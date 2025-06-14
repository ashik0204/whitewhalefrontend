import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import "./AdminRegister.css";

// Configure axios with the correct base URL - add this near the top after imports
axios.defaults.baseURL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';

const AdminRegister = () => {
    const [ credentials, setcredentials ] = useState({
        username: "",
        email: "",
        password: "",
        role: "admin" // Default to admin role
    });
    const [ error, seterror ] = useState('');
    const [ isLoading, setisLoading ] = useState(false);
    const [ inviteToken, setInviteToken ] = useState('');
    const navigate = useNavigate();

    // Extract invite token from URL on component mount
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        if (token) {
            setInviteToken(token);
        } else {
            // No token provided - unauthorized
            seterror('Invalid invitation link');
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setcredentials(prev => ({
            ...prev,
            [name]: value
        }));
    }

    const handlesubmit = async (e) => {
        e.preventDefault();
        seterror('');
        setisLoading(true);
        
        try {
            console.log("Sending registration request with data:", {
                ...credentials, 
                inviteToken
            });
            
            // Send token along with registration data
            const response = await axios.post('/api/auth/admin-register', {
                ...credentials,
                inviteToken
            }, {
                withCredentials: true
            });
            
            if (response.data.user) {
                // Redirect based on role
                if (['admin', 'editor'].includes(response.data.user.role)) {
                    navigate('/admin/dashboard');
                } else {
                    seterror('Registration successful but you do not have admin access');
                }
            }
        } catch (err) {
            console.error("Registration error:", err);
            seterror(err.response?.data?.message || 'Registration failed - Connection error');
        } finally {
            setisLoading(false);
        }
    }

    return(
        <div className="admin-register-container">
            <div className="admin-register-form">
                <div className="admin-register-header">
                    <h1>Admin Register</h1>
                </div>
                
                {error && <div className="error-message">{error}</div>}
                
                <form onSubmit={handlesubmit}>
                    <div className="username-content">
                        <input 
                            type="text" 
                            name="username"
                            value={credentials.username}
                            onChange={handleChange}
                            placeholder="Username" 
                            required
                        />
                    </div>
                    <div className="email-content">
                        <input 
                            type="email" 
                            name="email"
                            value={credentials.email}
                            onChange={handleChange}
                            placeholder="Email" 
                            required
                        />
                    </div>
                    <div className="password-content">
                        <input 
                            type="password" 
                            name="password"
                            value={credentials.password}
                            onChange={handleChange}
                            placeholder="Password" 
                            required
                        />
                    </div>
                    <div className="role-select">
                        <label>Role:</label>
                        <select 
                            name="role" 
                            value={credentials.role}
                            onChange={handleChange}
                        >
                            <option value="admin">Admin</option>
                            <option value="editor">Editor</option>
                        </select>
                    </div>
                    <div className="register-button">
                        <button type="submit" disabled={isLoading || !inviteToken}>
                            {isLoading ? 'Registering...' : 'Register'}
                        </button>
                    </div>
                </form>
                
                <div className="admin-register-footer">
                    <a href="/admin/login" className="login-link">Already have an account? Login</a>
                </div>
            </div>
        </div>
    );
};

export default AdminRegister;