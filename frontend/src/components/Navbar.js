import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">◆</span>
          <span className="brand-text">InterviewIQ</span>
        </Link>

        {isAuthenticated ? (
          <>
            <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
              <Link 
                to="/dashboard" 
                className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link 
                to="/interview/new" 
                className={`nav-link ${isActive('/interview/new') ? 'active' : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                New Interview
              </Link>
            </div>

            <div className="navbar-user">
              <div className="user-info">
                <span className="user-avatar">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
                <span className="user-name">{user?.name}</span>
              </div>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </div>

            <button 
              className="mobile-menu-btn"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <span className={`hamburger ${menuOpen ? 'open' : ''}`}></span>
            </button>
          </>
        ) : (
          <div className="navbar-auth">
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="btn btn-primary">Get Started</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

