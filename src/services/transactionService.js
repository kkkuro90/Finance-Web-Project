import api from './api';

export const addTransaction = async (data) => {
  const response = await api.post('/expenses', data);
  return response.data;
};

export const getLastTransactions = async (count = 5) => {
  const response = await api.get(`/expenses/user/last?count=${count}`);
  return response.data;
};

export const getStatsByCategory = async () => {
  const response = await api.get('/expenses/stats/categories');
  return response.data;
};

export const createFamily = async (familyName) => {
  const response = await api.post('/family/create', { name: familyName });
  return response.data;
};

export const getFamilyBudget = async () => {
  const response = await api.get('/family/budget');
  return response.data;
};