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
      // Try to preserve the original path more faithfully
      let assetUrl;
      if (imagePath.startsWith('/assets/')) {
        assetUrl = imagePath; // Keep it as-is if it already has the right format
      } else {
        const assetPath = imagePath.replace(/^\.\/assets\/|^assets\/|^\.\.\/assets\//, '');
        assetUrl = `/assets/${assetPath}`;
      }
      console.log("ImageUtils: Converted asset path to:", assetUrl);
      return assetUrl;
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
      
      // Make a test request to see if the URL is accessible
      fetch(fullUrl, { method: 'HEAD' })
        .then(response => {
          console.log(`Image URL ${fullUrl} status: ${response.status}`);
        })
        .catch(error => {
          console.error(`Failed to fetch ${fullUrl}:`, error);
        });
      
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
export const handleImageError = (originalSrc, fallbackImage = '/placeholder.jpg') => (e) => {
  console.error('Image failed to load:', originalSrc);
  
  // Get the API base URL for diagnostic
  const apiBaseUrl = getApiBaseUrl();
  
  // Try to diagnose the issue
  const imageUrl = e.target.src;
  console.error(`Image load failed - URL: ${imageUrl}`);
  
  // Check if the server has the image with our debug endpoint
  if (originalSrc.includes('/uploads/') && apiBaseUrl) {
    const filename = originalSrc.split('/').pop();
    const checkUrl = `${apiBaseUrl}/api/debug/image-check?path=${encodeURIComponent(originalSrc)}`;
    
    console.log(`Checking if image exists on server: ${checkUrl}`);
    fetch(checkUrl)
      .then(response => response.json())
      .then(data => console.log('Image check result:', data))
      .catch(error => console.error('Error checking image:', error));
  }
  
  e.target.onerror = null; // Prevent infinite error loop
  e.target.src = fallbackImage;
};
