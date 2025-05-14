import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// import EmailInviteModal from './EmailInviteModal';
// import LinkInviteModal from './LinkInviteModal';

const API_URL = process.env.REACT_APP_API_URL || '/api';

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
  const [notification, setNotification] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Загрузка участников семьи
  useEffect(() => {
    const fetchMembers = async () => {
      setLoading(true);
      try {
        // Здесь предполагается, что есть endpoint /api/family/members или /api/users
        const res = await axios.get(`${API_URL}/family/members`);
        setMembers(res.data);
      } catch (e) {
        setNotification({ message: 'Ошибка загрузки участников', type: 'error' });
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, []);

  const handleCreateGroup = async () => {
    setShowConfirmModal(true);
  };

  const confirmCreateGroup = async () => {
    setShowConfirmModal(false);
    try {
      // Здесь предполагается, что есть endpoint для создания новой группы
      await axios.post(`${API_URL}/family/create`);
      setNotification({ message: 'Новая группа успешно создана!', type: 'success' });
      // После создания — перезагрузить участников
      const res = await axios.get(`${API_URL}/family/members`);
      setMembers(res.data);
    } catch (e) {
      setNotification({ message: 'Ошибка создания группы', type: 'error' });
    }
  };

  // Удаление участника
  const handleRemoveMember = async (userId) => {
    try {
      await axios.delete(`${API_URL}/family/members/${userId}`);
      setMembers(members.filter(m => m.id !== userId));
      setNotification({ message: 'Участник удалён', type: 'success' });
    } catch (e) {
      setNotification({ message: 'Ошибка удаления участника', type: 'error' });
    }
  };

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
        onConfirm={confirmCreateGroup}
        message="Вы уверены, что хотите создать новую группу? Текущая группа будет удалена."
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
              {!member.isOwner && <button className="btn btn-danger btn-sm mt-2" onClick={() => handleRemoveMember(member.id)}>Удалить</button>}
            </div>
          ))}
        </div>
        
        <div style={{ marginTop: '30px' }}>
          <button className="btn btn-outline" style={{ marginRight: '12px', backgroundColor: '#5b248f', color: 'white' }}>Настройки доступа</button>
          <button className="btn btn-danger" style={{ backgroundColor: '#5b248f' }}>Удалить группу</button>
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
          <div className="member-card">
            <div className="member-avatar">ДС</div>
            <div className="member-name">Дмитрий Смирнов</div>
            <div className="member-email">dmitry@example.com</div>
            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
              <button className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '14px', backgroundColor: '#390668' }}>Принять</button>
              <button className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '14px', backgroundColor: '#390668', color: 'white' }}>Отклонить</button>
            </div>
          </div>
          
          <div className="member-card">
            <div className="member-avatar">ОС</div>
            <div className="member-name">Ольга Смирнова</div>
            <div className="member-email">olga@example.com</div>
            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
              <button className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '14px', backgroundColor: '#390668' }}>Принять</button>
              <button className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '14px', backgroundColor: '#390668', color: 'white' }}>Отклонить</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SharedAccess;