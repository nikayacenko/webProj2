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

// function getCookie(name) {
//     const matches = document.cookie.match(
//         new RegExp(`(?:^|; )${name.replace(/([.$?*|{}()\[\]\\\/+^])/g, '\\$1')}=([^;]*)`)
//     );
//     return matches ? decodeURIComponent(matches[1]) : null;
// }
// function setCookie(name, value, options = {}) {
//     options = {
//         path: '/',
//         secure: false,  // Отключаем для локального тестирования
//         sameSite: 'Lax', // Или 'None' если нужен кросс-сайтовый доступ
//         expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 день
//         ...options
//     };

//     let cookie = `${name}=${encodeURIComponent(value)}`;
    
//     // Добавляем опции
//     Object.entries(options).forEach(([key, val]) => {
//         if (['path', 'domain', 'secure', 'sameSite', 'expires', 'maxAge'].includes(key)) {
//             cookie += `; ${key}`;
//             if (val !== true && val !== undefined) cookie += `=${val}`;
//         }
//     });

//     document.cookie = cookie;
//     console.log('Cookie set:', cookie); // Для отладки
// }
// function deleteCookie(name) {
//     setCookie(name, '', { maxAge: -1 });
// }

// window.addEventListener("DOMContentLoaded", function() {
//     const form = document.getElementById("myform");

//     const validationRules = {
//         'fio': {
//             required: true,
//             maxLength: 150,
//             pattern: /^[а-яА-ЯёЁa-zA-Z\s\-]+$/,
//             messages: {
//                 required: 'Заполните имя',
//                 maxLength: 'ФИО должно содержать не более 150 символов',
//                 pattern: 'Используйте только буквы, пробелы и дефисы'
//             }
//         },
//         'field-email': {
//             required: true,
//             pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
//             messages: {
//                 required: 'Введите email',
//                 pattern: 'Введите корректный email'
//             }
//         },
//         'field-tel': {
//             required: true,
//             pattern: /^\+?[0-9\s\-()]+$/,
//             messages: {
//                 required: 'Укажите номер телефона',
//                 pattern: 'Используйте только цифры, пробелы и знак +'
//             }
//         },
//         'field-date': {
//             required: true,
//             messages: {
//                 required: 'Выберите дату'
//             }
//         },
//         'radio-group-1': {
//             required: true,
//             messages: {
//                 required: 'Укажите пол'
//             }
//         },
//         'check-1': {
//             required: true,
//             messages: {
//                 required: 'Необходимо ваше согласие'
//             }
//         },
//         'languages': {
//             required: true,
//             messages: {
//                 required: 'Выберите языки программирования'
//             }
//         },
//         'bio': {
//             required: true,
//             pattern: /^[а-яА-ЯёЁa-zA-Z0-9\s\.,!?()\-]+$/,
//             messages: {
//                 required: 'Напишите информацию о себе',
//                 pattern: 'Используйте только допустимые символы'
//             }
//         }
//     };
//     function setupFieldAutoSave(fieldName) {
//         const element = document.querySelector(`[name="${fieldName}"]`);
//         if (!element) return;
    
//         const saveFieldValue = () => {
//             let value;
//             if (element.type === 'checkbox') {
//                 value = element.checked;
//             } else if (element.type === 'radio') {
//                 if (element.checked) {
//                     value = element.value;
//                 } else {
//                     return; // Не сохраняем невыбранные radio
//                 }
//             } else if (element.tagName === 'SELECT' && element.multiple) {
//                 value = Array.from(element.selectedOptions).map(opt => opt.value).join(',');
//             } else {
//                 value = element.value;
//             }
    
//             console.log(`Saving ${fieldName}:`, value); // Отладочный вывод
//             setCookie(fieldName, value, { expires: new Date(Date.now() + 86400000) });
//         };
    
//         // Для разных типов полей разные события
//         if (element.type === 'checkbox' || element.type === 'radio') {
//             element.addEventListener('change', saveFieldValue);
//         } else if (element.tagName === 'SELECT' && element.multiple) {
//             element.addEventListener('change', saveFieldValue);
//         } else {
//             element.addEventListener('input', saveFieldValue);
//         }
//     }
//     // Восстановление значений из LocalStorage
//     function restoreFormCookies() {
//         Object.keys(validationRules).forEach(fieldName => {
//             const value = getCookie(fieldName);
//             const elements = document.getElementsByName(fieldName);
            
