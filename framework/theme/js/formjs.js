document.getElementById('myform').addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    try {
        const csrfToken = form.querySelector('input[name="csrf_token"]').value;        const response = await fetch('', {
            method: 'POST',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Accept': 'application/json',
                'X-CSRF-Token': csrfToken // Добавляем токен, если есть
            },
            body: formData,
            credentials: 'include' // Важно! Отправляем куки
        });

        const data = await response.json();

        // 1. Обновляем сообщения
        let messagesDiv = document.getElementById('messages');
        if (!messagesDiv) {
            messagesDiv = document.createElement('div');
            messagesDiv.id = 'messages';
            form.prepend(messagesDiv);
        }
        messagesDiv.innerHTML = data.messages?.join('<br>') || '';

        // 2. Подсвечиваем ошибки
        // if (data.errors) {
        //     Object.keys(data.errors).forEach(field => {
        //         const input = form.querySelector([name="${CSS.escape(field)}"]);
        //         if (input) input.classList.toggle('error', !!data.errors[field]);
        //     });
        // }

        // // 3. Восстанавливаем значения (если нужно)
        // if (data.values) {
        //     Object.keys(data.values).forEach(field => {
        //         const input = form.querySelector([name="${CSS.escape(field)}"]);
        //         if (input) input.value = data.values[field];
        //     });
        // }

        // 4. Успешная отправка
        if (data.success) {
            form.reset();
        }
    } catch (error) {
        console.error('Ошибка:', error);
    }
});