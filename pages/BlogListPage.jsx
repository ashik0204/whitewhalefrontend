import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './BlogListPage.css';
import Header from '../components/Header';
import Footer from '../components/Footer';

const BlogListPage = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTag, setActiveTag] = useState('');
  const [allTags, setAllTags] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Fix: Use correct API path
        const apiBaseUrl = import.meta.env.VITE_API_URL || 'https://whitewhale-xxs6.onrender.com';
        const response = await axios.get(`${apiBaseUrl}/api/blog`);
        console.log('API response:', response.data); // Debug log
        
        // Ensure posts is always an array
        const postsArray = Array.isArray(response.data) ? response.data : 
                          (response.data.posts ? response.data.posts : []);
        
        setPosts(postsArray);
        // Extract all unique tags
        const tags = postsArray
          .flatMap(post => post.tags)
          .filter((value, index, self) => self.indexOf(value) === index);
        
        setAllTags(tags);
      } catch (err) {
        setError('Failed to load blog posts');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Filter posts based on search and tags
   const filteredPosts = Array.isArray(posts) ? posts.filter(post => {
    const matchesSearch = post.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTag = activeTag ? post.tags?.includes(activeTag) : true;
    
    return matchesSearch && matchesTag;
  }) : [];

  const handleTagClick = (tag) => {
    setActiveTag(tag === activeTag ? '' : tag);
  };
  filteredPosts.map(post => console.log(`${window.location.origin}${post.coverImage}`))
  if (isLoading) {
    return (
      <>
        <Header />
        <div className="blog-loading">
          <div className="spinner"></div>
          <p>Loading blog posts...</p>
        </div>
        <Footer />
      </>
    );
  }

  // Update the getCorrectImagePath helper function
  const getCorrectImagePath = (imagePath) => {
    if (!imagePath) return null;
    
    // If it's already a full URL, use it
    if (imagePath.startsWith('http')) {
      return imagePath;
    }      // Get the API base URL from environment variable
    const apiBaseUrl = import.meta.env.VITE_API_URL || 'https://whitewhale-xxs6.onrender.com';
    
    // For paths starting with /uploads/
    if (imagePath.startsWith('/uploads/')) {
      return `${apiBaseUrl}${imagePath}`;
    }
    
    // If it's just a filename
    if (!imagePath.includes('/')) {
      return `${apiBaseUrl}/uploads/${imagePath}`;
    }
    
    return imagePath;
  };

  return (
    <>
      <Header />
      <main className="blog-list-container">
        <div className="blog-header">
          <h1>White Whaling Blog</h1>
          <p>Expert perspectives on revenue acceleration, AI-powered sales, and enterprise growth strategies.</p>
          
          <div className="blog-search">
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {allTags.length > 0 && (
            <div className="blog-tags-filter">
              {allTags.map(tag => (
                <button
                  key={tag}
                  className={`blog-tag-filter ${tag === activeTag ? 'active' : ''}`}
                  onClick={() => handleTagClick(tag)}
                >
                  {tag}
                </button>
              ))}
              {activeTag && (
                <button 
                  className="clear-filters"
                  onClick={() => setActiveTag('')}
                >
                  Clear filters
                </button>
              )}
            </div>
          )}
        </div>
        
        {error && <div className="blog-error">{error}</div>}
        
        {filteredPosts.length === 0 ? (
          <div className="no-posts">
            <h2>No posts found</h2>
            <p>Try adjusting your search or filter criteria.</p>
          </div>
        ) : (
          <div className="blog-grid">
            {filteredPosts.map(post => (
              <article key={post._id} className="blog-card">
                <Link to={`/blog/${post.slug}`} className="blog-image-link">
                  <div className="blog-image-container">
                    {post.coverImage ? (
                      <img 
                        src={getCorrectImagePath(post.coverImage)} 
                        alt={post.title || "Blog post image"} 
                        className="blog-image"
                        onError={(e) => {
                          // Prevent infinite loop by only logging once
                          if (!e.target.getAttribute('data-error-logged')) {
                            console.error("Failed to load image:", post.coverImage, "Using URL:", getCorrectImagePath(post.coverImage));
                            e.target.setAttribute('data-error-logged', 'true');
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/800x600?text=Image+Not+Found';
                          }
                        }}
                      />
                    ) : (
                      <div className="default-image">No image available</div>
                    )}
                    <div className="blog-tags">
                      {post.tags && post.tags.map((tag, index) => (
                        <span key={index} className="blog-tag">{tag}</span>
                      ))}
                    </div>
                  </div>
                </Link>
                
                <div className="blog-content">
                  <h2 className="blog-title">
                    <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                  </h2>
                  
                  <div className="blog-meta">
                    <span className="blog-author">
                      By {post.author?.username || 'Unknown Author'}
                    </span>
                    <span className="blog-date">
                      {post.publishedAt ? 
                        new Date(post.publishedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long', 
                          day: 'numeric'
                        }) : 
                        new Date(post.createdAt || Date.now()).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long', 
                          day: 'numeric'
                        })
                      }
                    </span>
                    <span className="blog-read-time">{post.readTime || '5 min read'}</span>
                  </div>
                  
                  <p className="blog-excerpt">{post.excerpt}</p>
                  
                  <Link to={`/blog/${post.slug}`} className="read-more">
                    Read More →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
        
        <div className="blog-newsletter">
          <h3>Subscribe to our newsletter</h3>
          <p>Get the latest insights about sales, marketing, and AI delivered to your inbox.</p>
          <form className="newsletter-form">
            <input type="email" placeholder="Your email address" required />
            <button type="submit">Subscribe</button>
          </form>
          <p className="newsletter-disclaimer">We respect your privacy. No spam, ever.</p>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default BlogListPage;
