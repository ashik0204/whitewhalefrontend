// API URL configuration using environment variables

// Function to get the API base URL
export const getApiBaseUrl = () => {
  // Use the React environment variable if available
  if (process.env.REACT_APP_BACKEND_URL) {
    return process.env.REACT_APP_BACKEND_URL;
  }
  
  // Use the Vite environment variable if available (fallback)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Fallback logic
  const isLocalhost = window.location.hostname === 'localhost' || 
                      window.location.hostname === '127.0.0.1';
  
  // If local development, API is likely on port 3001
  if (isLocalhost) {
    return 'http://localhost:3001';
  }
  
  // Default production URL
  return 'https://whitewhale-xxs6.onrender.com';
};

// Function to get the URL for an uploaded image
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  
  // If it's already a full URL, use it
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // For paths starting with /uploads/, prepend the API server URL
  if (imagePath.startsWith('/uploads/')) {
    return `${getApiBaseUrl()}${imagePath}`;
  }
  
  // If it's just a filename, assume it's in uploads
  if (!imagePath.includes('/')) {
    return `${getApiBaseUrl()}/uploads/${imagePath}`;
  }
  
  // Default case
  return imagePath;
};
