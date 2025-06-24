import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import axios from 'axios';

// Configure axios globally with the backend URL
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'https://whitewhale-xxs6.onrender.com';
console.log('API URL:', import.meta.env.VITE_API_URL || 'https://whitewhale-xxs6.onrender.com');

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
