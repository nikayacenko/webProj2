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
function getCookie(name) {
    const matches = document.cookie.match(new RegExp(
        `(?:^|; )${name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1')}=([^;]*)`
    ));
    return matches ? decodeURIComponent(matches[1]) : null;
}
function setCookie(name, value, options = {}) {
    options = {
        path: '/',
        secure: true,
        sameSite: 'Lax',
        ...options
    };

    let cookie = `${name}=${encodeURIComponent(value)}`;
    
    if (options.expires instanceof Date) {
        cookie += `; expires=${options.expires.toUTCString()}`;
    }
    
    if (options.maxAge) {
        cookie += `; max-age=${options.maxAge}`;
    }
    
    Object.keys(options).forEach(opt => {
        if (['path', 'domain', 'secure', 'sameSite'].includes(opt)) {
            cookie += `; ${opt}`;
            if (options[opt] !== true) {
                cookie += `=${options[opt]}`;
            }
        }
    });

    document.cookie = cookie;
}
function deleteCookie(name) {
    setCookie(name, '', { maxAge: -1 });
}
function updateCsrfToken(newToken) {
    const meta = document.querySelector('meta[name="csrf-token"]');
    if (meta) {
        meta.content = newToken;
    }
    // Также обновляем в скрытом поле формы, если есть
    const input = form.querySelector('[name="csrf_token"]');
    if (input) {
        input.value = newToken;
    }
}
function clearFormCookies() {
    const cookies = [
        'fio', 'field-tel', 'field-email', 'field-date',
        'radio-group-1', 'check-1', 'languages', 'bio',
        'fio_error', 'field-tel_error', 'field-email_error',
        'field-date_error', 'radio-group-1_error', 'check-1_error',
        'languages_error', 'bio_error', 'save'
    ];
    cookies.forEach(deleteCookie);
}
function handleCsrfError() {
    showError('Сессия устарела. Обновите страницу и попробуйте снова.');
    // Можно добавить автоматическое обновление страницы
    setTimeout(() => location.reload(), 3000);
}
function showAuthModal(login, password) {
    const modal = `
        <div class="auth-modal">
            <h3>Учетная запись создана</h3>
            <div class="auth-data">
                <p><strong>Логин:</strong> <span>${login}</span></p>
                <p><strong>Пароль:</strong> <span>${password}</span></p>
            </div>
            <button class="copy-btn" data-clipboard-text="${login}\n${password}">
                Скопировать данные
            </button>
        </div>
    `;
    // Реализация модального окна зависит от вашей UI-библиотеки
}
window.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("myform");

    // Восстановление значений из LocalStorage
    const restoreFormCookies = () => {
        ['fio', 'field-tel', 'field-email', 'field-date', 'radio-group-1', 'check-1','languages','bio'].forEach(name => {
            const value = getCookie(name);
            const element = document.querySelector(`[name="${name}"]`);
            const elements = document.getElementsByName(name);
            
            if (value && elements.length > 0) {
                if (elements[0].type === 'checkbox' || elements[0].type === 'radio') {
                    elements[0].checked = value === 'true';
                } else {
                    elements[0].value = value;
                }
            }
        });
        if (getCookie('save')) {
            showSuccessMessage('Данные успешно сохранены');
            deleteCookie('save');
        }
        
        // Восстановление ошибок
        ['fio_error', 'field-tel_error', 'field-email_error', 'check-1_error'].forEach(errorName => {
            const errorCode = getCookie(errorName);
            if (errorCode) {
                const field = errorName.replace('_error', '');
                const element = document.querySelector(`[name="${field}"]`);
                if (element) {
                    highlightError(element, getErrorMessage(field, errorCode));
                }
                deleteCookie(errorName);
            }
        });
    };
    // Сохранение в Cookies
    form.addEventListener("input", function(event) {
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + 1);
        
        if (event.target.type === 'checkbox' || event.target.type === 'radio') {
            setCookie(event.target.name, event.target.checked, { expires: expiryDate });
        } else {
            setCookie(event.target.name, event.target.value, { expires: expiryDate });
        }
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
        const requiredFields = ['fio', 'field-email', 'field-tel'];
        let isValid = true;
        
        requiredFields.forEach(field => {
            const element = document.querySelector(`[name="${field}"]`);
            if (!element || !element.value.trim()) {
                isValid = false;
                setCookie(`${field}_error`, '1', { maxAge: 60 });
                highlightError(element, 'Это поле обязательно для заполнения');
            }
        });
        const check1 = document.querySelector('[name="check-1"]');
        if (!check1 || !check1.checked) {
            isValid = false;
            setCookie('check-1_error', '1', { maxAge: 60 });
            highlightError(check1, 'Необходимо ваше согласие');
        }

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
                try {
                    // Обновляем CSRF токен если он пришел
                    if (response.csrf_refresh) {
                        updateCsrfToken(response.csrf_refresh);
                    }
                    
                    // Обработка ошибок (даже при success: true)
                    if (response.error) {
                        showError(response.error);
                        return;
                    }
                    
                    // Создание нового пользователя
                    if (response.login && response.pass) {
                        showAuthData(response.login, response.pass);
                        clearFormCookies();
                        return;
                    }
                    
                    // Стандартный успешный ответ
                    if (response.success) {
                        showSuccessMessage(response.message || 'Данные сохранены');
                        clearFormCookies();
                        
                        if (response.redirect) {
                            setTimeout(() => {
                                window.location.href = response.redirect;
                            }, 1500);
                        }
                        return;
                    }
                    
                    // Неожиданный формат ответа
                    console.warn('Unexpected response:', response);
                    showError('Некорректный ответ сервера');
                    
                } catch (e) {
                    console.error('Error processing response:', e);
                    showError('Ошибка обработки ответа');
                }
            },
            error: function(xhr) {
                // Обработка ошибок валидации из PHP
                if (xhr.status === 422) {
                    const errors = xhr.responseJSON?.errors || {};
                    Object.keys(errors).forEach(field => {
                        const element = document.querySelector(`[name="${field}"]`);
                        if (element) {
                            highlightError(element, getErrorMessage(field, errors[field]));
                        }
                    });
                } else if (xhr.status === 403) {
                    showError('Ошибка CSRF токена. Обновите страницу и попробуйте снова.');
                } else {
                    showError('Произошла ошибка сервера. Пожалуйста, попробуйте позже.');
                }
            }
        });
    });

    function highlightError(element, message) {
        if (!element) return;
        
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.style.color = 'red';
        errorElement.textContent = message;
        
        element.style.borderColor = 'red';
        element.parentNode.appendChild(errorElement);
        
        setTimeout(() => {
            element.style.borderColor = '';
            errorElement.remove();
        }, 5000);
    }

    function getErrorMessage(field, code) {
        const messages = {
            'fio': {
                '1': 'Заполните имя',
                '2': 'ФИО должно содержать не более 150 символов',
                '3': 'ФИО должно содержать только буквы и пробелы'
            },
            'field-email': {
                '1': 'Email введен некорректно',
                '2': 'Такой email уже зарегистрирован'
            },
            'field-tel': 'Телефон должен содержать только цифры и знак +',
            'field-date': 'Заполните дату',
            'radio-group-1': 'Выберите пол',
            'check-1': 'Ознакомьтесь с контрактом',
            'languages': {
                '1': 'Укажите любимые языки программирования',
                '2': 'Указан недопустимый язык'
            },
            'bio': {
                '1': 'Заполните биографию',
                '2': 'Используйте только допустимые символы'
            }
        };

        if (messages[field] && typeof messages[field] === 'object' && messages[field][code]) {
            return messages[field][code];
        } else if (messages[field] && typeof messages[field] === 'string') {
            return messages[field];
        }
        
        return `Ошибка в поле ${field}: ${code}`;
    }

    function showSuccessMessage(message) {
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-success';
        alertDiv.textContent = message;
        form.prepend(alertDiv);
        
        setTimeout(() => {
            alertDiv.remove();
        }, 5000);
    }

    function showError(message) {
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-danger';
        alertDiv.textContent = message;
        form.prepend(alertDiv);
        
        setTimeout(() => {
            alertDiv.remove();
        }, 5000);
    }

    // Восстановление данных при загрузке
    restoreFormCookies();
});



