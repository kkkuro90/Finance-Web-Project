// FamilyBudget.jsx (новая страница)
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FamilyBudget = () => {
  const navigate = useNavigate();
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showAddIncomeModal, setShowAddIncomeModal] = useState(false);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  
  // Данные участников
  const [members, setMembers] = useState([
    { id: 1, name: 'Иван Петров', role: 'Администратор' },
    { id: 2, name: 'Мария Петрова', role: 'Участник' },
    { id: 3, name: 'Павел Петров', role: 'Участник' },
    { id: 4, name: 'Елена Петрова', role: 'Участник' }
  ]);
  
  // Данные операций
  const [transactions, setTransactions] = useState([
    { id: 1, date: '15.04.2025', category: 'Продукты', amount: -1250, member: 'Мария Петрова', description: 'Магнит' },
    { id: 2, date: '10.04.2025', category: 'Коммунальные услуги', amount: -8720, member: 'Иван Петров', description: 'Оплата за кв.' },
    { id: 3, date: '08.04.2025', category: 'Транспорт', amount: -500, member: 'Павел Петров', description: 'Такси' },
    { id: 4, date: '06.04.2025', category: 'Развлечения', amount: -750, member: 'Елена Петрова', description: 'Кино' }
  ]);

  // Форматирование суммы
  const formatAmount = (amount) => {
    return amount < 0 
      ? `-${Math.abs(amount).toLocaleString('ru-RU', { minimumFractionDigits: 2 })} ₽`
      : `${amount.toLocaleString('ru-RU', { minimumFractionDigits: 2 })} ₽`;
  };

  return (
    <div className="main-content">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 style={{ color: 'white', fontSize: '275%' }}>Семейный бюджет</h1>
        <button 
          style={{ backgroundColor: '#5b248f' }} 
          className="btn btn-primary"
          onClick={() => navigate('/shared-access')}
        >
          Совместный доступ
        </button>
      </div>

      <div className="card mb-4" style={{ backgroundColor: '#390668' }}>
        <div className="card-body">
          <h2 style={{ color: 'white' }}>Декабрь 2023 г.</h2>
          <h3 style={{ color: 'white' }}>Семья Петровых</h3>
          
          <div className="row mt-4">
            <div className="col-md-4">
              <div className="budget-card">
                <h4 style={{ color: 'white' }}>Общий бюджет</h4>
                <h2 style={{ color: 'lightgreen' }}>75 430 ₽</h2>
              </div>
            </div>
            <div className="col-md-4">
              <div className="budget-card">
                <h4 style={{ color: 'white' }}>Доходы</h4>
                <h2 style={{ color: 'lightgreen' }}>120 000 ₽</h2>
              </div>
            </div>
            <div className="col-md-4">
              <div className="budget-card">
                <h4 style={{ color: 'white' }}>Расходы</h4>
                <h2 style={{ color: 'lightcoral' }}>44 570 ₽</h2>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card mb-4" style={{ backgroundColor: '#390668' }}>
        <div className="card-header d-flex justify-content-between align-items-center">
          <h2 style={{ color: 'white' }}>Последние операции</h2>
          <div>
            <button 
              style={{ backgroundColor: '#5b248f', marginRight: '10px' }} 
              className="btn btn-primary"
              onClick={() => setShowAddIncomeModal(true)}
            >
              Добавить доход
            </button>
            <button 
              style={{ backgroundColor: '#5b248f' }} 
              className="btn btn-primary"
              onClick={() => setShowAddExpenseModal(true)}
            >
              Добавить расход
            </button>
          </div>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table" style={{ color: 'white' }}>
              <thead>
                <tr>
                  <th>Дата</th>
                  <th>Категория</th>
                  <th>Сумма</th>
                  <th>Участник</th>
                  <th>Описание</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>{transaction.date}</td>
                    <td>{transaction.category}</td>
                    <td style={{ color: transaction.amount < 0 ? 'lightcoral' : 'lightgreen' }}>
                      {formatAmount(transaction.amount)}
                    </td>
                    <td>{transaction.member}</td>
                    <td>{transaction.description}</td>
                    <td>
                      <button 
                        style={{ backgroundColor: '#615e68', marginRight: '5px' }} 
                        className="btn btn-sm"
                      >
                        Повторить
                      </button>
                      <button 
                        style={{ backgroundColor: '#615e68' }} 
                        className="btn btn-sm"
                      >
                        Изменить
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="card" style={{ backgroundColor: '#390668' }}>
        <div className="card-header d-flex justify-content-between align-items-center">
          <h2 style={{ color: 'white' }}>Участники</h2>
          <button 
            style={{ backgroundColor: '#5b248f' }} 
            className="btn btn-primary"
            onClick={() => setShowAddMemberModal(true)}
          >
            Добавить участника
          </button>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table" style={{ color: 'white' }}>
              <thead>
                <tr>
                  <th>Имя</th>
                  <th>Роль</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member) => (
                  <tr key={member.id}>
                    <td>{member.name}</td>
                    <td>{member.role}</td>
                    <td>
                      <button 
                        style={{ backgroundColor: '#615e68', marginRight: '5px' }} 
                        className="btn btn-sm"
                      >
                        Изменить роль
                      </button>
                      <button 
                        style={{ backgroundColor: '#615e68' }} 
                        className="btn btn-sm"
                      >
                        Удалить
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Модальные окна */}
      {showAddMemberModal && (
        <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content" style={{ backgroundColor: '#390668', color: 'white' }}>
              <div className="modal-header">
                <h5 className="modal-title">Добавить участника</h5>
                <button type="button" className="btn-close" onClick={() => setShowAddMemberModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Email участника</label>
                  <input type="email" className="form-control" placeholder="Введите email" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Имя участника</label>
                  <input type="text" className="form-control" placeholder="Введите имя" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Роль участника</label>
                  <select className="form-select">
                    <option>Участник</option>
                    <option>Администратор</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddMemberModal(false)}>Отмена</button>
                <button type="button" className="btn btn-primary">Добавить</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAddIncomeModal && (
        <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content" style={{ backgroundColor: '#390668', color: 'white' }}>
              <div className="modal-header">
                <h5 className="modal-title">Добавить доход</h5>
                <button type="button" className="btn-close" onClick={() => setShowAddIncomeModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Сумма</label>
                  <input type="number" className="form-control" placeholder="Введите сумму" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Категория</label>
                  <input type="text" className="form-control" placeholder="Введите категорию" />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddIncomeModal(false)}>Отмена</button>
                <button type="button" className="btn btn-primary">Добавить</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAddExpenseModal && (
        <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content" style={{ backgroundColor: '#390668', color: 'white' }}>
              <div className="modal-header">
                <h5 className="modal-title">Добавить расход</h5>
                <button type="button" className="btn-close" onClick={() => setShowAddExpenseModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Сумма</label>
                  <input type="number" className="form-control" placeholder="Введите сумму" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Категория</label>
                  <input type="text" className="form-control" placeholder="Введите категорию" />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddExpenseModal(false)}>Отмена</button>
                <button type="button" className="btn btn-primary">Добавить</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FamilyBudget;