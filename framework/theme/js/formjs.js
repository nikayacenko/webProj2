// document.getElementById('myform').addEventListener('submit', async (e) => {
//     e.preventDefault();
//     const form = e.target;
//     const formData = new FormData(form);

//     try {
//         const csrfToken = form.querySelector('input[name="csrf_token"]').value;        const response = await fetch('', {
//             method: 'POST',
//             headers: {
//                 'X-Requested-With': 'XMLHttpRequest',
//                 'Accept': 'application/json',
//                 'X-CSRF-Token': csrfToken // Добавляем токен, если есть
//             },
//             body: formData,
//             credentials: 'include' // Важно! Отправляем куки
//         });

//         const data = await response.json();

//         // 1. Обновляем сообщения
//         let messagesDiv = document.getElementById('messages');
//         if (!messagesDiv) {
//             messagesDiv = document.createElement('div');
//             messagesDiv.id = 'messages';
//             form.prepend(messagesDiv);
//         }
//         messagesDiv.innerHTML = data.messages?.join('<br>') || '';

//         // 2. Подсвечиваем ошибки
//         // if (data.errors) {
//         //     Object.keys(data.errors).forEach(field => {
//         //         const input = form.querySelector([name="${CSS.escape(field)}"]);
//         //         if (input) input.classList.toggle('error', !!data.errors[field]);
//         //     });
//         // }

//         // // 3. Восстанавливаем значения (если нужно)
//         // if (data.values) {
//         //     Object.keys(data.values).forEach(field => {
//         //         const input = form.querySelector([name="${CSS.escape(field)}"]);
//         //         if (input) input.value = data.values[field];
//         //     });
//         // }

//         // 4. Успешная отправка
//         if (data.success) {
//             form.reset();
//         }
//     } catch (error) {
//         console.error('Ошибка:', error);
//     }
// });

document.addEventListener('DOMContentLoaded', function() {
    const myButton = document.getElementById('saveButton');
    if (myButton) {
        myButton.type = 'button'; // Заменяем тип кнопки
    }
});



window.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("myform");

    // Восстановление значений из LocalStorage
    const fieldsToRestore = ['fio', 'field-tel', 'field-email', 'field-date', 
                           'radio-group-1', 'languages[]', 'bio', 'check-1'];
    
    fieldsToRestore.forEach(fieldName => {
        const storedValue = localStorage.getItem(fieldName);
        if (storedValue) {
            const elements = document.getElementsByName(fieldName);
            if (elements.length > 0) {
                if (elements[0].type === 'checkbox') {
                    elements[0].checked = storedValue === 'true';
                } else if (elements[0].type === 'radio') {
                    elements.forEach(radio => {
                        radio.checked = radio.value === storedValue;
                    });
                } else if (elements[0].tagName === 'SELECT' && elements[0].multiple) {
                    const values = JSON.parse(storedValue);
                    Array.from(elements[0].options).forEach(option => {
                        option.selected = values.includes(option.value);
                    });
                } else {
                    elements[0].value = storedValue;
                }
            }
        }
    });

    // Сохранение значений в LocalStorage
    form.addEventListener("input", function (event) {
        const target = event.target;
        if (target.name) {
            if (target.type === 'checkbox') {
                localStorage.setItem(target.name, target.checked);
            } else if (target.type === 'radio' && target.checked) {
                localStorage.setItem(target.name, target.value);
            } else if (target.tagName === 'SELECT' && target.multiple) {
                const selected = Array.from(target.selectedOptions).map(opt => opt.value);
                localStorage.setItem(target.name, JSON.stringify(selected));
            } else {
                localStorage.setItem(target.name, target.value);
            }
        }
    });

    // Обработка отправки формы
    form.addEventListener("click", function (e) {
        e.preventDefault();

        // Валидация обязательных полей
        const requiredFields = ['fio', 'field-tel', 'field-email', 'check-1'];
        let isValid = true;
        
        requiredFields.forEach(fieldName => {
            const element = document.getElementsByName(fieldName)[0];
            if (!element) return;
            
            if (element.type === 'checkbox' && !element.checked) {
                isValid = false;
                element.classList.add('error');
            } else if ((element.type === 'text' || element.type === 'email' || element.type === 'tel') && !element.value.trim()) {
                isValid = false;
                element.classList.add('error');
            }
        });

        if (!isValid) {
            alert('Заполните все обязательные поля!');
            return;
        }

        // Подготовка данных формы
        const formData = new FormData(form);
        
        // Для множественного select нужно добавить значения правильно
        const languagesSelect = document.querySelector('select[name="languages[]"]');
        if (languagesSelect) {
            formData.delete('languages[]'); // Удаляем старые значения
            Array.from(languagesSelect.selectedOptions).forEach(option => {
                formData.append('languages[]', option.value);
            });
        }

        // Отправка данных
        fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest' // Добавляем заголовок для AJAX
            }
        })
        .then(response => {
            // Сначала проверяем статус ответа
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            // Пытаемся распарсить как JSON, если не получится - вернем текст
            return response.text().then(text => {
                try {
                    return JSON.parse(text);
                } catch (e) {
                    // Если это не JSON, проверяем содержимое
                    if (text.includes('form') || text.includes('<html') || text.includes('<style')) {
                        // Это HTML-страница, вероятно редирект
                        return { redirect: true };
                    }
                    return { success: false, message: text };
                }
            });
        })
        .then(data => {
            if (data.redirect) {
                // Сервер вернул HTML, нужно перезагрузить страницу
                window.location.reload();
            } else if (data.success) {
                alert('Форма успешно отправлена!');
                form.reset();
                // Если нужно перенаправить
                if (data.redirectUrl) {
                    window.location.href = data.redirectUrl;
                }
            } else {
                alert(data.message || 'Произошла ошибка при отправке формы');
            }
        })
        .catch(error => {
            console.error('Ошибка:', error);
            alert('Произошла ошибка при отправке формы. Пожалуйста, попробуйте еще раз.');
        });
    });

    // Удаление класса error при фокусе на поле
    form.querySelectorAll('input, select, textarea').forEach(element => {
        element.addEventListener('focus', function() {
            this.classList.remove('error');
        });
    });
});