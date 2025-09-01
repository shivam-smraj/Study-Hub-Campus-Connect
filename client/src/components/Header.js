// client/src/components/Header.js
import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Header.css';

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

  const renderAuthLinks = () => {
    if (currentUser) {
      return (
        <>
          <span className="user-name">{currentUser.firstName}</span>
          <a href="http://localhost:5000/api/auth/logout" className="auth-button">Logout</a>
        </>
      );
    } else {
      return (
        <a href="http://localhost:5000/api/auth/google" className="auth-button login">Sign in with Google</a>
      );
    }
  };

   return (
    <header className="app-header">
      <div className="container header-container">
        <Link to="/" className="logo" onClick={() => setIsMenuOpen(false)}>
          Study Hub
        </Link>

        {/* This button toggles the mobile menu */}
        <button className="hamburger" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          &#9776;
        </button>

        {/* --- THIS IS THE MOBILE/TABLET NAVIGATION MENU --- */}
        {/* It's hidden on desktop and slides down on mobile when 'open' */}
        <nav className={`main-nav ${isMenuOpen ? 'open' : ''}`}>
          {currentUser && <NavLink to="/bookmarks" onClick={() => setIsMenuOpen(false)} className="nav-link">My Bookmarks</NavLink>}
          {currentUser && <NavLink to="/collections" onClick={() => setIsMenuOpen(false)} className="nav-link">My Collections</NavLink>}
          <NavLink to="/syllabus" onClick={() => setIsMenuOpen(false)} className="nav-link">Syllabus</NavLink>
          <NavLink to="/question-papers" onClick={() => setIsMenuOpen(false)} className="nav-link">Question Papers</NavLink>
          
          {/* This div is specifically for the login/logout buttons inside the mobile menu */}
          <div className="auth-links-mobile">
            {renderAuthLinks()}
          </div>
        </nav>

        {/* --- THIS IS FOR THE DESKTOP VIEW ONLY --- */}
        {/* It contains only the login/logout buttons and is hidden on mobile */}
        <div className="auth-links-desktop">
          {renderAuthLinks()}
        </div>
      </div>
    </header>
  );

}
export default Header;