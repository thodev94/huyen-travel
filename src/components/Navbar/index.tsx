"use client";
import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { useWindowSize } from '../../hooks/useWindowSize';

interface NavbarProps {
  onSelectTour: (id: string) => void;
  onNavigate?: (id: string) => void;
  selectedTourId?: string | null;
}

const Navbar: React.FC<NavbarProps> = ({ onSelectTour, onNavigate, selectedTourId }) => {
  const navRef = useRef<HTMLElement>(null);
  const { width } = useWindowSize();
  const isMobile = width <= 768;
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);



  useGSAP(() => {
    if (isMobile) return;
    const tl = gsap.timeline();
    tl.from('.nav-logo-anim', { x: -20, opacity: 0, duration: 0.8, ease: 'power3.out' })
      .from('.nav-link-anim', { y: -10, opacity: 0, duration: 0.5, stagger: 0.05, ease: 'power2.out' }, '-=0.2');
  }, { scope: navRef });

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);

    if (selectedTourId) {
      setActiveSection('');
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }

    const sections = ['hero', 'about', 'services', 'gallery', 'contact'];
    const observers = sections.map(id => {
      const el = document.getElementById(id);
      if (!el) return null;

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveSection(id);
          }
        });
      }, { rootMargin: '-30% 0px -30% 0px' });

      observer.observe(el);
      return observer;
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observers.forEach(o => o?.disconnect());
    };
  }, [selectedTourId]);

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
          {mounted && (
            <button
              onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
              className="theme-toggle-btn"
              aria-label="Toggle theme"
            >
              {resolvedTheme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
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
              onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
              className="theme-toggle-btn"
              style={{ marginTop: '20px', width: '50px', height: '50px' }}
              aria-label="Toggle theme"
            >
              {resolvedTheme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
