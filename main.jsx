import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import axios from 'axios';

// Configure axios globally with the backend URL
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'https://whitewhale-xxs6.onrender.com';
axios.defaults.withCredentials = true; // Always send cookies with requests
console.log('API URL:', import.meta.env.VITE_API_URL || 'https://whitewhale-xxs6.onrender.com');

// Set up auth token from localStorage if it exists
const token = localStorage.getItem('authToken');
if (token) {
  console.log('Found auth token in localStorage, adding to default headers');
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
