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
    const form = document.getElementById('myform');
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Предотвращаем обычную отправку формы

        const formData = new FormData(form); // Собираем данные формы

        fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: {
                'X-Requested-With': 'XMLHttpRequest' // Устанавливаем заголовок для Ajax запроса
            }
        })
        .then(response => response.json()) // Преобразуем ответ в JSON
        .then(data => {
            if (data.errors) {
                // Обрабатываем ошибки
                console.log("Ошибки валидации", data.errors);
                //Пример: Вывод ошибок возле соответствующих полей
                for (const field in data.errors) {
                    const errorElement = document.createElement('span');
                    errorElement.className = 'error';
                    errorElement.textContent = data.errors[field];
                    const inputField = document.getElementById(field);
                    inputField.parentNode.appendChild(errorElement);
                }
            } else if (data.success) {
                // Обрабатываем успешную отправку
                console.log("Успех:", data.message);
                //Перенаправляем на страницу успеха
                window.location.href = url('./');
            } else{
                console.log("Что-то пошло не так");
            }
        })
        .catch(error => {
            console.error('Ошибка:', error);
        });
    });
});