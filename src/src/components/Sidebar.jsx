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
      <div className={styles.logoContainer}>
        <h1 className={styles.logo}>Waves</h1>
        <h4 className={styles.subtitle}><b>Финансовый <br /> менеджер </b></h4>
      </div>
      
      <div className={styles.nav}>
        <button 
          className={`${styles.navButton} ${activeTab === 'dashboard' ? styles.active : ''}`}
          onClick={() => handleTabChange('dashboard')}
        >
          <i className={`bi bi-speedometer2 ${styles.icon}`}></i>
          <span className={styles.navText}>Дашборд</span>
        </button>
        
        <button 
          className={`${styles.navButton} ${activeTab === 'history' ? styles.active : ''}`}
          onClick={() => handleTabChange('history')}
        >
          <i className={`bi bi-clock-history ${styles.icon}`}></i>
          <span className={styles.navText}>История</span>
        </button>
        
        <button 
          className={`${styles.navButton} ${activeTab === 'categories' ? styles.active : ''}`}
          onClick={() => handleTabChange('categories')}
        >
          <i className={`bi bi-tags ${styles.icon}`}></i>
          <span className={styles.navText}>Категории</span>
        </button>
        
        <button 
          className={`${styles.navButton} ${activeTab === 'financial' ? styles.active : ''}`}
          onClick={() => handleTabChange('financial')}
        >
          <i className={`bi bi-graph-up ${styles.icon}`}></i>
          <span className={styles.navText}>Финансовый обзор</span>
        </button>
        
        <button 
          className={`${styles.navButton} ${activeTab === 'shared' ? styles.active : ''}`}
          onClick={() => handleTabChange('shared')}
        >
          <i className={`bi bi-people ${styles.icon}`}></i>
          <span className={styles.navText}>Совместный доступ</span>
        </button>
      </div>
      
      <div className={styles.balanceCard}>
        <h6 className={styles.balanceTitle}>Общий баланс</h6>
        <h3 className={styles.balanceAmount}>25,430.50 ₽</h3>
        <div className={styles.stats}>
          <div className={styles.statItem}>
            <span className={styles.incomeLabel}>Доход:</span>
            <span className={styles.income}>32,500.00 ₽</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.expenseLabel}>Расход:</span>
            <span className={styles.expense}>7,069.50 ₽</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;