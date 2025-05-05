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
    // Получаем элементы формы
    const form = document.getElementById("myform");

    // Восстанавливаем значения из LocalStorage при загрузке страницы
    window.onload = function () {
        const storedName = localStorage.getItem("fio");
        const storedEmail = localStorage.getItem("field-email");
        // const storedMessage = localStorage.getItem("field-message");
        // const storedOrg = localStorage.getItem("field-company");
        // const storedNumber = localStorage.getItem("field-number");
        
        if (storedName) document.getElementsByName("fio")[0].value = storedName;
        if (storedEmail) document.getElementsByName("field-email")[0].value = storedEmail;
        //if (storedMessage) document.getElementsByName("field-message")[0].value = storedMessage;
       // if (storedOrg) document.getElementsByName("field-company")[0].value = storedOrg;
        //if (storedNumber) document.getElementsByName("field-number")[0].value = storedNumber;
    };

    // Сохраняем значения в LocalStorage при каждом вводе
    form.addEventListener("input", function (event) {
        localStorage.setItem(event.target.name, event.target.value);
    });

    // Обработка отправки формы
    form.addEventListener("click", function (e) {
        e.preventDefault();

        let email = document.getElementsByName("field-email")[0];
        let name = document.getElementsByName("fio")[0];
        //let number = document.getElementsByName("field-number")[0];
        const checkbox = document.getElementsByName("check-1")[0];
        let formcheck = true;

        // Валидация полей
        if (!name.value) formcheck = false;
        if (!email.value) formcheck = false;
        //if (!number.value) formcheck = false;
        if (!checkbox.checked) formcheck = false;

        if (formcheck) {
            // Создаем объект FormData для отправки
            const formData = new FormData(form);

            // Отправляем данные через Fetch API
            fetch(form.action, {
                method: "POST",
                body: formData,
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest' // Добавляем заголовок для AJAX
                }
            })
            .then(response => {
                // Проверяем Content-Type ответа
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    return response.json();
                } else {
                    return response.text().then(text => {
                        throw new Error('Ожидался JSON, но получили: ' + text.substring(0, 100));
                    });
                }
            })
            .then(data => {
                if (data.success) {
                    alert('Форма успешно отправлена!');
                    form.reset();
                    // Очистка localStorage после успешной отправки
                    fieldsToRestore.forEach(fieldName => {
                        localStorage.removeItem(fieldName);
                    });
                } else {
                    alert('Ошибка: ' + (data.message || 'Неизвестная ошибка сервера'));
                    // Можно добавить обработку ошибок валидации
                    if (data.errors) {
                        Object.entries(data.errors).forEach(([field, error]) => {
                            const elements = document.getElementsByName(field);
                            if (elements.length > 0) {
                                elements[0].classList.add('error');
                            }
                        });
                    }
                }
            })
            .catch(error => {
                alert("Ошибка при отправке: " + error.message);
            });
        } else {
            alert("Заполните все обязательные поля формы");
        }
    });
});