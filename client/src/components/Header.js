// client/src/components/Header.js
import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Header.css';
import { 
  StarIcon, CollectionIcon, BookIcon, 
  FileIcon, SearchIcon, UserIcon, 
  LogoutIcon, MenuIcon, CloseIcon 
} from './Icons';

const Header = () => {
  const { currentUser } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const nav = document.querySelector('.main-nav');
      const hamburger = document.querySelector('.hamburger');
      if (isMenuOpen && nav && !nav.contains(event.target) && !hamburger.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMenuOpen]);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  return (
    <header className="app-header">
      <div className="container header-container">
        <Link to="/" className="logo" onClick={() => setIsMenuOpen(false)}>
          Study Hub
        </Link>

        {/* Mobile Menu Toggle */}
        <button className="hamburger" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
          {isMenuOpen ? <CloseIcon className="icon" /> : <MenuIcon className="icon" />}
        </button>

        {/* Navigation Menu */}
        <nav className={`main-nav ${isMenuOpen ? 'open' : ''}`}>
          <div className="nav-links">
            {currentUser && (
              <>
                <NavLink to="/bookmarks" className="nav-link" title="My Bookmarks">
                  <StarIcon className="nav-icon" />
                  <span className="nav-text">Bookmarks</span>
                </NavLink>
                <NavLink to="/collections" className="nav-link" title="My Collections">
                  <CollectionIcon className="nav-icon" />
                  <span className="nav-text">Collections</span>
                </NavLink>
              </>
            )}
            <NavLink to="/syllabus" className="nav-link" title="Syllabus">
              <BookIcon className="nav-icon" />
              <span className="nav-text">Syllabus</span>
            </NavLink>
            <NavLink to="/question-papers" className="nav-link" title="Question Papers">
              <FileIcon className="nav-icon" />
              <span className="nav-text">Papers</span>
            </NavLink>
            <NavLink to="/search" className="nav-link" title="Search">
              <SearchIcon className="nav-icon" />
              <span className="nav-text">Search</span>
            </NavLink>
          </div>

          {/* Auth Section */}
          <div className="auth-section">
            {currentUser ? (
              <>
                <div className="user-profile">
                  <UserIcon className="nav-icon user-icon" />
                  <span className="user-name">{currentUser.firstName}</span>
                </div>
                <a href={`${API_URL}/api/auth/logout`} className="auth-button logout" title="Logout">
                  <LogoutIcon className="nav-icon" />
                  <span className="nav-text-mobile">Logout</span>
                </a>
              </>
            ) : (
              <a href={`${API_URL}/api/auth/google`} className="auth-button login">
                Sign in
              </a>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
