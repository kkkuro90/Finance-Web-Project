import { useEffect, useRef, useState } from 'react';
import { Chart, registerables } from 'chart.js';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';

const Dashboard = () => {
  const categoriesChartRef = useRef(null);
  const expensesChartRef = useRef(null);
  const [activeChart, setActiveChart] = useState('categories');
  const navigate = useNavigate();
  const isMobile = useMediaQuery({ maxWidth: 768 });

  Chart.register(...registerables);

  useEffect(() => {
    let categoriesChart, expensesChart;

    if (categoriesChartRef.current && activeChart === 'categories') {
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
              position: isMobile ? 'bottom' : 'right',
              labels: {
                color: '#ffffff',
                font: {
                  size: isMobile ? 12 : 14
                }
              }
            }
          }
        }
      });
      categoriesChartRef.current.chart = categoriesChart;
    }

    if (expensesChartRef.current && activeChart === 'expenses') {
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
      if (categoriesChart) categoriesChart.destroy();
      if (expensesChart) expensesChart.destroy();
    };
  }, [activeChart, isMobile]);
  
  return (
    <div className={`${isMobile ? 'col-12' : 'col-md-9 col-lg-10'} main-content`}>
      <div id="dashboard-content" style={isMobile ? { paddingTop: '60px' } : {}}>
        {/* Заголовок и кнопки переключения */}
        <div className={isMobile ? "mb-3" : "d-flex justify-content-between align-items-center mb-4"}>
          <h2 style={{ color: 'white', fontSize: isMobile ? '200%' : '275%' }}>Дашборд</h2>
          
          {isMobile ? (
            <div className="d-flex flex-wrap gap-2 my-3">
              <button 
                className="btn btn-primary flex-grow-1"
                style={{ 
                  backgroundColor: activeChart === 'categories' ? '#7b2cbf' : '#5b248f',
                  fontSize: '14px'
                }}
                onClick={() => setActiveChart('categories')}
              >
                Категории
              </button>
              <button 
                className="btn btn-primary flex-grow-1"
                style={{ 
                  backgroundColor: activeChart === 'expenses' ? '#7b2cbf' : '#5b248f',
                  fontSize: '14px'
                }}
                onClick={() => setActiveChart('expenses')}
              >
                Динамика
              </button>
            </div>
          ) : (
            <>
              <button 
                className="btn btn-primary"
                style={{ 
                  backgroundColor: activeChart === 'categories' ? '#7b2cbf' : '#5b248f',

                }}
                onClick={() => setActiveChart('categories')}
              >
                Статистика по категориям
              </button>
              <button 
                className="btn btn-primary"
                style={{ 
                  backgroundColor: activeChart === 'expenses' ? '#7b2cbf' : '#5b248f',

                }}
                onClick={() => setActiveChart('expenses')}
              >
                Динамика расходов
              </button>
            </>
          )}
        </div>

        {/* Основной контент в две колонки на ПК */}
        <div className="row">
          {/* Колонка с быстрыми действиями и операциями */}
          <div className="col-md-6">
            {/* Быстрые действия - теперь всегда 2x2 */}
            <div className="card mb-4">
              <div className="card-header">
                <h5 className="card-title">Быстрые действия</h5>
              </div>
              <div style={{ backgroundColor: '#390668' }} className="card-body">
                <div className="row g-2">
                  <div className="col-6">
                    <button 
                      style={{ 
                        width: '100%', 
                        color: 'white', 
                        backgroundColor: 'rgba(139, 71, 184, 0.575)',
                        marginBottom: '10px'
                      }} 
                      className="btn"
                      onClick={() => navigate('/history')}
                    >
                      {isMobile ? 'Повторить' : 'Повторить платеж'}
                    </button>
                  </div>
                  <div className="col-6">
                    <button 
                      style={{ 
                        width: '100%', 
                        color: 'white', 
                        backgroundColor: 'rgba(139, 71, 184, 0.575)',
                        marginBottom: '10px'
                      }} 
                      className="btn"
                      onClick={() => navigate('/history')}
                    >
                      {isMobile ? 'Доход' : 'Добавить доход'}
                    </button>
                  </div>
                  <div className="col-6">
                    <button 
                      style={{ 
                        width: '100%', 
                        color: 'white', 
                        backgroundColor: 'rgba(139, 71, 184, 0.575)',
                        marginBottom: '10px'
                      }} 
                      className="btn"
                      onClick={() => navigate('/history')}
                    >
                      {isMobile ? 'Расход' : 'Добавить расход'}
                    </button>
                  </div>
                  <div className="col-6">
                    <button 
                      style={{ 
                        width: '100%', 
                        color: 'white', 
                        backgroundColor: 'rgba(139, 71, 184, 0.575)',
                        marginBottom: '10px'
                      }} 
                      className="btn"
                    >
                      {isMobile ? 'Экспорт' : 'Экспорт данных'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Последние операции */}
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="card-title">Последние операции</h5>
                <a 
                  style={{ textDecoration: 'none', color: 'white' }} 
                  href="#" 
                  className="small"
                  onClick={(e) => e.preventDefault()}
                >
                  Все операции
                </a>
              </div>
              <div style={{ backgroundColor: '#390668' }} className="card-body">
                <div style={{ backgroundColor: 'rgba(139, 71, 184, 0.575)' }} className="transaction-item expense mb-2">
                  <div style={{ color: 'white' }} className="d-flex justify-content-between">
                    <p>Продукты</p>
                    <span className="text-danger">-1,250.00 ₽</span>
                  </div>
                  <small className="text-muted">Магнит, 15 апр 2023</small>
                </div>
                <div style={{ backgroundColor: 'rgba(139, 71, 184, 0.575)' }} className="transaction-item income mb-2">
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
          
          {/* График */}
          <div className={isMobile ? "mt-3" : "col-md-6"}>
            <div className="card">
              <div className="card-header">
                <h5 className="card-title">
                  {activeChart === 'categories' ? 'Статистика по категориям' : 'Динамика расходов'}
                </h5>
              </div>
              <div style={{ backgroundColor: '#390668', minHeight: isMobile ? '300px' : '400px' }} className="card-body">
                <div 
                  style={{ 
                    position: 'relative', 
                    height: isMobile ? '350px' : '650px', 
                    display: activeChart === 'categories' ? 'block' : 'none' 
                  }}
                >
                  <canvas ref={categoriesChartRef} />
                </div>
                
                <div 
                  style={{ 
                    position: 'relative', 
                    height: isMobile ? '350px' : '650px', 
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