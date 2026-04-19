"use client";
import React, { useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useWindowSize } from '../hooks/useWindowSize';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const galleryImages = [
  "https://images.unsplash.com/photo-1583417319070-4a69db38a482?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=600&auto=format&fit=crop"
];

const Gallery: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { width } = useWindowSize();
  const isMobile = width <= 768;

  useGSAP(() => {
    if (isMobile) return; // disable GSAP animations on small screens
    gsap.fromTo(
      '.gallery-anim',
      { opacity: 0, scale: 0.9, y: 30 },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'back.out(1.2)',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        }
      }
    );
  }, { scope: sectionRef });

  const bentoGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 285px)',
    gridTemplateRows: isMobile ? 'auto' : 'repeat(3, 200px)',
    gap: '16px',
    justifyContent: 'center',
    margin: '0 auto',
    width: isMobile ? '100%' : 'max-content',
  };

  const galleryItems = [
    { spanC: 2, spanR: 1 },
    { spanC: 1, spanR: 1 },
    { spanC: 1, spanR: 2 },
    { spanC: 3, spanR: 1 },
    { spanC: 1, spanR: 1 },
    { spanC: 3, spanR: 1 }
  ];

  return (
    <section id="gallery" className="gallery" ref={sectionRef}>
      <div className="gallery-inner">
        <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 20px' }}>
          <h2 className="section-title text-center gallery-anim" style={{ width: '100%', marginBottom: '30px' }}>Travel Journal</h2>
        </div>

        <div className="gallery-grid" style={bentoGridStyle}>
          {galleryImages.map((img, index) => {
            const config = galleryItems[index % galleryItems.length];
            return (
              <div
                key={index}
                className="glass-panel gallery-anim"
                style={{
                  gridColumn: isMobile ? 'span 1' : `span ${config.spanC}`,
                  gridRow: isMobile ? 'span 1' : `span ${config.spanR}`,
                  position: 'relative',
                  background: 'var(--bg-pure)',
                  height: isMobile ? '280px' : '100%'
                }}
              >
                <div style={{
                  width: '100%',
                  height: '100%',
                  overflow: 'hidden',
                  position: 'relative',
                  borderRadius: '12px'
                }}>
                  <Image
                    src={img}
                    alt={`Vietnam view ${index + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 285px"
                    quality={75}
                    style={{
                      objectFit: 'cover',
                      display: 'block',
                      transition: 'transform 0.8s cubic-bezier(0.2, 1, 0.3, 1)'
                    }}
                    className="gallery-img"
                  />
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    padding: '20px',
                    background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                    color: 'white',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    zIndex: 2
                  }}>
                    Moments // 0{index + 1}
                  </div>
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
