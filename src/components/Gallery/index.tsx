"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import toursData from '../../../public/data/tours.json';
import imageMap from '../../../public/data/imageMap.json';
import './Gallery.css';

interface GalleryProps {
  onSelectTour?: (id: string) => void;
}

const VISIBLE_SLIDES = 4;
const AUTO_PLAY_DELAY = 4200;
const FALLBACK_IMAGE = '/images/baners/banner.png';

const Gallery: React.FC<GalleryProps> = ({ onSelectTour }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const tours = toursData;

  const handleNext = () => {
    setActiveIndex(prev => (prev + 1) % tours.length);
  };

  const handlePrev = () => {
    setActiveIndex(prev => (prev - 1 + tours.length) % tours.length);
  };

  useEffect(() => {
    if (isPaused || tours.length <= 1) return;

    const timer = window.setInterval(handleNext, AUTO_PLAY_DELAY);
    return () => window.clearInterval(timer);
  }, [isPaused, tours.length]);

  if (tours.length === 0) return null;

  const visibleTours = Array.from(
    { length: Math.min(VISIBLE_SLIDES, tours.length) },
    (_, offset) => tours[(activeIndex + offset) % tours.length]
  );

  return (
    <section id="gallery" className="gallery">
      <div className="gallery-inner">
        <div className="gallery-heading-row">
          <div>
            <span className="gallery-kicker">Vietnam in every frame</span>
            <h2 className="section-title gallery-title">Your good time</h2>
          </div>

          <div className="gallery-controls" aria-label="Gallery controls">
            <span className="gallery-counter">
              {String(activeIndex + 1).padStart(2, '0')}
              <small>/ {String(tours.length).padStart(2, '0')}</small>
            </span>
            <button type="button" onClick={handlePrev} aria-label="Previous tours">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
            </button>
            <button type="button" onClick={handleNext} aria-label="Next tours">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </div>
        </div>

        <div
          className="gallery-carousel"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocusCapture={() => setIsPaused(true)}
          onBlurCapture={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
              setIsPaused(false);
            }
          }}
        >
          <div key={activeIndex} className="gallery-slide-grid">
            {visibleTours.map((tour, position) => {
              const folder = (tour as any).folder as keyof typeof imageMap;
              const images = imageMap[folder] || [];
              const imageUrl = images[0] || FALLBACK_IMAGE;

              return (
                <article
                  className="gallery-slide-card"
                  key={tour.id + '-' + position}
                  onClick={() => onSelectTour?.(tour.id)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      onSelectTour?.(tour.id);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={'View ' + tour.title}
                >
                  <Image
                    src={imageUrl}
                    alt={tour.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    quality={82}
                    style={{ objectFit: 'cover' }}
                    priority={position === 0}
                  />

                  <div className="gallery-slide-shade" aria-hidden="true" />

                  <div className="gallery-slide-index">
                    {String((activeIndex + position) % tours.length + 1).padStart(2, '0')}
                  </div>

                  <div className="gallery-slide-content">
                    <span>{tour.category}</span>
                    <h3>{tour.title}</h3>
                    <p>{tour.brief}</p>
                    <div className="gallery-slide-link">
                      View experience
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="gallery-progress" aria-hidden="true">
            <span style={{ width: String(((activeIndex + 1) / tours.length) * 100) + '%' }} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Gallery;