import { useEffect, useRef, useState } from 'react';
import { Chart, registerables } from 'chart.js';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import axios from 'axios';

const API_URL = "http://localhost:5001/api";

const Dashboard = () => {
  const categoriesChartRef = useRef(null);
  const expensesChartRef = useRef(null);
  const [activeChart, setActiveChart] = useState('categories');
  const [summary, setSummary] = useState({ balance: 0, income: 0, expense: 0 });
  const [categoryStats, setCategoryStats] = useState([]);
  const [recentOperations, setRecentOperations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const isMobile = useMediaQuery({ maxWidth: 768 });

  Chart.register(...registerables);

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [summaryRes, statsRes, operationsRes] = await Promise.all([
          axios.get(`${API_URL}/dashboard/summary`),
          axios.get(`${API_URL}/dashboard/category-stats`),
          axios.get(`${API_URL}/operations`)
        ]);
        setSummary(summaryRes.data);
        setCategoryStats(statsRes.data);
        setRecentOperations(operationsRes.data.slice(0, 5));
      } catch (error) {
        setError('Ошибка загрузки данных дашборда');
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  useEffect(() => {
    let categoriesChart, expensesChart;
    if (categoriesChartRef.current && activeChart === 'categories') {
      if (categoriesChartRef.current.chart) {
        categoriesChartRef.current.chart.destroy();
      }
      const ctx = categoriesChartRef.current.getContext('2d');
      categoriesChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: categoryStats.map(stat => stat.category),
          datasets: [{
            data: categoryStats.map(stat => Math.abs(stat.total)),
            backgroundColor: [
              '#21013f',
              'blueviolet',
              '#390668',
              '#9e56bf',
              '#9966ff'
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: isMobile ? 'bottom' : 'right',
              labels: {
                color: '#ffffff',
                font: { size: isMobile ? 12 : 14 }
              }
            }
          }
        }
      });
      categoriesChartRef.current.chart = categoriesChart;
    }
    if (expensesChartRef.current && activeChart === 'expenses') {
      if (expensesChartRef.current.chart) {
        expensesChartRef.current.chart.destroy();
      }
      const monthlyData = recentOperations.reduce((acc, op) => {
        const month = new Date(op.date).toLocaleString('ru-RU', { month: 'short' });
        if (!acc[month]) acc[month] = 0;
        acc[month] += Math.abs(op.amount);
        return acc;
      }, {});
      const ctx = expensesChartRef.current.getContext('2d');
      expensesChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: Object.keys(monthlyData),
          datasets: [{
            label: 'Расходы',
            data: Object.values(monthlyData),
            borderColor: '#dc3545',
            backgroundColor: 'rgba(220, 53, 69, 0.1)',
            fill: true,
            tension: 0.3
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: {
              beginAtZero: false,
              ticks: { color: '#ffffff' },
              grid: { color: 'rgba(255, 255, 255, 0.1)' }
            },
            x: {
              ticks: { color: '#ffffff' },
              grid: { color: 'rgba(255, 255, 255, 0.1)' }
            }
          }
        }
      });
      expensesChartRef.current.chart = expensesChart;
    }
    return () => {
      if (categoriesChart) categoriesChart.destroy();
      if (expensesChart) expensesChart.destroy();
    };
  }, [activeChart, isMobile, categoryStats, recentOperations]);

  const handleExport = async () => {
    try {
      const response = await axios.get(`${API_URL}/operations`);
      const data = response.data;
      const csv = [
        ["Дата", "Категория", "Описание", "Сумма"],
        ...data.map(op => [
          new Date(op.date).toLocaleDateString(),
          op.category.name,
          op.description || "",
          op.amount
        ])
      ].map(row => row.join(";"))
        .join("\n");
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = "operations.csv";
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      setError('Ошибка экспорта данных');
    }
  };

  if (loading) return <div className="main-content"><div className="loading">Загрузка...</div></div>;
  if (error) return <div className="main-content"><div className="error">{error}</div></div>;

  return (
    <div className="main-content-container">
      <div id="dashboard-content">
        <div className="dashboard-header">
          <h2 className="dashboard-title">Дашборд</h2>
          <div className="dashboard-switcher">
            <button 
              className={`btn btn-primary${activeChart === 'categories' ? ' active' : ''}`}
              onClick={() => setActiveChart('categories')}
            >
              Категории
            </button>
            <button 
              className={`btn btn-primary${activeChart === 'expenses' ? ' active' : ''}`}
              onClick={() => setActiveChart('expenses')}
            >
              Динамика
            </button>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <div className="card mb-4">
              <div className="card-header">
                <h5 className="card-title">Финансовый обзор</h5>
              </div>
              <div className="card-body">
                <div className="row text-center">
                  <div className="col-4">
                    <h6>Баланс</h6>
                    <p className="mb-0" style={{ color: summary.balance >= 0 ? '#28a745' : '#dc3545' }}>
                      {summary.balance.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' })}
                    </p>
                  </div>
                  <div className="col-4">
                    <h6>Доходы</h6>
                    <p className="mb-0 text-success">
                      {summary.income.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' })}
                    </p>
                  </div>
                  <div className="col-4">
                    <h6>Расходы</h6>
                    <p className="mb-0 text-danger">
                      {summary.expense.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="card mb-4">
              <div className="card-header">
                <h5 className="card-title">Быстрые действия</h5>
              </div>
              <div className="card-body">
                <div className="row g-2">
                  <div className="col-6">
                    <button 
                      className="btn btn-secondary w-100 mb-2"
                      onClick={() => navigate('/history')}
                    >
                      Повторить платеж
                    </button>
                  </div>
                  <div className="col-6">
                    <button 
                      className="btn btn-secondary w-100 mb-2"
                      onClick={() => navigate('/history')}
                    >
                      Добавить доход
                    </button>
                  </div>
                  <div className="col-6">
                    <button 
                      className="btn btn-secondary w-100 mb-2"
                      onClick={() => navigate('/history')}
                    >
                      Добавить расход
                    </button>
                  </div>
                  <div className="col-6">
                    <button 
                      className="btn btn-secondary w-100 mb-2"
                      onClick={handleExport}
                    >
                      Экспорт данных
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="card-title">Последние операции</h5>
                <a 
                  href="#" 
                  className="small text-white"
                  onClick={e => { e.preventDefault(); navigate('/history'); }}
                >
                  Все операции →
                </a>
              </div>
              <div className="card-body">
                <ul className="list-group list-group-flush">
                  {recentOperations.map(op => (
                    <li key={op.id} className="list-group-item d-flex justify-content-between align-items-center bg-dark text-white">
                      <span>
                        <b>{op.category.name}</b> — {op.description || ''} <small className="text-muted">{new Date(op.date).toLocaleDateString()}</small>
                      </span>
                      <span style={{ color: op.amount > 0 ? '#28a745' : '#dc3545' }}>
                        {op.amount > 0 ? '+' : ''}{op.amount.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' })}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card">
              <div className="card-body" style={{ height: '400px' }}>
                <canvas ref={activeChart === 'categories' ? categoriesChartRef : expensesChartRef}></canvas>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;