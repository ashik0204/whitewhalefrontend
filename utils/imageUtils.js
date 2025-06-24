/**
 * Utility functions for handling image paths
 */

// Get the API base URL from environment variable
export const getApiBaseUrl = () => {
  return import.meta.env.VITE_API_URL || 'https://whitewhale-xxs6.onrender.com';
};

/**
 * Returns the correct URL for an image path
 * @param {string} imagePath - The path to the image
 * @returns {string} The correct URL for the image
 */
export const getCorrectImagePath = (imagePath) => {
  if (!imagePath) {
    // Return a default image if no image path is provided
    return '/src/assets/white_whaling_logo.jpeg';
  }
  
  try {
    // If it's already a full URL, use it
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    // Handle relative paths to assets folder
    if (imagePath.startsWith('./assets/') || imagePath.startsWith('/assets/') || 
        imagePath.startsWith('assets/') || imagePath.startsWith('../assets/')) {
      // Remove any leading ./ or / and ensure it starts with /src/assets/
      const cleanPath = imagePath.replace(/^(\.\/|\/)?assets\//, '');
      return `/src/assets/${cleanPath}`;
    }
    
    // For paths starting with /uploads/ (from the backend)
    if (imagePath.startsWith('/uploads/')) {
      return `${getApiBaseUrl()}${imagePath}`;
    }
    
    // If it looks like just a filename for an upload
    if (!imagePath.includes('/')) {
      return `${getApiBaseUrl()}/uploads/${imagePath}`;
    }
    
    // If we get here and don't know how to handle it, return as-is and log
    console.warn('Unknown image path format:', imagePath);
    return imagePath;
  } catch (error) {
    console.error('Error processing image path:', error);
    return '/src/assets/white_whaling_logo.jpeg'; // Fallback to default
  }
};

/**
 * Creates an image onError handler that falls back to a default image
 * @returns {Function} An onError handler for img elements
 */
export const handleImageError = () => (e) => {
  console.error('Image failed to load:', e.target.src);
  e.target.src = '/src/assets/white_whaling_logo.jpeg'; // Default fallback image
  e.target.onerror = null; // Prevent infinite error loop
};
