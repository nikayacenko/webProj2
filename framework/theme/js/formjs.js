

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

    let cookie = `${name}=${encodeURIComponent(value)}`;
    
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

function highlightError(element, message) {
    // Для select multiple с именем languages[]
    const isLanguagesSelect = element.name === 'languages[]';
    const errorContainer = isLanguagesSelect 
        ? element.closest('.form-group') || element.parentElement
        : element.closest('.form-group') || element.parentElement;
    
    let errorElement = errorContainer.querySelector('.error-message');
    
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        // Вставляем после select
        element.parentNode.insertBefore(errorElement, element.nextSibling);
        if(element.type==='radio')
        {
            element.parentNode.parentNode.parentNode.appendChild(errorElement);
        }
        if(element.type==='checkbox')
        {
            element.parentNode.appendChild(errorElement);
        }
    }
    
    errorElement.textContent = message;
    element.classList.add('error-field');
    
    // Для select multiple добавляем класс к родительскому контейнеру
    if (isLanguagesSelect) {
        errorContainer.classList.add('error-container');
    }
}

function resetFormErrors() {
    document.querySelectorAll('.error-message').forEach(el => el.remove());
    document.querySelectorAll('.error-field').forEach(el => el.classList.remove('error-field'));
    document.querySelectorAll('.error-container').forEach(el => el.classList.remove('error-container'));
}

function showError(message) {
    alert(message); 
}

function showSuccessMessage(message) {
    alert(message); 
}

