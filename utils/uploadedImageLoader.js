/**
 * Advanced utilities for loading uploaded images with fallback strategies
 * This helps solve CORS and image loading issues across different environments
 */

import { getApiBaseUrl } from './imageUtils';

/**
 * Advanced function to get the URL for an uploaded image with multiple fallback strategies
 * @param {string} imagePath - The path to the uploaded image
 * @returns {object} An object with primary and fallback URLs
 */
export const getUploadedImageSources = (imagePath) => {
  if (!imagePath) {
    return { 
      primary: '/placeholder.jpg',
      fallbacks: []
    };
  }
  
  // Normalize the path
  let normalizedPath = imagePath;
  if (!normalizedPath.startsWith('/uploads/') && !normalizedPath.includes('://')) {
    normalizedPath = `/uploads/${normalizedPath.replace(/^\//, '')}`;
  }
  
  // Extract just the filename without path
  const filename = normalizedPath.split('/').pop();
  
  // Get API base URL
  const apiBaseUrl = getApiBaseUrl();
  
  // Generate various URL formats to try
  const sources = {
    primary: `${apiBaseUrl}${normalizedPath}`,
    fallbacks: [
      // Try absolute URL with API base
      `${apiBaseUrl}/uploads/${filename}`,
      // Try relative URL from current domain
      `/uploads/${filename}`,
      // Try direct access to file without path prefix
      `${apiBaseUrl}/${filename}`,
      // Try with different path format
      normalizedPath.startsWith('/') ? `${apiBaseUrl}${normalizedPath}` : `${apiBaseUrl}/${normalizedPath}`
    ]
  };
  
  console.log('Generated image sources:', sources);
  return sources;
};

/**
 * Component prop that handles image loading with fallback strategies
 * Use this in your component: <img {...imageLoaderProps(imagePath)} alt="Description" />
 * 
 * @param {string} imagePath - The path to the uploaded image
 * @returns {object} Props to spread on an img element
 */
export const imageLoaderProps = (imagePath) => {
  const sources = getUploadedImageSources(imagePath);
  
  return {
    src: sources.primary,
    onError: (e) => {
      console.error(`Primary image failed to load: ${sources.primary}`);
      
      // Try fallbacks in sequence
      const tryNextFallback = (index = 0) => {
        if (index >= sources.fallbacks.length) {
          console.error('All fallbacks failed, using placeholder');
          e.target.src = '/placeholder.jpg';
          return;
        }
        
        console.log(`Trying fallback ${index + 1}/${sources.fallbacks.length}: ${sources.fallbacks[index]}`);
        e.target.src = sources.fallbacks[index];
        
        // Set up error handler for this fallback
        e.target.onerror = () => {
          console.error(`Fallback ${index + 1} failed: ${sources.fallbacks[index]}`);
          tryNextFallback(index + 1);
        };
      };
      
      // Start trying fallbacks
      tryNextFallback();
    }
  };
};

/**
 * Debug utility to check all possible image URLs
 * @param {string} imagePath - The path to check
 */
export const debugImageUrls = async (imagePath) => {
  const sources = getUploadedImageSources(imagePath);
  const allUrls = [sources.primary, ...sources.fallbacks];
  
  console.group(`Debug image URLs for: ${imagePath}`);
  
  for (const url of allUrls) {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      console.log(
        `URL: ${url} - Status: ${response.status} ${response.ok ? '✅' : '❌'}`
      );
    } catch (error) {
      console.error(`URL: ${url} - Error: ${error.message}`);
    }
  }
  
  console.groupEnd();
};
