import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './BlogDetail.css';
import Header from '../components/Header';
import Footer from '../components/Footer';

const BlogDetail = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const apiBaseUrl = import.meta.env.VITE_API_URL || 'https://whitewhale-xxs6.onrender.com';
        const response = await axios.get(`${apiBaseUrl}/api/blog/${slug}`);
        console.log('Blog post data:', response.data);
        setPost(response.data);
      } catch (err) {
        console.error('Error fetching blog post:', err);
        setError('Failed to load blog post');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });  };
  
  // Enhanced helper to properly format image URLs with debugging
  const getFullImageUrl = (imagePath) => {
    if (!imagePath) {
      console.log("BlogDetail: No image path provided, using placeholder");
      return '/placeholder.jpg';
    }
    
    // Always use the API base URL from environment or fallback
    const apiBaseUrl = import.meta.env.VITE_API_URL || 'https://whitewhale-xxs6.onrender.com';
    console.log("BlogDetail: Using API base URL:", apiBaseUrl);
    
    // If it's already a full URL, use it
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      console.log("BlogDetail: Image is already a full URL:", imagePath);
      return imagePath;
    }
    
    // For paths starting with /uploads/ (from backend)
    if (imagePath.startsWith('/uploads/')) {
      const fullUrl = `${apiBaseUrl}${imagePath}`;
      console.log("BlogDetail: Converted /uploads/ path to full URL:", fullUrl);
      return fullUrl;
    }
    
    // If it's just a filename (likely from backend uploads)
    if (!imagePath.includes('/')) {
      const fullUrl = `${apiBaseUrl}/uploads/${imagePath}`;
      console.log("BlogDetail: Converted filename to full uploads URL:", fullUrl);
      return fullUrl;
    }
    
    // For relative paths that don't start with /uploads/
    if (imagePath.startsWith('/')) {
      const fullUrl = `${apiBaseUrl}${imagePath}`;
      console.log("BlogDetail: Converted relative path to full URL:", fullUrl);
      return fullUrl;
    }
    
    // For all other cases, prepend API base URL to ensure it works
    const fullUrl = `${apiBaseUrl}/${imagePath}`;
    console.log("BlogDetail: Using default full URL construction:", fullUrl);
    return fullUrl;
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="blog-detail-loading">
          <div className="spinner"></div>
          <p>Loading post...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !post) {
    return (
      <>
        <Header />
        <div className="blog-detail-error">
          <h2>Error</h2>
          <p>{error || 'Post not found'}</p>
          <Link to="/blog" className="back-to-blog">Back to Blog</Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="blog-detail-container">
        <div className="blog-detail-header">
          <h1>{post.title}</h1>
          
          <div className="blog-detail-meta">
            <span className="blog-detail-author">
              By {post.author?.username || 'Unknown Author'}
            </span>
            <span className="blog-detail-date">
              {formatDate(post.publishedAt || post.createdAt)}
            </span>
            <span className="blog-detail-time">{post.readTime || '5 min read'}</span>
          </div>
          
          {post.tags && post.tags.length > 0 && (
            <div className="blog-detail-tags">
              {post.tags.map((tag, index) => (
                <span key={index} className="blog-detail-tag">{tag}</span>
              ))}
            </div>
          )}
        </div>
          {post.coverImage && (
          <div className="blog-detail-image">
            <img 
              src={getFullImageUrl(post.coverImage)} 
              alt={post.title}
              className="blog-feature-image"
              onError={(e) => {
                console.error("Failed to load image:", post.coverImage);
                e.target.onerror = null;
                e.target.src = '/placeholder.jpg';
              }}
            />
            <p className="image-debug-info">Image source: {getFullImageUrl(post.coverImage)}</p>
          </div>
        )}
        
        <div className="blog-detail-content" dangerouslySetInnerHTML={{ __html: post.content }} />
        
        <div className="blog-detail-footer">
          <Link to="/blog" className="back-to-blog">← Back to Blog</Link>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default BlogDetail;
