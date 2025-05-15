document.querySelector('.register-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const login = document.getElementById('login').value;
    const surname = document.getElementById('surname').value;
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:5001/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                Login: login,
                Surname: surname,
                Name: name,
                Email: email,
                Password: password
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            alert(`Ошибка: ${errorData.Message || 'Не удалось зарегистрироваться.'}`);
            return;
        }

        alert('Регистрация прошла успешно!');
        window.location.href = 'auth.html';
    } catch (error) {
        alert('Произошла ошибка при регистрации.');
    }
});