"use client";
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useWindowSize } from '../hooks/useWindowSize';
import toursData from '../data/tours.json';
import imageMapData from '../data/imageMap.json';
import './Services.css';

const imageMap: Record<string, string[]> = imageMapData;

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface ServicesProps {
  onSelectTour: (tourId: string) => void;
}

const BANNER_IMAGES = [
  "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1583417319070-4a69db38a482?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1534008897995-27a23e859048?q=80&w=600&auto=format&fit=crop"
];

const Services: React.FC<ServicesProps> = ({ onSelectTour }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const { width } = useWindowSize();
  const isMobile = width <= 768;
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const categories = ['all', ...Array.from(new Set(toursData.map(t => t.category)))];

  const filteredTours = activeCategory === 'all'
    ? toursData
    : toursData.filter(t => t.category === activeCategory);

  const searchResults = searchQuery.trim() === ''
    ? []
    : toursData.filter(t =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 5);

  // Initial entrance for section title and toolbar - runs only once
  useGSAP(() => {
    gsap.fromTo(
      '.services-entry-anim',
      { opacity: 0, y: isMobile ? 20 : 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: isMobile ? 'top 90%' : 'top 80%',
        }
      }
    );
  }, { scope: sectionRef });

  // Animation for tour cards - triggers on scroll AND when filtered
  useGSAP(() => {
    gsap.fromTo(
      '.tour-card-anim',
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.08,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: isMobile ? 'top 90%' : 'top 80%',
        }
      }
    );
  }, { scope: sectionRef, dependencies: [activeCategory] });

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

  return (
    <section id="services" className="services" ref={sectionRef}>
      <div className="services-inner">
        <h2 className="section-title services-entry-anim">Our Tours</h2>

        <div className="services-toolbar services-entry-anim">
          {/* Search Bar */}
          <div ref={searchRef} className="tour-card-anim search-input-wrapper" style={{
            position: 'relative',
            width: '100%',
            maxWidth: isMobile ? '100%' : '400px',
            zIndex: 100
          }}>
            <div style={{ position: 'relative' }}>
              <input
                ref={inputRef}
                type="text"
                className="search-input"
                placeholder="Search tours (e.g. Mekong, Cu Chi...)"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
              />
              <span style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', opacity: 0.5 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </span>
            </div>

            {/* Suggestions Dropdown via Portal */}
            {showSuggestions && searchResults.length > 0 && createPortal(
              <div ref={suggestionsRef} className="glass-panel" style={{
                position: 'absolute',
                top: coords.top + 10,
                left: coords.left,
                width: coords.width,
                padding: '10px',
                borderRadius: '20px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
                zIndex: 10000,
                maxHeight: '400px',
                overflowY: 'auto',
                border: '1px solid rgba(0,0,0,0.05)',
                background: '#FFFFFF'
              }}>
                  {searchResults.map((tour) => {
                  const folder = tour.folder as keyof typeof imageMap;
                  const folderImages = imageMap[folder] || [];
                  const thumb = folderImages.length > 0 ? folderImages[0] : BANNER_IMAGES[0];
                  return (
                    <div
                      key={tour.id}
                      className="search-suggestion-item"
                      onClick={() => {
                        onSelectTour(tour.id);
                        setShowSuggestions(false);
                        setSearchQuery('');
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '10px',
                        borderRadius: '12px',
                        cursor: 'pointer'
                      }}
                    >
                      <Image
                        src={thumb}
                        alt={tour.title}
                        width={50}
                        height={50}
                        sizes="50px"
                        quality={60}
                        style={{ objectFit: 'cover', borderRadius: '10px' }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 'bold', fontSize: '0.85rem', color: 'var(--color-primary-deep)' }}>{tour.title}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'capitalize' }}>{tour.category} Tours</div>
                      </div>
                    </div>
                  );
                })}
              </div>,
              document.body
            )}
          </div>

          {/* Category Menu — Now using CSS classes */}
          <div className="services-categories services-entry-anim">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`category-btn ${activeCategory === cat ? 'active' : ''}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="service-grid">
          {filteredTours.map(s => {
            const folder = (s as any).folder as keyof typeof imageMap;
            const folderImages = imageMap[folder] || [];
            const coverImage = folderImages.length > 0 ? folderImages[0] : BANNER_IMAGES[0];

            return (
              <a
                key={s.id}
                href={`/tours/${s.id}`}
                onClick={(e) => { e.preventDefault(); onSelectTour(s.id); }}
                className="card-container tour-card-anim"
                style={{ cursor: 'pointer', textDecoration: 'none' }}
              >
                <div className="service-card">

                  <div className="service-img-wrapper">
                    <Image
                      src={coverImage}
                      alt={s.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      quality={75}
                      style={{ objectFit: 'cover' }}
                    />
                  </div>

                  <div className="card-content">
                    <div style={{ alignSelf: 'flex-start', marginBottom: '15px' }}>
                      <span className={s.category.toLowerCase() === 'saigon' ? 'tag-badge saigon' : 'tag-badge'}>
                        {s.category}
                      </span>
                    </div>
                    <h3 className="card-title">{s.title}</h3>
                    <p className="card-brief">{s.brief}</p>

                    <div className="card-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      View Experiences
                      <span className="arrow" style={{ display: 'inline-flex', alignItems: 'center' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                          <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;