//             if (value && elements.length > 0) {
//                 if (elements[0].type === 'checkbox') {
//                     elements[0].checked = value === 'true';
//                 } else if (elements[0].type === 'radio') {
//                     elements.forEach(el => {
//                         if (el.value === value) el.checked = true;
//                     });
//                 } else if (elements[0].tagName === 'SELECT' && elements[0].multiple) {
//                     const values = value.split(',');
//                     Array.from(elements[0].options).forEach(opt => {
//                         opt.selected = values.includes(opt.value);
//                     });
//                 } else {
//                     elements[0].value = value;
//                 }
//             }
            
//             // Восстановление ошибок
//             const errorCode = getCookie(`${fieldName}_error`);
//             if (errorCode) {
//                 const message = validationRules[fieldName].messages[errorCode] || 
//                                validationRules[fieldName].messages.required;
//                 highlightError(elements[0], message);
//             }
            
//             // Настраиваем автосохранение для каждого поля
//             setupFieldAutoSave(fieldName);
//         });
//     }
//     function validateForm() {
//         let isValid = true;
//         resetFormErrors();
        
//         Object.keys(validationRules).forEach(fieldName => {
//             const elements = document.getElementsByName(fieldName);
//             if (!elements.length) return;
            
//             const rules = validationRules[fieldName];
//             const element = elements[0];
//             let isFieldValid = true;
            
//             // Для radio и checkbox
//             if (element.type === 'radio' || element.type === 'checkbox') {
//                 const isChecked = Array.from(elements).some(el => el.checked);
//                 if (rules.required && !isChecked) {
//                     isValid = false;
//                     setCookie(`${fieldName}_error`, '1', { maxAge: 60 });
//                     highlightError(element.closest('.form-group') || element, rules.messages.required);
//                 }
//             } 
//             // Для select multiple
//             else if (element.tagName === 'SELECT' && element.multiple) {
//                 const selected = Array.from(element.options).some(opt => opt.selected);
//                 if (rules.required && !selected) {
//                     isValid = false;
//                     setCookie(`${fieldName}_error`, '1', { maxAge: 60 });
//                     highlightError(element, rules.messages.required);
//                 }
//             }
//             // Для остальных полей
//             else {
//                 const value = element.value.trim();
                
//                 if (rules.required && !value) {
//                     isValid = false;
//                     setCookie(`${fieldName}_error`, '1', { maxAge: 60 });
//                     highlightError(element, rules.messages.required);
//                 }
//                 else if (value) {
//                     if (rules.maxLength && value.length > rules.maxLength) {
//                         isValid = false;
//                         setCookie(`${fieldName}_error`, '2', { maxAge: 60 });
//                         highlightError(element, rules.messages.maxLength);
//                     }
                    
//                     if (rules.pattern && !rules.pattern.test(value)) {
//                         isValid = false;
//                         setCookie(`${fieldName}_error`, '3', { maxAge: 60 });
//                         highlightError(element, rules.messages.pattern);
//                     }
//                 }
//             }
            
//         });
        
//         return isValid;
//     }
//     // Сохранение в Cookies


//     // Обработка отправки формы
//     form.addEventListener("submit", function(e) {
//         e.preventDefault();
        
//         // Собираем данные формы
//         const formData = new FormData(this);
        
//         // Добавляем CSRF-токен, если он нужен
//         const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;
//         if (csrfToken) {
//             formData.append('csrf_token', csrfToken);
//         }

//         let isValid = true;
//     let hasValidationErrors = false;

//     // Сначала сохраняем ВСЕ значения полей (даже невалидные)
//     Object.keys(validationRules).forEach(fieldName => {
//         const elements = document.getElementsByName(fieldName);
//         if (!elements.length) return;
        
//         const element = elements[0];
//         const rules = validationRules[fieldName];
//         let value;

//         // Получаем значение в зависимости от типа элемента
//         if (element.type === 'checkbox') {
//             value = element.checked;
//             setCookie(fieldName, value, { expires: new Date(Date.now() + 86400000) });
//         } 
//         else if (element.type === 'radio') {
//             const selected = Array.from(elements).find(el => el.checked);
//             value = selected ? selected.value : '';
//             if (selected) setCookie(fieldName, value, { expires: new Date(Date.now() + 86400000) });
//         } 
//         else if (element.tagName === 'SELECT' && element.multiple) {
//             value = Array.from(element.selectedOptions).map(opt => opt.value).join(',');
//             setCookie(fieldName, value, { expires: new Date(Date.now() + 86400000) });
//         }
//         else {
//             value = element.value.trim();
//             setCookie(fieldName, value, { expires: new Date(Date.now() + 86400000) });
//         }
//     });

//     // Затем выполняем валидацию
//     Object.keys(validationRules).forEach(fieldName => {
//         const elements = document.getElementsByName(fieldName);
//         if (!elements.length) return;
        
