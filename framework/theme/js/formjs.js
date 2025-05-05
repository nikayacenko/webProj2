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
    // const openBtn = document.getElementById("open-form");
    // let popup = document.getElementById("popup");
    // let overlay = document.getElementById("overlay");
    // openBtn.addEventListener("click", function () {
    //     popup.style.display = "block";
    //     overlay.classList.add("show");
    //     window.history.pushState("", "", "index1.html");
    // });


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
            document.getElementsByName("field-message")[0].value =
            storedMessage;
        }
    };

    //Сохраняем значения в LocalStorage при каждом вводе
    form.addEventListener("input", function (event) {
        localStorage.setItem(event.target.name, event.target.value);
    });

    // Обработка событий навигации для контроля за поведением при переходах
    window.addEventListener("popstate", function (event) {
        if (popup.style.display === "block") {
            popup.style.display = "none";
            overlay.classList.remove("show");
            window.history.replaceState("", "", "index.html");
        }
        updateContent(event.state.content);
    });


    $(function () {
        $(".formcarryForm").submit(function (e) {
            e.preventDefault();

            let email = document.getElementsByName("field-email");
            let name = document.getElementsByName("fio");
            let number = document.getElementsByName("field-number");
            const checkbox = document.getElementsByName("check-1")[0];
            let formcheck = true;
            if (!name[0].value) {
                formcheck = false;
            }
            if (!email[0].value) {
                formcheck = false;
            }
            if (!number[0].value) {
                formcheck = false;
            }
            if (!checkbox.checked) {
                formcheck = false;
            }

            if (formcheck) {
                $.ajax({
                    complete: function () {
                        document.getElementById("myform").reset();
                    },
                    contentType: false,
                    data: new FormData(this),
                    dataType: "json",
                    error: function (jqXHR) {
                        const errorObject = jqXHR.responseJSON;
                        alert("Ошибка: " + errorObject.message);
                    },
                    processData: false,
                    success: function (response) {
                        if (response.status === "success") {
                            alert("Форма отправлена!");
                            document.getElementById("myform").reset();
                        } else {
                            alert("Ошибка");
                            document.getElementById("myform").reset();
                        }
                    },
                    type: "POST",
                    url: "./"
                });
            } else {
                alert("Заполните все поля формы");
            }
        });
    });
});

