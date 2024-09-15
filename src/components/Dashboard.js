import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import './Dashboard.css';
import EmployeeList from './EmployeeList';
import CreateEmployee from './CreateEmployee';

function Dashboard() {
  const username = localStorage.getItem('username') || 'Hukum Gupta'; // Default username
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="logo">Logo</div>
        <nav className="dashboard-nav">
          <span onClick={() => navigate('/')}>Home</span>
          <span onClick={() => navigate('/employees')}>Employee List</span>
          <span>{username} - <button onClick={handleLogout} className="logout-button">Logout</button></span>
        </nav>
      </header>
      <aside className="dashboard-sidebar">
        <span className="active" onClick={() => navigate('/create-employee')}>Create Employee</span>
      </aside>
      <main className="dashboard-main">
        <Routes>
          <Route path="/" element={<h1>Welcome to Admin Panel</h1>} />
          <Route path="/employees" element={<EmployeeList />} />
          <Route path="/create-employee" element={<CreateEmployee />} />
        </Routes>
      </main>
    </div>
  );
}

export default Dashboard;