//         const element = elements[0];
//         const rules = validationRules[fieldName];
//         let value;

//         if (element.type === 'checkbox') {
//             value = element.checked;
//         } 
//         else if (element.type === 'radio') {
//             value = Array.from(elements).some(el => el.checked);
//         } 
//         else if (element.tagName === 'SELECT' && element.multiple) {
//             value = Array.from(element.selectedOptions).length > 0;
//         }
//         else {
//             value = element.value.trim();
//         }

//         // Валидация
//         if (rules.required && !value) {
//             isValid = false;
//             hasValidationErrors = true;
//             setCookie(`${fieldName}_error`, '1', { maxAge: 60 });
//             highlightError(element, rules.messages.required);
//         }
//         else if (value && rules.maxLength && value.length > rules.maxLength) {
//             isValid = false;
//             hasValidationErrors = true;
//             setCookie(`${fieldName}_error`, '2', { maxAge: 60 });
//             highlightError(element, rules.messages.maxLength);
//         }
//         else if (value && rules.pattern && !rules.pattern.test(value)) {
//             isValid = false;
//             hasValidationErrors = true;
//             setCookie(`${fieldName}_error`, '3', { maxAge: 60 });
//             highlightError(element, rules.messages.pattern);
//         }
//         else {
//             // Если поле валидно, удаляем ошибку если она была
//             deleteCookie(`${fieldName}_error`);
//             const errorContainer = element.closest('.form-group') || element.parentElement;
//             const errorElement = errorContainer.querySelector('.error-message');
//             if (errorElement) errorElement.remove();
//             element.classList.remove('error-field');
//         }
//     });

//     if (hasValidationErrors) {
//         alert("Заполните все обязательные поля");
//         return;
//     }

//         // Отправка AJAX
//         $.ajax({
//             url: form.action,
//             type: 'POST',
//             data: formData,
//             processData: false,
//             contentType: false,
//             dataType: 'json',
//             beforeSend: function(xhr) {
//                 xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
//             },
//             success: function(response, status, xhr) {
//                 try {
//                     // Проверяем, может ли response быть строкой (на случай неправильного Content-Type)
//                     if (typeof response === 'string') {
//                         response = JSON.parse(response);
//                     }
            
//                     // Обработка ошибок валидации (422 статус)
//                     if (xhr.status === 422 || response.errors) {
//                         let errorMessage = response.message || 'Ошибки валидации';
                        
//                         // Очищаем предыдущие ошибки
//                         document.querySelectorAll('.error-message').forEach(el => el.remove());
                        
//                         // Показываем общее сообщение об ошибке
//                         showError(errorMessage);
                        
//                         // Подсвечиваем конкретные ошибки полей
//                         if (response.errors) {
//                             Object.keys(response.errors).forEach(field => {
//                                 const element = document.querySelector(`[name="${field}"]`);
//                                 if (element) {
//                                     // Получаем сообщение об ошибке напрямую из validationRules
//                                     const errorCode = response.errors[field];
//                                     const fieldRules = validationRules[field];
//                                     let message = '';
                                    
//                                     if (fieldRules && fieldRules.messages) {
//                                         // Если ошибка содержит код (например '1', '2')
//                                         if (typeof errorCode === 'string' || typeof errorCode === 'number') {
//                                             message = fieldRules.messages[errorCode] || fieldRules.messages.required || 'Ошибка в поле';
//                                         } 
//                                         // Если ошибка содержит готовое сообщение
//                                         else if (typeof errorCode === 'string') {
//                                             message = errorCode;
//                                         }
//                                     } else {
//                                         message = errorCode || 'Ошибка в поле';
//                                     }
                                    
//                                     highlightError(element, message);
//                                 }
//                             });
//                         }
//                         return;
//                     }
            
//                     // Обработка успешного создания пользователя
//                     if (response.login && response.pass) {
//                         showSuccessMessage(`Учетная запись создана! Логин: ${response.login}, Пароль: ${response.pass}`);
//                         form.reset();
                        
//                         // Очищаем cookies после успешной отправки
//                         ['fio', 'field-tel', 'field-email', 'field-date', 'radio-group-1', 'check-1', 'languages', 'bio'].forEach(name => {
//                             deleteCookie(name);
//                         });
//                         return;
//                     }
            
//                     // Обработка успешного обновления данных
//                     if (response.success || response.message) {
//                         resetFormErrors();
//                         showSuccessMessage(response.message || 'Данные успешно сохранены');
                        
