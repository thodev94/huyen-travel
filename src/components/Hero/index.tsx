"use client";
import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useWindowSize } from '../../hooks/useWindowSize';
import toursData from '../../data/tours.json';
import imageMapData from '../../data/imageMap.json';
import './Hero.css';

gsap.registerPlugin(useGSAP);

const imageMap: Record<string, string[]> = imageMapData;

interface HeroProps {
  onSelectTour?: (id: string) => void;
}

const Hero: React.FC<HeroProps> = ({ onSelectTour }) => {
  const heroRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { width } = useWindowSize();
  const isMobile = width <= 768;

  const tours = toursData;
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.5; // 50% tốc độ
    }
  }, []);

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

  const toursCount = tours.length;

  const handleLoadedMetadata = () => {

  };

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    if (video.duration && video.currentTime >= video.duration - 0.25) {
      video.currentTime = 0;
      video.play().catch((err) => console.log("TimeUpdate loop play failed:", err));
    }
  };


  return (
    <section id="hero" className="hero" ref={heroRef}>
      <div className="hero-bg" aria-hidden="true">
        <video
          ref={videoRef}
          className="hero-bg-video"
          src="/Videos/fyp.mp4"
          autoPlay
          muted
          playsInline
          preload="auto"
          loop
          onLoadedMetadata={handleLoadedMetadata}
          onTimeUpdate={handleTimeUpdate}
        />
        <div className="hero-overlay" aria-hidden="true" />
      </div>

      <div className="hero-content">
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
            EXPLORE
            <br />
            <span className="highlight">AUTHENTIC</span>
            <br />
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
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </span>
            </button>
            <button className="btn-hero-secondary" onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}>
              Learn My Story
            </button>
          </div>

          <div className="hero-stats hero-anim">
            <div className="stat-item">
              <div className="stat-icon icon-places">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <div className="stat-text">
                <div className="stat-number">{toursCount.toLocaleString()}</div>
                <div className="stat-label">Travel places</div>
              </div>
            </div>

            <div className="stat-item">
              <div className="stat-icon icon-features">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </div>
              <div className="stat-text">
                <div className="stat-number">Features</div>
                <div className="stat-label">Local experiences</div>
              </div>
            </div>

            <div className="stat-item">
              <div className="stat-icon icon-story">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
              </div>
              <div className="stat-text">
                <div className="stat-number">Our story</div>
                <div className="stat-label">Local-first tours</div>
              </div>
            </div>
          </div>
        </div>

        {!isMobile && <div className="hero-right hero-anim">
          {(() => {
            const currentTour = tours[activeIndex];
            const folder = (currentTour as any).folder as keyof typeof imageMap;
            const images = imageMap[folder] || [];
            const imageUrl = images.length > 0 ? images[0] : "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=2000&auto=format&fit=crop";

            return (
              <div className="hero-arch-container" onClick={() => onSelectTour && onSelectTour(currentTour.id)}>
                <svg className="hero-arch-text-svg" viewBox="0 0 380 520" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <defs>
                    <path id="archTextPath" d="M 35,200 A 155,155 0 0,1 345,200" fill="none" />
                  </defs>
                  <text className="arch-curved-text">
                    <textPath href="#archTextPath" startOffset="50%" textAnchor="middle">
                      ★ TOP RATED LOCAL EXPERIENCES IN VIETNAM ★
                    </textPath>
                  </text>
                </svg>

                <div className="hero-arch-outline" />

                <div className="hero-arch-frame">
                  <Image
                    key={activeIndex}
                    className="hero-arch-img hero-slider-img"
                    src={imageUrl}
                    alt={currentTour.title}
                    fill
                    priority
                    sizes="(max-width: 1200px) 340px, 340px"
                    style={{ objectFit: 'cover', objectPosition: 'center' }}
                  />
                </div>

                <div className="highly-rated-card">
                  <div className="rating-star-badge">
                    <span className="star-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    </span>
                  </div>
                  <div className="card-info">
                    <h4 className="card-title">Highly Rated</h4>
                    <p className="card-subtitle">Best travel & relaxing experiences</p>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>}
      </div>
    </section>
  );
};

export default Hero;
