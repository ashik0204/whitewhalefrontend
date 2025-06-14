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
        setIsLoading(true);
        // Fix: Use correct API path
        const response = await axios.get('/api/blog?limit=3');
        
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

  // Improved image URL handling function
  const getCorrectImagePath = (imagePath) => {
    if (!imagePath) {
      // Return a default image if no image path is provided
      return '../assets/white_whaling_logo.jpeg';
    }
    
    try {
      // If it's already a full URL, use it
      if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath;
      }
      
      // Handle relative paths
      if (imagePath.startsWith('./') || imagePath.startsWith('../')) {
        // Try to resolve relative path - this might need adjustment based on your project structure
        return new URL(imagePath, window.location.origin).href;
      }
      
      // For paths starting with /uploads/
      if (imagePath.startsWith('/uploads/')) {
        const baseUrl = process.env.NODE_ENV === 'development' 
          ? 'http://localhost:3001'
          : window.location.origin;
        return `${baseUrl}${imagePath}`;
      }
      
      // If it's just a filename without directory structure
      if (!imagePath.includes('/')) {
        const baseUrl = process.env.NODE_ENV === 'development'
          ? 'http://localhost:3001'
          : window.location.origin;
        return `${baseUrl}/uploads/${imagePath}`;
      }
      
      // If it starts with a slash but not /uploads/
      if (imagePath.startsWith('/') && !imagePath.startsWith('/uploads/')) {
        return `${window.location.origin}${imagePath}`;
      }
      
      // Default case - try to use as-is
      return imagePath;
    } catch (error) {
      console.error('Error processing image path:', error);
      return '../assets/white_whaling_logo.jpeg'; // Fallback image
    }
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
              filteredBlogPosts.map(post => (
                <div key={post._id} className="blog-card">
                  <div className="blog-image-container">
                    <img 
                      src={getCorrectImagePath(post.coverImage)}
                      alt={post.title} 
                      className="blog-image"
                      onError={(e) => {
                        console.log("Image failed to load:", post.coverImage);
                        // Try with an absolute import path for the fallback
                        import('../assets/white_whaling_logo.jpeg').then(image => {
                          e.target.src = image.default;
                        }).catch(err => {
                          console.error("Failed to load fallback image:", err);
                          // Last resort - set to empty string or data URI
                          e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='14' text-anchor='middle' dominant-baseline='middle'%3ENo Image%3C/text%3E%3C/svg%3E";
                        });
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