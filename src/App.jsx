import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';
import Sidebar from './components/Sidebar';
import MobileSidebar from './components/MobileSidebar/MobileSidebar';
import Dashboard from './components/Dashboard';
import History from './components/History';
import Categories from './components/Categories';
import FinancialOverview from './components/FinancialOverview';
import SharedAccess from './components/SharedAccess';
import FamilyBudget from './components/FamilyBudget';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const location = useLocation();
  const isMobile = useMediaQuery({ maxWidth: 991 });

  // Синхронизация activeTab с URL
  useEffect(() => {
    const path = location.pathname.substring(1); // Убираем первый слэш
    const validTabs = ['dashboard', 'history', 'categories', 'financial', 'shared', 'family-budget'];
    
    if (validTabs.includes(path)) {
      setActiveTab(path);
    } else {
      setActiveTab('dashboard');
      if (location.pathname !== '/dashboard') {
        window.history.replaceState(null, '', '/dashboard');
      }
    }
  }, [location]);

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Рендерим соответствующий сайдбар в зависимости от устройства */}
        {isMobile ? (
          <MobileSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        ) : (
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        )}
        
        {/* Основное содержимое с учетом мобильной версии */}
        <div className={`${isMobile ? 'col-12' : 'col-md-9 col-lg-10'} main-content`}>
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