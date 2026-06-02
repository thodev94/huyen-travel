"use client";
import React, { useState, useEffect } from 'react';

interface MobileBottomNavProps {
  onNavigate?: (id: string) => void;
}

const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'about', 'services', 'gallery', 'contact'];
      let currentInfo = { id: 'hero', offset: -1 };
      
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el && window.scrollY >= el.offsetTop - 200) {
          currentInfo = { id: section, offset: el.offsetTop };
        }
      }
      setActiveTab(currentInfo.id);
    };
    
    // Initial active calculate
    handleScroll();
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNav = (id: string) => {
    setActiveTab(id);
    if (onNavigate) {
      onNavigate(id);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, "", `#${id}`);
    }
  };

  return (
    <div className="mobile-bottom-nav">
      
      {/* Home Tab */}
      <div className={`nav-item ${activeTab === 'hero' ? 'active' : ''}`} onClick={() => handleNav('hero')}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
        <span>Home</span>
      </div>

      {/* Guide / About Tab */}
      <div className={`nav-item ${activeTab === 'about' ? 'active' : ''}`} onClick={() => handleNav('about')}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
        <span>Profile</span>
      </div>

      {/* Tours / Services Tab - CENTER HIGHLIGHT */}
      <div className={`nav-item center-action ${activeTab === 'services' ? 'active' : ''}`} onClick={() => handleNav('services')}>
        <div className="center-icon-wrap">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
          </svg>
        </div>
        <span>Tours</span>
      </div>

      {/* Journal Tab */}
      <div className={`nav-item ${activeTab === 'gallery' ? 'active' : ''}`} onClick={() => handleNav('gallery')}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <circle cx="8.5" cy="8.5" r="1.5"></circle>
          <polyline points="21 15 16 10 5 21"></polyline>
        </svg>
        <span>Journal</span>
      </div>

      {/* Contact Tab */}
      <div className={`nav-item ${activeTab === 'contact' ? 'active' : ''}`} onClick={() => handleNav('contact')}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
          <polyline points="22,6 12,13 2,6"></polyline>
        </svg>
        <span>Contact</span>
      </div>

    </div>
  );
};

export default MobileBottomNav;
