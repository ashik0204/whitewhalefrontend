import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import whaleLogo from '../assets/white_whaling_logo.jpeg';
import './Header.css';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  return (
    <header className="header">
      <div className="container">
        <nav className="navbar">
          <div className="nav-logo">
            <Link to="/">
              <img src={whaleLogo} className="logo" alt="White Whaling logo" />
            </Link>
          </div>
          <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
            {isHomePage ? (
              <>
                <li><a href="#about" className="nav-link" onClick={closeMenu}>About Us</a></li>
                {/* <li><a href="#features" className="nav-link drop-down" onClick={closeMenu}>Features</a></li> */}
                <li className="nav-link drop-down" onClick={toggleDropdown}>
                  Features
                  {isDropdownOpen && (
                    <div className="mega-dropdown">
                      <div className="mega-column">
                        <h4>Sales Automation</h4>
                        <a href="#features-lead-qualification" className="mega-item">Lead Qualification
                        </a>
                        <a href="#features-cold-outreach" className="mega-item"> Cold Outreach
                        </a>
                      </div>
                      <div className="mega-column">
                        <h4>Marketing Tools</h4>
                        <a href="#features-omnichannel" className="mega-item"> Omnichannel Marketing
                        </a>
                        <a href="#features-customer-care" className="mega-item">Customer Care
                        </a>
                      </div>
                      <div className="mega-column">
                        <h4>Integrations</h4>
                        <a href="#features-crm-integration" className="mega-item">CRM Integration
                        </a>
                      
                        <a href="#features-data-enrichment" className="mega-item">Data Enrichment
                        </a>
                        
                      </div>
                      <div className="mega-promo">
                        <h3>AI-powered automation for B2B sales</h3>
                        <p>Discover how AI can transform your sales process.</p>
                        <a href="#learn" className="learn-more">Learn more →</a>
                      </div>
                    </div>
                  )}
                </li>
                <li><a href="#pricing" className="nav-link" onClick={closeMenu}>Pricing</a></li>
                <li><Link to="/blog" className="nav-link" onClick={closeMenu}>Blog</Link></li>
                <li><a href="#contact" className="nav-link drop-down" onClick={closeMenu}>Contact</a></li>
              </>
            ) : (
              <>
                <li><Link to="/" className="nav-link" onClick={closeMenu}>Home</Link></li>
                <li><Link to="/blog" className="nav-link" onClick={closeMenu}>Blog</Link></li>
                <li><a href="/#contact" className="nav-link" onClick={closeMenu}>Contact</a></li>
              </>
            )}
            <li><Link to="/admin/login" className="nav-link admin-link" onClick={closeMenu}>Admin</Link></li>
          </ul>
          <div className="menu-toggle" onClick={toggleMenu}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </nav>
      </div>
    </header>
  );
}