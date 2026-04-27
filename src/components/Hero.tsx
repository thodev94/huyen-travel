"use client";
import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useWindowSize } from '../hooks/useWindowSize';
import toursData from '../data/tours.json';
import imageMapData from '../data/imageMap.json';

gsap.registerPlugin(useGSAP);

const imageMap: Record<string, string[]> = imageMapData;

interface HeroProps {
  onSelectTour?: (id: string) => void;
}

const Hero: React.FC<HeroProps> = ({ onSelectTour }) => {
  const heroRef = useRef<HTMLDivElement>(null);
  const { width } = useWindowSize();
  const isMobile = width <= 768;

  const tours = toursData;
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % tours.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [tours.length]);

  useGSAP(() => {
    gsap.fromTo(
      '.hero-anim',
      { opacity: 0, y: isMobile ? 20 : 30 },
      {
        opacity: 1,
        y: 0,
        duration: isMobile ? 0.6 : 1,
        stagger: isMobile ? 0.1 : 0.2,
        ease: 'power3.out',
        delay: isMobile ? 0.1 : 0.2
      }
    );
  }, { scope: heroRef });

  useGSAP(() => {
    gsap.fromTo(
      '.hero-slider-img',
      { opacity: 0, scale: 1.05 },
      { opacity: 1, scale: 1, duration: 0.8, ease: 'power2.out' }
    );
  }, { dependencies: [activeIndex], scope: heroRef });

  return (
    <section id="hero" className="hero" ref={heroRef}>
      <div className="hero-bg" aria-hidden="true">
        <Image
          src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2000&auto=format&fit=crop"
          alt="Background"
          fill
          priority
          sizes="100vw"
          style={{ objectFit: 'cover', objectPosition: 'center', opacity: 0.5 }}
        />
        <div className="hero-overlay" aria-hidden="true" />
      </div>

      <div className="hero-content">
        <div className="hero-text-side">
          <h1 className="hero-main-title hero-anim">
            Explore <br />
            <span>Authentic Vietnam</span>
          </h1>

          <div className="badges hero-anim">
            <span className="tag">Licensed Professional Guide</span>
            <span className="tag">8+ Years Experience</span>
          </div>

          <p className="hero-sub hero-anim">
            I am <strong>Huyen (Wind)</strong> — a licensed guide with a passion for showing
            the real side of Ho Chi Minh City and the Mekong Delta through storytelling and hidden gems.
          </p>

          <div className="hero-buttons hero-anim">
            <button className="btn-primary" onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}>
              Start Journey
            </button>
            <button className="btn-secondary" onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}>
              Learn My Story
            </button>
          </div>
        </div>

        {!isMobile && <div className="hero-image-side hero-anim">
          {(() => {
            const currentTour = tours[activeIndex];
            const folder = (currentTour as any).folder as keyof typeof imageMap;
            const images = imageMap[folder] || [];
            const imageUrl = images.length > 0 ? images[0] : "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=2000&auto=format&fit=crop";

            return (
              <div
                className="hero-image-wrapper"
                onClick={() => onSelectTour && onSelectTour(currentTour.id)}
                style={{ cursor: 'pointer' }}
              >
                <Image
                  key={activeIndex}
                  className="hero-slider-img"
                  src={imageUrl}
                  alt={currentTour.title}
                  fill
                  priority
                  sizes="(max-width: 1200px) 100vw, 60vw"
                  style={{ objectFit: 'cover', objectPosition: 'center' }}
                />
                <div className="hero-image-overlay"></div>
                <div className="hero-tour-hover-overlay">
                  <h3 style={{ margin: 0, fontSize: '1.5rem', color: 'white' }}>{currentTour.title}</h3>
                  <p style={{
                    margin: '5px 0 0 0',
                    fontSize: '0.9rem',

                    borderRadius: "5px",
                    padding: "5px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}><span style={{
                    color: '#ffff',
                    backgroundColor: "var(--color-primary-deep)",
                    width: "max-content",
                    margin: "0 auto",
                    borderRadius: "6px",
                    padding: "0 10px",
                    height: "34px",
                    lineHeight: '34px',
                    border: "#ffff",

                  }}>Click to view details &rarr;</span></p>
                </div>
              </div>
            );
          })()}
        </div>}
      </div>
    </section >
  );
};

export default Hero;