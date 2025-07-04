import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { getCorrectImagePath, handleImageError } from '../utils/imageUtils';
import { imageLoaderProps, debugImageUrls } from '../utils/uploadedImageLoader';
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
  
  // Debug post images when they're loaded
  useEffect(() => {
    if (blogPosts.length > 0) {
      console.log('Debugging blog post images...');
      blogPosts.forEach(post => {
        if (post.coverImage) {
          console.log(`Post "${post.title}" image: ${post.coverImage}`);
        }
      });
    }
  }, [blogPosts]);

  const filteredBlogPosts = blogPosts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  // We're now using the imported getCorrectImagePath function from imageUtils.js

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
                    {post.coverImage && (
                      <img 
                        src={getCorrectImagePath(post.coverImage)}
                        alt={post.title} 
                        className="blog-image"
                        onError={(e) => {
                          console.error(`Failed to load image: ${post.coverImage}`);
                          e.target.onerror = null;
                          e.target.src = '/placeholder.jpg';
                        }}
                      />
                    )}
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