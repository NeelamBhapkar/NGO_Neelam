import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom'; 
import { FaSun, FaMoon, FaCloud, FaBars, FaTimes } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';
import NGOImg from '../assets/Logo.png';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false); 
  
  const location = useLocation(); 

  const toggleNav = () => setIsNavOpen(!isNavOpen);
  const closeNav = () => setIsNavOpen(false);

  const handleThemeToggle = () => {
    setIsAnimating(true);
    toggleTheme();
    setTimeout(() => setIsAnimating(false), 500);
  };

  const getThemeIcon = () => {
    if (theme === 'light') return <FaSun size={16} color="#f59e0b" />;
    if (theme === 'grey') return <FaCloud size={16} color="#9ca3af" />;
    return <FaMoon size={16} color="#fbbf24" />;
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <style>
        {`
          @keyframes spin-theme {
            0% { transform: rotate(0deg) scale(1); }
            50% { transform: rotate(180deg) scale(0.8); }
            100% { transform: rotate(360deg) scale(1); }
          }
          .theme-spin-effect {
            animation: spin-theme 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          }
        `}
      </style>

      <nav 
        className="navbar navbar-expand-md sticky-top shadow-sm" 
        style={{ 
          backgroundColor: 'var(--nav-bg)', 
          transition: 'background-color 0.3s ease',
          padding: '0.4rem 3rem',
          minHeight: '60px'
        }}
      >
        <div className="container-fluid p-0">
          
          {/* BRANDING */}
          <Link 
            className="navbar-brand d-flex align-items-center" 
            to="/" 
            onClick={closeNav}
            style={styles.brand}
          >
            <img 
              src={NGOImg} 
              alt="NGO Connect Logo" 
              style={{ height: '32px', marginRight: '8px', objectFit: 'contain' }} 
            />
            <span style={{fontFamily: '"Google Sans", sans-serif'}}>NGO-Connect</span>
          </Link>

          {/* MOBILE TOGGLER */}
          <button 
            className="navbar-toggler border-0 p-0" 
            type="button" 
            onClick={toggleNav}
            aria-expanded={isNavOpen}
            aria-label="Toggle navigation"
            style={{ color: 'var(--text-primary)' }} 
          >
            {isNavOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>

          {/* COLLAPSIBLE CONTENT */}
          <div 
            className={`collapse navbar-collapse ${isNavOpen ? 'show' : ''}`} 
            id="navbarContent"
          >
            {/* LINKS */}
            <ul className="navbar-nav ms-auto mb-2 mb-md-0 gap-md-4 gap-2 text-center pt-3 pt-md-0">
              {['Home', 'Campaigns', 'Our Mission', 'FAQs', 'Contact'].map((item) => {
                const path = item === 'Home' ? '/' : `/${item.toLowerCase().replace(' ', '-')}`;
                const active = isActive(path);

                return (
                  <li className="nav-item" key={item}>
                    <Link 
                      to={path} 
                      className={`nav-link ${active ? 'active' : ''}`} 
                      onClick={closeNav}
                      style={{
                        ...styles.navLink,
                        ...(active ? styles.activeNavLink : {}) 
                      }} 
                    >
                      {item}
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* THEME TOGGLE */}
            <div className="d-flex align-items-center justify-content-center gap-3 mt-3 mt-md-0 ms-md-4">
              <button 
                onClick={handleThemeToggle} 
                className={`btn btn-link text-decoration-none p-0 d-flex align-items-center justify-content-center ${isAnimating ? 'theme-spin-effect' : ''}`}
                style={styles.themeBtn}
                title="Switch Theme"
              >
                {getThemeIcon()}
              </button>
            </div>

          </div>
        </div>
      </nav>
    </>
  );
};

const styles = {
  brand: {
    fontSize: '1.25rem',
    fontWeight: '800',
    color: 'var(--primary)',
    letterSpacing: '-0.5px',
  },
  navLink: {
    color: 'var(--text-secondary)',
    fontWeight: '600',
    fontSize: '0.9rem',
    transition: 'color 0.3s, border-bottom 0.3s',
    borderBottom: '2px solid transparent',
  },
  activeNavLink: {
    color: 'var(--primary)',
    borderBottom: '2px solid var(--primary)',
    fontWeight: '700',
  },
  themeBtn: {
    background: 'var(--nav-bg)',
    border: '1px solid rgba(128, 128, 128, 0.2)',
    cursor: 'pointer',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
  },
};

export default Navbar;