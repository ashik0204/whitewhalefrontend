import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminLogin.css';

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    console.log("Login attempt with:", credentials);
    console.log("API URL being used:", axios.defaults.baseURL);

    try {
      console.log("Sending login request with withCredentials:true...");
      const response = await axios.post('/api/auth/login', credentials, {
        withCredentials: true
      });
      
      console.log("Login response:", response.data);
      
      if (response.data.user) {
        console.log("User authenticated:", response.data.user);
        // Redirect based on role
        if (['admin', 'editor'].includes(response.data.user.role)) {
          console.log("Redirecting to dashboard...");
          navigate('/admin/dashboard');
        } else {
          console.log("User doesn't have admin role:", response.data.user.role);
          setError('You do not have admin access');
        }
      }
    } catch (err) {
      console.error("Login error:", err);
      console.error("Error response:", err.response?.data);
      console.error("Error status:", err.response?.status);
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-form-wrapper">
        <div className="admin-login-header">
          <h1>Admin Login</h1>
          <p>Access the White Whaling admin dashboard</p>
        </div>
        
        {error && <div className="admin-login-error">{error}</div>}
        
        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="admin-login-button"
            disabled={isLoading}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        
        <div className="admin-login-footer">
          <div className="admin-links">
            <a href="/" className="back-link">Back to Website</a>
            <span className="admin-divider">|</span>
            <a href="/admin/register" className="register-link">Register New User</a>
          </div>
          <p className="register-note">Note: Registration requires an invitation token</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
