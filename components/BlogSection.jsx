import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './common.css';
import './BlogSection.css';

const BlogSection = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);        // Use the correct API URL with base URL from environment
        const apiBaseUrl = import.meta.env.VITE_API_URL || 'https://whitewhale-xxs6.onrender.com';
        const response = await axios.get(`${apiBaseUrl}/api/blog?limit=3`);
        
        const postsData = response.data.posts || response.data;
        setBlogPosts(postsData);
      } catch (err) {
        console.error('Error fetching blog posts:', err);
        setError('Failed to load blog posts');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const filteredBlogPosts = blogPosts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  // Enhanced image URL handling function with debugging
  const getCorrectImagePath = (imagePath) => {
    if (!imagePath) {
      console.log("No image path provided, using placeholder");
      return '/placeholder.jpg';
    }
    
    // Always use the API base URL from environment or fallback
    const apiBaseUrl = import.meta.env.VITE_API_URL || 'https://whitewhale-xxs6.onrender.com';
    console.log("Using API base URL:", apiBaseUrl);
    
    // If it's already a full URL, use it
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      console.log("Image is already a full URL:", imagePath);
      return imagePath;
    }
    
    // For paths starting with /uploads/ (from backend)
    if (imagePath.startsWith('/uploads/')) {
      const fullUrl = `${apiBaseUrl}${imagePath}`;
      console.log("Converted /uploads/ path to full URL:", fullUrl);
      return fullUrl;
    }
    
    // If it's just a filename (likely from backend uploads)
    if (!imagePath.includes('/')) {
      const fullUrl = `${apiBaseUrl}/uploads/${imagePath}`;
      console.log("Converted filename to full uploads URL:", fullUrl);
      return fullUrl;
    }
    
    // For relative paths that don't start with /uploads/
    if (imagePath.startsWith('/')) {
      const fullUrl = `${apiBaseUrl}${imagePath}`;
      console.log("Converted relative path to full URL:", fullUrl);
      return fullUrl;
    }
    
    // For all other cases, prepend API base URL to ensure it works
    const fullUrl = `${apiBaseUrl}/${imagePath}`;
    console.log("Using default full URL construction:", fullUrl);
    return fullUrl;
  };

  return (
    <section className="section" id="blog">
      <div className="container">
        <h2>Latest Insights</h2>
        <p className="section-intro">Expert perspectives on revenue acceleration, AI-powered sales, and enterprise growth strategies.</p>
        
        <input 
          className="search" 
          id="blog-search" 
          type="text" 
          placeholder="Search" 
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        {isLoading ? (
          <div className="blog-loading">
            <div className="spinner"></div>
            <p>Loading blog posts...</p>
          </div>
        ) : error ? (
          <div className="blog-error">{error}</div>
        ) : (
          <div className="blog-grid">
            {filteredBlogPosts.length > 0 ? (
              filteredBlogPosts.map(post => (                <div key={post._id} className="blog-card">                  
                  <div className="blog-image-container">
                    <img 
                      src={getCorrectImagePath(post.coverImage)}
                      alt={post.title} 
                      className="blog-image"
                      onError={(e) => {
                        console.log("Image failed to load:", post.coverImage);
                        e.target.onerror = null;
                        e.target.src = '/placeholder.jpg';
                      }}
                    />
                    <div className="blog-tags">
                      {post.tags && post.tags.map((tag, index) => (
                        <span key={index} className="blog-tag">{tag}</span>
                      ))}
                    </div>
                  </div>
                  <div className="blog-content">
                    <h3 className="blog-title">{post.title}</h3>
                    <div className="blog-meta">
                      <span className="blog-author">By {post.author?.username || 'Admin'}</span>
                      <span className="blog-date">
                        {new Date(post.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                      <span className="blog-read-time">{post.readTime || '5 min read'}</span>
                    </div>
                    <p className="blog-excerpt">{post.excerpt}</p>
                    <Link to={`/blog/${post.slug}`} className="blog-read-more">
                      Read More →
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-posts">No blog posts found matching your search.</div>
            )}
          </div>
        )}
        
        <div className="blog-cta">
          <h3>Want more insights delivered to your inbox?</h3>
          <div className="newsletter-form">
            <input type="email" placeholder="Your email address" className="newsletter-input" />
            <button className="newsletter-button">Subscribe</button>
          </div>
          <p className="newsletter-disclaimer">We respect your privacy. No spam, ever.</p>
        </div>
        
        <div className="view-all-container">
          <Link to="/blog" className="view-all-link">
            View All Articles →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;