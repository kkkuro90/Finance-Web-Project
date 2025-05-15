import { useState, useRef, useEffect } from 'react';
import { Chart, registerables } from 'chart.js';
import axios from 'axios';

Chart.register(...registerables);

const API_URL = 'http://localhost:5001/api';

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

const Categories = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryType, setNewCategoryType] = useState('expense');
  const [editingCategory, setEditingCategory] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [notification, setNotification] = useState(null);
  const [incomeCategories, setIncomeCategories] = useState([]);
  const [expenseCategories, setExpenseCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryOperations, setCategoryOperations] = useState([]);

  const categoryChartRef = useRef(null);
  const categoryChartInstance = useRef(null);

  // Загрузка категорий с backend
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_URL}/categories`);
        const income = res.data.filter(cat => cat.type === 'income');
        const expense = res.data.filter(cat => cat.type === 'expense');
        setIncomeCategories(income);
        setExpenseCategories(expense);
        if (expense.length > 0) setSelectedCategory(expense[0].name);
      } catch (e) {
        setNotification({ message: 'Ошибка загрузки категорий', type: 'error' });
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Добавление категории
  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      setNotification({ message: 'Пожалуйста, введите название категории', type: 'error' });
      return;
    }
    try {
      const res = await axios.post(`${API_URL}/categories`, {
        name: newCategoryName.trim(),
        type: newCategoryType
      });
      if (newCategoryType === 'income') {
        setIncomeCategories([...incomeCategories, res.data]);
      } else {
        setExpenseCategories([...expenseCategories, res.data]);
        if (!selectedCategory) setSelectedCategory(res.data.name);
      }
      setNewCategoryName('');
      setNotification({ message: 'Категория успешно добавлена!', type: 'success' });
    } catch (e) {
      setNotification({ message: 'Ошибка добавления категории', type: 'error' });
    }
  };

  // Удаление категории
  const handleDeleteCategory = (id, type) => {
    setCategoryToDelete({ id, type });
    setShowConfirmModal(true);
  };
  const confirmDelete = async () => {
    try {
      await axios.delete(`${API_URL}/categories/${categoryToDelete.id}`);
      if (categoryToDelete.type === 'income') {
        setIncomeCategories(incomeCategories.filter(cat => cat.id !== categoryToDelete.id));
      } else {
        setExpenseCategories(expenseCategories.filter(cat => cat.id !== categoryToDelete.id));
        if (selectedCategory && expenseCategories.find(cat => cat.id === categoryToDelete.id)?.name === selectedCategory) {
          setSelectedCategory(expenseCategories.length > 1 ? expenseCategories.find(cat => cat.id !== categoryToDelete.id).name : '');
        }
      }
      setNotification({ message: 'Категория успешно удалена!', type: 'success' });
    } catch (e) {
      setNotification({ message: 'Ошибка удаления категории', type: 'error' });
    } finally {
      setShowConfirmModal(false);
    }
  };

  // Редактирование категории
  const startEditing = (category, type) => {
    setEditingCategory({ ...category, type });
    setEditCategoryName(category.name);
  };
  const saveEdit = async () => {
    if (!editCategoryName.trim() || !editingCategory) {
      setNotification({ message: 'Пожалуйста, введите название категории', type: 'error' });
      return;
    }
    try {
      const res = await axios.put(`${API_URL}/categories/${editingCategory.id}`, {
        id: editingCategory.id,
        name: editCategoryName.trim(),
        type: editingCategory.type
      });
      if (editingCategory.type === 'income') {
        setIncomeCategories(incomeCategories.map(cat => cat.id === editingCategory.id ? { ...cat, name: editCategoryName.trim() } : cat));
      } else {
        setExpenseCategories(expenseCategories.map(cat => cat.id === editingCategory.id ? { ...cat, name: editCategoryName.trim() } : cat));
        if (selectedCategory === editingCategory.name) setSelectedCategory(editCategoryName.trim());
      }
      setNotification({ message: 'Изменения сохранены!', type: 'success' });
    } catch (e) {
      setNotification({ message: 'Ошибка сохранения изменений', type: 'error' });
    }
    setEditingCategory(null);
  };
  const cancelEdit = () => setEditingCategory(null);

  // График (оставлен без изменений, но данные можно подтянуть из backend при необходимости)
  useEffect(() => {
    if (categoryChartRef.current) {
      if (categoryChartInstance.current) categoryChartInstance.current.destroy();

      const monthly = {};
      categoryOperations.forEach(op => {
        const date = new Date(op.date);
        const month = date.toLocaleString('ru-RU', { month: 'short', year: '2-digit' });
        if (!monthly[month]) monthly[month] = 0;
        monthly[month] += Math.abs(op.amount);
      });

      const labels = Object.keys(monthly);
      const data = Object.values(monthly);

      const ctx = categoryChartRef.current.getContext('2d');
      categoryChartInstance.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels,
          datasets: [{
            label: selectedCategory,
            data,
            backgroundColor: '#5b248f',
          }]
        },
        options: {
          responsive: true,
          plugins: { legend: { display: false } },
          scales: { x: { ticks: { color: 'white' } }, y: { ticks: { color: 'white' } } }
        }
      });
    }
    return () => { if (categoryChartInstance.current) categoryChartInstance.current.destroy(); };
  }, [selectedCategory, categoryOperations]);

  useEffect(() => {
    if (!selectedCategory) return;
    const fetchCategoryOperations = async () => {
      try {
        const res = await axios.get(`${API_URL}/operations`);
        const filtered = res.data.filter(op =>
          (op.category?.name || op.category) === selectedCategory
        );
        setCategoryOperations(filtered);
      } catch (e) {
        setCategoryOperations([]);
      }
    };
    fetchCategoryOperations();
  }, [selectedCategory]);

  const total = categoryOperations.reduce((sum, op) => sum + Math.abs(op.amount), 0);

  const months = new Set();
  categoryOperations.forEach(op => {
    const date = new Date(op.date);
    const month = date.getMonth();
    const year = date.getFullYear();
    months.add(`${year}-${month}`);
  });
  const avgPerMonth = months.size > 0 ? total / months.size : 0;

  const [allOperations, setAllOperations] = useState([]);
  useEffect(() => {
    axios.get(`${API_URL}/operations`).then(res => setAllOperations(res.data));
  }, []);
  const totalAllExpenses = allOperations
    .filter(op => op.category?.type === 'expense' || op.category === 'expense')
    .reduce((sum, op) => sum + Math.abs(op.amount), 0);

  const percent = totalAllExpenses > 0 ? (total / totalAllExpenses) * 100 : 0;

  if (loading) return <div className="main-content"><div className="loading">Загрузка...</div></div>;

  return (
    <div className="main-content-container">
      {notification && (<Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />)}
      <ConfirmationModal isOpen={showConfirmModal} onClose={() => setShowConfirmModal(false)} onConfirm={confirmDelete} message="Вы уверены, что хотите удалить эту категорию?" />
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="dashboard-title">Управление категориями</h2>
      </div>
      <div className="card mb-4">
        <div className="card-header"><h5 className="card-title">Добавить новую категорию</h5></div>
        <div className="card-body">
          <div className="row g-3 align-items-center">
            <div className="col-md-5">
              <input type="text" className="form-control" placeholder="Название категории" value={newCategoryName} onChange={e => setNewCategoryName(e.target.value)} />
            </div>
            <div className="col-md-3">
              <select className="form-select" value={newCategoryType} onChange={e => setNewCategoryType(e.target.value)}>
                <option value="income">Доход</option>
                <option value="expense">Расход</option>
              </select>
            </div>
            <div className="col-md-2">
              <button className="btn btn-success w-100" onClick={handleAddCategory}>Добавить</button>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-6">
          <div className="card mb-4">
            <div className="card-header"><h5 className="card-title">Статистика по категории</h5></div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label">Выберите категорию</label>
                <select className="form-select" value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
                  {expenseCategories.map(category => (
                    <option key={category.id} value={category.name}>{category.name}</option>
                  ))}
                </select>
              </div>
              <div className="alert alert-info mb-3">
                <strong>{selectedCategory}</strong><br />
                Всего расходов: {total.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' })}<br />
                Средний расход: {avgPerMonth.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' })} в месяц<br />
                Процент от общих расходов: {percent.toFixed(2)}%
              </div>
              <div style={{ height: '100%' }}>
                <canvas ref={categoryChartRef} style={{ display: 'block', width: '100% !important', height: '100% !important' }} />
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="card mb-4 d-block d-lg-none">
            <div className="card-header"><h5 className="card-title">Категории доходов</h5></div>
            <div className="card-body p-0">
              <div className="list-group list-group-flush">
                {incomeCategories.map(category => (
                  <div key={category.id} className="list-group-item">
                    {editingCategory?.id === category.id && editingCategory?.type === 'income' ? (
                      <div className="d-grid gap-2">
                        <input type="text" className="form-control form-control-sm mb-2" value={editCategoryName} onChange={e => setEditCategoryName(e.target.value)} />
                        <div className="d-flex gap-2">
                          <button className="btn btn-sm btn-success flex-grow-1" onClick={saveEdit}>Сохранить</button>
                          <button className="btn btn-sm btn-danger flex-grow-1" onClick={cancelEdit}>Отмена</button>
                        </div>
                      </div>
                    ) : (
                      <div className="d-flex justify-content-between align-items-center">
                        <h6 className="mb-0">{category.name}</h6>
                        <div className="d-flex gap-2">
                          <button className="btn btn-sm" onClick={() => startEditing(category, 'income')}>Изменить</button>
                          <button className="btn btn-sm" onClick={() => handleDeleteCategory(category.id, 'income')}>Удалить</button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="card d-block d-lg-none">
            <div className="card-header"><h5 className="card-title">Категории расходов</h5></div>
            <div className="card-body p-0">
              <div className="list-group list-group-flush">
                {expenseCategories.map(category => (
                  <div key={category.id} className="list-group-item">
                    {editingCategory?.id === category.id && editingCategory?.type === 'expense' ? (
                      <div className="d-grid gap-2">
                        <input type="text" className="form-control form-control-sm mb-2" value={editCategoryName} onChange={e => setEditCategoryName(e.target.value)} />
                        <div className="d-flex gap-2">
                          <button className="btn btn-sm btn-success flex-grow-1" onClick={saveEdit}>Сохранить</button>
                          <button className="btn btn-sm btn-danger flex-grow-1" onClick={cancelEdit}>Отмена</button>
                        </div>
                      </div>
                    ) : (
                      <div className="d-flex justify-content-between align-items-center">
                        <h6 className="mb-0">{category.name}</h6>
                        <div className="d-flex gap-2">
                          <button className="btn btn-sm" onClick={() => startEditing(category, 'expense')}>Изменить</button>
                          <button className="btn btn-sm" onClick={() => handleDeleteCategory(category.id, 'expense')}>Удалить</button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="card mb-4 d-none d-lg-block">
            <div className="card-header"><h5 className="card-title">Категории доходов</h5></div>
            <div className="card-body">
              <div className="list-group">
                {incomeCategories.map(category => (
                  <div key={category.id} className="list-group-item d-flex justify-content-between align-items-center">
                    {editingCategory?.id === category.id && editingCategory?.type === 'income' ? (
                      <div className="d-flex w-100 align-items-center">
                        <input type="text" className="form-control form-control-sm me-2" value={editCategoryName} onChange={e => setEditCategoryName(e.target.value)} />
                        <button className="btn btn-sm btn-success me-1" onClick={saveEdit}>✓</button>
                        <button className="btn btn-sm btn-danger" onClick={cancelEdit}>✕</button>
                      </div>
                    ) : (
                      <>{category.name}<div><button className="btn btn-sm btn-outline-primary me-1" onClick={() => startEditing(category, 'income')}>Изменить</button><button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteCategory(category.id, 'income')}>Удалить</button></div></> )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="card d-none d-lg-block">
            <div className="card-header"><h5 className="card-title">Категории расходов</h5></div>
            <div className="card-body">
              <div className="list-group">
                {expenseCategories.map(category => (
                  <div key={category.id} className="list-group-item d-flex justify-content-between align-items-center">
                    {editingCategory?.id === category.id && editingCategory?.type === 'expense' ? (
                      <div className="d-flex w-100 align-items-center">
                        <input type="text" className="form-control form-control-sm me-2" value={editCategoryName} onChange={e => setEditCategoryName(e.target.value)} />
                        <button className="btn btn-sm btn-success me-1" onClick={saveEdit}>✓</button>
                        <button className="btn btn-sm btn-danger" onClick={cancelEdit}>✕</button>
                      </div>
                    ) : (
                      <>{category.name}<div><button className="btn btn-sm btn-outline-primary me-1" onClick={() => startEditing(category, 'expense')}>Изменить</button><button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteCategory(category.id, 'expense')}>Удалить</button></div></> )}
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