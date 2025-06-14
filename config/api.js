const isDevelopment = import.meta.env.MODE === 'development';

// Define the base URL for API calls
const API_BASE_URL = isDevelopment 
  ? 'http://localhost:3001' // For local development
  : ''; // In production, use relative paths

export { API_BASE_URL };
