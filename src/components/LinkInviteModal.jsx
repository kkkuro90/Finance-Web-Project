const LinkInviteModal = ({ onClose }) => {
    const inviteLink = "https://example.com/invite/12345";
    return (
      <div className="modal" style={{ display: 'flex' }} onClick={(e) => e.target === e.currentTarget && onClose()}>
        <div className="modal-content">
          <div className="modal-header">
            <h3>Ссылка для приглашения</h3>
            <span className="modal-close" onClick={onClose}>×</span>
          </div>
          <div className="form-group">
            <label className="form-label">Скопируйте и отправьте ссылку:</label>
            <input type="text" className="form-input" value={inviteLink} readOnly />
          </div>
          <button className="btn btn-primary" style={{ width: '100%' }}>Скопировать ссылку</button>
        </div>
      </div>
    );
  };
  export default LinkInviteModal;