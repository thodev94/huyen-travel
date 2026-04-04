import React, { useState, useEffect } from 'react';
import { useWindowSize } from '../hooks/useWindowSize';

const Navbar: React.FC = () => {
  const { width } = useWindowSize();
  const isMobile = width < 768;
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);

    // Active Section Tracking
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
    color: activeSection === id ? 'var(--accent)' : 'white',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '0.75rem',
    letterSpacing: '2px',
    textTransform: 'uppercase' as const,
    transition: 'color 0.3s ease',
    position: 'relative' as const,
    opacity: activeSection === id ? 1 : 0.7
  });

  const navLinks = [
    { id: 'hero', label: 'Profile' },
    { id: 'about', label: 'About' },
    { id: 'services', label: 'Services' },
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
          backdropFilter: 'blur(20px) saturate(180%)',
          backgroundColor: isScrolled ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.3)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          justifyContent: isMobile ? 'space-between' : 'center',
          alignItems: 'center',
          transition: 'background-color 0.4s ease',
          gap: 16,
          padding: isMobile ? '0 20px' : '0'
        }}
      >
        <div className="logo" style={{ marginRight: isMobile ? '0' : '40px' }}>
          <span style={{ fontWeight: 'bold', color: 'red', fontSize: '1rem', letterSpacing: '2px' }}>HUYEN TOUR.</span>
        </div>

        {!isMobile && (
          <div className="nav-links" style={{ display: 'flex', gap: '30px' }}>
            {navLinks.map(link => (
              <a key={link.id} href={`#${link.id}`} style={getLinkStyle(link.id)}>
                {link.label}
                {activeSection === link.id && (
                  <span style={{ position: 'absolute', bottom: '25px', left: 0, width: '100%', height: '2px', backgroundColor: 'var(--accent)' }} />
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
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Mobile Navigation */}
      <div 
        className={`mobile-nav ${isMenuOpen ? 'open' : ''}`}
        style={{
          position: 'fixed',
          top: 0,
          left: isMenuOpen ? 0 : '-100%',
          width: '100%',
          height: '100vh',
          zIndex: 999,
          transition: 'left 0.6s cubic-bezier(0.2, 1, 0.3, 1)',
          display: 'flex',
          flexDirection: 'column',
          backdropFilter: 'blur(30px) saturate(200%)',
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
        }}
      >
        <div style={{ padding: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <span style={{ fontWeight: 'bold', color: 'red', fontSize: '1rem', letterSpacing: '2px' }}>HUYEN TOUR.</span>
          <button onClick={closeMenu} style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '2rem', cursor: 'pointer' }}>×</button>
        </div>
        
        <div className="mobile-nav-inner" style={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center', 
          alignItems: 'center', 
          gap: '40px' 
        }}>
          {navLinks.map(link => (
            <a 
              key={link.id} 
              href={`#${link.id}`} 
              onClick={closeMenu}
              style={{
                ...getLinkStyle(link.id),
                fontSize: '2rem',
                color: activeSection === link.id ? 'var(--accent)' : 'white',
                opacity: activeSection === link.id ? 1 : 0.5,
                transform: activeSection === link.id ? 'scale(1.1)' : 'scale(1)',
                display: 'flex',
                alignItems: 'center',
                gap: '15px'
              }}
            >
              {activeSection === link.id && (
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent)' }} />
              )}
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
