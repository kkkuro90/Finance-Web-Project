import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EmailInviteModal from './EmailInviteModal';
import LinkInviteModal from './LinkInviteModal';

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
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();

  const handleCreateGroup = () => {
    setShowConfirmModal(true);
  };

  const confirmCreateGroup = () => {
    setShowConfirmModal(false);
    setNotification({
      message: "Новая группа успешно создана!",
      type: 'success'
    });
  };

  return (
    <div className="col-md-9 col-lg-10 main-content">
      {/* Уведомление */}
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

      {/* Модальное окно подтверждения */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={confirmCreateGroup}
        message="Вы уверены, что хотите создать новую группу? Текущая группа будет удалена."
      />

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 style={{ color: 'white', fontSize: '260%' }}>Совместный доступ</h2>
        <button 
          style={{ backgroundColor: '#5b248f' }} 
          className="btn btn-primary"
          onClick={() => navigate('/family-budget')}
        >
          Семейный бюджет
        </button>
      </div>
      
      <div className="panel">
        <div className="family-header">
          <div style={{ color: 'white' }} className="family-title">Участники семьи</div>
          <button 
            style={{ backgroundColor: '#5b248f' }} 
            className="btn btn-primary" 
            id="createGroupBtn"
            onClick={handleCreateGroup}
          >
            Создать новую группу
          </button>
        </div>
        
        <div className="member-grid">
          <div className="member-card">
            <div className="member-avatar">ИП</div>
            <div className="member-name">Иван Петров</div>
            <div className="member-email">ivan@example.com</div>
            <div className="pill owner">Владелец</div>
          </div>
          
          <div className="member-card">
            <div className="member-avatar">МП</div>
            <div className="member-name">Мария Петрова</div>
            <div className="member-email">maria@example.com</div>
            <div className="pill">Участник</div>
          </div>
          
          <div className="member-card">
            <div className="member-avatar">АП</div>
            <div className="member-name">Алексей Петров</div>
            <div className="member-email">alex@example.com</div>
            <div className="pill">Участник</div>
          </div>
          
          <div className="member-card">
            <div className="member-avatar">ЕП</div>
            <div className="member-name">Елена Петрова</div>
            <div className="member-email">elena@example.com</div>
            <div className="pill">Участник</div>
          </div>
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
          <div className="invite-method" onClick={() => setShowEmailModal(true)}>
            <div className="method-icon">✉️</div>
            <div className="method-title">По электронной почте</div>
            <div className="method-desc">Отправить персональное приглашение на email</div>
          </div>
          
          <div className="invite-method" onClick={() => setShowLinkModal(true)}>
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
      
      {showEmailModal && <EmailInviteModal onClose={() => setShowEmailModal(false)} />}
      {showLinkModal && <LinkInviteModal onClose={() => setShowLinkModal(false)} />}
    </div>
  );
};

export default SharedAccess;