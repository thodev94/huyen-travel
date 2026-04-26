"use client";
import React, { useRef, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useWindowSize } from '../hooks/useWindowSize';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const galleryImages = [
  "https://images.unsplash.com/photo-1583417319070-4a69db38a482?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1200&auto=format&fit=crop"
];

const Gallery: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { width } = useWindowSize();
  const isMobile = width <= 768;
  const [activeIndex, setActiveIndex] = useState(0);

  useGSAP(() => {
    if (isMobile) return; // disable GSAP animations on small screens
    gsap.fromTo(
      '.gallery-anim',
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        }
      }
    );
  }, { scope: sectionRef });

  return (
    <section id="gallery" className="gallery" ref={sectionRef}>
      <div className="gallery-inner" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 20px' }}>
        <h2 className="section-title text-center gallery-anim" style={{ width: '100%', marginBottom: '40px' }}>Travel Journal</h2>

        <div className="gallery-anim" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Main Image */}
          <div style={{
            position: 'relative',
            width: '100%',
            height: isMobile ? '350px' : '650px',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
            background: '#000'
          }}>
            <Image
              key={activeIndex}
              src={galleryImages[activeIndex]}
              alt={`Vietnam view ${activeIndex + 1}`}
              fill
              quality={90}
              style={{ objectFit: 'contain' }}
              sizes="(max-width: 768px) 100vw, 1200px"
              priority
            />
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '100%',
              padding: '30px',
              background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
              color: 'white',
              zIndex: 2
            }}>
              <div style={{
                fontSize: '1rem',
                fontWeight: 700,
                letterSpacing: '2px',
                textTransform: 'uppercase'
              }}>
                Moments // 0{activeIndex + 1}
              </div>
            </div>
          </div>

          {/* Thumbnails Slider */}
          <div style={{
            display: 'flex',
            gap: '15px',
            overflowX: 'auto',
            paddingBottom: '15px',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
          }}>
            {galleryImages.map((img, index) => (
              <div
                key={index}
                onClick={() => setActiveIndex(index)}
                style={{
                  position: 'relative',
                  flex: '0 0 auto',
                  width: isMobile ? '100px' : '160px',
                  height: isMobile ? '70px' : '100px',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  border: activeIndex === index ? '3px solid var(--color-accent-orange)' : '3px solid transparent',
                  opacity: activeIndex === index ? 1 : 0.5,
                  transition: 'all 0.3s ease',
                  boxShadow: activeIndex === index ? '0 4px 15px rgba(0,0,0,0.2)' : 'none'
                }}
              >
                <Image
                  src={img}
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  sizes="160px"
                  style={{ objectFit: 'cover' }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Gallery;
