document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Вы не авторизованы!');
        window.location.href = 'auth.html';
        return;
    }

    try {
        const response = await fetch('http://localhost:5001/api/auth/profile', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` },
        });

        if (!response.ok) {
            throw new Error('Ошибка при получении данных профиля.');
        }

        const data = await response.json();

        document.getElementById('profileLogin').textContent = data.login || data.Login;
        document.getElementById('profileName').textContent = `${data.surname || data.Surname} ${data.name || data.Name}`;
        document.getElementById('profileEmail').textContent = data.email || data.Email;
        document.getElementById('profileBalance').textContent = `${data.balance} руб.`;

        window.currentProfile = data;
    } catch (error) {
        alert('Не удалось загрузить данные профиля.');
    }
});

async function loadDashboard() {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
        const response = await fetch('http://localhost:5001/api/auth/dashboard', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` },
        });

        if (!response.ok) return;

        const data = await response.json();
        document.getElementById('total-balance').textContent = `${data.totalBalance} руб`;
        document.getElementById('total-income').textContent = `${data.incomes} руб`;
        document.getElementById('total-expense').textContent = `${data.expenses} руб`;
    } catch (error) {
        // обработка ошибки
    }
}

document.addEventListener('DOMContentLoaded', loadDashboard);

// Handle dashboard navigation
document.getElementById('dashboard-tab').addEventListener('click', (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Вы не авторизованы!');
        window.location.href = 'auth.html';
        return;
    }
    window.location.href = 'http://localhost:3000/dashboard?token=' + encodeURIComponent(token);
});

function toggleSettings() {
    const settingsModal = document.getElementById('settingsModal');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    if (!settingsModal.classList.contains('active') && window.currentProfile) {
        nameInput.value = window.currentProfile.name || window.currentProfile.Name || '';
        emailInput.value = window.currentProfile.email || window.currentProfile.Email || '';
        document.getElementById('password').value = '';
    }

    if (settingsModal.classList.contains('active')) {
        settingsModal.classList.remove('active');
        setTimeout(() => {
            settingsModal.style.display = 'none';
        }, 300); 
    } else {
        settingsModal.style.display = 'flex';
        setTimeout(() => {
            settingsModal.classList.add('active');
        }, 10); 
    }
}

document.getElementById('saveProfileBtn').addEventListener('click', async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:5001/api/auth/update-profile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                Name: name,
                Email: email,
                NewPassword: password
            })
        });

        const data = await response.json();
        if (response.ok) {
            alert('Профиль обновлён!');
            window.location.reload();
        } else {
            alert('Ошибка: ' + (data.Message || 'Не удалось обновить профиль'));
        }
    } catch (error) {
        alert('Произошла ошибка при обновлении профиля.');
    }
});

document.querySelector('.add-source').addEventListener('click', async () => {
    const amount = prompt('Введите сумму дохода:', '0');
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
        alert('Введите корректную сумму!');
        return;
    }
    const token = localStorage.getItem('token');
    try {
        const response = await fetch('http://localhost:5001/api/auth/add-income', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ Amount: Number(amount) })
        });
        const data = await response.json();
        if (response.ok) {
            alert('Доход добавлен!');
            window.location.reload();
        } else {
            alert('Ошибка: ' + (data.Message || 'Не удалось добавить доход'));
        }
    } catch (error) {
        alert('Произошла ошибка при добавлении дохода.');
    }
});

document.querySelector('.delete-account').addEventListener('click', async () => {
    if (!confirm('Вы уверены, что хотите удалить аккаунт? Это действие необратимо!')) return;
    const token = localStorage.getItem('token');
    try {
        const response = await fetch('http://localhost:5001/api/auth/delete-account', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json();
        if (response.ok) {
            alert('Аккаунт удалён!');
            localStorage.removeItem('token');
            window.location.href = 'index.html';
        } else {
            alert('Ошибка: ' + (data.Message || 'Не удалось удалить аккаунт'));
        }
    } catch (error) {
        alert('Произошла ошибка при удалении аккаунта.');
    }
}); 