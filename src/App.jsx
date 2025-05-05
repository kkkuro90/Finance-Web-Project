import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import History from './components/History';
import Categories from './components/Categories';
import FinancialOverview from './components/FinancialOverview';
import SharedAccess from './components/SharedAccess';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'history':
        return <History />;
      case 'categories':
        return <Categories />;
      case 'financial':
        return <FinancialOverview />;
      case 'shared':
        return <SharedAccess />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        {renderContent()}
      </div>
    </div>
  );
}

export default App;