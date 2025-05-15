import React, { useState, useEffect, useRef } from "react";
import "./UserAccount.css";

function UserAccount() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); 
  const menuRef = useRef(null);

  const [profileData, setProfileData] = useState({
    name: "Surname Name",
    login: "User123456",
    email: "user@example.com",
    balance: "100 руб.",
    avatar:
      "https://i.pinimg.com/474x/d5/82/9d/d5829d01f4425addd09920f1b02bd1e4.jpg "
  });

  const [settings, setSettings] = useState({
    name: profileData.name,
    email: profileData.email,
    password: ""
  });

  const [isLoading, setIsLoading] = useState(false);

  const toggleSettings = () => {
    setIsModalOpen((prev) => !prev);
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleSettingsChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      setProfileData(prev => ({
        ...prev,
        name: settings.name,
        email: settings.email
      }));
      toggleSettings();
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (
      window.confirm("Вы уверены, что хотите удалить аккаунт? Это действие нельзя отменить.")
    ) {
      setIsLoading(true);
      try {
      } catch (error) {
        console.error("Failed to delete account:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="container">
      <div className="col-md-3 col-lg-2 sidebar">
        <h1 className="text-center mb-4 sidebar-title">
          <a href="index.html" style={{ textDecoration: "none", color: "#ffffff" }}>
            Waves
          </a>
        </h1>
        <button className="menu-toggle" onClick={toggleMenu} aria-label="Открыть меню">
          ☰
        </button>
        <ul ref={menuRef} className={`nav flex-column ${isMenuOpen ? "active" : ""}`}>
          <li className="nav-item">
            <a className="nav-link active sidebar-link" href="dashboard.html" id="dashboard-tab">
              <i className="bi bi-speedometer2 me-2"></i> Дашборд
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link sidebar-link" href="#" id="logout-tab">
              <i className="bi bi-logout-up me-2"></i> Выйти
            </a>
          </li>
        </ul>

        <div className="mt-4 p-3 balance-info">
          <div className="balance-container">
            <h6 className="balance-title">Общий баланс</h6>
            <span id="total-balance" className="total-balance">
              3 250 руб
            </span>
          </div>
          <div className="income-expense">
            <div className="income">
              <p>Доход:</p>
              <span id="total-income">32 500 руб</span>
            </div>
            <div className="expense">
              <p>Расход:</p>
              <span id="total-expense">29 250 руб</span>
            </div>
          </div>
        </div>
      </div>
      <form className="register-form" id="profileInfo">
        <div className="profile-centered">
          <div className="profile-avatar">
            <img src={profileData.avatar} alt="Аватар профиля" />
          </div>
          <span id="profileName">{profileData.name}</span>
        </div>
        <p className="profile-text">
          Логин: <span id="profileLogin">{profileData.login}</span>
        </p>
        <p className="profile-text">
          Email: <span id="profileEmail">{profileData.email}</span>
        </p>
        <p className="profile-text">
          Баланс: <span id="profileBalance">{profileData.balance}</span>
        </p>
        <div className="profile-centered">
          <button
            type="button"
            className="primary-button"
            style={{ width: "100%", marginTop: "4rem" }}
            onClick={toggleSettings}
          >
            Настройки профиля
          </button>
        </div>
      </form>
      <div
        className={`settings-modal ${isModalOpen ? "active" : ""}`}
        id="settingsModal"
        style={{ display: isModalOpen ? "flex" : "none" }}
      >
        <div className="modal-content">
          <button className="close-button" onClick={toggleSettings}>
            &times;
          </button>
          <h2 style={{ textAlign: "center" }}>Настройки профиля</h2>
          <div className="form-group">
            <label htmlFor="name">Имя:</label>
            <br />
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Ваше имя"
              value={settings.name}
              onChange={handleSettingsChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <br />
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Ваш email"
              value={settings.email}
              onChange={handleSettingsChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Новый пароль:</label>
            <br />
            <input type="password" id="password" placeholder="Новый пароль" />
          </div>

          <h2 style={{ textAlign: "center" }}>Управление бюджетом</h2>
          <button className="primary-button add-source">Добавить источник дохода</button>
          <button
            className="primary-button"
            style={{ width: "100%" }}
            onClick={handleSettingsSubmit}
          >
            Сохранить изменения
          </button>
          <button
            className="primary-button delete-account"
            onClick={handleDeleteAccount}
          >
            Удалить аккаунт
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserAccount;