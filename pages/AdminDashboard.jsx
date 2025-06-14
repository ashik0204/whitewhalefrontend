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
        // Get current user - Fix: Use correct API path
        const userResponse = await axios.get('/api/auth/me', { withCredentials: true });
        // console.log(userResponse.data.user);
        // console.log("error!")
        setUser(userResponse.data.user);
        // console.log("error?")
        
        if (!userResponse.data.user || !['admin', 'editor'].includes(userResponse.data.user.role)) {
          navigate('/admin/login');
          return;
        }

        // Get posts - Fix: Use correct API path
        const postsResponse = await axios.get('/api/admin/posts', { withCredentials: true });
        setPosts(postsResponse.data);
      } catch (err) {
        setError('Failed to fetch data');
        console.error(err);
        if (err.response?.status === 401) {
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
      navigate('/admin/login');
    } catch (err) {
      setError('Logout failed');
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
