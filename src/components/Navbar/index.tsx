"use client";
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useTheme } from 'next-themes';
import { Sun, Moon, Search } from 'lucide-react';
import { useWindowSize } from '../../hooks/useWindowSize';
import toursData from '../../data/tours.json';
import imageMapData from '../../data/imageMap.json';

const imageMap: Record<string, string[]> = imageMapData;
const BANNER_IMAGES = [
  "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=600&auto=format&fit=crop"
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
  
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

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
    if (isMobile) return;
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

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const navLinks = [
    { id: 'hero', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'services', label: 'Tours' },
    { id: 'gallery', label: 'Journal' },
    { id: 'contact', label: 'Contact' }
  ];

  return (
    <nav className="navbar-wrapper" ref={navRef} role="navigation" aria-label="Main Navigation">
      <div className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
        <a href="#hero" className="logo nav-logo-anim" onClick={(e) => {
          if (onNavigate) {
            e.preventDefault();
            onNavigate('hero');
          }
        }}>
          <span className="logo-wind">WIND</span>
          <span className="logo-tours">TOURS.</span>
        </a>

        <div className="search-container">
          <div ref={searchRef} className="search-wrapper">
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
              className="search-input"
            />
            <span className="search-icon">
              <Search size={14} />
            </span>

            {showSuggestions && searchResults.length > 0 && createPortal(
              <div id="search-suggestions" role="listbox" aria-label="Search suggestions" ref={suggestionsRef} className="search-suggestions glass-panel" style={{
                top: coords.top + 10,
                left: !isMobile ? coords.left : (inputRef.current ? inputRef.current.getBoundingClientRect().left - (320 - coords.width) : coords.left)
              }}>
                {searchResults.map((tour) => {
                  const folder = (tour as any).folder as keyof typeof imageMap;
                  const folderImages = imageMap[folder] || [];
                  const thumb = folderImages.length > 0 ? folderImages[0] : BANNER_IMAGES[0];
                  return (
                    <div key={tour.id} role="option" aria-selected={false} className="search-suggestion-item" onClick={() => { onSelectTour(tour.id); setShowSuggestions(false); setSearchQuery(''); }}>
                      <Image src={thumb} alt={tour.title} width={45} height={45} sizes="45px" quality={60} className="search-suggestion-thumb" />
                      <div className="search-suggestion-text">
                        <div className="search-suggestion-title">{tour.title}</div>
                        <div className="search-suggestion-cat">{tour.category} Tours</div>
                      </div>
                    </div>
                  );
                })}
              </div>,
              document.body
            )}
          </div>
          
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="theme-toggle-btn"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          )}

          <div className="nav-links">
            {navLinks.map(link => (
              <a key={link.id} href={`#${link.id}`} className={`nav-link-item nav-link-anim ${activeSection === link.id ? 'active' : ''}`} onClick={(e) => {
                if (onNavigate) {
                  e.preventDefault();
                  onNavigate(link.id);
                }
                setActiveSection(link.id);
                window.history.replaceState(window.history.state || {}, "", `#${link.id}`);
              }}>
                {link.label}
                {activeSection === link.id && <span className="nav-link-indicator" />}
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
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      <div
        id="mobile-nav"
        role="dialog"
        aria-label="Mobile Navigation"
        aria-hidden={!isMenuOpen}
        className="mobile-nav-overlay"
        style={{ left: isMenuOpen ? 0 : '-100%' }}
      >
        <div className="mobile-nav-header">
          <div className="logo">
            <span className="logo-wind">WIND</span>
            <span className="logo-tours">TOURS.</span>
          </div>
          <button onClick={closeMenu} className="mobile-nav-close">×</button>
        </div>

        <div className="mobile-nav-content">
          <div className="mobile-search-wrapper">
            <input
              type="text"
              placeholder="Search tours..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              className="mobile-search-input"
            />
            <span className="search-icon" style={{ left: '15px' }}>
              <Search size={16} />
            </span>

            {showSuggestions && searchResults.length > 0 && (
              <div id="search-suggestions" role="listbox" aria-label="Search suggestions" className="mobile-search-suggestions">
                {searchResults.map((tour) => {
                  const folder = (tour as any).folder as keyof typeof imageMap;
                  const folderImages = imageMap[folder] || [];
                  const thumb = folderImages.length > 0 ? folderImages[0] : BANNER_IMAGES[0];
                  return (
                    <div key={tour.id} role="option" aria-selected={false} className="search-suggestion-item" onClick={() => { onSelectTour(tour.id); closeMenu(); setShowSuggestions(false); setSearchQuery(''); }}>
                      <Image src={thumb} alt={tour.title} width={40} height={40} sizes="40px" quality={60} className="search-suggestion-thumb" />
                      <div className="search-suggestion-text">
                        <div className="search-suggestion-title">{tour.title}</div>
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
              className="mobile-nav-link"
              style={{ color: activeSection === link.id ? 'var(--color-accent-orange)' : 'var(--color-primary-deep)' }}
              onClick={(e) => {
                if (onNavigate) {
                  e.preventDefault();
                  onNavigate(link.id);
                }
                setActiveSection(link.id);
                if (typeof window !== 'undefined') {
                  window.history.replaceState(window.history.state || {}, "", `#${link.id}`);
                }
                closeMenu();
              }}
            >
              {link.label}
            </a>
          ))}
          
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="theme-toggle-btn"
              style={{ marginTop: '20px', width: '50px', height: '50px' }}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
