import { useState } from 'react';

const History = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    date: '',
    category: '',
    description: '',
    amount: ''
  });

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

  // Пагинация
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
      alert("Пожалуйста, заполните все поля корректно.");
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
    setCurrentPage(1); // Перейти на первую страницу

    // Сброс формы
    setNewTransaction({
      date: new Date().toLocaleDateString('ru-RU'),
      category: '',
      description: '',
      amount: '',
      type: 'expense'
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
    setCurrentPage(1); // Вернуться на первую страницу
  };

  // Удалить операцию
  const handleDelete = (id) => {
    if (window.confirm("Вы уверены, что хотите удалить эту операцию?")) {
      setTransactions(transactions.filter(t => t.id !== id));
    }
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
    <div className="col-md-9 col-lg-10 main-content">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 style={{ color: 'white', fontSize: '260%' }}>История операций</h2>
      </div>

      {/* Форма добавления новой операции */}
      <div className="p-3" style={{ backgroundColor: '#390668' }}>
        <h5 style={{ color: 'white' }}>Добавить новую операцию</h5>
        <div className="d-flex flex-wrap gap-2 align-items-center">
          <input
            type="text"
            name="date"
            value={newTransaction.date}
            onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
            className="form-control form-control-sm"
            style={{ backgroundColor: '#615e68', color: 'white', width: '120px' }}
            placeholder="Дата"
          />
          <input
            type="text"
            name="category"
            value={newTransaction.category}
            onChange={(e) => setNewTransaction({ ...newTransaction, category: e.target.value })}
            className="form-control form-control-sm"
            style={{ backgroundColor: '#615e68', color: 'white', width: '150px' }}
            placeholder="Категория"
          />
          <input
            type="text"
            name="description"
            value={newTransaction.description}
            onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
            className="form-control form-control-sm"
            style={{ backgroundColor: '#615e68', color: 'white', width: '180px' }}
            placeholder="Описание"
          />
          <input
            type="number"
            name="amount"
            value={newTransaction.amount}
            onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
            className="form-control form-control-sm"
            style={{ backgroundColor: '#615e68', color: 'white', width: '100px' }}
            placeholder="Сумма"
          />
          <select
            name="type"
            value={newTransaction.type}
            onChange={(e) => setNewTransaction({ ...newTransaction, type: e.target.value })}
            className="form-select form-select-sm"
            style={{ backgroundColor: '#615e68', color: 'white', width: '110px' }}
          >
            <option value="expense">Расход</option>
            <option value="income">Доход</option>
          </select>
          <button
            onClick={handleAddTransaction}
            className="btn btn-sm btn-success"
            style={{ width: '105px' }}
          >
            Добавить
          </button>
        </div>
      </div>

      <div style={{ width: '100%' }} className="card mt-3">
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
                          textAlign: 'center' 
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

          {/* Пагинация */}
          <nav aria-label="Page navigation">
            <ul className="pagination justify-content-center">
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <button 
                  className="page-link" 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  style={{ color: 'white' }}
                >
                  Назад
                </button>
              </li>
              {Array.from({ length: totalPages }).map((_, index) => (
                <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                  <button 
                    className="page-link" 
                    onClick={() => setCurrentPage(index + 1)}
                    style={{ color: 'white' }}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}
              <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                <button 
                  className="page-link" 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  style={{ color: 'white' }}
                >
                  Вперед
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