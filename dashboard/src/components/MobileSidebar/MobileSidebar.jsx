import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiHome, FiClock, FiTag, FiPieChart, FiUsers, FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import styles from './MobileSidebar.module.css';

const MobileSidebar = ({ activeTab, setActiveTab }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    navigate(`/${tab}`);
    setIsOpen(false);
  };

  return (
    <>
      {/* Кнопка бургер-меню - теперь справа и fixed */}
      <button className={styles.burgerButton} onClick={() => setIsOpen(true)}>
        <FiMenu size={24} color="white" />
      </button>

      {/* Сам сайдбар */}
      <div className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        <button className={styles.closeButton} onClick={() => setIsOpen(false)}>
          <FiX size={24} />
        </button>

        <div className={styles.logoContainer}>
          <h4 className={styles.logo}>Waves</h4>
          <h4 className={styles.subtitle}>Финансовый менеджер</h4>
        </div>
        
        <nav className={styles.nav}>
          <button 
            className={`${styles.navButton} ${activeTab === 'dashboard' ? styles.active : ''}`}
            onClick={() => handleTabChange('dashboard')}
          >
            <FiHome className={styles.icon} /> Дашборд
          </button>
          <button 
            className={`${styles.navButton} ${activeTab === 'history' ? styles.active : ''}`}
            onClick={() => handleTabChange('history')}
          >
            <FiClock className={styles.icon} /> История
          </button>
          <button 
            className={`${styles.navButton} ${activeTab === 'categories' ? styles.active : ''}`}
            onClick={() => handleTabChange('categories')}
          >
            <FiTag className={styles.icon} /> Категории
          </button>
          <button 
            className={`${styles.navButton} ${activeTab === 'financial' ? styles.active : ''}`}
            onClick={() => handleTabChange('financial')}
          >
            <FiPieChart className={styles.icon} /> Финансовый обзор
          </button>
          <button 
            className={`${styles.navButton} ${activeTab === 'sharedaccess' ? styles.active : ''}`}
            onClick={() => handleTabChange('sharedaccess')}
          >
            <FiUsers className={styles.icon} /> Совместный доступ
          </button>
        </nav>
        
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

      {/* Затемнение фона */}
      {isOpen && <div className={styles.overlay} onClick={() => setIsOpen(false)} />}
    </>
  );
};

export default MobileSidebar;