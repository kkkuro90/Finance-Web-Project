document.querySelector('.register-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const login = document.getElementById('login').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
      const response = await fetch('https://localhost:5001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Ошибка: ${errorData.message}`);
        return;
      }

      alert('Регистрация прошла успешно!');
      window.location.href = 'auth.html';
    } catch (error) {
      console.error('Ошибка при регистрации:', error);
      alert('Произошла ошибка при регистрации.');
    }
  });