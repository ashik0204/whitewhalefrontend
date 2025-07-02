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
    
    // Handle external URLs that might be in webflow or amazonaws formats
    if (imagePath.includes('webflow-prod-assets') || 
        imagePath.includes('amazonaws.com') ||
        imagePath.includes('cdn.prod.website')) {
      console.log("ImageUtils: External image URL detected:", imagePath);
      return imagePath; // Return external URLs directly without modification
    }
    
    // Handle relative paths to assets folder
    if (
  imagePath.startsWith('./assets/') || 
  imagePath.startsWith('/assets/') || 
  imagePath.startsWith('assets/') || 
  imagePath.startsWith('../assets/')
) {
  // Normalize to ../assets/whatever
  const assetPath = imagePath.replace(/^(\.\/|\.\.\/|\/)?assets\//, '');
  const normalizedPath = `../assets/${assetPath}`;
  console.log("ImageUtils: Normalized asset path to:", normalizedPath);
  return normalizedPath;
}

    
    // For paths starting with /uploads/ (from the backend)
    if (imagePath.startsWith('/uploads/')) {
      // Always use the full URL with API base for uploads
      const fullUrl = `${apiBaseUrl}${imagePath}`;
      
      // Add debug info
      console.log("ImageUtils: Converting upload path:");
      console.log("- Original path:", imagePath);
      console.log("- API Base URL:", apiBaseUrl);
      console.log("- Full URL:", fullUrl);
      
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
 * Check if an image URL is accessible
 * @param {string} url - The image URL to check
 * @returns {Promise<boolean>} Promise resolving to true if image is accessible
 */
export const checkImageUrl = async (url) => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    console.log(`Image URL ${url} status: ${response.status}`);
    return response.ok;
  } catch (error) {
    console.error(`Failed to check URL ${url}:`, error);
    return false;
  }
};

/**
 * Creates an image onError handler that falls back to a default image
 * @param {string} originalSrc - The original image source that failed
 * @param {string} fallbackImage - Optional fallback image path
 * @returns {Function} An onError handler for img elements
 */
export const handleImageError = (originalSrc, fallbackImage = 'https://via.placeholder.com/400x300?text=Image+Not+Found') => (e) => {
  console.error('Image failed to load:', originalSrc);
  
  // Try to diagnose the issue
  const imageUrl = e.target.src;
  console.error(`Image load failed - URL: ${imageUrl}`);
  
  e.target.onerror = null; // Prevent infinite error loop
  e.target.src = fallbackImage;
};
