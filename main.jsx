import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import axios from 'axios';

// Configure axios globally with the backend URL
axios.defaults.baseURL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';
console.log('API URL:', process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001');

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
