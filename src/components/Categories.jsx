import { useState, useRef, useEffect } from 'react';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

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
  const [selectedCategory, setSelectedCategory] = useState('Продукты');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryType, setNewCategoryType] = useState('expense');
  const [editingCategory, setEditingCategory] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState('');
  
  // Состояния для модальных окон
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [notification, setNotification] = useState(null);

  const categoryChartRef = useRef(null);
  const categoryChartInstance = useRef(null);

  const [incomeCategories, setIncomeCategories] = useState([
    { id: 1, name: 'Зарплата' },
    { id: 2, name: 'Фриланс' },
    { id: 3, name: 'Инвестиции' }
  ]);

  const [expenseCategories, setExpenseCategories] = useState([
    { id: 4, name: 'Продукты' },
    { id: 5, name: 'Транспорт' },
    { id: 6, name: 'Кафе и рестораны' },
    { id: 7, name: 'ЖКХ' },
    { id: 8, name: 'Развлечения' }
  ]);

  // Обработчик добавления новой категории
  const handleAddCategory = () => {
    if (!newCategoryName.trim()) {
      setNotification({
        message: "Пожалуйста, введите название категории",
        type: 'error'
      });
      return;
    }
    
    const newCategory = {
      id: Date.now(),
      name: newCategoryName.trim()
    };

    if (newCategoryType === 'income') {
      setIncomeCategories([...incomeCategories, newCategory]);
    } else {
      setExpenseCategories([...expenseCategories, newCategory]);
    }

    setNewCategoryName('');
    setNotification({
      message: "Категория успешно добавлена!",
      type: 'success'
    });
  };

  // Обработчик удаления категории
  const handleDeleteCategory = (id, type) => {
    setCategoryToDelete({ id, type });
    setShowConfirmModal(true);
  };

  const confirmDelete = () => {
    if (categoryToDelete.type === 'income') {
      setIncomeCategories(incomeCategories.filter(cat => cat.id !== categoryToDelete.id));
    } else {
      setExpenseCategories(expenseCategories.filter(cat => cat.id !== categoryToDelete.id));
    }
    setShowConfirmModal(false);
    setNotification({
      message: "Категория успешно удалена!",
      type: 'success'
    });
  };

  // Начать редактирование категории
  const startEditing = (category, type) => {
    setEditingCategory({ ...category, type });
    setEditCategoryName(category.name);
  };

  // Сохранить изменения категории
  const saveEdit = () => {
    if (!editCategoryName.trim() || !editingCategory) {
      setNotification({
        message: "Пожалуйста, введите название категории",
        type: 'error'
      });
      return;
    }

    const updatedCategory = {
      ...editingCategory,
      name: editCategoryName.trim()
    };

    if (editingCategory.type === 'income') {
      setIncomeCategories(incomeCategories.map(cat => 
        cat.id === updatedCategory.id ? updatedCategory : cat
      ));
    } else {
      setExpenseCategories(expenseCategories.map(cat => 
        cat.id === updatedCategory.id ? updatedCategory : cat
      ));
    }

    setEditingCategory(null);
    setNotification({
      message: "Изменения сохранены!",
      type: 'success'
    });
  };

  // Отменить редактирование
  const cancelEdit = () => {
    setEditingCategory(null);
  };

  // Эффект для графика (оставлен без изменений)
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
        message="Вы уверены, что хотите удалить эту категорию?"
      />

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 style={{ color: 'white', fontSize: '260%' }}>Управление категориями</h2>
      </div>

      {/* Форма добавления новой категории */}
      <div className="card mb-4" style={{ backgroundColor: '#390668' }}>
        <div className="card-header">
          <h5 className="card-title">Добавить новую категорию</h5>
        </div>
        <div className="card-body">
          <div className="row g-3 align-items-center">
            <div className="col-md-5">
              <input
                type="text"
                className="form-control"
                style={{ backgroundColor: '#615e68', color: 'white' }}
                placeholder="Название категории"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <select
                className="form-select"
                style={{ backgroundColor: '#615e68', color: 'white' }}
                value={newCategoryType}
                onChange={(e) => setNewCategoryType(e.target.value)}
              >
                <option value="income">Доход</option>
                <option value="expense">Расход</option>
              </select>
            </div>
            <div className="col-md-2">
              <button
                className="btn btn-success w-100"
                onClick={handleAddCategory}
              >
                Добавить
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {/* График (оставлен без изменений) */}
        <div className="col-lg-6">
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="card-title">Статистика по категории</h5>
            </div>
            <div style={{ backgroundColor: '#390668', minHeight: '600px' }} className="card-body">
              <div className="mb-3">
                <label style={{ color: 'white' }} className="form-label">Выберите категорию</label>
                <select 
                  style={{ backgroundColor: '#615e68', color: 'white' }}
                  className="form-select"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {expenseCategories.map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ backgroundColor: '#5b248f', color: 'white' }} className="alert alert-info mb-3">
                <strong>{selectedCategory}</strong><br />
                Всего расходов: 12,450.00 ₽<br />
                Средний расход: 3,112.50 ₽ в месяц<br />
                Процент от общих расходов: 34%
              </div>
              <div style={{ height: '100%' }}>
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
        </div>

        {/* Категории доходов и расходов - мобильная версия */}
        <div className="col-lg-6">
          {/* Категории доходов */}
          <div className="card mb-4 d-block d-lg-none" style={{ backgroundColor: '#390668' }}>
            <div className="card-header">
              <h5 className="card-title" style={{ color: 'white' }}>Категории доходов</h5>
            </div>
            <div className="card-body p-0">
              <div className="list-group list-group-flush">
                {incomeCategories.map((category) => (
                  <div 
                    key={category.id} 
                    className="list-group-item"
                    style={{ 
                      backgroundColor: '#47444D',
                      borderLeft: '4px solid #2ecc71',
                      color: 'white'
                    }}
                  >
                    {editingCategory?.id === category.id && editingCategory?.type === 'income' ? (
                      <div className="d-grid gap-2">
                        <input
                          type="text"
                          className="form-control form-control-sm mb-2"
                          style={{ backgroundColor: '#615e68', color: 'white' }}
                          value={editCategoryName}
                          onChange={(e) => setEditCategoryName(e.target.value)}
                        />
                        <div className="d-flex gap-2">
                          <button 
                            className="btn btn-sm btn-success flex-grow-1"
                            onClick={saveEdit}
                          >
                            Сохранить
                          </button>
                          <button 
                            className="btn btn-sm btn-danger flex-grow-1"
                            onClick={cancelEdit}
                          >
                            Отмена
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="d-flex justify-content-between align-items-center">
                          <h6 style={{ color: 'white', margin: 0 }}>{category.name}</h6>
                          <div className="d-flex gap-2">
                            <button 
                              className="btn btn-sm"
                              style={{ backgroundColor: '#615e68', color: 'white', fontSize: '75%' }}
                              onClick={() => startEditing(category, 'income')}
                            >
                              Изменить
                              <i className="bi bi-pencil"></i>
                            </button>
                            <button 
                              className="btn btn-sm"
                              style={{ backgroundColor: '#615e68', color: 'white', fontSize: '75%' }}
                              onClick={() => handleDeleteCategory(category.id, 'income')}
                            >
                              Удалить
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Категории расходов */}
          <div className="card d-block d-lg-none" style={{ backgroundColor: '#390668' }}>
            <div className="card-header">
              <h5 className="card-title" style={{ color: 'white' }}>Категории расходов</h5>
            </div>
            <div className="card-body p-0">
              <div className="list-group list-group-flush">
                {expenseCategories.map((category) => (
                  <div 
                    key={category.id} 
                    className="list-group-item"
                    style={{ 
                      backgroundColor: '#47444D',
                      borderLeft: '4px solid #e74c3c',
                      color: 'white'
                    }}
                  >
                    {editingCategory?.id === category.id && editingCategory?.type === 'expense' ? (
                      <div className="d-grid gap-2">
                        <input
                          type="text"
                          className="form-control form-control-sm mb-2"
                          style={{ backgroundColor: '#615e68', color: 'white' }}
                          value={editCategoryName}
                          onChange={(e) => setEditCategoryName(e.target.value)}
                        />
                        <div className="d-flex gap-2">
                          <button 
                            className="btn btn-sm btn-success flex-grow-1"
                            onClick={saveEdit}
                          >
                            Сохранить
                          </button>
                          <button 
                            className="btn btn-sm btn-danger flex-grow-1"
                            onClick={cancelEdit}
                          >
                            Отмена
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="d-flex justify-content-between align-items-center">
                          <h6 style={{ color: 'white', margin: 0 }}>{category.name}</h6>
                          <div className="d-flex gap-2">
                            <button 
                              className="btn btn-sm"
                              style={{ backgroundColor: '#615e68', color: 'white', fontSize: '75%' }}
                              onClick={() => startEditing(category, 'expense')}
                            >
                              Изменить
                              <i className="bi bi-pencil"></i>
                            </button>
                            <button 
                              className="btn btn-sm"
                              style={{ backgroundColor: '#615e68', color: 'white', fontSize: '75%' }}
                              onClick={() => handleDeleteCategory(category.id, 'expense')}
                            >
                              Удалить
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Десктоп версии (остаются как были, но добавляем d-none d-lg-block) */}
          <div className="card mb-4 d-none d-lg-block" style={{ backgroundColor: '#390668' }}>
            <div className="card-header">
              <h5 className="card-title" style={{ color: 'white' }}>Категории доходов</h5>
            </div>
            <div className="card-body">
              <div className="list-group">
                {incomeCategories.map((category) => (
                  <div key={category.id} className="list-group-item d-flex justify-content-between align-items-center" style={{ backgroundColor: '#47444D', color: 'white' }}>
                    {editingCategory?.id === category.id && editingCategory?.type === 'income' ? (
                      <div className="d-flex w-100 align-items-center">
                        <input
                          type="text"
                          className="form-control form-control-sm me-2"
                          style={{ backgroundColor: '#615e68', color: 'white' }}
                          value={editCategoryName}
                          onChange={(e) => setEditCategoryName(e.target.value)}
                        />
                        <button 
                          className="btn btn-sm btn-success me-1"
                          onClick={saveEdit}
                        >
                          ✓
                        </button>
                        <button 
                          className="btn btn-sm btn-danger"
                          onClick={cancelEdit}
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <>
                        {category.name}
                        <div>
                          <button 
                            className="btn btn-sm btn-outline-primary me-1"
                            style={{ backgroundColor: '#615e68', color: 'white' }}
                            onClick={() => startEditing(category, 'income')}
                          >
                            Изменить
                          </button>
                          <button 
                            className="btn btn-sm btn-outline-danger"
                            style={{ backgroundColor: '#615e68', color: 'white' }}
                            onClick={() => handleDeleteCategory(category.id, 'income')}
                          >
                            Удалить
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="card d-none d-lg-block" style={{ backgroundColor: '#390668' }}>
            <div className="card-header">
              <h5 className="card-title" style={{ color: 'white' }}>Категории расходов</h5>
            </div>
            <div className="card-body">
              <div className="list-group">
                {expenseCategories.map((category) => (
                  <div key={category.id} className="list-group-item d-flex justify-content-between align-items-center" style={{ backgroundColor: '#47444D', color: 'white' }}>
                    {editingCategory?.id === category.id && editingCategory?.type === 'expense' ? (
                      <div className="d-flex w-100 align-items-center">
                        <input
                          type="text"
                          className="form-control form-control-sm me-2"
                          style={{ backgroundColor: '#615e68', color: 'white' }}
                          value={editCategoryName}
                          onChange={(e) => setEditCategoryName(e.target.value)}
                        />
                        <button 
                          className="btn btn-sm btn-success me-1"
                          onClick={saveEdit}
                        >
                          ✓
                        </button>
                        <button 
                          className="btn btn-sm btn-danger"
                          onClick={cancelEdit}
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <>
                        {category.name}
                        <div>
                          <button 
                            className="btn btn-sm btn-outline-primary me-1"
                            style={{ backgroundColor: '#615e68', color: 'white' }}
                            onClick={() => startEditing(category, 'expense')}
                          >
                            Изменить
                          </button>
                          <button 
                            className="btn btn-sm btn-outline-danger"
                            style={{ backgroundColor: '#615e68', color: 'white' }}
                            onClick={() => handleDeleteCategory(category.id, 'expense')}
                          >
                            Удалить
                          </button>
                        </div>
                      </>
                    )}
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