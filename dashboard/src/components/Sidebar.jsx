import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useMediaQuery } from 'react-responsive';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="sidebar" style={{
      width: isMobile ? '100%' : '250px',
      height: isMobile ? 'auto' : '100vh',
      position: isMobile ? 'relative' : 'fixed',
      backgroundColor: '#390668',
      padding: '1rem',
      color: 'white'
    }}>
      <h1 className="text-center mb-4">
        <a href="/" style={{ textDecoration: 'none', color: 'white' }}>Waves</a>
      </h1>

      <div className="user-info mb-4 text-center">
        <div className="avatar mb-2">
          <img
            src="https://i.pinimg.com/474x/d5/82/9d/d5829d01f4425addd09920f1b02bd1e4.jpg"
            alt="User avatar"
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              objectFit: 'cover'
            }}
          />
        </div>
        <h5>{user?.name} {user?.surname}</h5>
        <p className="text-muted mb-0">{user?.email}</p>
      </div>

      <ul className="nav flex-column">
        <li className="nav-item">
          <button
            className={`btn btn-link nav-link ${isActive('/dashboard') ? 'active' : ''}`}
            onClick={() => navigate('/dashboard')}
            style={{
              color: 'white',
              textDecoration: 'none',
              width: '100%',
              textAlign: 'left',
              backgroundColor: isActive('/dashboard') ? 'rgba(255, 255, 255, 0.1)' : 'transparent'
            }}
          >
            <i className="bi bi-speedometer2 me-2"></i> Дашборд
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`btn btn-link nav-link ${isActive('/history') ? 'active' : ''}`}
            onClick={() => navigate('/history')}
            style={{
              color: 'white',
              textDecoration: 'none',
              width: '100%',
              textAlign: 'left',
              backgroundColor: isActive('/history') ? 'rgba(255, 255, 255, 0.1)' : 'transparent'
            }}
          >
            <i className="bi bi-clock-history me-2"></i> История
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`btn btn-link nav-link ${isActive('/categories') ? 'active' : ''}`}
            onClick={() => navigate('/categories')}
            style={{
              color: 'white',
              textDecoration: 'none',
              width: '100%',
              textAlign: 'left',
              backgroundColor: isActive('/categories') ? 'rgba(255, 255, 255, 0.1)' : 'transparent'
            }}
          >
            <i className="bi bi-tags me-2"></i> Категории
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`btn btn-link nav-link ${isActive('/sharedaccess') ? 'active' : ''}`}
            onClick={() => navigate('/sharedaccess')}
            style={{
              color: 'white',
              textDecoration: 'none',
              width: '100%',
              textAlign: 'left',
              backgroundColor: isActive('/sharedaccess') ? 'rgba(255, 255, 255, 0.1)' : 'transparent'
            }}
          >
            <i className="bi bi-people me-2"></i> Семейный бюджет
          </button>
        </li>
      </ul>

      <div className="mt-auto" style={{ marginTop: '2rem' }}>
        <button
          className="btn btn-link nav-link"
          onClick={handleLogout}
          style={{
            color: 'white',
            textDecoration: 'none',
            width: '100%',
            textAlign: 'left'
          }}
        >
          <i className="bi bi-box-arrow-right me-2"></i> Выйти
        </button>
      </div>
    </div>
  );
};

export default Sidebar;