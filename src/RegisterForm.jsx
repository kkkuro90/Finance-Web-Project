import React, { useState } from 'react';
import './Forms.css'; // Можно создать отдельный CSS файл для стилей

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    login: '',
    surname: '',
    name: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Данные формы:', formData);
    // Здесь можно отправить данные на сервер
  };

  return (
    <div className="container">
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