import React, { useState, useEffect } from 'react';
import { useWindowSize } from '../hooks/useWindowSize';
import './Navbar.css';

const Navbar: React.FC = () => {
  const { width } = useWindowSize();
  const isMobile = width < 768;
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);

    const sections = ['hero', 'about', 'services', 'gallery', 'contact'];
    const observers = sections.map(id => {
      const el = document.getElementById(id);
      if (!el) return null;

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.4) {
            setActiveSection(id);
          }
        });
      }, { threshold: [0.1, 0.4, 0.6] });

      observer.observe(el);
      return observer;
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observers.forEach(o => o?.disconnect());
    };
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const getLinkStyle = (id: string) => ({
    color: activeSection === id ? 'var(--color-primary-bright)' : 'var(--text-secondary)',
    textDecoration: 'none',
    fontWeight: '700',
    fontSize: '0.85rem',
    letterSpacing: '1px',
    textTransform: 'uppercase' as const,
    transition: 'color 0.3s ease',
    position: 'relative' as const
  });

  const navLinks = [
    { id: 'hero', label: 'Profile' },
    { id: 'about', label: 'About' },
    { id: 'services', label: 'Tours' },
    { id: 'gallery', label: 'Journal' },
    { id: 'contact', label: 'Contact' }
  ];

  return (
    <nav className="navbar-wrapper">
      <div
        className={`navbar ${isScrolled ? 'scrolled' : ''}`}
        style={{
          width: '100%',
          height: '80px',
          display: 'flex',
          justifyContent: isMobile ? 'space-between' : 'space-between',
          alignItems: 'center',
          gap: 16
        }}
      >
        <a href="#hero" className="logo" style={{ textDecoration: 'none' }}>
          <span style={{ fontWeight: '900', color: 'var(--color-accent-orange)', fontSize: '1.2rem', letterSpacing: '2px' }}>HUYEN</span>
          <span style={{ fontWeight: '900', color: 'var(--color-primary-deep)', fontSize: '1.2rem', letterSpacing: '2px' }}>TOUR.</span>
        </a>

        {!isMobile && (
          <div className="nav-links">
            {navLinks.map(link => (
              <a key={link.id} href={`#${link.id}`} style={getLinkStyle(link.id)}>
                {link.label}
                {activeSection === link.id && (
                  <span style={{ position: 'absolute', bottom: '-8px', left: 0, width: '100%', height: '3px', borderRadius: '2px', backgroundColor: 'var(--color-accent-orange)' }} />
                )}
              </a>
            ))}
          </div>
        )}

        <button 
          className={`mobile-menu-btn ${isMenuOpen ? 'open' : ''}`} 
          onClick={toggleMenu}
          style={{ display: isMobile ? 'block' : 'none', background: 'transparent', border: 'none', cursor: 'pointer' }}
        >
          <span style={{ background: isScrolled ? 'var(--color-primary-deep)' : 'var(--text-primary)' }}></span>
          <span style={{ background: isScrolled ? 'var(--color-primary-deep)' : 'var(--text-primary)' }}></span>
          <span style={{ background: isScrolled ? 'var(--color-primary-deep)' : 'var(--text-primary)' }}></span>
        </button>
      </div>

      {/* Mobile Navigation */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: isMenuOpen ? 0 : '-100%',
          width: '100%',
          height: '100vh',
          zIndex: 999,
          transition: 'left 0.4s cubic-bezier(0.2, 1, 0.3, 1)',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'var(--bg-pure)',
          boxShadow: '10px 0 30px rgba(0,0,0,0.1)'
        }}
      >
        <div style={{ padding: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
          <div>
            <span style={{ fontWeight: '900', color: 'var(--color-accent-orange)', fontSize: '1.2rem', letterSpacing: '2px' }}>HUYEN</span>
            <span style={{ fontWeight: '900', color: 'var(--color-primary-deep)', fontSize: '1.2rem', letterSpacing: '2px' }}>TOUR.</span>
          </div>
          <button onClick={closeMenu} style={{ background: 'transparent', border: 'none', color: 'var(--color-primary-deep)', fontSize: '2.5rem', cursor: 'pointer', lineHeight: 1 }}>×</button>
        </div>
        
        <div style={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center', 
          alignItems: 'center', 
          gap: '30px' 
        }}>
          {navLinks.map(link => (
            <a 
              key={link.id} 
              href={`#${link.id}`} 
              onClick={closeMenu}
              style={{
                textDecoration: 'none',
                fontWeight: '800',
                fontSize: '1.8rem',
                textTransform: 'uppercase',
                letterSpacing: '2px',
                color: activeSection === link.id ? 'var(--color-accent-orange)' : 'var(--color-primary-deep)',
                transition: 'all 0.3s'
              }}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
