import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="layout">
      <header className="header">
        <div className="header-content">
          <h1 className="header-title">Farmer Data Management System</h1>
          <div className="header-actions">
            <span className="user-info">Welcome, {user?.username}</span>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      </header>
      <div className="main-container">
        <nav className="sidebar">
          <ul className="nav-menu">
            <li>
              <Link to="/dashboard" className="nav-link">
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/farmers" className="nav-link">
                Farmers
              </Link>
            </li>
            <li>
              <Link to="/equipment" className="nav-link">
                Equipment
              </Link>
            </li>
            <li>
              <Link to="/home-gardens" className="nav-link">
                Home Gardens
              </Link>
            </li>
            <li>
              <Link to="/csa-agriculture" className="nav-link">
                CSA Agriculture
              </Link>
            </li>
            <li>
              <Link to="/agro-wells" className="nav-link">
                Agro Wells
              </Link>
            </li>
            <li>
              <Link to="/poultry" className="nav-link">
                Poultry Farming
              </Link>
            </li>
          </ul>
        </nav>
        <main className="content">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
