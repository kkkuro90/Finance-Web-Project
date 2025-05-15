import React, { useState } from 'react';
import './Forms.css'; 

const LoginForm = () => {
  const [formData, setFormData] = useState({
    login: '',
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
    console.log('Данные для входа:', formData);
  };

  return (
    <div className="container">
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

export default LoginForm;