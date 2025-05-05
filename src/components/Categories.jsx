import { useState } from 'react';
import { Chart, registerables } from 'chart.js';
import { useEffect, useRef } from 'react';

Chart.register(...registerables);

const Categories = () => {
  const [selectedCategory, setSelectedCategory] = useState('Продукты');
  const categoryChartRef = useRef(null);
  const categoryChartInstance = useRef(null);

  const incomeCategories = [
    { name: 'Зарплата' },
    { name: 'Фриланс' },
    { name: 'Инвестиции' }
  ];

  const expenseCategories = [
    { name: 'Продукты' },
    { name: 'Транспорт' },
    { name: 'Кафе и рестораны' },
    { name: 'ЖКХ' },
    { name: 'Развлечения' }
  ];

  useEffect(() => {
    if (categoryChartRef.current) {
      if (categoryChartInstance.current) {
        categoryChartInstance.current.destroy();
      }

      const ctx = categoryChartRef.current.getContext('2d');
      categoryChartInstance.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Янв', 'Фев', 'Мар', 'Апр'],
          datasets: [{
            label: selectedCategory,
            data: [2800, 2950, 3100, 1250],
            backgroundColor: '#5b248f',
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            x: {
              ticks: {
                color: 'white'
              }
            },
            y: {
              ticks: {
                color: 'white'
              }
            }
          }
        }
      });
    }

    return () => {
      if (categoryChartInstance.current) {
        categoryChartInstance.current.destroy();
      }
    };
  }, [selectedCategory]);

  return (
    <div className="col-md-9 col-lg-10 main-content">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 style={{ color: 'white', fontSize: '260%' }}>Управление категориями</h2>
        <button className="btn btn-primary">
          <i className="bi bi-plus-circle"></i> Добавить категорию
        </button>
      </div>

      <div style={{ width: '60%', float: 'right' }} className="card mt-4">
        <div className="card-header">
          <h5 className="card-title">Статистика по категории</h5>
        </div>
        <div style={{ backgroundColor: '#390668', minHeight: '600px' }} className="card-body"> {/* Добавлен minHeight */}
          <div className="mb-3">
            <label style={{ color: 'white' }} className="form-label">Выберите категорию</label>
            <select 
              style={{ backgroundColor: '#615e68', color: 'white' }}
              className="form-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {expenseCategories.map((category) => (
                <option key={category.name} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div style={{ backgroundColor: '#5b248f', color: 'white' }} className="alert alert-info mb-3"> {/* Добавлен mb-3 */}
            <strong>{selectedCategory}</strong><br />
            Всего расходов: 12,450.00 ₽<br />
            Средний расход: 3,112.50 ₽ в месяц<br />
            Процент от общих расходов: 34%
          </div>
          <div style={{ height: '450px' }}> {/* Увеличена высота */}
            <canvas 
              ref={categoryChartRef}
              style={{ 
                backgroundColor: 'rgb(125, 67, 158)', 
                display: 'block',
                width: '100% !important',
                height: '100% !important'
              }}
            />
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-12">
          <div style={{ width: '95%', height: '35%' }} className="card mb-3">
            <div className="card-header">
              <h5 className="card-title">Категории доходов</h5>
            </div>
            <div style={{ backgroundColor: '#390668' }} className="card-body">
              <div className="list-group">
                {incomeCategories.map((category) => (
                  <div key={category.name} className="list-group-item d-flex justify-content-between align-items-center">
                    {category.name}
                    <div>
                      <button 
                        style={{ backgroundColor: '#615e68' }} 
                        className="btn btn-sm btn-outline-primary me-1"
                      >
                        Изменить
                      </button>
                      <button 
                        style={{ backgroundColor: '#615e68' }} 
                        className="btn btn-sm btn-outline-danger"
                      >
                        Удалить
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-12">
          <div style={{ width: '95%' }} className="card">
            <div className="card-header">
              <h5 className="card-title">Категории расходов</h5>
            </div>
            <div style={{ backgroundColor: '#390668' }} className="card-body">
              <div className="list-group">
                {expenseCategories.map((category) => (
                  <div key={category.name} className="list-group-item d-flex justify-content-between align-items-center">
                    {category.name}
                    <div>
                      <button 
                        style={{ backgroundColor: '#615e68' }} 
                        className="btn btn-sm btn-outline-primary me-1"
                      >
                        Изменить
                      </button>
                      <button 
                        style={{ backgroundColor: '#615e68' }} 
                        className="btn btn-sm btn-outline-danger"
                      >
                        Удалить
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;