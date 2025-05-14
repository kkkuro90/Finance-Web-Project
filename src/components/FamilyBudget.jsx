// FamilyBudget.jsx (обновленная страница)
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

const FamilyBudget = () => {
  const navigate = useNavigate();
  const [showAddIncomeModal, setShowAddIncomeModal] = useState(false);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTransaction, setNewTransaction] = useState({
    date: '',
    category: '',
    amount: '',
    member: '',
    description: '',
    type: 'expense',
  });
  // Заглушка для участников (members) — если потребуется, добавим API
  const [members, setMembers] = useState([]);

  useEffect(() => {
    fetchTransactions();
    // fetchMembers(); // если появится API для участников
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/operations`);
      setTransactions(res.data);
    } catch (e) {
      // обработка ошибки
    }
    setLoading(false);
  };

  // Форматирование суммы
  const formatAmount = (amount) => {
    return amount < 0
      ? `-${Math.abs(amount).toLocaleString('ru-RU', { minimumFractionDigits: 2 })} ₽`
      : `${amount.toLocaleString('ru-RU', { minimumFractionDigits: 2 })} ₽`;
  };

  // Добавить операцию
  const handleAddTransaction = async (type) => {
    if (!newTransaction.category || !newTransaction.amount) return;
    try {
      await axios.post(`${API_URL}/operations`, {
        ...newTransaction,
        amount: type === 'expense' ? -Math.abs(Number(newTransaction.amount)) : Math.abs(Number(newTransaction.amount)),
        date: newTransaction.date || new Date().toISOString(),
      });
      setShowAddIncomeModal(false);
      setShowAddExpenseModal(false);
      setNewTransaction({ date: '', category: '', amount: '', member: '', description: '', type: 'expense' });
      fetchTransactions();
    } catch (e) {
      // обработка ошибки
    }
  };

  // Удалить операцию
  const handleDeleteTransaction = async (id) => {
    try {
      await axios.delete(`${API_URL}/operations/${id}`);
      fetchTransactions();
    } catch (e) {
      // обработка ошибки
    }
  };

  // Повторить операцию
  const handleRepeatTransaction = async (transaction) => {
    try {
      await axios.post(`${API_URL}/operations`, {
        ...transaction,
        id: undefined,
        date: new Date().toISOString(),
      });
      fetchTransactions();
    } catch (e) {
      // обработка ошибки
    }
  };

  return (
    <div className="main-content">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 style={{ color: 'white', fontSize: '2.2rem' }}>Семейный бюджет</h1>
        <button className="btn btn-primary" onClick={() => navigate('/shared')}>
          Совместный доступ
        </button>
      </div>

      {/* Последние операции */}
      <div className="card mb-4">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h2 className="card-title">Последние операции</h2>
          <div>
            <button className="btn btn-primary me-2" onClick={() => { setShowAddIncomeModal(true); setNewTransaction({ ...newTransaction, type: 'income' }); }}>Добавить доход</button>
            <button className="btn btn-primary" onClick={() => { setShowAddExpenseModal(true); setNewTransaction({ ...newTransaction, type: 'expense' }); }}>Добавить расход</button>
          </div>
        </div>
        <div className="card-body">
          {loading ? <div>Загрузка...</div> : (
            <div className="table-responsive">
              <table className="table family-table">
                <thead>
                  <tr>
                    <th>Дата</th>
                    <th>Категория</th>
                    <th>Сумма</th>
                    <th>Описание</th>
                    <th>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td>{new Date(transaction.date).toLocaleDateString()}</td>
                      <td>{transaction.category?.name || transaction.category}</td>
                      <td style={{ color: transaction.amount < 0 ? 'lightcoral' : 'lightgreen' }}>{formatAmount(transaction.amount)}</td>
                      <td>{transaction.description}</td>
                      <td>
                        <button className="btn btn-sm btn-secondary me-1" onClick={() => handleRepeatTransaction(transaction)}>Повторить</button>
                        <button className="btn btn-sm btn-secondary me-1" onClick={() => handleDeleteTransaction(transaction.id)}>Удалить</button>
                        {/* Кнопка "Изменить" может открывать модалку для редактирования */}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Модальное окно добавления дохода/расхода */}
      {(showAddIncomeModal || showAddExpenseModal) && (
        <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content" style={{ backgroundColor: '#390668', color: 'white' }}>
              <div className="modal-header">
                <h5 className="modal-title">{showAddIncomeModal ? 'Добавить доход' : 'Добавить расход'}</h5>
                <button type="button" className="btn-close" onClick={() => { setShowAddIncomeModal(false); setShowAddExpenseModal(false); }}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Сумма</label>
                  <input type="number" className="form-control" value={newTransaction.amount} onChange={e => setNewTransaction({ ...newTransaction, amount: e.target.value })} placeholder="Введите сумму" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Категория</label>
                  <input type="text" className="form-control" value={newTransaction.category} onChange={e => setNewTransaction({ ...newTransaction, category: e.target.value })} placeholder="Введите категорию" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Описание</label>
                  <input type="text" className="form-control" value={newTransaction.description} onChange={e => setNewTransaction({ ...newTransaction, description: e.target.value })} placeholder="Описание (необязательно)" />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => { setShowAddIncomeModal(false); setShowAddExpenseModal(false); }}>Отмена</button>
                <button type="button" className="btn btn-primary" onClick={() => handleAddTransaction(newTransaction.type)}>Добавить</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Участники (заглушка) */}
      <div className="card mb-4 d-none d-lg-block">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h2 className="card-title">Участники</h2>
          <button className="btn btn-primary" onClick={() => setShowAddMemberModal(true)}>Добавить участника</button>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Имя</th>
                  <th>Роль</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {members.length === 0 ? (
                  <tr><td colSpan={3}>Нет данных</td></tr>
                ) : members.map((member) => (
                  <tr key={member.id}>
                    <td>{member.name}</td>
                    <td>{member.role}</td>
                    <td>
                      <button className="btn btn-sm btn-secondary me-1">Изменить роль</button>
                      <button className="btn btn-sm btn-secondary">Удалить</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FamilyBudget;