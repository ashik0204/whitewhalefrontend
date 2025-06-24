import React, { useState, useEffect } from 'react';

/**
 * A component that helps debug image loading issues
 * @param {Object} props
 * @param {string} props.src - The source URL of the image
 * @param {string} props.alt - The alt text for the image
 * @param {Object} props.style - Additional styles for the image
 * @param {string} props.className - CSS class name for the image
 */
function DebugImage({ src, alt = '', style = {}, className = '', ...rest }) {
  const [imageError, setImageError] = useState(false);
  const [imageSrc, setImageSrc] = useState(src);
  
  useEffect(() => {
    setImageSrc(src);
    setImageError(false);
  }, [src]);

  const handleError = () => {
    console.error(`Image failed to load: ${imageSrc}`);
    setImageError(true);
    // Try a different path format as fallback
    if (src && src.startsWith('/src/')) {
      setImageSrc(src.replace('/src/', '/'));
    } else if (src && !src.startsWith('/')) {
      setImageSrc(`/${src}`);
    } else {
      // Last resort fallback
      setImageSrc('/src/assets/white_whaling_logo.jpeg');
    }
  };

  return (
    <div className="debug-image-container" style={{ position: 'relative' }}>
      <img
        src={imageSrc}
        alt={alt}
        onError={handleError}
        style={style}
        className={className}
        {...rest}
      />
      {imageError && (
        <div className="image-error-overlay" style={{
          position: 'absolute',
          top: '0',
          left: '0',
          background: 'rgba(255, 0, 0, 0.2)',
          color: 'white',
          padding: '2px 5px',
          fontSize: '10px',
          zIndex: '1'
        }}>
          Error loading original image
        </div>
      )}
      {(process.env.NODE_ENV === 'development' || import.meta.env.DEV) && (
        <div className="image-debug-info" style={{
          position: 'absolute',
          bottom: '0',
          right: '0',
          background: 'rgba(0, 0, 0, 0.5)',
          color: 'white',
          padding: '2px 5px',
          fontSize: '10px',
          maxWidth: '100%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
          {imageSrc}
        </div>
      )}
    </div>
  );
}

export default DebugImage;
