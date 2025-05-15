import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import famAcc from "./img/fam_acc.png";
import persAcc from "./img/pers_acc.png";
import RegisterForm from "./components/RegisterForm.jsx";
import AuthForm from "./components/AuthForm.jsx";
import UserAccount from "./components/UserAccount.jsx";
import Sidebar from "./components/Sidebar.jsx";
import "./App.css";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-container">
          <h1>Что-то пошло не так.</h1>
          <p>Пожалуйста, обновите страницу или попробуйте позже.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

function Header() {
  return (
    <header className="header">
      <div className="logo">Waves</div>
      <div className="auth-buttons">
        <Link to="/register" className="auth-button">Зарегистрироваться</Link>
        <Link to="/auth" className="auth-button">Войти</Link>
        <Link to="/user-account" className="auth-button">Профиль</Link>
      </div>
    </header>
  );
}

function MainContent() {
  return (
    <section className="main">
      <h1 className="main-title">Waves - управляй финансами легко и удобно</h1>
      <p className="description">
        Добро пожаловать в Waves – приложение, которое превращает контроль за
        деньгами в простую и приятную привычку!
      </p>
      <a href="#how-work" className="primary-button">
        Узнать подробнее
      </a>
    </section>
  );
}

function Features() {
  return (
    <>
      <h1>Почему Waves?</h1>
      <section className="features">
        <div className="feature-card">
          <h3 className="feature-title">
            Учет всех операций – быстро добавляйте доходы и расходы, распределяйте
            по категориям.
          </h3>
        </div>
        <div className="feature-card">
          <h3 className="feature-title">
            Автоматическая аналитика – понятные графики и отчеты, чтобы видеть,
            куда уходят деньги.
          </h3>
        </div>
        <div className="feature-card">
          <h3 className="feature-title">
            Гибкое бюджетирование – настраивайте лимиты и получайте уведомления о
            перерасходе.
          </h3>
        </div>
      </section>
      <section className="features">
        <div className="feature-card">
          <h3 className="feature-title">
            Цели и накопления – откладывайте на мечты, а Waves подскажет, как это
            сделать быстрее.
          </h3>
        </div>
        <div className="feature-card">
          <h3 className="feature-title">
            Синхронизация с банками – импортируйте транзакции автоматически (по
            желанию).
          </h3>
        </div>
        <div className="feature-card">
          <h3 className="feature-title">
            Безопасность – ваши данные защищены PIN-кодом, Face ID или Touch ID.
          </h3>
        </div>
      </section>
    </>
  );
}

function HowItWorks() {
  return (
    <section className="fullwidth-band how-it-works">
      <div className="band-content">
        <h1 id="how-work">Как это работает?</h1>
        <div className="how-it-works-steps">
          <div className="step-card">
            <h3>Добавление операций</h3>
            <p>Вносите доходы и расходы вручную или автоматически.</p>
          </div>
          <div className="step-card">
            <h3>Анализ статистики</h3>
            <p>Изучайте графики и отчеты для понимания структуры расходов.</p>
          </div>
          <div className="step-card">
            <h3>Планирование бюджета</h3>
            <p>Устанавливайте лимиты и достигайте финансовых целей.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function AccountTypes() {
  return (
    <>
      <h1 className="type">"Личные финансы или семейный бюджет? Waves справится с обоими задачами!"</h1>
      <section className="account-types">
        <div className="account-card">
          <h3>Персональный аккаунт</h3>
          <img
            src={persAcc}
            alt="Персональный аккаунт"
            style={{ marginTop: "-1.8rem" }}
          />
        </div>
        <div className="account-card">
          <h3>Семейный аккаунт</h3>
          <img
            src={famAcc}
            alt="Семейный аккаунт"
          />
        </div>
      </section>
    </>
  );
}

function Testimonials() {
  return (
    <>
      <h1>Ваши отзывы</h1>
      <section className="testimonials">
        <div className="testimonial-card">
          <p>"Отличное приложение! С Waves я наконец-то вижу, куда уходят мои деньги."</p>
          <p>- Михаил</p>
        </div>
        <div className="testimonial-card">
          <p>"Очень удобно планировать бюджет и отслеживать расходы. Рекомендую всем!"</p>
          <p>- Анюта</p>
        </div>
        <div className="testimonial-card">
          <p>"Приложение просто спасение для тех, кто хочет контролировать свои финансы!"</p>
          <p>- Толик</p>
        </div>
      </section>
    </>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-section">
          <ul className="footer-links">
            <li>Контакты: +7 (3467) 37-70-00</li>
          </ul>
          <ul className="footer-contact-info">
            <li>Email: info@mail.ru</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2025 Waves. Все права защищены.</p>
      </div>
    </footer>
  );
}

function App() {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <div className="main-content">
          <Routes>
            <Route path="/login" element={<AuthForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/profile" element={<UserAccount />} />
            <Route path="/" element={<Navigate to="/login" />} />
            {/* Добавьте другие страницы по мере необходимости */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;