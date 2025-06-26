import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getCorrectImagePath, handleImageError } from '../utils/imageUtils';
import { imageLoaderProps, debugImageUrls } from '../utils/uploadedImageLoader';
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
  
  // We're now using the imported getCorrectImagePath function from imageUtils.js

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
            {/* Debug the image URL when component mounts */}
            {useEffect(() => { 
              console.log(`Debugging detail image for post: ${post.title}`); 
              debugImageUrls(post.coverImage);
            }, [post.coverImage])}
            
            <img 
              {...imageLoaderProps(post.coverImage)}
              alt={post.title}
              className="blog-feature-image"
              onError={handleImageError(post.coverImage, '/placeholder.jpg')}
            />
            <p className="image-debug-info">Image source: {getCorrectImagePath(post.coverImage)}</p>
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
