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
        myButton.addEventListener('click', function(event) {
            // Ваш код для обработки формы через JS
        });
    }
});



window.addEventListener("DOMContentLoaded", function () {
    // Получаем элементы формы
    const form = document.getElementById("myform");

    // Восстанавливаем значения из LocalStorage при загрузке страницы
    window.onload = function () {
        const storedName = localStorage.getItem("FIO");
        const storedEmail = localStorage.getItem("field-email");
        const storedMessage = localStorage.getItem("field-message");
        const storedOrg = localStorage.getItem("field-company");
        const storedNumber = localStorage.getItem("field-number");

        if (storedName) {
            document.getElementsByName("field-number")[0].value = storedNumber;
        }
        if (storedName) {
            document.getElementsByName("field-company")[0].value = storedOrg;
        }
        if (storedName) {
            document.getElementsByName("fio")[0].value = storedName;
        }
        if (storedEmail) {
            document.getElementsByName("field-email")[0].value = storedEmail;
        }
        if (storedMessage) {
            document.getElementsByName("field-message")[0].value = storedMessage;
        }
    };

    // Сохраняем значения в LocalStorage при каждом вводе
    form.addEventListener("input", function (event) {
        localStorage.setItem(event.target.name, event.target.value);
    });

    //Обработчик отправки формы
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        //Валидация на стороне клиента

        let email = document.getElementsByName("field-email")[0].value;
        let name = document.getElementsByName("fio")[0].value;
        let number = document.getElementsByName("field-number")[0].value;
        const checkbox = document.getElementsByName("check-1")[0].checked;

        let formcheck = true;

        if (!name) {
            formcheck = false;
        }
        if (!email) {
            formcheck = false;
        }
        if (!number) {
            formcheck = false;
        }
        if (!checkbox) {
            formcheck = false;
        }

        if (!formcheck) {
            console.error("Заполните все обязательные поля!"); //Замените на вывод на странице
            return; //Прерываем отправку
        }

        //Отправка формы через Fetch
        const formData = new FormData(form);
        fetch(form.action, {
            method: "POST",
            body: formData,
            headers: {
                "X-Requested-With": "XMLHttpRequest",
            },
        })
            .then((response) => response.json()) //Парсим JSON ответ
            .then((data) => {
                //Обработка ответа от сервера
                if (data.success) {
                    //Действия в случае успешной отправки
                    console.log("Успешно отправлено!", data.message);
                    //Очищаем localStorage (по желанию)
                    localStorage.clear();

                    //Дополнительная логика (например, показ сообщения об успехе)
                } else {
                    //Обработка ошибок
                    console.error("Ошибка!", data.errors); //Замените на вывод на странице
                }
            })
            .catch((error) => {
                console.error("Ошибка сети:", error);
            });
    });
});