window.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("myform");
    if (!form) return;

    function showSuccessMessageEntry(message) {
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-success';
        alertDiv.textContent = message;
        form.prepend(alertDiv);

        alertDiv.scrollIntoView({ 
            behavior: 'smooth',  // Плавная прокрутка
            block: 'start'       // Верх сообщения будет у верхнего края окна
        });
    }

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
            pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            messages: {
                required: 'Введите email',
                pattern: 'Введите корректный email',
                new: 'Такой email уже зарегистрирован' 
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
        'languages[]': {
            required: true,
            messages: {
                required: 'Выберите хотя бы один язык программирования'
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
    function clearFormButKeepCookies() {
        // Полностью очищаем форму
        const form = document.getElementById("myform");
        if (form) {
            // обработка для разных типов полей
            Object.keys(validationRules).forEach(fieldName => {
                const elements = document.getElementsByName(fieldName);
                if (!elements.length) return;
                
                const element = elements[0];
                
                if (element.type === 'checkbox') {
                    element.checked = false;
                } else if (element.type === 'radio') {
                    elements.forEach(el => el.checked = false);
                } else if (element.tagName === 'SELECT' && element.multiple) {
                    Array.from(element.options).forEach(opt => opt.selected = false);
                } else {
                    element.value = '';
                }
            });
        } 
        // Удаляем только куки с ошибками
        Object.keys(validationRules).forEach(name => {
            deleteCookie(`${name}_error`);
        });
        // Очищаем визуальные ошибки
        resetFormErrors();
    }
    // Настройка автосохранения полей
    function setupFieldAutoSave(fieldName) {
        const elements = document.querySelectorAll(`[name="${fieldName}"]`);
        if (!elements.length) return;
        const element = elements[0];
        const saveFieldValue = () => {
            let value;
            
            if (element.type === 'checkbox') {
                value = element.checked;
            } else if (element.type === 'radio') {
                const selected = Array.from(elements).find(el => el.checked);
                value = selected ? selected.value : '';
                if (!selected) return;
            } else if (element.tagName === 'SELECT' && element.multiple) {
                const selected = Array.from(element.selectedOptions).map(opt => opt.value).join(',');
                value = selected;
            } else {
                value = element.value;
            }
    
            setCookie(fieldName, value, { expires: 1 });
        };
    
        if (element.type === 'checkbox' || element.type === 'radio') {
            elements.forEach(el => el.addEventListener('change', saveFieldValue));
        } else {
            element.addEventListener('change', saveFieldValue);
            if (element.tagName !== 'SELECT' || !element.multiple) {
                element.addEventListener('input', saveFieldValue);
            }
        }
    }

    // Восстановление значений из кук
    function restoreFormCookies() {
        Object.keys(validationRules).forEach(fieldName => {
            const value = getCookie(fieldName);
            const elements = document.getElementsByName(fieldName);
            
            if (value !== null && elements.length > 0) { 
                const element = elements[0];
                
                if (element.type === 'checkbox') {
                    element.checked = value === 'true';
                } else if (element.type === 'radio') {
                    elements.forEach(el => {
                        if (el.value === value) el.checked = true;
                    });
                } else if (element.name === 'languages[]') {
                    const values = value ? value.split(',') : [];
                    Array.from(element.options).forEach(opt => {
                        opt.selected = values.includes(opt.value);
                    });
                } else {
                    element.value = value;
                }
            }
            
            // Настраиваем автосохранение для каждого поля
            setupFieldAutoSave(fieldName);
        });
    }

    // Валидация формы
    function validateForm() {
        let isValid = true;
        resetFormErrors();
        
        Object.keys(validationRules).forEach(fieldName => {
            const elements = document.getElementsByName(fieldName);
            if (!elements.length) return;
            
            const rules = validationRules[fieldName];
            const element = elements[0];
            let value, isFieldValid = true;
            
            // Получаем значение в зависимости от типа элемента
        if (element.type === 'checkbox') {
            value = element.checked;
        } else if (element.type === 'radio') {
            value = Array.from(elements).some(el => el.checked);
        } else if (element.name === 'languages[]') {
            const selectedOptions = Array.from(element.selectedOptions);
            value = selectedOptions.length > 0;
            
            if (value) {
                const selectedValues = selectedOptions.map(opt => opt.value).join(',');
                setCookie('languages', selectedValues, { expires: 1 });
            }
        } else {
            value = element.value.trim();
        }
            

            // Валидация
            if (rules.required && !value) {
                isValid = false;
                setCookie(`${fieldName}_error`, 'required', { maxAge: 60 });
                highlightError(element, rules.messages.required);
            }
            else if (value && rules.new) {
                isValid = false;
                setCookie(`${fieldName}_error`, 'new', { maxAge: 60 });
                highlightError(element, rules.messages.new);
            }
            else if (value && rules.maxLength && value.length > rules.maxLength) {
                isValid = false;
                setCookie(`${fieldName}_error`, 'maxLength', { maxAge: 60 });
                highlightError(element, rules.messages.maxLength);
            }
            else if (value && rules.pattern && !rules.pattern.test(value)) {
                isValid = false;
                setCookie(`${fieldName}_error`, 'pattern', { maxAge: 60 });
                highlightError(element, rules.messages.pattern);
            }
            else {
                deleteCookie(`${fieldName}_error`);
            }
        });
        
        return isValid;
    }

    // Восстанавливаем значения при загрузке
    restoreFormCookies();

    // Обработка отправки формы
    form.addEventListener("submit", function(e) {
        e.preventDefault();
        
        // Сначала сохраняем все значения полей
        Object.keys(validationRules).forEach(fieldName => {
            const elements = document.getElementsByName(fieldName);
            if (!elements.length) return;
            
            const element = elements[0];
            let value;
            
            if (element.type === 'checkbox') {
                value = element.checked;
            } else if (element.type === 'radio') {
                const selected = Array.from(elements).find(el => el.checked);
                value = selected ? selected.value : '';
            } else if (element.tagName === 'SELECT' && element.multiple) {
                value = Array.from(element.selectedOptions).map(opt => opt.value).join(',');
            } else {
                value = element.value;
            }
            
            if (value) setCookie(fieldName, value, { expires: 1 });
        });

        // Затем валидируем
        if (!validateForm()) {
            // showError("Заполните все обязательные поля корректно");
            return;
        }

        // Подготовка данных для отправки
        const formData = new FormData(form);
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;
        if (csrfToken) formData.append('csrf_token', csrfToken);

        // AJAX отправка
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
                    if (typeof response === 'string') {
                        response = JSON.parse(response);
                    }
            
                    if (xhr.status === 422 || response.errors) {
                        Object.keys(response.errors).forEach(field => {
                            const element = document.querySelector(`[name="${field}"]`);
                            if (element) {
                                const errorCode = response.errors[field];
                                const rules = validationRules[field];
                                // Используем сообщение из validationRules вместо кода
                                const message = rules?.messages?.[errorCode] || errorCode;
                                highlightError(element, message);
                                
                                if (field === 'field-email' && errorCode === 'new') {
                                    setCookie(`${field}_error`, 'new', { maxAge: 60 });
                                }
                            }
                        });
                        return;
                    }
            
                    if (response.login && response.pass) {
                        showSuccessMessageEntry(`Учетная запись создана! Логин: ${response.login}, Пароль: ${response.pass}`);
                        
                        // Полностью очищаем форму и ошибки
                        clearFormButKeepCookies();
                        
                        return;
                    }
            
                    if (response.success || response.message) {
                        resetFormErrors();
                        showSuccessMessage(response.message || 'Данные успешно сохранены');
                        
                        if (response.redirect) {
                            setTimeout(() => {
                                window.location.href = response.redirect;
                            }, 1500);
                        }
                        return;
                    }
            
                    showError('Некорректный формат ответа сервера');
                    console.error('Неожиданный ответ сервера:', response);
            
                } catch (e) {
                    showError('Ошибка обработки ответа сервера');
                    console.error('Ошибка при обработке ответа:', e, 'Ответ:', response);
                }
            },
            error: function(xhr) {
                if (xhr.status === 422) {
                    const emailField = document.getElementsByName('field-email')[0];
                    if (emailField) {
                        highlightError(emailField, validationRules['field-email'].messages['new']);
                        setCookie('field-email_error', 'new', { maxAge: 60 });                    }
                    
                    if (xhr.responseJSON?.errors) {
                        Object.entries(xhr.responseJSON.errors).forEach(([field, errorCode]) => {
                            const element = document.querySelector(`[name="${field}"]`);
                            if (element && field !== 'field-email') { // email уже обработали
                                const rules = validationRules[field];
                                const message = rules?.messages?.[errorCode] || errorCode;
                                highlightError(element, message);
                            }
                        });
                    }
                } 
                else if (xhr.status === 403) {
                    showError('Ошибка безопасности. Обновите страницу (код: 403)');
                }
                else {
                    showError(`Ошибка сервера (код: ${xhr.status})`);
                }
            }
        });
    });
});