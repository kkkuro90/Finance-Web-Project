// FamilyBudget.jsx (обновленная страница)
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const API_URL = 'http://localhost:5001/api';

const getToken = () => localStorage.getItem('token');
const axiosAuth = axios.create({
  baseURL: API_URL,
});
axiosAuth.interceptors.request.use(config => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const FamilyBudget = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showAddIncomeModal, setShowAddIncomeModal] = useState(false);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState([]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [notification, setNotification] = useState(null);
  const [newTransaction, setNewTransaction] = useState({
    date: '',
    category: '',
    amount: '',
    member: '',
    description: '',
    type: 'expense',
  });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (!getToken()) {
      navigate('/login');
      return;
    }
    fetchTransactions();
    fetchMembers();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await axiosAuth.get('/operations');
      setTransactions(res.data);
    } catch (e) {
      setNotification({ message: 'Ошибка загрузки операций: ' + (e.response?.data?.message || e.message), type: 'error' });
    }
    setLoading(false);
  };

  const fetchMembers = async () => {
    try {
      const res = await axiosAuth.get('/family/members');
      setMembers(res.data);
    } catch (e) {
      setNotification({ message: 'Ошибка загрузки участников: ' + (e.response?.data?.message || e.message), type: 'error' });
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axiosAuth.get('/categories');
      setCategories(res.data);
    } catch (e) {}
  };

  const isValidEmail = (email) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);

  const handleInvite = async () => {
    try {
      await axiosAuth.post('/family/invite', { email: inviteEmail });
      setNotification({ message: 'Приглашение отправлено!', type: 'success' });
      setInviteEmail('');
      setShowInviteModal(false);
      fetchMembers();
    } catch (e) {
      setNotification({ message: 'Ошибка отправки приглашения: ' + (e.response?.data?.message || e.message), type: 'error' });
    }
  };

  const handleCreateGroup = async () => {
    try {
      await axiosAuth.post('/family/create');
      setNotification({ message: 'Группа создана!', type: 'success' });
      fetchMembers();
      login(localStorage.getItem('token'));
      navigate('/sharedaccess');
    } catch (e) {
      setNotification({ message: 'Ошибка создания группы: ' + (e.response?.data?.message || e.message), type: 'error' });
    }
  };

  const handleDeleteGroup = async () => {
    try {
      await axiosAuth.delete('/family/delete');
      setNotification({ message: 'Группа удалена!', type: 'success' });
      setMembers([]);
    } catch (e) {
      setNotification({ message: 'Ошибка удаления группы: ' + (e.response?.data?.message || e.message), type: 'error' });
    }
  };

  // Форматирование суммы
  const formatAmount = (amount) => {
    return amount < 0
      ? `-${Math.abs(amount).toLocaleString('ru-RU', { minimumFractionDigits: 2 })} ₽`
      : `${amount.toLocaleString('ru-RU', { minimumFractionDigits: 2 })} ₽`;
  };

  // Добавить операцию
  const handleAddTransaction = async (type) => {
    const categoryId = Number(newTransaction.category);
    if (!categoryId) {
      setNotification({ message: 'Выберите категорию', type: 'error' });
      return;
    }
    const selectedCategory = categories.find(c => c.id === categoryId);
    if (!selectedCategory) {
      setNotification({ message: 'Категория не найдена', type: 'error' });
      return;
    }
    try {
      await axiosAuth.post('/operations', {
        categoryId,
        amount: type === 'expense' ? -Math.abs(Number(newTransaction.amount)) : Math.abs(Number(newTransaction.amount)),
        description: newTransaction.description
      });
      setShowAddIncomeModal(false);
      setShowAddExpenseModal(false);
      setNewTransaction({ date: '', category: '', amount: '', member: '', description: '', type: 'expense' });
      fetchTransactions();
    } catch (e) {
      setNotification({ message: 'Ошибка добавления операции: ' + (e.response?.data?.message || e.message), type: 'error' });
    }
  };

  // Удалить операцию
  const handleDeleteTransaction = async (id) => {
    try {
      await axiosAuth.delete(`/operations/${id}`);
      fetchTransactions();
    } catch (e) {
      // обработка ошибки
    }
  };

  // Повторить операцию
  const handleRepeatTransaction = async (transaction) => {
    try {
      await axiosAuth.post('/operations', {
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
    <div className="main-content-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 style={{ color: 'white', fontSize: '2.2rem' }}>Семейный бюджет</h1>
        <button className="btn btn-primary" onClick={() => navigate('/sharedaccess')}>
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
                  <select className="form-control" value={newTransaction.category} onChange={e => setNewTransaction({ ...newTransaction, category: e.target.value })}>
                    <option value="">Выберите категорию</option>
                    {categories.filter(c => c.type === (showAddIncomeModal ? 'income' : 'expense')).map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
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

      {/* Участники */}
      <div className="card mb-4 d-none d-lg-block">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h2 className="card-title">Участники</h2>
          <button className="btn btn-primary" onClick={() => setShowInviteModal(true)}>Пригласить по email</button>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Имя</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {members.length === 0 ? (
                  <tr><td colSpan={2}>Нет данных</td></tr>
                ) : members.map((member) => (
                  <tr key={member.id}>
                    <td>{member.name} {member.surname}</td>
                    <td>{member.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* Модалка приглашения */}
      {showInviteModal && (
        <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content" style={{ backgroundColor: '#390668', color: 'white' }}>
              <div className="modal-header">
                <h5 className="modal-title">Пригласить по email</h5>
                <button type="button" className="btn-close" onClick={() => setShowInviteModal(false)}></button>
              </div>
              <div className="modal-body">
                <input type="email" className="form-control" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} placeholder="Email" />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowInviteModal(false)}>Отмена</button>
                <button type="button" className="btn btn-primary" onClick={handleInvite} disabled={!isValidEmail(inviteEmail)}>Пригласить</button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Кнопки управления группой */}
      <div className="mb-4">
        <button className="btn btn-outline me-2" onClick={handleCreateGroup}>Создать новую группу</button>
        <button className="btn btn-danger" onClick={handleDeleteGroup}>Удалить группу</button>
      </div>
      {notification && (
        <div style={{ position: 'fixed', top: '20px', right: '20px', backgroundColor: notification.type === 'success' ? '#2ecc71' : '#e74c3c', color: 'white', padding: '15px 25px', borderRadius: '4px', zIndex: 1000 }}>{notification.message}</div>
      )}
    </div>
  );
};

export default FamilyBudget;