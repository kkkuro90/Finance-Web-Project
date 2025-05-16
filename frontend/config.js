const config = {
    apiUrl: 'api',
    endpoints: {
        login: '/auth/login',
        register: '/auth/register',
        profile: '/auth/profile'
    }
};

// Функция для проверки аутентификации
function isAuthenticated() {
    const token = localStorage.getItem('token');
    return !!token;
}

// Функция для получения заголовков с токеном
function getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
    };
}

// Функция для редиректа на страницу входа
function redirectToLogin() {
    window.location.href = '/auth';
}

// Функция для редиректа в профиль
function redirectToProfile() {
    window.location.href = '/profile';
}

// Проверка доступа к защищенным страницам
function checkAuth() {
    const currentPath = window.location.pathname;
    if (!isAuthenticated() && !currentPath.includes('auth') && !currentPath.includes('login')) {
        redirectToLogin();
        return false;
    }
    return true;
}

// Проверка доступа к страницам для неавторизованных пользователей
function checkGuest() {
    const currentPath = window.location.pathname;
    if (isAuthenticated() && (currentPath.includes('auth') || currentPath.includes('login'))) {
        redirectToProfile();
        return false;
    }
    return true;
} 