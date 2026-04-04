import React, { useState, useEffect } from 'react';

const Navbar: React.FC = () => {
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
          justifyContent: 'center',
          alignItems: 'center',
          transition: 'background-color 0.4s ease',
          gap: 16
        }}
      >
        <div className="logo" style={{ marginRight: '40px' }}>
          <span style={{ fontWeight: 'bold', color: 'red', fontSize: '1rem', letterSpacing: '2px' }}>HUYEN TOUR.</span>
        </div>

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

        <button className={`mobile-menu-btn ${isMenuOpen ? 'open' : ''}`} onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Mobile Navigation */}
      <div className={`mobile-nav ${isMenuOpen ? 'open' : ''}`}>
        <div className="mobile-nav-inner" style={{ transition: 'background 0.5s ease', background: isMenuOpen ? 'rgba(0,0,0,0.95)' : 'transparent' }}>
          {navLinks.map(link => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={closeMenu}
              style={{
                ...getLinkStyle(link.id),
                fontSize: '1.8rem',
                color: activeSection === link.id ? 'var(--accent)' : 'white',
                opacity: activeSection === link.id ? 1 : 0.6
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