//                         // Редирект если есть
//                         if (response.redirect) {
//                             setTimeout(() => {
//                                 window.location.href = response.redirect;
//                             }, 1500);
//                         }
//                         return;
//                     }
            
//                     // Если ответ не распознан
//                     showError('Некорректный формат ответа сервера');
//                     console.error('Неожиданный ответ сервера:', response);
            
//                 } catch (e) {
//                     showError('Ошибка обработки ответа сервера');
//                     console.error('Ошибка при обработке ответа:', e, 'Ответ:', response);
//                 }
//             },
//             error: function(xhr) {
//                 // Только для реальных HTTP ошибок (не 200)
//                 let errorMsg = 'Ошибка сервера';
                
//                 if (xhr.status === 422) {
//                     errorMsg = 'Проверьте правильность данных';
//                 } else if (xhr.status === 403) {
//                     errorMsg = 'Ошибка безопасности. Обновите страницу';
//                 }
                
//                 showError(`${errorMsg} (код: ${xhr.status})`);
                
//                 // Дополнительная обработка ошибок валидации
//                 if (xhr.status === 422 && xhr.responseJSON?.errors) {
//                     Object.entries(xhr.responseJSON.errors).forEach(([field, error]) => {
//                         const element = document.querySelector(`[name="${field}"]`);
//                         if (element) highlightError(element, error);
//                     });
//                 }
//             }
//         });
//     });

// function highlightError(element, message) {
//     if (!element) return;
    
//     // Удаляем старые ошибки
//     const errorContainer = element.closest('.form-group') || element.parentElement;
//     const oldError = errorContainer.querySelector('.error-message');
//     if (oldError) oldError.remove();
    
//     // Добавляем новую ошибку
//     if (message) {
//         const errorElement = document.createElement('div');
//         errorElement.className = 'error-message';
//         errorElement.textContent = message;
//         errorContainer.appendChild(errorElement);
//     }
    
//     // Подсвечиваем поле
//     element.classList.add('error-field');
// }

//     function showSuccessMessage(message) {
//         const alertDiv = document.createElement('div');
//         alertDiv.className = 'alert alert-success';
//         alertDiv.textContent = message;
//         form.prepend(alertDiv);
//     }

//     function showError(message) {
//         const alertDiv = document.createElement('div');
//         alertDiv.className = 'alert alert-danger';
//         alertDiv.textContent = message;
//         form.prepend(alertDiv);
//     }

//     function resetFormErrors() {
//         // Удаляем все сообщения об ошибках
//         document.querySelectorAll('.error-message').forEach(el => el.remove());
        
//         // Сбрасываем подсветку полей
//         document.querySelectorAll('.error-field').forEach(field => {
//             field.classList.remove('error-field');
//         });
//     }

    

//     // Восстановление данных при загрузке
//     restoreFormCookies();
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
    alert(message); // Можно заменить на более красивый вывод
}

function showSuccessMessage(message) {
    alert(message); // Можно заменить на более красивый вывод
}

window.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("myform");
    if (!form) return;

    function showSuccessMessageEntry(message) {
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-success';
        alertDiv.textContent = message;
        form.prepend(alertDiv);

        // Прокручиваем к сообщению
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
            // Особенная обработка для разных типов полей
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
            
            if (value !== null && elements.length > 0) { // Проверяем value !== null вместо просто value
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
                        let errorMessage = response.message || 'Ошибки валидации';
                        showError(errorMessage);
                        
                        if (response.errors) {
                            Object.keys(response.errors).forEach(field => {
                                const element = document.querySelector(`[name="${field}"]`);
                                if (element) {
                                    const errorCode = response.errors[field];
                                    const fieldRules = validationRules[field];
                                    let message = '';
                                    
                                    if (fieldRules?.messages) {
                                        message = fieldRules.messages[errorCode] || 
                                                  fieldRules.messages.required || 
                                                  errorCode;
                                    } else {
                                        message = errorCode || 'Ошибка в поле';
                                    }
                                    
                                    highlightError(element, message);
                                }
                            });
                        }
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
                let errorMsg = 'Ошибка сервера';
                
                if (xhr.status === 422) {
                    errorMsg = 'Такая почта уже зарегистрирована.';
                } else if (xhr.status === 403) {
                    errorMsg = 'Ошибка безопасности. Обновите страницу';
                }
                
                showError(`${errorMsg} (код: ${xhr.status})`);
                
                if (xhr.status === 422 && xhr.responseJSON?.errors) {
                    Object.entries(xhr.responseJSON.errors).forEach(([field, error]) => {
                        const element = document.querySelector(`[name="${field}"]`);
                        if (element) highlightError(element, error);
                    });
                }
            }
        });
    });
});