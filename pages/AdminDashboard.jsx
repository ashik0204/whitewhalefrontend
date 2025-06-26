import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('posts');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch user and posts on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Dashboard mounted - checking authentication...");
        console.log("API URL being used:", axios.defaults.baseURL);
        
        // Check for stored token and add to axios headers if it exists
        const storedToken = localStorage.getItem('authToken');
        if (storedToken) {
          console.log("Found stored auth token, adding to headers");
          axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        }
        
        // Check for stored user data first
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          console.log("Using stored user data:", parsedUser);
          setUser(parsedUser);
        }
        
        // Get current user - Fix: Use correct API path
        console.log("Fetching current user...");
        const userResponse = await axios.get('/api/auth/me', { 
          withCredentials: true 
        });
        
        console.log("User response:", userResponse.data);
        setUser(userResponse.data.user);
        
        if (!userResponse.data.user || !['admin', 'editor'].includes(userResponse.data.user.role)) {
          console.log("User not authenticated or not admin/editor:", userResponse.data.user);
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          navigate('/admin/login');
          return;
        }

        console.log("User authenticated successfully:", userResponse.data.user);

        // Get posts - Fix: Use correct API path
        console.log("Fetching posts...");
        const postsResponse = await axios.get('/api/admin/posts', { withCredentials: true });
        console.log("Posts response:", postsResponse.data);
        setPosts(postsResponse.data);
      } catch (err) {
        console.error("Dashboard error:", err);
        console.error("Error response:", err.response?.data);
        console.error("Error status:", err.response?.status);
        setError('Failed to fetch data');
        
        if (err.response?.status === 401) {
          console.log("Unauthorized - redirecting to login");
          navigate('/admin/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      // Fix: Use correct API path
      await axios.post('/api/auth/logout', {}, { withCredentials: true });
      
      // Clear stored authentication data
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      delete axios.defaults.headers.common['Authorization'];
      
      console.log("Logged out successfully, cleared auth data");
      navigate('/admin/login');
    } catch (err) {
      console.error("Logout error:", err);
      // Still clear local storage even if server logout fails
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      delete axios.defaults.headers.common['Authorization'];
      navigate('/admin/login');
      setError('Logout failed on server but cleared local data');
    }
  };

  const handleDeletePost = async (id) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        // Fix: Use correct API path
        await axios.delete(`/api/blog/${id}`, { withCredentials: true });
        setPosts(posts.filter(post => post._id !== id));
      } catch (err) {
        setError('Failed to delete post');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <h2>White Whaling</h2>
        </div>
        <nav className="admin-navigation">
          <ul>
            <li className={activeTab === 'posts' ? 'active' : ''}>
              <button onClick={() => setActiveTab('posts')}>Blog Posts</button>
            </li>
            {user?.role === 'admin' && (
              <li className={activeTab === 'users' ? 'active' : ''}>
                <button onClick={() => setActiveTab('users')}>Users</button>
              </li>
            )}
            <li className={activeTab === 'settings' ? 'active' : ''}>
              <button onClick={() => setActiveTab('settings')}>Settings</button>
            </li>
          </ul>
        </nav>
        <div className="admin-sidebar-footer">
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>
      </aside>

      <main className="admin-content">
        <header className="admin-header">
          <h1>Admin Dashboard</h1>
          <div className="admin-user">
            <span>Logged in as {user?.username}</span>
          </div>
        </header>

        {error && (
          <div className="admin-error">
            {error}
            <button onClick={() => setError('')}>×</button>
          </div>
        )}

        {activeTab === 'posts' && (
          <div className="admin-section">
            <div className="section-header">
              <h2>Blog Posts</h2>
              <Link to="/admin/posts/new" className="new-post-button">
                New Post
              </Link>
            </div>
            
            <div className="post-list">
              <div className="post-list-header">
                <div className="post-title-header">Title</div>
                <div className="post-status-header">Status</div>
                <div className="post-date-header">Last Updated</div>
                <div className="post-actions-header">Actions</div>
              </div>
              
              {posts.length === 0 ? (
                <div className="no-posts">No posts found. Create your first post!</div>
              ) : (
                posts.map(post => (
                  <div key={post._id} className="post-item">
                    <div className="post-title">{post.title}</div>
                    <div className={`post-status ${post.status || 'draft'}`}>
                      {post.status || 'draft'}
                    </div>
                    <div className="post-date">
                      {new Date(post.updatedAt || post.createdAt || Date.now()).toLocaleDateString()}
                    </div>
                    <div className="post-actions">
                      <Link 
                        to={`/admin/posts/edit/${post._id}`} 
                        className="edit-button"
                        title={`Edit post ID: ${post._id}`}
                      >
                        Edit
                      </Link>
                      <button 
                        onClick={() => handleDeletePost(post._id)} 
                        className="delete-button"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'users' && user?.role === 'admin' && (
          <div className="admin-section">
            <h2>User Management</h2>
            <p>This section will allow you to manage users (admin only).</p>
            
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="admin-section">
            <h2>Settings</h2>
            <p>Configure dashboard settings here.</p>
            {/* Settings will be implemented here */}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
