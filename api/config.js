// Base URL for API requests
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://your-render-backend-url.onrender.com';

// Helper function for API requests
export const fetchApi = async (endpoint, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  
  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }
  
  return response.json();
};

export default API_BASE_URL;
