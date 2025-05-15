document.querySelector('.register-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const login = document.getElementById('login').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:5001/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ Login: login, Password: password }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            alert(`Ошибка: ${errorData.Message || 'Не удалось войти.'}`);
            return;
        }

        const data = await response.json();
        if (data.token) {
            localStorage.setItem('token', data.token);
            window.location.href = 'profile.html';
        } else {
            alert('Ошибка: токен не получен от сервера');
        }
    } catch (error) {
        alert('Произошла ошибка при входе.');
    }
});