import { useState } from 'react';
import { useMediaQuery } from 'react-responsive';

const FinancialOverview = () => {
  const [budgets, setBudgets] = useState([
    { name: 'Продукты', budget: 10000, spent: 8500 },
    { name: 'Транспорт', budget: 5000, spent: 6200 },
    { name: 'Развлечения', budget: 4000, spent: 3000 },
    { name: 'Жилье', budget: 20000, spent: 15000 },
    { name: 'Одежда', budget: 5000, spent: 7500 },
    { name: 'Здоровье', budget: 3000, spent: 1200 }
  ]);

  const isMobile = useMediaQuery({ maxWidth: 768 });

  const handleBudgetUpdate = (index, newBudget) => {
    const updatedBudgets = [...budgets];
    updatedBudgets[index].budget = newBudget;
    setBudgets(updatedBudgets);
  };

  // Форматирование чисел с разделителями
  const formatNumber = (num) => new Intl.NumberFormat('ru-RU').format(num);

  return (
    <div className={`${isMobile ? 'col-12' : 'col-md-9 col-lg-10'} main-content`}>
      <div id="dashboard-content">
        <h1 style={{ color: 'white', fontSize: isMobile ? '24px' : '32px' }}>Мой бюджет</h1>
        
        {/* Уведомление о превышении бюджета */}
        <div 
          style={{ 
            backgroundColor: '#390668', 
            width: isMobile ? '100%' : '95%',
            padding: '12px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '20px'
          }} 
          className="alert"
        >
          <span style={{ fontSize: '20px' }}>⚠️</span>
          <div style={{ color: 'white', fontSize: isMobile ? '14px' : '16px' }}>
            Вы превысили бюджет в 2 категориях!
          </div>
        </div>
        
        {/* Краткая сводка */}
        <div 
          style={{ 
            backgroundColor: '#390668', 
            display: 'flex', 
            flexDirection: isMobile ? 'column' : 'row',
            gap: '16px', 
            padding: '16px',
            borderRadius: '8px',
            marginBottom: '20px'
          }}
        >
          {[
            { title: 'Общий бюджет', value: 45000, desc: 'на апрель' },
            { title: 'Потрачено', value: 38200, desc: '85% от бюджета' },
            { title: 'Остаток', value: 6800, desc: '15% от бюджета' }
          ].map((item, i) => (
            <div 
              key={i}
              style={{ 
                backgroundColor: '#5b248f', 
                color: 'white', 
                padding: '12px', 
                borderRadius: '8px', 
                textAlign: 'center', 
                flex: 1 
              }}
            >
              <div style={{ fontSize: isMobile ? '16px' : '20px' }}>{item.title}</div>
              <div style={{ fontSize: isMobile ? '20px' : '24px', margin: '8px 0' }}>
                {formatNumber(item.value)} ₽
              </div>
              <div style={{ fontSize: isMobile ? '14px' : '16px' }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Категории расходов */}
      <div 
        style={{ 
          backgroundColor: '#390668', 
          padding: isMobile ? '16px' : '24px',
          borderRadius: '8px'
        }}
      >
        <h2 style={{ color: 'white', marginBottom: '20px' }}>Категории расходов</h2>
      
        <div 
          style={{ 
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '16px'
          }}
        >
          {budgets.map((category, index) => {
            const percentage = Math.min(100, (category.spent / category.budget) * 100);
            const isOverbudget = category.spent > category.budget;
            const remaining = category.budget - category.spent;
            
            return (
              <div 
                key={index}
                style={{ 
                  backgroundColor: '#5b248f',
                  padding: '16px',
                  borderRadius: '8px'
                }} 
              >
                <div 
                  style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    marginBottom: '10px'
                  }}
                >
                  <span style={{ color: 'white', fontWeight: '500' }}>{category.name}</span>
                  <span style={{ color: 'white' }}>
                    {formatNumber(category.budget)} ₽
                  </span>
                </div>
                
                {/* Прогресс-бар */}
                <div 
                  style={{ 
                    height: '8px',
                    backgroundColor: '#390668',
                    borderRadius: '4px',
                    marginBottom: '8px',
                    overflow: 'hidden'
                  }}
                >
                  <div 
                    style={{ 
                      width: `${isOverbudget ? 100 + (percentage - 100) : percentage}%`, 
                      height: '100%',
                      backgroundColor: isOverbudget ? '#e74c3c' : '#9b59b6'
                    }}
                  ></div>
                </div>
                
                <div 
                  style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    fontSize: '14px',
                    marginBottom: '12px'
                  }}
                >
                  <span style={{ color: 'white' }}>
                    {formatNumber(category.spent)} ₽
                  </span>
                  {isOverbudget ? (
                    <span style={{ color: '#e74c3c' }}>
                      +{formatNumber(category.spent - category.budget)} ₽
                    </span>
                  ) : (
                    <span style={{ color: '#2ecc71' }}>
                      {formatNumber(remaining)} ₽ осталось
                    </span>
                  )}
                </div>
                
                {/* Форма изменения бюджета */}
                <div 
                  style={{ 
                    display: 'flex',
                    gap: '8px'
                  }}
                >
                  <input 
                    type="number" 
                    style={{ 
                      flex: 1,
                      backgroundColor: '#390668',
                      color: 'white',
                      border: '1px solid #615e68',
                      borderRadius: '4px',
                      padding: '8px',
                      fontSize: '14px'
                    }}
                    placeholder="Новый бюджет" 
                    value={category.budget}
                    onChange={(e) => {
                      const newBudget = parseInt(e.target.value) || 0;
                      handleBudgetUpdate(index, newBudget);
                    }}
                  />
                  <button 
                    style={{ 
                      backgroundColor: '#2ecc71',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '0 12px',
                      cursor: 'pointer'
                    }}
                    onClick={() => handleBudgetUpdate(index, category.budget)}
                  >
                    ✓
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FinancialOverview;