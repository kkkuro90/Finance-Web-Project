import { useEffect, useRef, useState } from 'react';
import { Chart, registerables } from 'chart.js';

const Dashboard = () => {
  const categoriesChartRef = useRef(null);
  const expensesChartRef = useRef(null);
  const [activeChart, setActiveChart] = useState('categories'); // 'categories' или 'expenses'
  
  // Регистрируем необходимые компоненты Chart.js
  Chart.register(...registerables);

  useEffect(() => {
    let categoriesChart, expensesChart;

    if (categoriesChartRef.current && activeChart === 'categories') {
      // Уничтожаем предыдущий график, если он существует
      if (categoriesChartRef.current.chart) {
        categoriesChartRef.current.chart.destroy();
      }

      const ctx = categoriesChartRef.current.getContext('2d');
      categoriesChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Продукты', 'Транспорт', 'Кафе', 'ЖКХ', 'Развлечения'],
          datasets: [{
            data: [1250, 450, 850, 12000, 1500],
            backgroundColor: [
              '#21013f',
              'blueviolet',
              '#390668',
              '#9e56bf',
              '#9966ff'
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                color: '#ffffff',
                font: {
                  size: 14
                }
              }
            }
          }
        }
      });
      categoriesChartRef.current.chart = categoriesChart;
    }

    if (expensesChartRef.current && activeChart === 'expenses') {
      // Уничтожаем предыдущий график, если он существует
      if (expensesChartRef.current.chart) {
        expensesChartRef.current.chart.destroy();
      }

      const ctx = expensesChartRef.current.getContext('2d');
      expensesChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Янв', 'Фев', 'Мар', 'Апр', 'Май'],
          datasets: [{
            label: 'Расходы',
            data: [15000, 14000, 16000, 15500, 17000],
            borderColor: '#dc3545',
            backgroundColor: 'rgba(220, 53, 69, 0.1)',
            fill: true,
            tension: 0.3
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              beginAtZero: false,
              ticks: {
                color: '#ffffff'
              },
              grid: {
                color: 'rgba(255, 255, 255, 0.1)'
              }
            },
            x: {
              ticks: {
                color: '#ffffff'
              },
              grid: {
                color: 'rgba(255, 255, 255, 0.1)'
              }
            }
          }
        }
      });
      expensesChartRef.current.chart = expensesChart;
    }

    return () => {
      // Очистка при размонтировании компонента
      if (categoriesChart) categoriesChart.destroy();
      if (expensesChart) expensesChart.destroy();
    };
  }, [activeChart]); // Зависимость от activeChart
  
  return (
    <div className="col-md-9 col-lg-10 main-content">
      <div id="dashboard-content">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 style={{ color: 'white', fontSize: '275%' }}>Дашборд</h2>
          <div>
            <button 
              style={{ 
                position: 'absolute', 
                right: '30rem', 
                backgroundColor: activeChart === 'categories' ? '#7b2cbf' : '#5b248f' 
              }} 
              className="btn btn-primary"
              onClick={() => setActiveChart('categories')}
            >
              Статистика по категориям
            </button>
          </div>
          <div>
            <button 
              style={{ 
                position: 'absolute', 
                right: '6rem', 
                width: '14rem', 
                backgroundColor: activeChart === 'expenses' ? '#7b2cbf' : '#5b248f' 
              }} 
              className="btn btn-primary"
              onClick={() => setActiveChart('expenses')}
            >
              Динамика расходов
            </button>
          </div>
        </div>

        <div className="row">
          <div className="col-md-6">
            <div style={{ width: '100%' }} className="card">
              <div className="card-header">
                <h5 className="card-title">Быстрые действия</h5>
              </div>
              <div style={{ backgroundColor: '#390668' }} className="card-body">
                <button style={{ width: '48.5%', color: 'white', backgroundColor: 'rgba(139, 71, 184, 0.575)' }} className="btn btn-outline-primary me-2 mb-2">Повторить платеж</button>
                <button style={{ width: '48.5%', color: 'white', backgroundColor: 'rgba(139, 71, 184, 0.575)' }} className="btn btn-outline-success me-2 mb-2">Добавить доход</button>
                <button style={{ width: '48.5%', color: 'white', backgroundColor: 'rgba(139, 71, 184, 0.575)' }} className="btn btn-outline-danger me-2 mb-2">Добавить расход</button>
                <button style={{ width: '48.5%', color: 'white', backgroundColor: 'rgba(139, 71, 184, 0.575)' }} className="btn btn-outline-secondary mb-2">Экспорт данных</button>
              </div>
            </div>

            <div style={{ width: '100%' }} className="card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="card-title">Последние операции</h5>
                <a style={{ textDecoration: 'none', color: 'white' }} href="#" className="small">Все операции</a>
              </div>
              <div style={{ backgroundColor: '#390668' }} className="card-body">
                <div style={{ backgroundColor: 'rgba(139, 71, 184, 0.575)' }} className="transaction-item expense">
                  <div style={{ color: 'white' }} className="d-flex justify-content-between">
                    <p>Продукты</p>
                    <span className="text-danger">-1,250.00 ₽</span>
                  </div>
                  <small className="text-muted">Магнит, 15 апр 2023</small>
                </div>
                <div style={{ backgroundColor: 'rgba(139, 71, 184, 0.575)' }} className="transaction-item income">
                  <div style={{ color: 'white' }} className="d-flex justify-content-between">
                    <p>Зарплата</p>
                    <span className="text-success">+30,000.00 ₽</span>
                  </div>
                  <small className="text-muted">ООО "Компания", 10 апр 2023</small>
                </div>
                <div style={{ backgroundColor: 'rgba(139, 71, 184, 0.575)' }} className="transaction-item expense">
                  <div style={{ color: 'white' }} className="d-flex justify-content-between">
                    <p>Кафе</p>
                    <span className="text-danger">-850.00 ₽</span>
                  </div>
                  <small className="text-muted">Starbucks, 8 апр 2023</small>
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-md-6">
            {/* Контейнер для графиков */}
            <div className="card">
              <div className="card-header">
                <h5 className="card-title">
                  {activeChart === 'categories' ? 'Статистика по категориям' : 'Динамика расходов'}
                </h5>
              </div>
              <div style={{ backgroundColor: '#390668', minHeight: '400px' }} className="card-body">
                {/* Круговой график (отображается при activeChart === 'categories') */}
                <div 
                  style={{ 
                    position: 'relative', 
                    height: '650px', 
                    display: activeChart === 'categories' ? 'block' : 'none' 
                  }}
                >
                  <canvas ref={categoriesChartRef} />
                </div>
                
                {/* Линейный график (отображается при activeChart === 'expenses') */}
                <div 
                  style={{ 
                    position: 'relative', 
                    height: '650px', 
                    display: activeChart === 'expenses' ? 'block' : 'none' 
                  }}
                >
                  <canvas ref={expensesChartRef} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;