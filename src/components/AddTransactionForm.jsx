import { useState } from 'react';
import { addTransaction } from '../services/transactionService';

const AddTransactionForm = ({ onTransactionAdded }) => {
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    description: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addTransaction({
        ...formData,
        date: new Date().toISOString()
      });
      onTransactionAdded(); // Обновляем данные в родительском компоненте
      setFormData({ amount: '', category: '', description: '' });
    } catch (error) {
      console.error('Ошибка:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="number"
        value={formData.amount}
        onChange={(e) => setFormData({...formData, amount: e.target.value})}
        placeholder="Сумма"
        required
      />
      <input
        type="text"
        value={formData.category}
        onChange={(e) => setFormData({...formData, category: e.target.value})}
        placeholder="Категория"
        required
      />
      <button type="submit">Добавить</button>
    </form>
  );
};