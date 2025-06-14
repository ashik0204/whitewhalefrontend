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
        const response = await axios.get(`/api/blog/${slug}`);
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
    });
  };

  // Helper to properly format image URLs
  const getFullImageUrl = (imagePath) => {
    if (!imagePath) return null;
    
    // If it's already a full URL, use it
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // For paths starting with /uploads/    // Get the API base URL from environment variable
    const apiBaseUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';
    
    if (imagePath.startsWith('/uploads/')) {
      return `${apiBaseUrl}${imagePath}`;
    }
    
    // If it's just a filename
    if (!imagePath.includes('/')) {
      return `${apiBaseUrl}/uploads/${imagePath}`;
    }
    
    return imagePath;
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
              onError={(e) => {
                if (!e.target.getAttribute("errorlogged")){
                  console.error("Failed to load feature image:", post.coverImage);
                  e.target.setAttribute("errorlogged", "true");
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/1200x600?text=White+Whaling';
                }
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
