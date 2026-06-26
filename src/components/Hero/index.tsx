"use client";
import React, { useRef, useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Search, Star, Map, X } from 'lucide-react';
import { useWindowSize } from '../../hooks/useWindowSize';
import toursData from '../../data/tours.json';
import imageMapData from '../../data/imageMap.json';
import './Hero.css';

gsap.registerPlugin(useGSAP);

const imageMap: Record<string, string[]> = imageMapData;

interface HeroProps {
  onSelectTour?: (id: string) => void;
}

const FOLDERS = Object.keys(imageMapData);

function getInitialSlots(): [string, string, string] {
  const shuffled = [...FOLDERS].sort(() => Math.random() - 0.5);
  return [shuffled[0] || FOLDERS[0], shuffled[1] || FOLDERS[1], shuffled[2] || FOLDERS[2]];
}

const ALL_CATEGORIES = Array.from(new Set(toursData.map(t => t.category)));

const Hero: React.FC<HeroProps> = ({ onSelectTour }) => {
  const heroRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hubRef = useRef<HTMLDivElement>(null);       // the hub-inner pill
  const searchRef = useRef<HTMLDivElement>(null);
  const categoryRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const { width } = useWindowSize();
  const isMobile = width <= 768;

  const tours = toursData;
  const toursCount = tours.length;

  // Phone card slots
  const [slots, setSlots] = useState<[number, number, number]>(() => {
    return [0, Math.min(1, FOLDERS.length - 1), Math.min(2, FOLDERS.length - 1)];
  });
  const [slotChanging, setSlotChanging] = useState<number | null>(null);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showCategoryDrop, setShowCategoryDrop] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Shuffle slots on the client after mounting to avoid hydration mismatches
    const s = getInitialSlots();
    setSlots([FOLDERS.indexOf(s[0]), FOLDERS.indexOf(s[1]), FOLDERS.indexOf(s[2])]);
  }, []);

  // Search results popup
  const [showPopup, setShowPopup] = useState(false);
  const [popupResults, setPopupResults] = useState<typeof toursData>([]);
  const [popupCoords, setPopupCoords] = useState({ top: 0, left: 0, width: 0 });


  // Compute popup position - document-absolute coords include scrollY.
  const computePopupCoords = useCallback(() => {
    const anchor = isMobile ? searchRef.current : hubRef.current;
    if (!anchor) return null;

    const rect = anchor.getBoundingClientRect();
    const POPUP_MAX_H = 500;
    const GAP = isMobile ? 4 : 10;
    const spaceBelow = window.innerHeight - rect.bottom - GAP;
    const spaceAbove = rect.top - GAP;

    let top: number;
    if (isMobile) {
      top = rect.bottom + window.scrollY + GAP;
    } else if (spaceBelow >= Math.min(POPUP_MAX_H, 280)) {
      top = rect.bottom + window.scrollY + GAP;
    } else if (spaceAbove >= Math.min(POPUP_MAX_H, 280)) {
      top = rect.top + window.scrollY - POPUP_MAX_H - GAP;
    } else {
      top = spaceBelow >= spaceAbove
        ? rect.bottom + window.scrollY + GAP
        : rect.top + window.scrollY - POPUP_MAX_H - GAP;
    }

    const coords = {
      top: Math.max(window.scrollY + 8, top),
      left: rect.left + window.scrollX,
      width: isMobile ? rect.width : Math.max(rect.width, 580),
    };
    setPopupCoords(coords);
    return coords;
  }, [isMobile]);

  // Filter tours based on current query + category
  const getFilteredResults = useCallback(() => {
    const q = searchQuery.trim().toLowerCase();
    const results = toursData.filter(t => {
      const matchQ = !q || t.title.toLowerCase().includes(q) || t.category.toLowerCase().includes(q);
      const matchCat = !selectedCategory || t.category === selectedCategory;
      return matchQ && matchCat;
    });
    return results.length > 0 ? results : toursData;
  }, [searchQuery, selectedCategory]);

  // Open/refresh popup with current results + recomputed position
  const openPopup = useCallback(() => {
    computePopupCoords();
    setPopupResults(getFilteredResults());
    setShowPopup(true);
  }, [computePopupCoords, getFilteredResults]);

  // Handle search button click or Enter key
  const handleSearch = useCallback(() => {
    openPopup();
  }, [openPopup]);

  // Close popup
  const closePopup = useCallback(() => setShowPopup(false), []);

  // Recompute coords on scroll/resize while popup open
  useEffect(() => {
    if (!showPopup) return;
    const update = () => {
      computePopupCoords();
    };
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [showPopup, computePopupCoords]);

  // Refresh results whenever query or category changes while popup is open
  useEffect(() => {
    if (!showPopup) return;
    setPopupResults(getFilteredResults());
  }, [searchQuery, selectedCategory, showPopup, getFilteredResults]);

  // Animate popup in with GSAP (after portal renders into DOM)
  useEffect(() => {
    if (!showPopup) return;
    // rAF ensures the portal DOM is painted before we animate
    const id = requestAnimationFrame(() => {
      if (popupRef.current) {
        gsap.fromTo(popupRef.current,
          { opacity: 0, y: -14, scale: 0.97 },
          { opacity: 1, y: 0, scale: 1, duration: 0.28, ease: 'power3.out' }
        );
      }
    });
    return () => cancelAnimationFrame(id);
  }, [showPopup]);

  // Click outside to close popup & category drop
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const t = e.target as Node;
      if (categoryRef.current && !categoryRef.current.contains(t)) setShowCategoryDrop(false);
      if (popupRef.current && !popupRef.current.contains(t) && hubRef.current && !hubRef.current.contains(t)) {
        setShowPopup(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Video speed
  useEffect(() => {
    if (videoRef.current) videoRef.current.playbackRate = 0.5;
  }, []);

  // Cycle phone card slots every 5 s
  useEffect(() => {
    if (isMobile) return;

    const interval = setInterval(() => {
      const slot = Math.floor(Math.random() * 3) as 0 | 1 | 2;
      setSlotChanging(slot);
      const current = slots[slot];
      let next = current;
      while (next === current && FOLDERS.length > 1) next = Math.floor(Math.random() * FOLDERS.length);
      setTimeout(() => {
        setSlots(prev => { const c = [...prev] as [number, number, number]; c[slot] = next; return c; });
        setSlotChanging(null);
      }, 400);
    }, 5000);
    return () => clearInterval(interval);
  }, [slots, isMobile]);

  // GSAP entrance
  useGSAP(() => {
    if (isMobile) return;

    gsap.fromTo('.hero-anim',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: 'power3.out', delay: 0.2 }
    );
  }, { scope: heroRef, dependencies: [isMobile] });

  // Phone card GSAP
  useGSAP(() => {
    if (!mounted || isMobile || slotChanging === null) return;

    const card = heroRef.current?.querySelector(`.hero-phone-card-${slotChanging}`);
    if (!card) return;

    gsap.to(card, { opacity: 0, scale: 0.95, duration: 0.35, ease: 'power2.in' });
  }, { dependencies: [slotChanging, mounted, isMobile], scope: heroRef });

  useGSAP(() => {
    if (!mounted || isMobile || slotChanging !== null) return;

    const cards = heroRef.current?.querySelectorAll('.hero-phone-card');
    if (!cards?.length) return;

    gsap.fromTo(cards,
      { opacity: 0, scale: 0.96 },
      { opacity: 1, scale: 1, duration: 0.6, stagger: 0.08, ease: 'power2.out' }
    );
  }, { dependencies: [slots, mounted, isMobile], scope: heroRef });

  const handleLoadedMetadata = () => { };
  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const v = e.currentTarget;
    if (v.duration && v.currentTime >= v.duration - 0.25) {
      v.currentTime = 0;
      v.play().catch(() => { });
    }
  };

  const getSlotImage = (idx: number) => {
    const key = FOLDERS[idx];
    const imgs = imageMap[key] || [];
    const url = imgs[0] || "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=600&auto=format&fit=crop";
    const tour = tours.find(t => (t as any).folder === key);
    return { url, title: tour ? tour.title : key };
  };

  const left = getSlotImage(slots[0]);
  const center = getSlotImage(slots[1]);
  const right = getSlotImage(slots[2]);

  // Enter key in input triggers search
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <section id="hero" className="hero" ref={heroRef}>
      <div className="hero-bg" aria-hidden="true">
        {mounted && !isMobile && (
          <video
            ref={videoRef}
            className="hero-bg-video"
            src="/Videos/fyp.mp4"
            autoPlay
            muted
            playsInline
            preload="metadata"
            loop
            onLoadedMetadata={handleLoadedMetadata}
            onTimeUpdate={handleTimeUpdate}
          />
        )}
        <div className="hero-overlay" aria-hidden="true" />
      </div>

      <div className="hero-wrapper">
        {/* TOP ROW */}
        <div className="hero-content">
          {/* LEFT */}
          <div className="hero-text-side">
            <div className="badges hero-anim">
              <span className="tag-hero tag-guide">
                <span className="star-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                </span> LICENSED PROFESSIONAL GUIDE
              </span>
              <span className="tag-hero tag-experience">8+ YEARS EXPERIENCE</span>
            </div>

            <h1 className="hero-main-title hero-anim">
              EXPLORE<br />
              <span className="highlight">AUTHENTIC</span><br />
              VIETNAM
            </h1>

            <p className="hero-sub hero-anim">
              I am <strong>Huyen (Wind)</strong> — a licensed guide with a passion for showing the real side of Ho Chi Minh City and the Mekong Delta through storytelling and hidden gems.
            </p>

            <div className="hero-buttons hero-anim">
              <button className="btn-hero-cta" onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}>
                <span>Start Journey</span>
                <span className="arrow">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                  </svg>
                </span>
              </button>
              <button className="btn-hero-secondary" onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}>
                Learn My Story
              </button>
            </div>
          </div>

          {/* RIGHT: Phone Cards */}
          {mounted && !isMobile && (
            <div className="hero-right hero-anim">
              <div className="hero-phone-stack">
                {[
                  { cls: 'card-left hero-phone-card-0', data: left, sz: '180px', slot: 0 },
                  { cls: 'card-center hero-phone-card-1', data: center, sz: '200px', slot: 1, priority: true },
                  { cls: 'card-right hero-phone-card-2', data: right, sz: '180px', slot: 2 },
                ].map(({ cls, data, sz, slot, priority }) => (
                  <div key={slot} className={`hero-phone-card ${cls}`}
                    onClick={() => { const t = tours.find(t => (t as any).folder === FOLDERS[slots[slot]]); if (t && onSelectTour) onSelectTour(t.id); }}>
                    <Image src={data.url} alt={data.title} fill sizes={sz} className="hero-phone-card-img"
                      style={{ objectFit: 'cover' }} {...(priority ? { priority: true } : {})} />
                    <div className="hero-phone-card-label">{data.title}</div>
                  </div>
                ))}
                <div className="hero-phone-badge">
                  <div className="hero-phone-badge-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  </div>
                  <div className="hero-phone-badge-info">
                    <p className="badge-title">Highly Rated</p>
                    <p className="badge-sub">Best travel experiences</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* UNIFIED SEARCH HUB */}
        <div className="hero-unified-bar hero-anim">
          <div className="hub-inner" ref={hubRef}>

            {/* Field 1: Category */}
            <div className="hub-field hub-field-clickable" ref={categoryRef}
              onClick={() => setShowCategoryDrop(v => !v)}>
              <div className="hub-field-icon hub-icon-cat"><Star size={18} /></div>
              <div className="hub-field-body">
                <span className="hub-field-label">Category</span>
                <span className="hub-field-value">{selectedCategory || 'All tours'}</span>
              </div>
              {showCategoryDrop && (
                <div className="hub-dropdown">
                  <div className={`hub-drop-item ${!selectedCategory ? 'active' : ''}`}
                    onClick={e => { e.stopPropagation(); setSelectedCategory(''); setShowCategoryDrop(false); }}>
                    All tours
                  </div>
                  {ALL_CATEGORIES.map(cat => (
                    <div key={cat} className={`hub-drop-item ${selectedCategory === cat ? 'active' : ''}`}
                      onClick={e => { e.stopPropagation(); setSelectedCategory(cat); setShowCategoryDrop(false); }}>
                      {cat}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="hub-divider" />

            {/* Field 2: Total stat */}
            <div className="hub-field hub-field-stat">
              <div className="hub-field-icon hub-icon-map"><Map size={18} /></div>
              <div className="hub-field-body">
                <span className="hub-field-label">Total Tours</span>
                <span className="hub-field-value">{toursCount} destinations</span>
              </div>
            </div>

            <div className="hub-divider" />

            {/* Field 3: Destination input + Search btn — together */}
            <div className="hub-search-group" ref={searchRef}>
              <Search size={16} className="hub-search-group-icon" />
              <input
                type="text"
                className="hub-field-input hub-search-input"
                placeholder="Destination or tour name..."
                value={searchQuery}
                aria-label="Search destination"
                onChange={e => {
                  setSearchQuery(e.target.value);
                  // show popup immediately as user types
                  if (!showPopup) {
                    computePopupCoords();
                    setShowPopup(true);
                  }
                }}
                onKeyDown={handleKeyDown}
              />
              <button className="hub-search-btn" onClick={handleSearch} aria-label="Search">
                <Search size={18} />
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* SEARCH RESULTS POPUP — via createPortal */}
      {showPopup && mounted && createPortal(
        <div
          ref={popupRef}
          className="hub-popup"
          style={{
            top: popupCoords.top,
            left: popupCoords.left,
            width: isMobile ? 350 : popupCoords.width,
          }}
        >
          {/* Popup header */}
          <div className="hub-popup-header">
            <span className="hub-popup-title">
              {popupResults.length} tour{popupResults.length !== 1 ? 's' : ''} found
              {selectedCategory ? ` in "${selectedCategory}"` : ''}
              {searchQuery ? ` for "${searchQuery}"` : ''}
            </span>
            <button className="hub-popup-close" onClick={closePopup} aria-label="Close">
              <X size={16} />
            </button>
          </div>

          {/* Tour grid */}
          <div className="hub-popup-grid">
            {popupResults.map((tour, index) => {
              const folder = (tour as any).folder as keyof typeof imageMap;
              const imgs = imageMap[folder] || [];
              const thumb = imgs[0] || '';
              return (
                <div key={tour.id} className="hub-popup-card"
                  onClick={() => { if (onSelectTour) onSelectTour(tour.id); setShowPopup(false); }}>
                  <div className="hub-popup-card-img">
                    {thumb && (
                      <Image src={thumb} alt={tour.title} fill sizes="200px"
                        loading={index === 0 ? 'eager' : 'lazy'}
                        style={{ objectFit: 'cover' }} quality={70} />
                    )}
                    <div className="hub-popup-card-cat">{tour.category}</div>
                  </div>
                  <div className="hub-popup-card-body">
                    <h4 className="hub-popup-card-title">{tour.title}</h4>
                    <p className="hub-popup-card-desc">{tour.brief}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>,
        document.body
      )}
    </section>
  );
};

export default Hero;
