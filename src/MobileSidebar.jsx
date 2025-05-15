import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // <-- для навигации внутри приложения
import { FiHome, FiClock, FiTag, FiPieChart, FiUsers, FiMenu, FiX } from 'react-icons/fi';
import styles from './MobileSidebar.module.css';

const MobileSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Кнопка бургер-меню */}
      <button 
        className={styles.burgerButton} 
        onClick={() => setIsOpen(true)}
        aria-label="Открыть меню"
      >
        <FiMenu size={24} />
      </button>

      {/* Боковое меню */}
      <div className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        <button className={styles.closeButton} onClick={() => setIsOpen(false)}>
          <FiX size={24} />
        </button>

        <div className={styles.logoContainer}>
          <h4 className={styles.logo}>Waves</h4>
          <h4 className={styles.subtitle}>Финансовый менеджер</h4>
        </div>
        
        <nav className={styles.nav}>
          <Link to="/dashboard" className={styles.navButton}>
            <FiHome className={styles.icon} /> Дашборд
          </Link>
          <Link to="/history" className={styles.navButton}>
            <FiClock className={styles.icon} /> История
          </Link>
          <Link to="/categories" className={styles.navButton}>
            <FiTag className={styles.icon} /> Категории
          </Link>
          <Link to="/financial" className={styles.navButton}>
            <FiPieChart className={styles.icon} /> Финансовый обзор
          </Link>
          <Link to="/shared" className={styles.navButton}>
            <FiUsers className={styles.icon} /> Совместный доступ
          </Link>
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

      {/* Overlay для закрытия по клику вне меню */}
      {isOpen && <div className={styles.overlay} onClick={() => setIsOpen(false)} />}
    </>
  );
};

export default MobileSidebar;