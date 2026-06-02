"use client";
import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import toursData from '../data/tours.json';
import imageMap from '../data/imageMap.json';
import './Gallery.css';

gsap.registerPlugin(useGSAP);

interface GalleryProps {
  onSelectTour?: (id: string) => void;
}

const Gallery: React.FC<GalleryProps> = ({ onSelectTour }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const thumbnailsRef = useRef<HTMLDivElement>(null);

  // Keep all tours
  const tours = toursData;

  const scrollThumbnailIntoView = (index: number) => {
    if (thumbnailsRef.current && thumbnailsRef.current.children[index]) {
      const activeElement = thumbnailsRef.current.children[index] as HTMLElement;
      activeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  };

  const handleNext = () => {
    setActiveIndex((prev) => {
      const next = (prev + 1) % tours.length;
      scrollThumbnailIntoView(next);
      return next;
    });
  };

  const handlePrev = () => {
    setActiveIndex((prev) => {
      const p = (prev - 1 + tours.length) % tours.length;
      scrollThumbnailIntoView(p);
      return p;
    });
  };

  if (tours.length === 0) return null;

  const currentTour = tours[activeIndex];
  const folder = (currentTour as any).folder as keyof typeof imageMap;
  const images = imageMap[folder] || [];
  const imageUrl = images.length > 0 ? images[0] : "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1200&auto=format&fit=crop";

  return (
    <section id="gallery" className="gallery" style={{ padding: '20px 0' }}>
      <div className="gallery-inner">
        <h2 className="section-title text-center" style={{ marginBottom: '60px', color: 'var(--color-primary-deep)' }}>
          Discover your good time
        </h2>
 
        <div ref={containerRef} style={{ position: 'relative' }}>
          <div
            key={activeIndex}
            className="tour-slider-container slide-anim-wrapper"
            onClick={() => onSelectTour && onSelectTour(currentTour.id)}
          >
            {/* Left: Image */}
            <div className="slider-image-wrapper">
              <Image
                src={imageUrl}
                alt={currentTour.title}
                fill
                style={{ objectFit: 'cover' }}
                priority
              />
            </div>
 
            {/* Right: Content */}
            <div className="slider-content-wrapper">
              <h3 className="slider-title">
                {currentTour.title}
              </h3>
              <p className="slider-description">
                {(() => {
                  if (!currentTour.nodes) return (currentTour as any).brief;
                  const overviewNode = currentTour.nodes.find((n: any) => n.type === 'paragraph' && n.text && n.text.length > 60);
                  return overviewNode ? overviewNode.text : (currentTour as any).brief;
                })()}
              </p>

              <div className="slider-nav-buttons">
                <button
                  onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                  className="slider-btn-prev">
                  &larr; Prev
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleNext(); }}
                  className="slider-btn-next">
                  Next &rarr;
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Thumbnails List */}
        <div ref={thumbnailsRef} className="thumbnails-container">
          {tours.map((t, index) => {
            const f = (t as any).folder as keyof typeof imageMap;
            const imgs = imageMap[f] || [];
            const thumbUrl = imgs.length > 0 ? imgs[0] : "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1200&auto=format&fit=crop";

            return (
              <div
                key={t.id}
                onClick={() => {
                  setActiveIndex(index);
                  scrollThumbnailIntoView(index);
                }}
                className={`tour-thumbnail ${activeIndex === index ? 'active' : ''}`}
              >
                <Image src={thumbUrl} alt={t.title} fill style={{ objectFit: 'cover' }} sizes="160px" />
                <div className="tour-thumbnail-overlay">
                  {t.title}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Gallery;
