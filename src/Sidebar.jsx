import { useNavigate } from 'react-router-dom';
const Sidebar = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    navigate(`/${tab}`);
  };

  return (
    <div className="col-md-3 col-lg-2 sidebar">
      <h4 className="text-center mb-4" style={{ color: 'white', fontSize: '210%' }}>Waves</h4>
      <h4 className="text-center mb-4" style={{ color: 'white' }}>Финансовый <br />менеджер</h4>
      
      <ul className="nav flex-column">
        <li className="nav-item">
          <a 
            style={{ fontSize: '130%' }} 
            className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`} 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              handleTabChange('dashboard');
            }}
          >
            <i className="bi bi-speedometer2 me-2"></i> Дашборд
          </a>
        </li>
        <li className="nav-item">
          <a 
            style={{ fontSize: '130%' }} 
            className={`nav-link ${activeTab === 'history' ? 'active' : ''}`} 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              handleTabChange('history');
            }}
          >
            <i className="bi bi-clock-history me-2"></i> История
          </a>
        </li>
          <li className="nav-item">
            <a 
              style={{ fontSize: '130%' }} 
              className={`nav-link ${activeTab === 'categories' ? 'active' : ''}`} 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                handleTabChange('categories');
              }}
            >
              <i className="bi bi-tags me-2"></i> Категории
            </a>
          </li>
          <li className="nav-item">
            <a 
              style={{ fontSize: '130%' }} 
              className={`nav-link ${activeTab === 'financial' ? 'active' : ''}`} 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                handleTabChange('financial');
              }}
            >
              <i className="bi bi-graph-up me-2"></i> Финансовый обзор
            </a>
          </li>
          <li className="nav-item">
            <a 
              style={{ fontSize: '130%' }} 
              className={`nav-link ${activeTab === 'shared' ? 'active' : ''}`} 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                handleTabChange('shared');
              }}
            >
              <i className="bi bi-graph-up me-2"></i> Совместный доступ
            </a>
          </li>   
        </ul>
        
        <div style={{ backgroundColor: '#390668' }} className="mt-4 p-3">
          <h6 style={{ color: 'white', textAlign: 'center', fontSize: '170%' }}>Общий баланс</h6>
          <h3 style={{ color: 'white', textAlign: 'center' }}>25,430.50 ₽</h3>
          <div className="d-flex justify-content-between">
            <p style={{ fontSize: 'larger', textAlign: 'center' }} className="text-success">
              Доход: <span>32,500.00 ₽</span>
            </p>
            <p style={{ fontSize: 'larger', textAlign: 'center' }} className="text-danger">
              Расход: <span>7,069.50 ₽</span>
            </p>
          </div>
        </div>
      </div>
    );
  };
  
  export default Sidebar;