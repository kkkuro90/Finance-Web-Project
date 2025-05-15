const EmailInviteModal = ({ onClose }) => {
    return (
      <div className="modal" style={{ display: 'flex' }} onClick={(e) => e.target === e.currentTarget && onClose()}>
        <div className="modal-content">
          <div className="modal-header">
            <h3>Пригласить по email</h3>
            <span className="modal-close" onClick={onClose}>×</span>
          </div>
          
          <div className="form-group">
            <label className="form-label">Email участника</label>
            <input type="email" className="form-input" placeholder="example@mail.com" />
          </div>
          
          <div className="form-group">
            <label className="form-label">Сообщение (необязательно)</label>
            <textarea 
              className="form-input" 
              rows="3" 
              placeholder="Привет! Присоединяйся к нашей семейной группе в приложении Финансы вместе..."
            ></textarea>
          </div>
          
          <button className="btn btn-primary" style={{ width: '100%' }}>Отправить приглашение</button>
        </div>
      </div>
    );
  };
  
  export default EmailInviteModal;