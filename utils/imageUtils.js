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
    console.log("ImageUtils: No image path provided, using placeholder");
    return '/placeholder.jpg';
  }
  
  try {
    // Get the API base URL
    const apiBaseUrl = getApiBaseUrl();
    console.log("ImageUtils: Using API base URL:", apiBaseUrl);
    
    // If it's already a full URL, use it
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      console.log("ImageUtils: Image is already a full URL:", imagePath);
      return imagePath;
    }
    
    // Handle relative paths to assets folder
    if (imagePath.startsWith('./assets/') || imagePath.startsWith('/assets/') || 
        imagePath.startsWith('assets/') || imagePath.startsWith('../assets/')) {
      // Extract the filename and use it with the base URL
      const filename = imagePath.split('/').pop();
      const assetUrl = `/assets/${filename}`;
      console.log("ImageUtils: Converted asset path to:", assetUrl);
      return assetUrl;
    }
    
    // For paths starting with /uploads/ (from the backend)
    if (imagePath.startsWith('/uploads/')) {
      const fullUrl = `${apiBaseUrl}${imagePath}`;
      console.log("ImageUtils: Converted /uploads/ path to full URL:", fullUrl);
      return fullUrl;
    }
    
    // If it looks like just a filename for an upload
    if (!imagePath.includes('/')) {
      const fullUrl = `${apiBaseUrl}/uploads/${imagePath}`;
      console.log("ImageUtils: Converted filename to full uploads URL:", fullUrl);
      return fullUrl;
    }
    
    // For relative paths that start with /
    if (imagePath.startsWith('/')) {
      const fullUrl = `${apiBaseUrl}${imagePath}`;
      console.log("ImageUtils: Converted relative path to full URL:", fullUrl);
      return fullUrl;
    }
    
    // If we get here and don't know how to handle it, return as-is and log
    console.warn('ImageUtils: Unknown image path format:', imagePath);
    return imagePath;
  } catch (error) {
    console.error('ImageUtils: Error processing image path:', error);
    return '/placeholder.jpg'; // Fallback to default
  }
};

/**
 * Creates an image onError handler that falls back to a default image
 * @param {string} originalSrc - The original image source that failed
 * @param {string} fallbackImage - Optional fallback image path
 * @returns {Function} An onError handler for img elements
 */
export const handleImageError = (originalSrc, fallbackImage = '/placeholder.jpg') => (e) => {
  console.error('Image failed to load:', originalSrc);
  e.target.onerror = null; // Prevent infinite error loop
  e.target.src = fallbackImage;
};
