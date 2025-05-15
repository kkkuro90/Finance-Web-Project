import { useNavigate } from 'react-router-dom';
import styles from './Sidebar.module.css'; 

const Sidebar = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    navigate(`/${tab}`);
  };

  return (
    <div className={styles.sidebar}>
      <h4 className="text-center mb-4" style={{ color: 'white', fontSize: '210%' }}>Waves</h4>
      <h4 className="text-center mb-4" style={{ color: 'white' }}>Финансовый <br />менеджер</h4>
      
      <ul className="nav flex-column">
        <li className="nav-item">
          <a 
            style={{ fontSize: '130%' }} 
            className={`nav-link ${activeTab === 'dashboard' ? styles['active'] : ''} ${styles['navLink']}`} 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              handleTabChange('dashboard');
            }}
          >
            <i className="bi bi-speedometer2 me-2"></i> Дашборд
          </a>
        </li>
        <li className="nav-item">
          <a 
            style={{ fontSize: '130%' }} 
            className={`nav-link ${activeTab === 'history' ? styles['active'] : ''} ${styles['navLink']}`} 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              handleTabChange('history');
            }}
          >
            <i className="bi bi-clock-history me-2"></i> История
          </a>
        </li>
        <li className="nav-item">
          <a 
            style={{ fontSize: '130%' }} 
            className={`nav-link ${activeTab === 'categories' ? styles['active'] : ''} ${styles['navLink']}`} 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              handleTabChange('categories');
            }}
          >
            <i className="bi bi-tags me-2"></i> Категории
          </a>
        </li>
        <li className="nav-item">
          <a 
            style={{ fontSize: '130%' }} 
            className={`nav-link ${activeTab === 'financial' ? styles['active'] : ''} ${styles['navLink']}`} 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              handleTabChange('financial');
            }}
          >
            <i className="bi bi-graph-up me-2"></i> Финансовый обзор
          </a>
        </li>
        <li className="nav-item">
          <a 
            style={{ fontSize: '130%' }} 
            className={`nav-link ${activeTab === 'shared' ? styles['active'] : ''} ${styles['navLink']}`} 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              handleTabChange('shared');
            }}
          >
            <i className="bi bi-people me-2"></i> Совместный доступ
          </a>
        </li>   
      </ul>
      
      <div className={styles.balanceCard}>
        <h6 className={styles.balanceTitle}>Общий баланс</h6>
        <h3 className={styles.balanceAmount}>25,430.50 ₽</h3>
        <div className="d-flex justify-content-between">
          <p className={styles.statItem}>
            Доход: <span className={styles.income}>32,500.00 ₽</span>
          </p>
          <p className={styles.statItem}>
            Расход: <span className={styles.expense}>7,069.50 ₽</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;