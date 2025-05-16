// Проверяем, что пользователь не авторизован
if (!checkGuest()) {
    // Если пользователь авторизован, checkGuest выполнит редирект
    return;
}

document.querySelector('.register-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const login = document.getElementById('login').value;
    const surname = document.getElementById('surname').value;
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Очищаем предыдущие сообщения
    const errorMessage = document.getElementById('error-message');
    const successMessage = document.getElementById('success-message');
    errorMessage.style.display = 'none';
    successMessage.style.display = 'none';

    try {
        const response = await fetch(`${config.apiUrl}${config.endpoints.register}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                Login: login,
                Surname: surname,
                Name: name,
                Email: email,
                Password: password
            }),
            credentials: 'include'
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Ошибка при регистрации');
        }

        // Показываем сообщение об успехе
        successMessage.textContent = 'Регистрация прошла успешно! Сейчас вы будете перенаправлены на страницу входа.';
        successMessage.style.display = 'block';

        // Редирект на страницу входа через 2 секунды
        setTimeout(() => {
            window.location.href = 'auth.html';
        }, 2000);
    } catch (error) {
        errorMessage.textContent = error.message || 'Произошла ошибка при регистрации';
        errorMessage.style.display = 'block';
    }
});