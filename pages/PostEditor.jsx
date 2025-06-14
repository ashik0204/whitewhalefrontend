import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './PostEditor.css';

const PostEditor = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    coverImage: '',
    tags: '',
    readTime: '5 min read',
    status: 'draft'
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [imageFile, setImageFile] = useState(null);

  // Helper function to get the correct image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    
    // If it's already a full URL, use it
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // For paths starting with /uploads/
    if (imagePath.startsWith('/uploads/')) {
      // For localhost development
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return `http://localhost:3001${imagePath}`;
      }
      // For production
      return `${window.location.origin}${imagePath}`;
    }
    
    // If it's just a filename
    if (!imagePath.includes('/')) {
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return `http://localhost:3001/uploads/${imagePath}`;
      }
      return `${window.location.origin}/uploads/${imagePath}`;
    }
    
    return imagePath;
  };

  // Fetch post data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      const fetchPost = async () => {
        setIsLoading(true);
        try {
          console.log(`Fetching post with ID: ${id}`);
          const response = await axios.get(`/api/blog/post/${id}`, { 
            withCredentials: true,
            timeout: 10000
          });
          
          console.log('Post data received:', response.data);
          
          const post = response.data;
          setFormData({
            title: post.title || '',
            excerpt: post.excerpt || '',
            content: post.content || '',
            coverImage: post.coverImage || '',
            tags: Array.isArray(post.tags) ? post.tags.join(', ') : '',
            readTime: post.readTime || '5 min read',
            status: post.status || 'draft'
          });
          
          // Handle preview URL differently based on image path format
          if (post.coverImage) {
            console.log('Original cover image path:', post.coverImage);
            setPreviewUrl(getImageUrl(post.coverImage));
            console.log('Preview URL set to:', getImageUrl(post.coverImage));
          }
        } catch (err) {
          console.error('Error fetching post:', err);
          setError(`Failed to fetch post data: ${err.message}`);
        } finally {
          setIsLoading(false);
        }
      };
      fetchPost();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Store the actual file for later upload
    setImageFile(file);

    // Create a preview URL for the UI
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Helper function to display cleaner image paths
  const formatImagePath = (path) => {
    if (!path) return '';
    
    // For data URLs (base64), show a placeholder text
    if (path.startsWith('data:')) {
      return 'New image selected (unsaved)';
    }
    
    // For URLs, extract just the filename
    try {
      const url = new URL(path);
      const pathParts = url.pathname.split('/');
      return pathParts[pathParts.length - 1]; // Just show the filename
    } catch (e) {
      // For relative paths
      if (path.startsWith('/uploads/')) {
        const pathParts = path.split('/');
        return pathParts[pathParts.length - 1]; // Just show the filename
      }
    }
    
    return path;
  };

  // Ensure uploads are processed correctly and image paths are stored in the right format
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');

    try {
      // Convert tags string to array
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag);

      let imageUrl = formData.coverImage;
      
      // If we have a new image file, upload it first
      if (imageFile) {
        const uploadFormData = new FormData();
        uploadFormData.append('image', imageFile);
        
        console.log('Uploading image file:', imageFile.name, imageFile.size);
        
        try {
          const uploadResponse = await axios.post('/api/upload', uploadFormData, {
            withCredentials: true,
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          
          console.log('Upload response:', uploadResponse.data);
          
          // Make sure we use ONLY the relative path for storage in the database
          // This should be in the format '/uploads/filename.jpg'
          imageUrl = uploadResponse.data.imageUrl;
          
          // Ensure the path starts with "/uploads/"
          if (imageUrl && !imageUrl.startsWith('/uploads/')) {
            if (imageUrl.includes('/uploads/')) {
              imageUrl = '/uploads/' + imageUrl.split('/uploads/')[1];
            } else if (uploadResponse.data.filename) {
              imageUrl = `/uploads/${uploadResponse.data.filename}`;
            }
          }
          
          console.log('Final image URL for storage:', imageUrl);
        } catch (uploadError) {
          console.error('Image upload failed:', uploadError);
          setError(`Image upload failed: ${uploadError.message}`);
          setIsSaving(false);
          return;
        }
      }

      // This is where the updated post data (including the new cover image URL) is sent to the server
      const postData = {
        ...formData,
        coverImage: imageUrl,
        tags: tagsArray
      };

      console.log('Saving post with coverImage path:', imageUrl);

      if (isEditMode) {
        // This is the PUT request that updates the blog post in the database
        await axios.put(`/api/blog/${id}`, postData, { withCredentials: true });
      } else {
        await axios.post('/api/blog', postData, { withCredentials: true });
      }
      
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save post');
      console.error('Error saving post:', err);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="post-editor-loading">
        <div className="spinner"></div>
        <p>Loading post data...</p>
      </div>
    );
  }

  return (
    <div className="post-editor-container">
      <div className="post-editor-header">
        <h1>{isEditMode ? 'Edit Post' : 'Create New Post'}</h1>
        <div className="post-editor-actions">
          <button 
            onClick={() => navigate('/admin/dashboard')}
            className="cancel-button"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            className="save-button"
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Post'}
          </button>
        </div>
      </div>

      {error && <div className="post-editor-error">{error}</div>}

      <form className="post-editor-form">
        <div className="form-group">
          <label htmlFor="title">Post Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Enter post title"
          />
        </div>

        <div className="form-group">
          <label htmlFor="excerpt">Excerpt</label>
          <textarea
            id="excerpt"
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            required
            placeholder="Brief summary of the post"
            rows="3"
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            placeholder="Write your post content here..."
            rows="15"
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="coverImage">Featured Image</label>
          <input
            type="file"
            id="coverImage"
            accept="image/*"
            onChange={handleImageChange}
          />
          {previewUrl && (
            <div className="image-preview">
              <img 
                src={previewUrl} 
                alt="Preview" 
                onError={(e) => {
                  console.error("Image failed to load:", previewUrl);
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Available';
                }}
              />
              {previewUrl && (
                <p className="image-info">
                  <span className="image-filename">{formatImagePath(previewUrl)}</span>
                  {imageFile && <span className="image-size">({(imageFile.size / 1024).toFixed(1)} KB)</span>}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="form-row">
          <div className="form-group half">
            <label htmlFor="tags">Tags</label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="Separate tags with commas"
            />
          </div>

          <div className="form-group half">
            <label htmlFor="readTime">Read Time</label>
            <input
              type="text"
              id="readTime"
              name="readTime"
              value={formData.readTime}
              onChange={handleChange}
              placeholder="e.g. 5 min read"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
      </form>
    </div>
  );
};

export default PostEditor;
