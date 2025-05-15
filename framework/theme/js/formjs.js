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
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 день по умолчанию
        ...options
    };

    // Кодируем значение
    let cookie = `${name}=${encodeURIComponent(value)}`;
    
    // Добавляем опции
    Object.entries(options).forEach(([key, val]) => {
        if (['path', 'domain', 'secure', 'sameSite', 'expires', 'maxAge'].includes(key)) {
            cookie += `; ${key}`;
            if (val !== true) cookie += `=${val}`;
        }
    });

    document.cookie = cookie;
}
function deleteCookie(name) {
    setCookie(name, '', { maxAge: -1 });
}

window.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("myform");

    const validationRules = {
        'fio': {
            required: true,
            maxLength: 150,
            pattern: /^[а-яА-ЯёЁa-zA-Z\s\-]+$/,
            messages: {
                required: 'Заполните имя',
                maxLength: 'ФИО должно содержать не более 150 символов',
                pattern: 'Используйте только буквы, пробелы и дефисы'
            }
        },
        'field-email': {
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            messages: {
                required: 'Введите email',
                pattern: 'Введите корректный email'
            }
        },
        'field-tel': {
            required: true,
            pattern: /^\+?[0-9\s\-()]+$/,
            messages: {
                required: 'Укажите номер телефона',
                pattern: 'Используйте только цифры, пробелы и знак +'
            }
        },
        'field-date': {
            required: true,
            messages: {
                required: 'Выберите дату'
            }
        },
        'radio-group-1': {
            required: true,
            messages: {
                required: 'Укажите пол'
            }
        },
        'check-1': {
            required: true,
            messages: {
                required: 'Необходимо ваше согласие'
            }
        },
        'languages': {
            required: true,
            messages: {
                required: 'Выберите языки программирования'
            }
        },
        'bio': {
            required: true,
            pattern: /^[а-яА-ЯёЁa-zA-Z0-9\s\.,!?()\-]+$/,
            messages: {
                required: 'Напишите информацию о себе',
                pattern: 'Используйте только допустимые символы'
            }
        }
    };
    function validateFieldInRealTime(fieldName) {
        const element = document.querySelector(`[name="${fieldName}"]`);
        if (!element) return;
    
        element.addEventListener('input', function() {
            const value = this.value.trim();
            const rules = validationRules[fieldName];
            
            if (!rules) return;
            
            // Проверяем валидность
            let isValid = true;
            if (rules.required && !value) isValid = false;
            if (value && rules.maxLength && value.length > rules.maxLength) isValid = false;
            if (value && rules.pattern && !rules.pattern.test(value)) isValid = false;
            
            // Если валидно - сохраняем и убираем ошибки
            if (isValid) {
                // Сохраняем в куки
                const expiryDate = new Date();
                expiryDate.setHours(expiryDate.getHours() + 1);
                
                if (element.type === 'checkbox') {
                    setCookie(fieldName, element.checked, { expires: expiryDate });
                } else {
                    setCookie(fieldName, value, { expires: expiryDate });
                }
                
                // Убираем ошибки
                const errorContainer = this.closest('.form-group') || this.parentElement;
                const errorElement = errorContainer.querySelector('.error-message');
                if (errorElement) errorElement.remove();
                this.classList.remove('error-field');
                
                // Удаляем куку с ошибкой если была
                deleteCookie(`${fieldName}_error`);
            }
        });
    }
    // Восстановление значений из LocalStorage
    function restoreFormCookies() {
        Object.keys(validationRules).forEach(fieldName => {
            const value = getCookie(fieldName);
            const elements = document.getElementsByName(fieldName);
            
            if (value && elements.length > 0) {
                if (elements[0].type === 'checkbox') {
                    elements[0].checked = value === 'true';
                } else if (elements[0].type === 'radio') {
                    elements.forEach(el => {
                        if (el.value === value) el.checked = true;
                    });
                } else {
                    elements[0].value = value;
                }
            }
            
            // Восстановление ошибок
            const errorCode = getCookie(`${fieldName}_error`);
            if (errorCode) {
                const message = validationRules[fieldName].messages[errorCode] || 
                               validationRules[fieldName].messages.required;
                highlightError(elements[0], message);
            }
        });
        Object.keys(validationRules).forEach(fieldName => {
            validateFieldInRealTime(fieldName);
            const element = document.querySelector(`[name="${fieldName}"]`);
        if (!element) return;
        
            element.addEventListener('input', function() {
                const expiryDate = new Date();
                expiryDate.setHours(expiryDate.getHours() + 1);
                
                // Для чекбоксов сохраняем состояние
                if (this.type === 'checkbox') {
                    setCookie(this.name, this.checked, { expires: expiryDate });
                } 
                // Для radio сохраняем выбранное значение
                else if (this.type === 'radio' && this.checked) {
                    setCookie(this.name, this.value, { expires: expiryDate });
                }
                // Для остальных полей сохраняем значение
                else if (this.type !== 'radio') {
                    setCookie(this.name, this.value, { expires: expiryDate });
                }
            });
        });
        document.querySelectorAll('select[multiple]').forEach(select => {
            select.addEventListener('change', function() {
                const selected = Array.from(this.selectedOptions)
                    .map(opt => opt.value)
                    .join(',');
                setCookie(this.name, selected);
            });
        });
    }
    function validateForm() {
        let isValid = true;
        resetFormErrors();
        
        Object.keys(validationRules).forEach(fieldName => {
            const elements = document.getElementsByName(fieldName);
            if (!elements.length) return;
            
            const rules = validationRules[fieldName];
            const element = elements[0];
            let isFieldValid = true;
            
            // Для radio и checkbox
            if (element.type === 'radio' || element.type === 'checkbox') {
                const isChecked = Array.from(elements).some(el => el.checked);
                if (rules.required && !isChecked) {
                    isValid = false;
                    setCookie(`${fieldName}_error`, '1', { maxAge: 60 });
                    highlightError(element.closest('.form-group') || element, rules.messages.required);
                }
            } 
            // Для select multiple
            else if (element.tagName === 'SELECT' && element.multiple) {
                const selected = Array.from(element.options).some(opt => opt.selected);
                if (rules.required && !selected) {
                    isValid = false;
                    setCookie(`${fieldName}_error`, '1', { maxAge: 60 });
                    highlightError(element, rules.messages.required);
                }
            }
            // Для остальных полей
            else {
                const value = element.value.trim();
                
                if (rules.required && !value) {
                    isValid = false;
                    setCookie(`${fieldName}_error`, '1', { maxAge: 60 });
                    highlightError(element, rules.messages.required);
                }
                else if (value) {
                    if (rules.maxLength && value.length > rules.maxLength) {
                        isValid = false;
                        setCookie(`${fieldName}_error`, '2', { maxAge: 60 });
                        highlightError(element, rules.messages.maxLength);
                    }
                    
                    if (rules.pattern && !rules.pattern.test(value)) {
                        isValid = false;
                        setCookie(`${fieldName}_error`, '3', { maxAge: 60 });
                        highlightError(element, rules.messages.pattern);
                    }
                }
            }
            
        });
        
        return isValid;
    }
    // Сохранение в Cookies
    // Исправленный обработчик input
