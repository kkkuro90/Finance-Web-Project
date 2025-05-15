import React, { useState } from 'react';
import './Forms.css';

const Notification = ({ message, type, onClose }) => {
  if (!message) return null;

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
        animation: 'slideIn 0.3s ease-out'
      }}
    >
      {message}
    </div>
  );
};

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    login: '',
    surname: '',
    name: '',
    email: '',
    password: ''
  });

  const [notification, setNotification] = useState({ message: '', type: 'success' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { login, surname, name, email, password } = formData;

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          Login: login,
          Surname: surname,
          Name: name,
          Email: email,
          Password: password
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        setNotification({
          message: errorData.Message || 'Не удалось зарегистрироваться.',
          type: 'error'
        });
        return;
      }

      setNotification({
        message: 'Регистрация прошла успешно!',
        type: 'success'
      });

      setTimeout(() => {
        window.location.href = '/auth'; 
      }, 1500);

    } catch (error) {
      setNotification({
        message: 'Произошла ошибка при регистрации.',
        type: 'error'
      });
    }
  };

  return (
    <div className="main-container">
      <Notification
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ message: '', type: 'success' })}
      />

      <form className="register-form" onSubmit={handleSubmit}>
        <h2 style={{ textAlign: 'center' }}>Регистрация</h2>

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
          <label htmlFor="surname">Фамилия</label>
          <input
            type="text"
            id="surname"
            name="surname"
            placeholder="Ваша фамилия"
            value={formData.surname}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="name">Имя</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Ваше имя"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Ваш email"
            value={formData.email}
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
          Зарегистрироваться
        </button>

        <p className="already">
          Уже зарегистрированы? <a href="/auth">Войти</a>
        </p>
      </form>
    </div>
  );
};

export default RegisterForm;