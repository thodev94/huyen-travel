import React, { useState, useEffect } from 'react';
import { GlassElement } from '../GlassElement/GlassElement';
import { useWindowSize } from '../hooks/useWindowSize';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { width, height } = useWindowSize(); // Get both width and height

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar-wrapper">
      <div
        className={`navbar ${isScrolled ? 'scrolled' : ''}`}
        style={{
          width: '100%',
          height: '80px',
          backdropFilter: 'blur(20px) saturate(180%)',
          backgroundColor: isScrolled ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.3)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          transition: 'background-color 0.4s ease',
          gap: 16
        }}
      >
        <div className="logo" >
          <span style={{ fontWeight: 'bold', color: 'red' }}>HUYEN PORTFOLIO.</span>
        </div>

        <div className="nav-links">
          <a href="#hero">Profile</a>
          <a href="#about">About</a>
          <a href="#services">Services</a>
          <a href="#gallery">Journal</a>
          <a href="#contact">Contact</a>
        </div>

        <button className={`mobile-menu-btn ${isMenuOpen ? 'open' : ''}`} onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Mobile Navigation */}
      <div className={`mobile-nav ${isMenuOpen ? 'open' : ''}`}>
        <div className="mobile-nav-inner">
          <a href="#hero" onClick={closeMenu}>Profile</a>
          <a href="#about" onClick={closeMenu}>About</a>
          <a href="#services" onClick={closeMenu}>Services</a>
          <a href="#gallery" onClick={closeMenu}>Journal</a>
          <a href="#contact" onClick={closeMenu}>Contact</a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
