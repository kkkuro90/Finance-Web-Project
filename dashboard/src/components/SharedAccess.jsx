import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import EmailInviteModal from './EmailInviteModal';
import LinkInviteModal from './LinkInviteModal';

const API_URL = 'http://localhost:5001/api';

const getToken = () => localStorage.getItem('token');
const axiosAuth = axios.create({
  baseURL: API_URL,
});
axiosAuth.interceptors.request.use(config => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Компонент модального окна подтверждения
const ConfirmationModal = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: '#390668',
        padding: '20px',
        borderRadius: '8px',
        maxWidth: '500px',
        width: '90%',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ color: 'white', marginBottom: '20px' }}>Подтверждение действия</h3>
        <p style={{ color: '#adb5bd', marginBottom: '30px' }}>{message}</p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button 
            onClick={onClose}
            style={{
              backgroundColor: '#615e68',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Отмена
          </button>
          <button 
            onClick={onConfirm}
            style={{
              backgroundColor: '#e74c3c',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Подтвердить
          </button>
        </div>
      </div>
    </div>
  );
};

const SharedAccess = () => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [notification, setNotification] = useState(null);
  const [members, setMembers] = useState([]);
  const [budget, setBudget] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [categoryBudgets, setCategoryBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [invites, setInvites] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!getToken()) {
      navigate('/login');
      return;
    }
    fetchAll();
  }, []);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const fetchAll = async () => {
    setLoading(true);
    await Promise.all([fetchBudget(), fetchCategoryBudgets(), fetchInvites()]);
    setLoading(false);
  };

  const fetchBudget = async () => {
    try {
      const res = await axiosAuth.get('/family/budget');
      setBudget(res.data.budget);
      setMembers(res.data.members);
      setIsAdmin(res.data.isAdmin);
    } catch (e) {
      setNotification({ message: 'Ошибка загрузки бюджета: ' + (e.response?.data?.message || e.message), type: 'error' });
    }
  };

  const fetchCategoryBudgets = async () => {
    try {
      const res = await axiosAuth.get('/family/category-budgets');
      setCategoryBudgets(res.data);
    } catch (e) {}
  };

  const fetchInvites = async () => {
    try {
      const res = await axiosAuth.get('/family/invites');
      setInvites(res.data);
    } catch (e) {}
  };

  const handleSetBudget = async (newBudget) => {
    try {
      await axiosAuth.post('/family/set-budget', { budget: newBudget });
      setBudget(newBudget);
      setNotification({ message: 'Бюджет обновлен', type: 'success' });
    } catch (e) {
      setNotification({ message: 'Ошибка обновления бюджета: ' + (e.response?.data?.message || e.message), type: 'error' });
    }
  };

  const handleInvite = async () => {
    try {
      await axiosAuth.post('/family/invite', { email: inviteEmail });
      setNotification({ message: 'Приглашение отправлено!', type: 'success' });
      setInviteEmail('');
      fetchInvites();
    } catch (e) {
      setNotification({ message: 'Ошибка отправки приглашения: ' + (e.response?.data?.message || e.message), type: 'error' });
    }
  };

  const handleSetCategoryBudget = async (categoryId, budget) => {
    try {
      await axiosAuth.post('/family/category-budget', { categoryId, budget });
      fetchCategoryBudgets();
      setNotification({ message: 'Бюджет по категории обновлен', type: 'success' });
    } catch (e) {
      setNotification({ message: 'Ошибка обновления бюджета по категории: ' + (e.response?.data?.message || e.message), type: 'error' });
    }
  };

  const handleCreateGroup = () => {
    setConfirmAction(() => async () => {
      try {
        await axiosAuth.post('/family/create');
        setNotification({ message: 'Новая группа успешно создана!', type: 'success' });
        setMembers([]);
        setInvites([]);
        setBudget(0);
        fetchAll();
      } catch (e) {
        setNotification({ message: 'Ошибка создания группы: ' + (e.response?.data?.message || e.message), type: 'error' });
      }
      setShowConfirmModal(false);
    });
    setShowConfirmModal(true);
  };

  const handleDeleteGroup = () => {
    setConfirmAction(() => async () => {
      try {
        await axiosAuth.delete('/family/delete');
        setNotification({ message: 'Группа удалена!', type: 'success' });
        setMembers([]);
        setInvites([]);
        setBudget(0);
      } catch (e) {
        setNotification({ message: 'Ошибка удаления группы: ' + (e.response?.data?.message || e.message), type: 'error' });
      }
      setShowConfirmModal(false);
    });
    setShowConfirmModal(true);
  };

  const handleAccessSettings = () => {
    if (location.pathname !== '/sharedaccess') {
      navigate('/sharedaccess');
    }
  };

  const isValidEmail = (email) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);

  if (loading) return <div className="main-content"><div className="loading">Загрузка...</div></div>;

  return (
    <div className="main-content">
      {notification && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          backgroundColor: notification.type === 'success' ? '#2ecc71' : '#e74c3c',
          color: 'white',
          padding: '15px 25px',
          borderRadius: '4px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
          zIndex: 1000,
          animation: 'slideIn 0.3s ease-out'
        }}>
          {notification.message}
        </div>
      )}
      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={confirmAction}
        message="Вы уверены, что хотите выполнить это действие? Текущая группа будет удалена."
      />
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="dashboard-title">Совместный доступ</h2>
        <button 
          className="btn btn-primary"
          onClick={() => navigate('/family-budget')}
        >
          Семейный бюджет
        </button>
      </div>
      <div className="panel">
        <div className="family-header">
          <div className="family-title">Участники семьи</div>
          <button 
            className="btn btn-primary" 
            id="createGroupBtn"
            onClick={handleCreateGroup}
          >
            Создать новую группу
          </button>
        </div>
        <div className="member-grid">
          {members.map(member => (
            <div className="member-card" key={member.id}>
              <div className="member-avatar">{member.name?.[0]}{member.surname?.[0]}</div>
              <div className="member-name">{member.name} {member.surname}</div>
              <div className="member-email">{member.email}</div>
              <div className={member.isOwner ? 'pill owner' : 'pill'}>{member.isOwner ? 'Владелец' : 'Участник'}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: '30px' }}>
          <button className="btn btn-outline" style={{ marginRight: '12px', backgroundColor: '#5b248f', color: 'white' }} onClick={handleAccessSettings} disabled={location.pathname === '/sharedaccess'}>Настройки доступа</button>
          <button className="btn btn-danger" style={{ backgroundColor: '#5b248f' }} onClick={handleDeleteGroup}>Удалить группу</button>
        </div>
      </div>
      <div className="invite-section">
        <div className="invite-title">Пригласить в группу</div>
        <p>Отправьте приглашение членам семьи, чтобы они могли видеть общие финансы и участвовать в бюджетировании.</p>
        <div className="invite-methods">
          <div className="invite-method">
            <div className="method-icon">✉️</div>
            <div className="method-title">По электронной почте</div>
            <div className="method-desc">Отправить персональное приглашение на email</div>
          </div>
          <div className="invite-method">
            <div className="method-icon">🔗</div>
            <div className="method-title">Ссылка для приглашения</div>
            <div className="method-desc">Скопируйте и отправьте ссылку любым способом</div>
          </div>
        </div>
      </div>
      <div className="panel">
        <h2 style={{ color: 'white' }}>Ожидающие приглашения</h2>
        <div className="member-grid">
          {invites.length === 0 ? (
            <div style={{ color: 'white' }}>Нет ожидающих приглашений</div>
          ) : invites.filter(i => !i.accepted).map(invite => (
            <div className="member-card" key={invite.id}>
              <div className="member-avatar">{invite.invitedUserEmail?.[0]?.toUpperCase() || '?'}</div>
              <div className="member-name">{invite.invitedUserEmail}</div>
              <div className="member-email">{invite.invitedUserEmail}</div>
              <div style={{ color: '#aaa', fontSize: '12px' }}>Создано: {new Date(invite.createdAt).toLocaleString()}</div>
              <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                <button className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '14px', backgroundColor: '#390668', color: 'white' }} disabled>Ожидает</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="panel">
        <h2 style={{ color: 'white' }}>Пригласить по email</h2>
        <input
          type="email"
          value={inviteEmail}
          onChange={e => setInviteEmail(e.target.value)}
          placeholder="Email"
        />
        <button onClick={handleInvite} disabled={!isValidEmail(inviteEmail)}>Пригласить</button>
      </div>
      <div className="panel">
        <button className="btn btn-outline me-2" onClick={handleCreateGroup}>Создать новую группу</button>
        <button className="btn btn-danger" onClick={handleDeleteGroup}>Удалить группу</button>
      </div>
      <div className="panel">
        <h2 style={{ color: 'white' }}>Общий бюджет</h2>
        <div>
          <h3>Общий бюджет: {budget} ₽</h3>
          {isAdmin && (
            <input
              type="number"
              value={budget}
              onChange={e => handleSetBudget(Number(e.target.value))}
              placeholder="Установить бюджет"
            />
          )}
        </div>
      </div>
      <div className="panel">
        <h2 style={{ color: 'white' }}>Бюджеты по категориям</h2>
        <ul>
          {categoryBudgets.map(cat => (
            <li key={cat.id}>
              {cat.name}: {cat.monthlyBudget || 0} ₽
              {isAdmin && (
                <input
                  type="number"
                  defaultValue={cat.monthlyBudget || ''}
                  onBlur={e => handleSetCategoryBudget(cat.id, Number(e.target.value))}
                  placeholder="Установить бюджет"
                />
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SharedAccess;