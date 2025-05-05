import { useState } from 'react';

const FinancialOverview = () => {
  const [budgets, setBudgets] = useState([
    { name: 'Продукты', budget: 10000, spent: 8500 },
    { name: 'Транспорт', budget: 5000, spent: 6200 },
    { name: 'Развлечения', budget: 4000, spent: 3000 },
    { name: 'Жилье', budget: 20000, spent: 15000 },
    { name: 'Одежда', budget: 5000, spent: 7500 },
    { name: 'Здоровье', budget: 3000, spent: 1200 }
  ]);

  const handleBudgetUpdate = (index, newBudget) => {
    const updatedBudgets = [...budgets];
    updatedBudgets[index].budget = newBudget;
    setBudgets(updatedBudgets);
  };

  return (
    <div className="col-md-9 col-lg-10 main-content">
      <div id="dashboard-content">
        <h1 style={{ color: 'white', fontSize: '275%' }}>Мой бюджет</h1>
        
        <div style={{ backgroundColor: '#390668', width: '95%' }} className="notification alert" id="overbudgetNotification">
          <span className="notification-icon">⚠️</span>
          <div style={{ color: 'white', fontSize: 'large' }}>Вы превысили бюджет в 2 категориях!</div>
        </div>
        
        <div className="budget-summary" style={{ backgroundColor: '#390668', display: 'flex', gap: '16px', padding: '16px' }}>
          <div className="summary-item" style={{ backgroundColor: '#5b248f', color: 'white', padding: '12px', borderRadius: '8px', textAlign: 'center', flex: 1 }}>
            <div style={{ fontSize: '150%' }}>Общий бюджет</div>
            <div className="summary-value" style={{ fontSize: '1.5rem', margin: '8px 0' }}>45,000 ₽</div>
            <div style={{ fontSize: '115%' }}>на апрель</div>
          </div>
          <div className="summary-item" style={{ backgroundColor: '#5b248f', color: 'white', padding: '12px', borderRadius: '8px', textAlign: 'center', flex: 1 }}>
            <div style={{ fontSize: '150%' }}>Потрачено</div>
            <div className="summary-value" style={{ fontSize: '1.5rem', margin: '8px 0' }}>38,200 ₽</div>
            <div style={{ fontSize: '115%' }}>85% от бюджета</div>
          </div>
          <div className="summary-item" style={{ backgroundColor: '#5b248f', color: 'white', padding: '12px', borderRadius: '8px', textAlign: 'center', flex: 1 }}>
            <div style={{ fontSize: '150%' }}>Остаток</div>
            <div className="summary-value" style={{ fontSize: '1.5rem', margin: '8px 0' }}>6,800 ₽</div>
            <div style={{ fontSize: '115%' }}>15% от бюджета</div>
          </div>
        </div>
      </div>
      
      <div style={{ backgroundColor: '#390668' }} className="card">
        <h2 style={{ color: 'white', paddingLeft: '2rem' }}>Категории расходов</h2>
      
        <div style={{ backgroundColor: '#390668', color: 'white' }} className="budget-categories">
          {budgets.map((category, index) => {
            const percentage = Math.min(100, (category.spent / category.budget) * 100);
            const isOverbudget = category.spent > category.budget;
            const remaining = category.budget - category.spent;
            
            return (
              <div 
                key={index}
                style={{ 
                  backgroundColor: '#5b248f', 
                  width: '28.5rem', 
                  marginLeft: index % 3 === 1 ? '200px' : index % 3 === 2 ? '400px' : '0',
                  marginBottom: '20px'
                }} 
                className={`category-card ${isOverbudget ? 'overbudget' : ''}`}
              >
                <div className="category-header">
                  <span className="category-name">{category.name}</span>
                  <span className="category-budget">
                    {new Intl.NumberFormat('ru-RU').format(category.budget)} ₽
                  </span>
                </div>
                <div style={{ backgroundColor: '#390668' }} className="progress-container">
                  <div 
                    className="progress-bar" 
                    style={{ 
                      width: `${isOverbudget ? 100 + (percentage - 100) : percentage}%`, 
                      backgroundColor: isOverbudget ? 'red' : 'blueviolet'
                    }}
                  ></div>
                </div>
                <div className="category-details">
                  <span className="category-spent">
                    {new Intl.NumberFormat('ru-RU').format(category.spent)} ₽
                  </span>
                  {isOverbudget ? (
                    <span className="category-over">
                      +{new Intl.NumberFormat('ru-RU').format(category.spent - category.budget)} ₽
                    </span>
                  ) : (
                    <span className="category-remaining">
                      {new Intl.NumberFormat('ru-RU').format(remaining)} ₽ осталось
                    </span>
                  )}
                </div>
                <div className="budget-form">
                  <input 
                    type="number" 
                    className="budget-input" 
                    placeholder="Новый бюджет" 
                    value={category.budget}
                    onChange={(e) => {
                      const newBudget = parseInt(e.target.value) || 0;
                      const updatedBudgets = [...budgets];
                      updatedBudgets[index].budget = newBudget;
                      setBudgets(updatedBudgets);
                    }}
                  />
                  <button 
                    className="save-btn"
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