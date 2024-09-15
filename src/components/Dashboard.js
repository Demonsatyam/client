import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css'; // Create this file for styling

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
          <span>Home</span>
          <span>Employee List</span>
          <span>{username} - <button onClick={handleLogout} className="logout-button">Logout</button></span>
        </nav>
      </header>
      <aside className="dashboard-sidebar">
        <span className="active">Dashboard</span>
      </aside>
      <main className="dashboard-main">
        <h1>Welcome Admin Panel</h1>
      </main>
    </div>
  );
}

export default Dashboard;
