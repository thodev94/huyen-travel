import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useWindowSize } from '../hooks/useWindowSize';
import './Hero.css';

gsap.registerPlugin(useGSAP);

const Hero: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const { width } = useWindowSize();
  const isMobile = width < 768;

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

  return (
    <section id="hero" className="hero" ref={heroRef}>

      <div className="hero-content">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          
          <h1 className="hero-main-title hero-anim">
            Explore <br />
            <span>Authentic Vietnam</span>
          </h1>

          {/* Badge */}
          <div className="hero-anim" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px', marginBottom: '25px', marginTop: '5px' }}>
            <span className="tag">Licensed Professional Guide</span>
            <span className="tag">8+ Years Experience</span>
          </div>

          <p className="hero-sub hero-anim">
            I am <strong>Huyen (Wind)</strong> — a licensed guide with a passion for showing 
            the real side of Ho Chi Minh City and the Mekong Delta through storytelling and hidden gems.
          </p>

          <div className="hero-anim" style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '20px' }}>
            <button className="btn-primary" onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}>
              Start Journey
            </button>
            <button className="btn-secondary" onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}>
              Learn My Story
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;