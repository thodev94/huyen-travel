"use client";
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useWindowSize } from '../hooks/useWindowSize';
import toursData from '../data/tours.json';
import imageMapData from '../data/imageMap.json';

const imageMap: Record<string, string[]> = imageMapData;
const BANNER_IMAGES = [
  "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1583417319070-4a69db38a482?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1534008897995-27a23e859048?q=80&w=600&auto=format&fit=crop"
];

interface NavbarProps {
  onSelectTour: (id: string) => void;
  onNavigate?: (id: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onSelectTour, onNavigate }) => {
  const navRef = useRef<HTMLElement>(null);
  const { width } = useWindowSize();
  const isMobile = width <= 768;
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });

  useEffect(() => {
    const updateCoords = () => {
      if (inputRef.current) {
        const rect = inputRef.current.getBoundingClientRect();
        setCoords({
          top: rect.bottom + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width
        });
      }
    };

    if (showSuggestions) {
      updateCoords();
      window.addEventListener('resize', updateCoords);
      window.addEventListener('scroll', updateCoords);
    }

    return () => {
      window.removeEventListener('resize', updateCoords);
      window.removeEventListener('scroll', updateCoords);
    };
  }, [showSuggestions]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const isOutsideSearch = searchRef.current && !searchRef.current.contains(target);
      const isOutsideSuggestions = suggestionsRef.current && !suggestionsRef.current.contains(target);

      if (isOutsideSearch && isOutsideSuggestions) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchResults = searchQuery.trim() === ''
    ? []
    : toursData.filter(t =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 5);

  useGSAP(() => {
    if (isMobile) return; // skip GSAP animations on mobile
    const tl = gsap.timeline();
    tl.from('.nav-logo-anim', { x: -20, opacity: 0, duration: 0.8, ease: 'power3.out' })
      .from('.nav-link-anim', { y: -10, opacity: 0, duration: 0.5, stagger: 0.05, ease: 'power2.out' }, '-=0.2');
  }, { scope: navRef });

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

  useEffect(() => {
    if (activeSection && typeof window !== 'undefined') {
      if (document.getElementById('hero')) {
        const newHash = `#${activeSection}`;
        if (window.location.hash !== newHash) {
          window.history.replaceState(null, "", newHash);
        }
      }
    }
  }, [activeSection]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const getLinkStyle = (id: string) => ({
    color: activeSection === id
      ? 'var(--color-accent-orange)'
      : 'var(--text-secondary)',
    textDecoration: 'none',
    fontWeight: '700',
    fontSize: '0.85rem',
    letterSpacing: '1px',
    textTransform: 'uppercase' as const,
    transition: 'color 0.3s ease',
    position: 'relative' as const,
    display: 'inline-block',
    paddingBottom: '8px'
  });

  const navLinks = [
    { id: 'hero', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'services', label: 'Tours' },
    { id: 'gallery', label: 'Journal' },
    { id: 'contact', label: 'Contact' }
  ];

  return (
    <nav className="navbar-wrapper" ref={navRef} role="navigation" aria-label="Main Navigation">
      <div
        className={`navbar ${isScrolled ? 'scrolled' : ''}`}
        style={{
          width: '100%',
          height: isMobile ? '50px' : '60px',
          display: 'flex',
          justifyContent: isMobile ? 'space-between' : 'space-between',
          alignItems: 'center',
          background: 'rgba(250, 247, 242, 0.98)',
          gap: 16
        }}
      >
        <a href="#hero" className="logo nav-logo-anim" style={{ textDecoration: 'none' }} onClick={(e) => {
          if (onNavigate) {
            e.preventDefault();
            onNavigate('hero');
          }
        }}>
          <span style={{ fontWeight: '900', color: 'var(--color-accent-orange)', fontSize: '1.2rem', letterSpacing: '2px' }}>WIND</span>
          <span style={{ fontWeight: '900', color: 'var(--color-primary-deep)', fontSize: '1.2rem', letterSpacing: '2px', transition: 'color 0.3s' }}>TOURS.</span>
        </a>


        <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
          {/* Desktop Search - Now on the left */}
          <div ref={searchRef} style={{ position: 'relative', zIndex: 10 }}>
            <input
              ref={inputRef}
              aria-label="Search tours"
              aria-controls="search-suggestions"
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              style={{
                width: '180px',
                padding: '8px 15px 8px 35px',
                borderRadius: '20px',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-pure)',
                color: 'var(--text-primary)',
                fontSize: '0.85rem',
                outline: 'none',
                transition: 'all 0.3s'
              }}
            />
            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '0.9rem', opacity: 0.6 }}>🔍</span>

            {showSuggestions && searchResults.length > 0 && createPortal(
              <div id="search-suggestions" role="listbox" aria-label="Search suggestions" ref={suggestionsRef} className="glass-panel" style={{
                position: 'absolute',
                top: coords.top + 10,
                left: !isMobile ? coords.left : inputRef?.current ? inputRef?.current?.getBoundingClientRect().left - (320 - coords.width) : coords.left, /* Align right on desktop */
                width: '320px',
                padding: '10px', borderRadius: '15px', boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                zIndex: 20000, background: 'var(--bg-pure)', border: '1px solid var(--border-color)'
              }}>
                {searchResults.map((tour) => {
                  const folder = (tour as any).folder as keyof typeof imageMap;
                  const folderImages = imageMap[folder] || [];
                  const thumb = folderImages.length > 0 ? folderImages[0] : BANNER_IMAGES[0];
                  return (
                    <div key={tour.id} role="option" aria-selected={false} onClick={() => { onSelectTour(tour.id); setShowSuggestions(false); setSearchQuery(''); }}
                      style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', borderRadius: '10px', cursor: 'pointer', transition: 'background 0.2s' }}
                      onMouseOver={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.05)'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                      <Image src={thumb} alt={tour.title} width={45} height={45} sizes="45px" quality={60} style={{ objectFit: 'cover', borderRadius: '8px' }} />
                      <div style={{ flex: 1, overflow: 'hidden' }}>
                        <div style={{ fontWeight: '700', fontSize: '0.85rem', color: 'var(--color-primary-deep)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{tour.title}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'capitalize' }}>{tour.category} Tours</div>
                      </div>
                    </div>
                  );
                })}
              </div>,
              document.body
            )}
          </div>

          {/* Nav Links - Now on the right */}
          <div className="nav-links">
            {navLinks.map(link => (
              <a key={link.id} href={`#${link.id}`} className="nav-link-anim" style={getLinkStyle(link.id)} onClick={(e) => {
                if (onNavigate) {
                  e.preventDefault();
                  onNavigate(link.id);
                }
                setActiveSection(link.id);
                if (typeof window !== 'undefined') {
                  window.history.replaceState(null, "", `#${link.id}`);
                }
              }}>
                {link.label}
                {activeSection === link.id && (
                  <span style={{ position: 'absolute', bottom: '-8px', left: 0, width: '100%', height: '3px', borderRadius: '2px', backgroundColor: 'var(--color-accent-orange)' }} />
                )}
              </a>
            ))}
          </div>
        </div>


        <button
          className={`mobile-menu-btn ${isMenuOpen ? 'open' : ''}`}
          onClick={toggleMenu}
          aria-controls="mobile-nav"
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          style={{ display: isMobile ? 'block' : 'none', background: 'transparent', border: 'none', cursor: 'pointer' }}
        >
          <span style={{ background: 'var(--color-primary-deep)' }}></span>
          <span style={{ background: 'var(--color-primary-deep)' }}></span>
          <span style={{ background: 'var(--color-primary-deep)' }}></span>
        </button>
      </div>

      {/* Mobile Navigation */}
      <div
        id="mobile-nav"
        role="dialog"
        aria-label="Mobile Navigation"
        aria-hidden={!isMenuOpen}
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
            <span style={{ fontWeight: '900', color: 'var(--color-accent-orange)', fontSize: '1.2rem', letterSpacing: '2px' }}>WIND</span>
            <span style={{ fontWeight: '900', color: 'var(--color-primary-deep)', fontSize: '1.2rem', letterSpacing: '2px' }}>TOURS.</span>
          </div>
          <button onClick={closeMenu} style={{ background: 'transparent', border: 'none', color: 'var(--color-primary-deep)', fontSize: '2.5rem', cursor: 'pointer', lineHeight: 1 }}>×</button>
        </div>

        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '30px',
          padding: '0 20px'
        }}>
          {/* Mobile Search */}
          <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
            <input
              type="text"
              placeholder="Search tours..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              style={{
                width: '100%',
                padding: '12px 15px 12px 40px',
                borderRadius: '25px',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-main)',
                fontSize: '1rem',
                outline: 'none'
              }}
            />
            <span style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)' }}>🔍</span>

            {showSuggestions && searchResults.length > 0 && (
              <div id="search-suggestions" role="listbox" aria-label="Search suggestions" style={{
                position: 'absolute', top: 'calc(100% + 5px)', left: 0, right: 0,
                background: 'var(--bg-pure)', borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                padding: '10px', zIndex: 1001, border: '1px solid var(--border-color)',
                maxHeight: '200px', overflowY: 'auto'
              }}>
                {searchResults.map((tour) => {
                  const folder = (tour as any).folder as keyof typeof imageMap;
                  const folderImages = imageMap[folder] || [];
                  const thumb = folderImages.length > 0 ? folderImages[0] : BANNER_IMAGES[0];
                  return (
                    <div key={tour.id} role="option" aria-selected={false} onClick={() => { onSelectTour(tour.id); closeMenu(); setShowSuggestions(false); setSearchQuery(''); }}
                      style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', borderRadius: '10px' }}>
                      <Image src={thumb} alt={tour.title} width={40} height={40} sizes="40px" quality={60} style={{ objectFit: 'cover', borderRadius: '8px' }} />
                      <div style={{ flex: 1, overflow: 'hidden' }}>
                        <div style={{ fontWeight: '700', fontSize: '0.8rem', color: 'var(--color-primary-deep)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{tour.title}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {navLinks.map(link => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={(e) => {
                if (onNavigate) {
                  e.preventDefault();
                  onNavigate(link.id);
                }
                setActiveSection(link.id);
                if (typeof window !== 'undefined') {
                  window.history.replaceState(null, "", `#${link.id}`);
                }
                closeMenu();
              }}
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
