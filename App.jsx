import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import FeaturesSection from './components/FeaturesSection';
import PricingSection from './components/PricingSection';
import BlogSection from './components/BlogSection';
import ContactSection from './components/ContactSection';
import BeliefsSection from './components/BeliefsSection';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import PostEditor from './pages/PostEditor';
import BlogListPage from './pages/BlogListPage';
import BlogDetail from './pages/BlogDetail';
import HomePage from './pages/HomePage';
import AdminRegister from './pages/AdminRegister';
import Debug from './pages/Debug'; // Import the Debug component
import './index.css';

// Add this global style to override dark mode
const globalStyles = {
  app: {
    backgroundColor: '#ffffff',
    color: '#333333',
    minHeight: '100vh',
    width: '100%'
  }
};

function App() {
  return (
    <Router>
      <div className="App" style={globalStyles.app}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/posts/new" element={<PostEditor />} />
          <Route path="/admin/posts/edit/:id" element={<PostEditor />} />
          <Route path="/blog" element={<BlogListPage />} />
          <Route path="/blog/:slug" element={<BlogDetail />} />
          <Route path="/admin/register" element={<AdminRegister />} />
          <Route path="/debug" element={<Debug />} /> {/* Add debug page */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
