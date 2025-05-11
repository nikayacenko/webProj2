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

window.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("myform");

    // Восстановление значений из LocalStorage
    const restoreFormData = () => {
        ['FIO', 'field-email', 'field-message', 'field-company', 'field-number', 'check-1'].forEach(name => {
            const value = localStorage.getItem(name);
            if (value && document.getElementsByName(name)[0]) {
                document.getElementsByName(name)[0].value = value;
            }
        });
    };

    // Сохранение в LocalStorage
    form.addEventListener("input", function(event) {
        localStorage.setItem(event.target.name, event.target.value);
    });

    // Обработка отправки формы
    form.addEventListener("submit", function(e) {
        e.preventDefault();
        
        // Собираем данные формы
        const formData = new FormData(this);
        
        // Добавляем CSRF-токен, если он нужен
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;
        if (csrfToken) {
            formData.append('csrf_token', csrfToken);
        }

        // Валидация перед отправкой
        const requiredFields = ['FIO', 'field-email', 'field-number'];
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!formData.get(field)) {
                isValid = false;
                document.cookie = `${field}_error=1; path=/`;
            }
        });

        if (!isValid) {
            alert("Заполните все обязательные поля");
            return;
        }

        // Отправка AJAX
        $.ajax({
            url: form.action,
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            dataType: 'json',
            beforeSend: function(xhr) {
                xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            },
            success: function(response) {
                if (response.redirect) {
                    window.location.href = response.redirect;
                } else {
                    // Обработка успешной отправки
                    alert("Форма успешно отправлена!");
                    form.reset();
                    localStorage.clear();
                    
                    // Очистка ошибок из cookies
                    document.cookie = "fio_error=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                    document.cookie = "field-email_error=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                    document.cookie = "field-number_error=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                }
            },
            error: function(xhr) {
                // Обработка ошибок валидации из PHP
                if (xhr.status === 403) {
                    alert("Ошибка CSRF токена");
                } else {
                    const errors = xhr.responseJSON?.errors || {};
                    Object.keys(errors).forEach(field => {
                        alert(`Ошибка в поле ${field}: ${errors[field]}`);
                    });
                }
            }
        });
    });

    // Восстановление данных при загрузке
    restoreFormData();
});