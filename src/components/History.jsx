import { useState, useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';

// Компонент для модального окна подтверждения
const ConfirmationModal = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: '#390668',
        padding: '20px',
        borderRadius: '8px',
        maxWidth: '400px',
        width: '90%',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <h5 style={{ color: 'white', marginBottom: '20px' }}>Подтверждение</h5>
        <p style={{ color: '#adb5bd', marginBottom: '20px' }}>{message}</p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button 
            onClick={onClose}
            style={{
              backgroundColor: '#615e68',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Отмена
          </button>
          <button 
            onClick={onConfirm}
            style={{
              backgroundColor: '#e74c3c',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Подтвердить
          </button>
        </div>
      </div>
    </div>
  );
};

// Компонент для уведомлений
const Notification = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'error' ? '#e74c3c' : '#2ecc71';

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      backgroundColor: bgColor,
      color: 'white',
      padding: '10px 20px',
      borderRadius: '4px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
      zIndex: 1000,
      animation: 'slideIn 0.3s ease-out'
    }}>
      {message}
    </div>
  );
};

const History = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    date: '',
    category: '',
    description: '',
    amount: ''
  });
  const isMobile = useMediaQuery({ maxWidth: 768 });

  // Состояния для модальных окон
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState(null);
  const [notification, setNotification] = useState(null);

  // Исходные данные операций
  const initialTransactions = [
    { id: 1, date: '15.04.2023', category: 'Продукты', description: 'Магнит', amount: -1250.00, type: 'expense' },
    { id: 2, date: '10.04.2023', category: 'Зарплата', description: 'ООО "Компания"', amount: 30000.00, type: 'income' },
    { id: 3, date: '08.04.2023', category: 'Кафе', description: 'Starbucks', amount: -850.00, type: 'expense' },
    { id: 4, date: '05.04.2023', category: 'Транспорт', description: 'Такси', amount: -450.00, type: 'expense' },
    { id: 5, date: '01.04.2023', category: 'ЖКХ', description: 'Квартплата', amount: -12000.00, type: 'expense' },
    { id: 6, date: '28.03.2023', category: 'Развлечения', description: 'Кино', amount: -600.00, type: 'expense' },
    { id: 7, date: '25.03.2023', category: 'Зарплата', description: 'Фриланс', amount: 15000.00, type: 'income' },
  ];

  const [transactions, setTransactions] = useState(initialTransactions);
  const transactionsPerPage = 5;
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = transactions.slice(indexOfFirstTransaction, indexOfLastTransaction);
  const totalPages = Math.ceil(transactions.length / transactionsPerPage);

  // Форма для добавления новой транзакции
  const [newTransaction, setNewTransaction] = useState({
    date: new Date().toLocaleDateString('ru-RU'),
    category: '',
    description: '',
    amount: '',
    type: 'expense'
  });

  // Добавить новую транзакцию
  const handleAddTransaction = () => {
    const amountValue = parseFloat(newTransaction.amount);
    if (!newTransaction.category || isNaN(amountValue)) {
      setNotification({
        message: "Пожалуйста, заполните все поля корректно.",
        type: 'error'
      });
      return;
    }

    const newTrans = {
      id: Date.now(),
      date: newTransaction.date,
      category: newTransaction.category,
      description: newTransaction.description,
      amount: newTransaction.type === 'expense' ? -amountValue : amountValue,
      type: newTransaction.type
    };

    setTransactions([newTrans, ...transactions]);
    setCurrentPage(1);
    setNewTransaction({
      date: new Date().toLocaleDateString('ru-RU'),
      category: '',
      description: '',
      amount: '',
      type: 'expense'
    });

    setNotification({
      message: "Операция успешно добавлена!",
      type: 'success'
    });
  };

  // Повторить операцию
  const handleRepeat = (transaction) => {
    const newTransaction = {
      ...transaction,
      id: Date.now(),
      date: new Date().toLocaleDateString('ru-RU')
    };
    setTransactions([newTransaction, ...transactions]);
    setCurrentPage(1);
    setNotification({
      message: "Операция успешно повторена!",
      type: 'success'
    });
  };

  // Удалить операцию
  const handleDelete = (id) => {
    setTransactionToDelete(id);
    setShowConfirmModal(true);
  };

  const confirmDelete = () => {
    setTransactions(transactions.filter(t => t.id !== transactionToDelete));
    setShowConfirmModal(false);
    setNotification({
      message: "Операция успешно удалена!",
      type: 'success'
    });
  };

  // Начать редактирование
  const startEditing = (transaction) => {
    setEditingId(transaction.id);
    setEditForm({
      date: transaction.date,
      category: transaction.category,
      description: transaction.description,
      amount: Math.abs(transaction.amount)
    });
  };

  // Сохранить изменения
  const saveEdit = () => {
    setTransactions(
      transactions.map(t =>
        t.id === editingId ? {
          ...t,
          date: editForm.date,
          category: editForm.category,
          description: editForm.description,
          amount: t.type === 'expense' ? -editForm.amount : editForm.amount
        } : t
      )
    );
    setEditingId(null);
    setNotification({
      message: "Изменения сохранены!",
      type: 'success'
    });
  };

  // Отменить редактирование
  const cancelEdit = () => {
    setEditingId(null);
  };

  // Изменение полей формы
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  // Форматирование суммы
  const formatAmount = (amount, type) => {
    return `${type === 'expense' ? '-' : '+'}${Math.abs(amount).toFixed(2)} ₽`;
  };

  return (
    <div className={`${isMobile ? 'col-12' : 'col-md-9 col-lg-10'} main-content`}>
      {/* Уведомление */}
      {notification && (
        <Notification 
          message={notification.message} 
          type={notification.type} 
          onClose={() => setNotification(null)} 
        />
      )}

      {/* Модальное окно подтверждения */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={confirmDelete}
        message="Вы уверены, что хотите удалить эту операцию?"
      />

      {/* Остальной код компонента остается без изменений */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 style={{ color: 'white', fontSize: isMobile ? '200%' : '260%' }}>История операций</h2>
      </div>

      {/* Форма добавления новой операции */}
      <div className="p-3 mb-3" style={{ backgroundColor: '#390668', borderRadius: '8px' }}>
        <h5 style={{ color: 'white', marginBottom: '15px' }}>Добавить новую операцию</h5>
        <div className={isMobile ? "d-grid gap-2" : "d-flex flex-wrap gap-2 align-items-center"}>
          <input
            type="text"
            name="date"
            value={newTransaction.date}
            onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
            className="form-control form-control-sm"
            style={{ backgroundColor: '#615e68', color: 'white' }}
            placeholder="Дата"
          />
          <input
            type="text"
            name="category"
            value={newTransaction.category}
            onChange={(e) => setNewTransaction({ ...newTransaction, category: e.target.value })}
            className="form-control form-control-sm"
            style={{ backgroundColor: '#615e68', color: 'white' }}
            placeholder="Категория"
          />
          <input
            type="text"
            name="description"
            value={newTransaction.description}
            onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
            className="form-control form-control-sm"
            style={{ backgroundColor: '#615e68', color: 'white' }}
            placeholder="Описание"
          />
          <input
            type="number"
            name="amount"
            value={newTransaction.amount}
            onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
            className="form-control form-control-sm"
            style={{ backgroundColor: '#615e68', color: 'white' }}
            placeholder="Сумма"
          />
          <select
            name="type"
            value={newTransaction.type}
            onChange={(e) => setNewTransaction({ ...newTransaction, type: e.target.value })}
            className="form-select form-select-sm"
            style={{ backgroundColor: '#615e68', color: 'white' }}
          >
            <option value="expense">Расход</option>
            <option value="income">Доход</option>
          </select>
          <button
            onClick={handleAddTransaction}
            className="btn btn-sm btn-success"
          >
            Добавить
          </button>
        </div>
      </div>

      {/* Список операций */}
      <div className="card" style={{ backgroundColor: '#390668' }}>
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 style={{ fontSize: isMobile ? '160%' : '185%', margin: 0 }} className="card-title">Список операций</h5>
          <input 
            type="text" 
            className="form-control form-control-sm" 
            placeholder="Поиск..." 
            style={{ 
              width: isMobile ? '150px' : '200px', 
              backgroundColor: '#615e68', 
              color: 'white' 
            }} 
          />
        </div>
        
        <div className="card-body p-0">
          {isMobile ? (
            /* Мобильная версия - карточки */
            <div className="list-group list-group-flush">
              {currentTransactions.map((transaction) => (
                <div 
                  key={transaction.id} 
                  className={`list-group-item ${transaction.type === 'income' ? 'bg-success bg-opacity-10' : 'bg-danger bg-opacity-10'}`}
                  style={{ borderLeft: `4px solid ${transaction.type === 'income' ? '#2ecc71' : '#e74c3c'}` }}
                >
                  {editingId === transaction.id ? (
                    <div className="d-grid gap-2">
                      <input
                        type="text"
                        name="date"
                        value={editForm.date}
                        onChange={handleEditChange}
                        className="form-control form-control-sm mb-2"
                        style={{ backgroundColor: '#615e68', color: 'white' }}
                      />
                      <input
                        type="text"
                        name="category"
                        value={editForm.category}
                        onChange={handleEditChange}
                        className="form-control form-control-sm mb-2"
                        style={{ backgroundColor: '#615e68', color: 'white' }}
                      />
                      <input
                        type="text"
                        name="description"
                        value={editForm.description}
                        onChange={handleEditChange}
                        className="form-control form-control-sm mb-2"
                        style={{ backgroundColor: '#615e68', color: 'white' }}
                      />
                      <input
                        type="number"
                        name="amount"
                        value={editForm.amount}
                        onChange={handleEditChange}
                        className="form-control form-control-sm mb-2"
                        style={{ backgroundColor: '#615e68', color: 'white' }}
                      />
                      <div className="d-flex gap-2">
                        <button onClick={saveEdit} className="btn btn-sm btn-success flex-grow-1">
                          Сохранить
                        </button>
                        <button onClick={cancelEdit} className="btn btn-sm btn-danger flex-grow-1">
                          Отмена
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <h6 style={{ color: 'white', marginBottom: '4px' }}>{transaction.category}</h6>
                          <p style={{ color: '#adb5bd', marginBottom: '4px', fontSize: '14px' }}>
                            {transaction.description}
                          </p>
                          <small style={{ color: '#adb5bd' }}>{transaction.date}</small>
                        </div>
                        <span style={{ 
                          color: transaction.type === 'income' ? 'lightgreen' : 'lightcoral',
                          fontWeight: 'bold',
                          fontSize: '16px'
                        }}>
                          {formatAmount(transaction.amount, transaction.type)}
                        </span>
                      </div>
                      
                      <div className="d-flex gap-2 mt-3">
                        <button 
                          onClick={() => handleRepeat(transaction)}
                          className="btn btn-sm btn-outline-secondary flex-grow-1"
                          style={{ fontSize: '12px' }}
                        >
                          Повторить
                        </button>
                        <button 
                          onClick={() => startEditing(transaction)}
                          className="btn btn-sm btn-outline-primary flex-grow-1"
                          style={{ fontSize: '12px' }}
                        >
                          Изменить
                        </button>
                        <button 
                          onClick={() => handleDelete(transaction.id)}
                          className="btn btn-sm btn-outline-danger flex-grow-1"
                          style={{ fontSize: '12px' }}
                        >
                          Удалить
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          ) : (
            /* Десктопная версия - таблица */
            <div className="table-responsive">
              <table className="table table-hover m-0">
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
                  {currentTransactions.map((transaction) => (
                    <tr key={transaction.id} className={`table-${transaction.type === 'income' ? 'success' : 'danger'}`}>
                      {editingId === transaction.id ? (
                        <>
                          <td style={{ textAlign: 'center' }}>
                            <input
                              type="text"
                              name="date"
                              value={editForm.date}
                              onChange={handleEditChange}
                              className="form-control form-control-sm"
                              style={{ backgroundColor: '#615e68', color: 'white' }}
                            />
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <input
                              type="text"
                              name="category"
                              value={editForm.category}
                              onChange={handleEditChange}
                              className="form-control form-control-sm"
                              style={{ backgroundColor: '#615e68', color: 'white' }}
                            />
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <input
                              type="text"
                              name="description"
                              value={editForm.description}
                              onChange={handleEditChange}
                              className="form-control form-control-sm"
                              style={{ backgroundColor: '#615e68', color: 'white' }}
                            />
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <input
                              type="number"
                              name="amount"
                              value={editForm.amount}
                              onChange={handleEditChange}
                              className="form-control form-control-sm"
                              style={{ backgroundColor: '#615e68', color: 'white' }}
                            />
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <button
                              onClick={saveEdit}
                              className="btn btn-sm btn-success me-1"
                              style={{ width: '40%' }}
                            >
                              Сохранить
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="btn btn-sm btn-danger"
                              style={{ width: '40%' }}
                            >
                              Отмена
                            </button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td style={{ color: 'white', textAlign: 'center' }}>{transaction.date}</td>
                          <td style={{ color: 'white', textAlign: 'center' }}>{transaction.category}</td>
                          <td style={{ color: 'white', textAlign: 'center' }}>{transaction.description}</td>
                          <td style={{ 
                            color: transaction.type === 'income' ? 'lightgreen' : 'lightcoral', 
                            textAlign: 'center',
                            fontWeight: 'bold'
                          }}>
                            {formatAmount(transaction.amount, transaction.type)}
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <button 
                              onClick={() => handleRepeat(transaction)}
                              style={{ backgroundColor: '#615e68', width: '30%' }} 
                              className="btn btn-sm btn-outline-secondary me-1"
                            >
                              Повторить
                            </button>
                            <button 
                              onClick={() => startEditing(transaction)}
                              style={{ backgroundColor: '#615e68', width: '30%' }} 
                              className="btn btn-sm btn-outline-primary me-1"
                            >
                              Изменить
                            </button>
                            <button 
                              onClick={() => handleDelete(transaction.id)}
                              style={{ backgroundColor: '#615e68', width: '30%' }} 
                              className="btn btn-sm btn-outline-danger"
                            >
                              Удалить
                            </button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Пагинация */}
        <div className="card-footer">
          <nav aria-label="Page navigation">
            <ul className={`pagination ${isMobile ? 'pagination-sm justify-content-center' : 'justify-content-center'}`}>
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <button 
                  className="page-link" 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  style={{ color: 'white', backgroundColor: '#5b248f' }}
                >
                  {isMobile ? '←' : 'Назад'}
                </button>
              </li>
              {Array.from({ length: totalPages }).map((_, index) => (
                <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                  <button 
                    className="page-link" 
                    onClick={() => setCurrentPage(index + 1)}
                    style={{ 
                      color: 'white', 
                      backgroundColor: currentPage === index + 1 ? '#7b2cbf' : '#5b248f'
                    }}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}
              <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                <button 
                  className="page-link" 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  style={{ color: 'white', backgroundColor: '#5b248f' }}
                >
                  {isMobile ? '→' : 'Вперед'}
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default History;