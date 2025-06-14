import axios from 'axios';

// Configure axios with environment variable
const configureAxios = () => {
  axios.defaults.baseURL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';
};

// Export a pre-configured instance of axios
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001'
});

export { configureAxios, axiosInstance };
