import React, { useState } from 'react';
import './Forms.css';

const Notification = ({ message, type, onClose }) => {
  const bgColor = type === 'error' ? '#e74c3c' : '#2ecc71';

  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        backgroundColor: bgColor,
        color: 'white',
        padding: '10px 20px',
        borderRadius: '4px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
        zIndex: 1000,
        animation: 'slideIn 0.3s ease-out',
        transition: 'opacity 0.3s'
      }}
      onClick={onClose} 
    >
      {message}
    </div>
  );
};

const AuthForm = () => {
  const [formData, setFormData] = useState({
    login: '',
    password: ''
  });

  const [notification, setNotification] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { login, password } = formData;

    try {
      const response = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Login: login, Password: password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setNotification({
          message: errorData.Message || 'Не удалось войти.',
          type: 'error'
        });
        return;
      }

      const data = await response.json();
      if (data.token) {
        localStorage.setItem('token', data.token);
        window.location.href = 'profile.html';
      } else {
        setNotification({
          message: 'Ошибка: токен не получен от сервера',
          type: 'error'
        });
      }
    } catch (error) {
      setNotification({
        message: 'Произошла ошибка при входе.',
        type: 'error'
      });
    }
  };

  return (
    <div className="main-container">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <form className="register-form" onSubmit={handleSubmit}>
        <h2 style={{ textAlign: 'center' }}>Авторизация</h2>

        <div className="form-group">
          <label htmlFor="login">Логин</label>
          <input
            type="text"
            id="login"
            name="login"
            placeholder="Ваш логин"
            value={formData.login}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Пароль</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Ваш пароль"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="primary-button" style={{ width: '100%' }}>
          Войти
        </button>

        <p className="already">
          Ещё не зарегистрированы? <a href="/register">Зарегистрироваться</a>
        </p>
      </form>
    </div>
  );
};

export default AuthForm;