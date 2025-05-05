import { useState } from 'react';

const History = () => {
  const [showFilter, setShowFilter] = useState(false);

  const transactions = [
    { date: '15.04.2023', category: 'Продукты', description: 'Магнит', amount: '-1,250.00 ₽', type: 'expense' },
    { date: '10.04.2023', category: 'Зарплата', description: 'ООО "Компания"', amount: '+30,000.00 ₽', type: 'income' },
    { date: '08.04.2023', category: 'Кафе', description: 'Starbucks', amount: '-850.00 ₽', type: 'expense' },
    { date: '05.04.2023', category: 'Транспорт', description: 'Такси', amount: '-450.00 ₽', type: 'expense' },
    { date: '01.04.2023', category: 'ЖКХ', description: 'Квартплата', amount: '-12,000.00 ₽', type: 'expense' }
  ];

  return (
    <div className="col-md-9 col-lg-10 main-content">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 style={{ color: 'white', fontSize: '260%' }}>История операций</h2>
        <div>
          <button className="btn btn-primary me-2">
            <i className="bi bi-graph-up"></i> Анализировать
          </button>
          <button 
            className="btn btn-outline-primary" 
            onClick={() => setShowFilter(!showFilter)}
          >
            <i className="bi bi-funnel"></i> Фильтр
          </button>
        </div>
      </div>

      {showFilter && (
        <div className="card mb-4">
          <div style={{ backgroundColor: '#390668' }} className="card-body">
            <form>
              <div style={{ color: 'white' }} className="row">
                <div className="col-md-3">
                  <label className="form-label">Период</label>
                  <select className="form-select" defaultValue="Этот месяц">
                    <option>За все время</option>
                    <option>Этот месяц</option>
                    <option>Прошлый месяц</option>
                    <option>Этот год</option>
                    <option>Прошлый год</option>
                    <option>Произвольный</option>
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="form-label">Тип</label>
                  <select className="form-select" defaultValue="Все">
                    <option>Все</option>
                    <option>Доходы</option>
                    <option>Расходы</option>
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="form-label">С</label>
                  <input type="date" className="form-control" />
                </div>
                <div className="col-md-3">
                  <label className="form-label">По</label>
                  <input type="date" className="form-control" />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Тип</label>
                  <select className="form-select">
                    <option>Все</option>
                    <option>Доходы</option>
                    <option>Расходы</option>
                  </select>
                </div>
              </div>
              <div style={{ color: 'white' }} className="row mt-3">
                <div className="col-md-6">
                  <label className="form-label">Категория</label>
                  <select className="form-select">
                    <option>Все категории</option>
                    <option>Продукты</option>
                    <option>Транспорт</option>
                    <option>Развлечения</option>
                    <option>ЖКХ</option>
                    <option>Здоровье</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Сумма</label>
                  <div className="input-group">
                    <input type="number" className="form-control" placeholder="От" />
                    <input type="number" className="form-control" placeholder="До" />
                  </div>
                </div>
              </div>
              <div className="row mt-3">
                <div className="col-md-12">
                  <label style={{ color: 'white' }} className="form-label">Поиск</label>
                  <input type="text" className="form-control" placeholder="Поиск по описанию" />
                </div>
              </div>
              <div className="mt-3">
                <button type="submit" className="btn btn-primary me-2">Применить</button>
                <button style={{ backgroundColor: '#47444d' }} type="reset" className="btn btn-outline-secondary">
                  Сбросить
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div style={{ width: '100%' }} className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 style={{ fontSize: '185%' }} className="card-title">Список операций</h5>
          <input 
            type="text" 
            className="form-control form-control-sm" 
            placeholder="Поиск..." 
            style={{ width: '200px', backgroundColor: '#615e68', color: 'white' }} 
          />
        </div>
        <div style={{ backgroundColor: '#390668' }} className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th style={{ backgroundColor: '#5b248f', color: 'white', textAlign: 'center' }}>Дата</th>
                  <th style={{ backgroundColor: '#5b248f', color: 'white', textAlign: 'center' }}>Категория</th>
                  <th style={{ backgroundColor: '#5b248f', color: 'white', textAlign: 'center' }}>Описание</th>
                  <th style={{ backgroundColor: '#5b248f', color: 'white', textAlign: 'center' }}>Сумма</th>
                  <th style={{ backgroundColor: '#5b248f', color: 'white', textAlign: 'center' }}>Действия</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction, index) => (
                  <tr key={index} className={`table-${transaction.type === 'income' ? 'success' : 'danger'}`}>
                    <td style={{ color: 'white', textAlign: 'center' }}>{transaction.date}</td>
                    <td style={{ color: 'white', textAlign: 'center' }}>{transaction.category}</td>
                    <td style={{ color: 'white', textAlign: 'center' }}>{transaction.description}</td>
                    <td style={{ color: 'white', textAlign: 'center' }}>{transaction.amount}</td>
                    <td style={{ textAlign: 'center' }}>
                      <button 
                        style={{ backgroundColor: '#615e68', width: '40%' }} 
                        className="btn btn-sm btn-outline-secondary me-1"
                      >
                        Повторить
                      </button>
                      <button 
                        style={{ backgroundColor: '#615e68', width: '40%' }} 
                        className="btn btn-sm btn-outline-primary"
                      >
                        Изменить
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <nav aria-label="Page navigation">
            <ul className="pagination justify-content-center">
              <li className="page-item disabled">
                <a style={{ color: 'white' }} className="page-link" href="#" tabIndex="-1">Назад</a>
              </li>
              <li className="page-item active">
                <a style={{ color: 'white' }} className="page-link" href="#">1</a>
              </li>
              <li className="page-item">
                <a style={{ color: 'white' }} className="page-link" href="#">2</a>
              </li>
              <li className="page-item">
                <a style={{ color: 'white' }} className="page-link" href="#">3</a>
              </li>
              <li className="page-item">
                <a style={{ color: 'white' }} className="page-link" href="#">Вперед</a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default History;