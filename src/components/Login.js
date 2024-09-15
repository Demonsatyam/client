import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Add custom styles for the login form

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Check if the user is already logged in
  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      // If the user is already logged in, redirect to the dashboard
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    // Simple validation
    if (!username || !password) {
      setError('Both username and password are required');
      return;
    }

    try {
      // API call to login
      const response = await fetch('http://localhost:8009/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // On successful login, store the tokens and navigate to dashboard
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);
        localStorage.setItem('username', username);

        navigate('/dashboard');
      } else {
        // Handle invalid credentials
        setError(data.message || 'Invalid login credentials');
      }
    } catch (err) {
      // Handle errors such as network issues
      setError('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="login-container">
      <h2>Login Page</h2>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label>User Name</label>
          <input 
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />
        </div>
        {error && <div style={{ color: 'red' }}>{error}</div>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
