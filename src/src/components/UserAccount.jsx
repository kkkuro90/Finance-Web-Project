import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar.jsx";
import MobileSidebar from "./MobileSidebar/MobileSidebar.jsx";
import "./UserAccount.css";
import "./MobileSidebar/MobileSidebar.module.css";
import "./Sidebar.module.css";
import "./Alert.css"; 

function UserAccount() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);
  const [notification, setNotification] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

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

  useEffect(() => {
    window.showNotification = (message, type = "success") => {
      setNotification({ message, type });
    };

    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      delete window.showNotification;
    };
  }, []);

  const toggleSettings = () => setIsModalOpen((prev) => !prev);

  const handleSettingsChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5001/api/auth/update-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          Name: settings.name,
          Email: settings.email,
          NewPassword: settings.password
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Ошибка при сохранении');
      }

      setProfileData({
        ...profileData,
        name: settings.name,
        email: settings.email
      });

      setNotification({ message: 'Профиль успешно обновлён!', type: 'success' });
      toggleSettings();

    } catch (error) {
      setNotification({ message: error.message, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    setShowConfirmModal(false);
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5001/api/auth/delete-account', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        throw new Error('Ошибка при удалении аккаунта');
      }

      setNotification({ message: 'Аккаунт успешно удалён', type: 'success' });
      localStorage.removeItem('token');
      setTimeout(() => {
        window.location.href = '/auth.html';
      }, 1500);

    } catch (error) {
      setNotification({ message: error.message, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddIncome = async () => {
    const amount = prompt('Введите сумму дохода:', '0');
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      setNotification({ message: 'Введите корректную сумму!', type: 'error' });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5001/api/auth/add-income', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ Amount: Number(amount) })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.Message || 'Не удалось добавить доход');
      }

      setNotification({ message: 'Доход успешно добавлен!', type: 'success' });
      window.location.reload();

    } catch (error) {
      setNotification({ message: error.message, type: 'error' });
    }
  };

  return (
    <div className="main-container">
      {isDesktop && <Sidebar />}
      {!isDesktop && <MobileSidebar />}

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
          <button
            className="add-source"
            onClick={handleAddIncome}
          >
            Добавить источник дохода
          </button>
          <button
            className="primary-button"
            style={{ width: "100%" }}
            onClick={handleSettingsSubmit}
          >
            {isLoading ? "Сохранение..." : "Сохранить изменения"}
          </button>
          <button
            className="delete-account"
            onClick={handleDeleteAccount}
          >
            Удалить аккаунт
          </button>
        </div>
      </div>

      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      {showConfirmModal && (
        <div className="confirmation-overlay">
          <div className="confirmation-modal">
            <h3>Подтверждение</h3>
            <p>Вы уверены, что хотите удалить аккаунт? Это действие нельзя отменить.</p>
            <div className="confirmation-button-group">
              <button className="confirmation-button-confirm" onClick={confirmDelete}>
                Да, удалить
              </button>
              <button className="confirmation-button-cancel" onClick={() => setShowConfirmModal(false)}>
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserAccount;