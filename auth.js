document.querySelector('.register-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const login = document.getElementById('login').value;
    const password = document.getElementById('password').value;

    try {
      const response = await fetch('https://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Ошибка: ${errorData.message}`);
        return;
      }

      const data = await response.json();
      localStorage.setItem('token', data.token); // Сохраняем токен в localStorage
      alert('Вход выполнен успешно!');
      window.location.href = 'index.html'; // Перенаправление на главную страницу
    } catch (error) {
      console.error('Ошибка при входе:', error);
      alert('Произошла ошибка при входе.');
    }
  });