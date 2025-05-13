import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import History from './components/History';
import Categories from './components/Categories';
import FinancialOverview from './components/FinancialOverview';
import SharedAccess from './components/SharedAccess';
import FamilyBudget from './components/FamilyBudget';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const location = useLocation();
  const navigate = useNavigate();

  // Синхронизация activeTab с URL
  useEffect(() => {
    const path = location.pathname;
    if (path === '/dashboard') setActiveTab('dashboard');
    else if (path === '/history') setActiveTab('history');
    else if (path === '/categories') setActiveTab('categories');
    else if (path === '/financial') setActiveTab('financial');
    else if (path === '/shared') setActiveTab('shared');
    else if (path === '/family-budget') setActiveTab('family-budget');
  }, [location]);

  return (
    <div className="container-fluid">
      <div className="row">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="col-md-9 col-lg-10 main-content">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/history" element={<History />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/financial" element={<FinancialOverview />} />
            <Route path="/shared" element={<SharedAccess />} />
            <Route path="/family-budget" element={<FamilyBudget />} />
            <Route path="*" element={<Dashboard />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;