form.addEventListener("input", function(event) {
    const element = event.target;
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 1);
    
    // Для чекбоксов и радио сохраняем состояние
    if (element.type === 'checkbox' || element.type === 'radio') {
        if (element.type === 'radio' && !element.checked) return; // Сохраняем только выбранные radio
        
        const value = element.type === 'checkbox' ? element.checked : element.value;
        setCookie(element.name, value, { expires: expiryDate });
    } 
    // Для остальных полей
    else {
        const value = element.value.trim();
        const rules = validationRules[element.name];
        
        // Проверяем валидность перед сохранением
        let isValid = true;
        if (rules) {
            if (rules.required && !value) isValid = false;
            if (value && rules.maxLength && value.length > rules.maxLength) isValid = false;
            if (value && rules.pattern && !rules.pattern.test(value)) isValid = false;
        }
        
        if (isValid) {
            setCookie(element.name, value, { expires: expiryDate });
            // Удаляем ошибку если была
            deleteCookie(`${element.name}_error`);
            // Убираем подсветку ошибки
            element.classList.remove('error-field');
            const errorContainer = element.closest('.form-group') || element.parentElement;
            const errorElement = errorContainer.querySelector('.error-message');
            if (errorElement) errorElement.remove();
        }
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


        // Валидация всех полей
        Object.keys(validationRules).forEach(fieldName => {
            const elements = document.getElementsByName(fieldName);
            if (!elements.length) return;
            
            const rules = validationRules[fieldName];
            const element = elements[0];
            let value;
            
            // Получаем значение в зависимости от типа элемента
            if (element.type === 'checkbox') {
                value = element.checked;
            } else if (element.type === 'radio') {
                value = Array.from(elements).find(el => el.checked)?.value || '';
            } else {
                value = element.value.trim();
            }
            
            // Проверяем валидность поля
            let isFieldValid = true;
            if (rules.required && !value) {
                isFieldValid = false;
            }
            if (value && rules.maxLength && value.length > rules.maxLength) {
                isFieldValid = false;
            }
            if (value && rules.pattern && !rules.pattern.test(value)) {
                isFieldValid = false;
            }
            
            // Сохраняем значение в куки, если поле валидно
            if (isFieldValid) {
                const expiryDate = new Date();
                expiryDate.setHours(expiryDate.getHours() + 1);
                
                if (element.type === 'checkbox') {
                    setCookie(fieldName, element.checked, { expires: expiryDate });
                } else if (element.type === 'radio') {
                    const selectedValue = Array.from(elements).find(el => el.checked)?.value;
                    if (selectedValue) setCookie(fieldName, selectedValue, { expires: expiryDate });
                } else {
                    setCookie(fieldName, value, { expires: expiryDate });
                }
                
                // Удаляем куку с ошибкой, если она была
                deleteCookie(`${fieldName}_error`);
            } else {
                isValid = false;
                // Устанавливаем куку с ошибкой
                let errorCode = '1'; // по умолчанию required
                if (value && rules.maxLength && value.length > rules.maxLength) {
                    errorCode = '2';
                } else if (value && rules.pattern && !rules.pattern.test(value)) {
                    errorCode = '3';
                }
                setCookie(`${fieldName}_error`, errorCode, { maxAge: 60 });
                
                // Показываем ошибку
                const message = rules.messages[errorCode] || rules.messages.required;
                highlightError(element, message);
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
            success: function(response, status, xhr) {
                try {
                    // Проверяем, может ли response быть строкой (на случай неправильного Content-Type)
                    if (typeof response === 'string') {
                        response = JSON.parse(response);
                    }
            
                    // Обработка ошибок валидации (422 статус)
                    if (xhr.status === 422 || response.errors) {
                        let errorMessage = response.message || 'Ошибки валидации';
                        
                        // Очищаем предыдущие ошибки
                        document.querySelectorAll('.error-message').forEach(el => el.remove());
                        
                        // Показываем общее сообщение об ошибке
                        showError(errorMessage);
                        
                        // Подсвечиваем конкретные ошибки полей
                        if (response.errors) {
                            Object.keys(response.errors).forEach(field => {
                                const element = document.querySelector(`[name="${field}"]`);
                                if (element) {
                                    // Получаем сообщение об ошибке напрямую из validationRules
                                    const errorCode = response.errors[field];
                                    const fieldRules = validationRules[field];
                                    let message = '';
                                    
                                    if (fieldRules && fieldRules.messages) {
                                        // Если ошибка содержит код (например '1', '2')
                                        if (typeof errorCode === 'string' || typeof errorCode === 'number') {
                                            message = fieldRules.messages[errorCode] || fieldRules.messages.required || 'Ошибка в поле';
                                        } 
                                        // Если ошибка содержит готовое сообщение
                                        else if (typeof errorCode === 'string') {
                                            message = errorCode;
                                        }
                                    } else {
                                        message = errorCode || 'Ошибка в поле';
                                    }
                                    
                                    highlightError(element, message);
                                }
                            });
                        }
                        return;
                    }
            
                    // Обработка успешного создания пользователя
                    if (response.login && response.pass) {
                        showSuccessMessage(`Учетная запись создана! Логин: ${response.login}, Пароль: ${response.pass}`);
                        form.reset();
                        
                        // Очищаем cookies после успешной отправки
                        ['fio', 'field-tel', 'field-email', 'field-date', 'radio-group-1', 'check-1', 'languages', 'bio'].forEach(name => {
                            deleteCookie(name);
                        });
                        return;
                    }
            
                    // Обработка успешного обновления данных
                    if (response.success || response.message) {
                        resetFormErrors();
                        showSuccessMessage(response.message || 'Данные успешно сохранены');
                        
                        // Редирект если есть
                        if (response.redirect) {
                            setTimeout(() => {
                                window.location.href = response.redirect;
                            }, 1500);
                        }
                        return;
                    }
            
                    // Если ответ не распознан
                    showError('Некорректный формат ответа сервера');
                    console.error('Неожиданный ответ сервера:', response);
            
                } catch (e) {
                    showError('Ошибка обработки ответа сервера');
                    console.error('Ошибка при обработке ответа:', e, 'Ответ:', response);
                }
            },
            error: function(xhr) {
                // Только для реальных HTTP ошибок (не 200)
                let errorMsg = 'Ошибка сервера';
                
                if (xhr.status === 422) {
                    errorMsg = 'Проверьте правильность данных';
                } else if (xhr.status === 403) {
                    errorMsg = 'Ошибка безопасности. Обновите страницу';
                }
                
                showError(`${errorMsg} (код: ${xhr.status})`);
                
                // Дополнительная обработка ошибок валидации
                if (xhr.status === 422 && xhr.responseJSON?.errors) {
                    Object.entries(xhr.responseJSON.errors).forEach(([field, error]) => {
                        const element = document.querySelector(`[name="${field}"]`);
                        if (element) highlightError(element, error);
                    });
                }
            }
        });
    });

    // Функция getErrorMessage остается без изменений
function getErrorMessage(field, code) {
    const messages = {
        'fio': {
            '1': 'Заполните имя',
            '2': 'ФИО должно содержать не более 150 символов',
            '3': 'Используйте только буквы, пробелы и дефисы'
        },
        'field-email': {
            '1': 'Введите email',
            '2': 'Email введен некорректно',
            '3': 'Такой email уже зарегистрирован'
        },
        'field-tel': {
            '1': 'Укажите номер телефона',
            '2': 'Телефон должен содержать только цифры и знак +'
        },
        'field-date': {
            '1': 'Выберите дату'
        },
        'radio-group-1': {
            '1': 'Укажите пол'
        },
        'check-1': {
            '1': 'Необходимо ваше согласие'
        },
        'languages': {
            '1': 'Выберите языки программирования',
            '2': 'Указан недопустимый язык'
        },
        'bio': {
            '1': 'Напишите информацию о себе',
            '2': 'Используйте только допустимые символы'
        }
    };

    return messages[field]?.[code] || `Ошибка в поле ${field}`;
}
function highlightError(element, message) {
    if (!element) return;
    
    // Удаляем старые ошибки
    const errorContainer = element.closest('.form-group') || element.parentElement;
    const oldError = errorContainer.querySelector('.error-message');
    if (oldError) oldError.remove();
    
    // Добавляем новую ошибку
    if (message) {
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        errorContainer.appendChild(errorElement);
    }
    
    // Подсвечиваем поле
    element.classList.add('error-field');
}

    function showSuccessMessage(message) {
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-success';
        alertDiv.textContent = message;
        form.prepend(alertDiv);
    }

    function showError(message) {
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-danger';
        alertDiv.textContent = message;
        form.prepend(alertDiv);
    }

    function resetFormErrors() {
        // Удаляем все сообщения об ошибках
        document.querySelectorAll('.error-message').forEach(el => el.remove());
        
        // Сбрасываем подсветку полей
        document.querySelectorAll('.error-field').forEach(field => {
            field.classList.remove('error-field');
        });
    }

    

    // Восстановление данных при загрузке
    restoreFormCookies();
});



