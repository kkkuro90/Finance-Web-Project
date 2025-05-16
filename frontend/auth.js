// Проверяем, что пользователь не авторизован
if (!checkGuest()) {
    // Если пользователь авторизован, checkGuest выполнит редирект
    return;
}

document.querySelector('.register-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const login = document.getElementById('login').value;
    const password = document.getElementById('password').value;

    // Очищаем предыдущие сообщения об ошибках
    const errorMessage = document.getElementById('error-message');
    errorMessage.style.display = 'none';

    try {
        const response = await fetch(`${config.apiUrl}${config.endpoints.login}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ Login: login, Password: password }),
            credentials: 'include'
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Неверный логин или пароль');
        }

        if (data.token) {
            localStorage.setItem('token', data.token);
            window.location.href = 'profile.html';
        } else {
            throw new Error('Токен не получен от сервера');
        }
    } catch (error) {
        errorMessage.textContent = error.message || 'Произошла ошибка при входе';
        errorMessage.style.display = 'block';
    }
});