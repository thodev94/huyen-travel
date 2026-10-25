"use client";
import React, { useRef, useState } from 'react';
import Image from 'next/image';
import toursData from '../../../public/data/tours.json';
import imageMapData from '../../../public/data/imageMap.json';
import './Services.css';

const imageMap: Record<string, string[]> = imageMapData;
const FALLBACK_IMAGE = '/images/baners/banner.png';

interface ServicesProps {
  onSelectTour: (tourId: string) => void;
}

const Services: React.FC<ServicesProps> = ({ onSelectTour }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['all', ...Array.from(new Set(toursData.map(t => t.category)))];

  const filteredTours = toursData
    .filter(t => activeCategory === 'all' || t.category === activeCategory)
    .filter(t => {
      if (searchQuery.trim() === '') return true;
      const query = searchQuery.toLowerCase();
      return (
        t.title.toLowerCase().includes(query) ||
        t.category.toLowerCase().includes(query) ||
        t.brief.toLowerCase().includes(query)
      );
    });

  return (
    <section id="services" className="services" ref={sectionRef}>
      <div className="services-inner">
        <div className="services-header services-entry-anim">
          <div className="services-heading">
            <span className="services-eyebrow">Curated local experiences</span>
            <h2 className="section-title services-title">Your good time here!</h2>
            <p>Explore Saigon, the Mekong Delta and nearby escapes through local stories, culture and everyday life.</p>
          </div>

          <div className="services-count" aria-live="polite">
            <strong>{String(filteredTours.length).padStart(2, '0')}</strong>
            <span>{filteredTours.length === 1 ? 'experience' : 'experiences'}</span>
          </div>
        </div>

        <div className="services-toolbar services-entry-anim">
          <div className="search-input-wrapper">
            <div className="search-input-inner">
              <span className="search-icon" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </span>
              <label className="services-sr-only" htmlFor="tour-search">Search tours</label>
              <input
                id="tour-search"
                type="search"
                className="search-input"
                placeholder="Search by place or experience..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="search-clear"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear tour search"
                >
                  ×
                </button>
              )}
            </div>
          </div>

          <div className="services-categories" aria-label="Filter tours by category">
            {categories.map(cat => (
              <button
                type="button"
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={'category-btn ' + (activeCategory === cat ? 'active' : '')}
                aria-pressed={activeCategory === cat}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {filteredTours.length > 0 ? (
          <div className="service-grid">
            {filteredTours.map((tour, index) => {
              const folder = (tour as any).folder as keyof typeof imageMap;
              const folderImages = imageMap[folder] || [];
              const coverImage = folderImages[0] || FALLBACK_IMAGE;

              return (
                <a
                  key={tour.id}
                  href={'/tour/' + tour.id}
                  onClick={(event) => {
                    event.preventDefault();
                    onSelectTour(tour.id);
                  }}
                  className="card-container tour-card-anim"
                >
                  <article className="service-card">
                    <div className="service-img-wrapper">
                      <Image
                        src={coverImage}
                        alt={tour.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        quality={82}
                        loading={index < 3 ? 'eager' : 'lazy'}
                        style={{ objectFit: 'cover' }}
                      />
                      <div className="service-image-overlay" aria-hidden="true" />
                      <span className={'tag-badge ' + (tour.category.toLowerCase() === 'saigon' ? 'saigon' : '')}>
                        {tour.category}
                      </span>
                      <span className="service-card-index">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </div>

                    <div className="card-content">
                      <h3 className="card-title">{tour.title}</h3>
                      <p className="card-brief">{tour.brief}</p>

                      <div className="card-footer">
                        <span className="card-link">Explore tour</span>
                        <span className="card-arrow" aria-hidden="true">
                          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <polyline points="12 5 19 12 12 19"></polyline>
                          </svg>
                        </span>
                      </div>
                    </div>
                  </article>
                </a>
              );
            })}
          </div>
        ) : (
          <div className="services-empty">
            <span>0 results</span>
            <h3>No tours found</h3>
            <p>Try a different destination or view all available experiences.</p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('all');
              }}
            >
              View all tours
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Services;