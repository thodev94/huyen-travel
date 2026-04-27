"use client";
import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import toursData from '../data/tours.json';
import imageMap from '../data/imageMap.json';

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

  const handleNext = () => setActiveIndex((prev) => (prev + 1) % tours.length);
  const handlePrev = () => setActiveIndex((prev) => (prev - 1 + tours.length) % tours.length);

  // Auto scroll thumbnails when activeIndex changes
  useEffect(() => {
    if (thumbnailsRef.current && thumbnailsRef.current.children[activeIndex]) {
      const activeElement = thumbnailsRef.current.children[activeIndex] as HTMLElement;
      activeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  }, [activeIndex]);


  // useGSAP(() => {
  //   // GSAP animation when activeIndex changes
  //   gsap.fromTo(
  //     '.slide-anim-wrapper',
  //     { opacity: 0, y: 20 },
  //     { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
  //   );
  // }, { dependencies: [activeIndex], scope: containerRef });

  if (tours.length === 0) return null;

  const currentTour = tours[activeIndex];
  const folder = (currentTour as any).folder as keyof typeof imageMap;
  const images = imageMap[folder] || [];
  const imageUrl = images.length > 0 ? images[0] : "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1200&auto=format&fit=crop";

  return (
    <section id="gallery" className="gallery" style={{ padding: '20px 0' }}>
      <style>{`
        .tour-slider-container {
          display: flex;
          flex-direction: row;
          gap: 40px;
          align-items: stretch;
          border-radius: 24px;
          padding: 30px;
          cursor: pointer;
           box-shadow: 0 15px 40px rgba(0,0,0,0.4);
        }
        .slider-image-wrapper {
          flex: 1;
          position: relative;
          min-height: 400px;
          border-radius: 16px;
          overflow: hidden;
        }
        .slider-content-wrapper {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          color: red;
        }
        @media (max-width: 900px) {
          .tour-slider-container {
            flex-direction: column;
            padding: 20px;
            gap: 20px;
          }
          .slider-image-wrapper {
            min-height: 250px;
          }
        }
        .tour-thumbnail:hover {
          opacity: 1 !important;
          transform: translateY(-3px);
        }
        .tour-thumbnail-overlay {
          position: absolute;
          bottom: -100%;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.7);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 10px;
          font-weight: bold;
          font-size: 0.9rem;
          transition: bottom 0.3s ease;
        }
        .tour-thumbnail:hover .tour-thumbnail-overlay {
          bottom: 0;
        }
        /* Custom scrollbar for thumbnails */
        .thumbnails-container::-webkit-scrollbar {
          height: 8px;
        }
        .thumbnails-container::-webkit-scrollbar-track {
          background: #1a1a1a;
          border-radius: 4px;
        }
        .thumbnails-container::-webkit-scrollbar-thumb {
          background: var(--color-accent-orange);
          border-radius: 4px;
        }
      `}</style>
      <div style={{ margin: '0 auto' }}>
        <h2 className="section-title text-center" style={{ marginBottom: '60px', color: 'red' }}>
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
              <h3 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', marginBottom: '20px', color: 'var(--color-primary-bright)' }}>
                {currentTour.title}
              </h3>
              <p style={{ fontSize: '1.05rem', lineHeight: '1.8', color: 'var(--text-primary)', marginBottom: '30px', whiteSpace: 'pre-line' }}>
                {(() => {
                  if (!currentTour.nodes) return (currentTour as any).brief;
                  const overviewNode = currentTour.nodes.find((n: any) => n.type === 'paragraph' && n.text && n.text.length > 60);
                  return overviewNode ? overviewNode.text : (currentTour as any).brief;
                })()}
              </p>

              <div style={{ marginTop: 'auto', display: 'flex', gap: '15px', alignItems: 'center' }}>
                <button
                  onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                  style={{
                    padding: '12px 24px',
                    background: 'transparent',
                    border: '1px solid var(--color-accent-orange)',
                    color: 'var(--color-accent-orange)',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}>
                  &larr; Prev
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleNext(); }}
                  style={{
                    padding: '12px 24px',
                    background: 'var(--color-accent-orange)',
                    border: 'none',
                    color: 'white',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}>
                  Next &rarr;
                </button>

              </div>
            </div>
          </div>
        </div>

        {/* Thumbnails List */}
        <div ref={thumbnailsRef} className="thumbnails-container" style={{
          marginTop: '30px',
          display: 'flex',
          gap: '15px',
          overflowX: 'auto',
          paddingBottom: '15px',
          WebkitOverflowScrolling: 'touch'
        }}>
          {tours.map((t, index) => {
            const f = (t as any).folder as keyof typeof imageMap;
            const imgs = imageMap[f] || [];
            const thumbUrl = imgs.length > 0 ? imgs[0] : "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1200&auto=format&fit=crop";

            return (
              <div
                key={t.id}
                onClick={() => onSelectTour && onSelectTour(t.id)}
                className="tour-thumbnail"
                style={{
                  position: 'relative',
                  flex: '0 0 auto',
                  width: '160px',
                  height: '100px',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  border: activeIndex === index ? '3px solid var(--color-accent-orange)' : '3px solid transparent',
                  opacity: activeIndex === index ? 1 : 0.5,
                  transition: 'all 0.3s ease',
                  boxShadow: activeIndex === index ? '0 4px 15px rgba(0,0,0,0.3)' : 'none'
                }}
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
