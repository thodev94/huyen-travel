import React, { useRef } from 'react';
import { GlassElement } from '../GlassElement/GlassElement';
import { useWindowSize } from '../hooks/useWindowSize';

const Hero: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const { width } = useWindowSize();

  const isMobile = width < 768;
  const glassWidth = isMobile ? width * 0.95 : Math.min(width * 0.9, 900);
  const glassHeight = isMobile ? 480 : Math.min(width * 0.6, 500);

  return (
    <section id="hero" className="hero" ref={heroRef}>
      {/* Lớp nền có chiều sâu */}
      <div className="hero-bg-overlay" />

      <div className="hero-content">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            <GlassElement
            width={glassWidth}
            height={glassHeight}
            radius={isMobile ? 12 : 24}
            depth={isMobile ? 30 : 60}
            blur={0.1}
            chromaticAberration={2}
          >
            <div className="hero-inner-container">
              {/* Badge chứng thực */}
              <div className="badge-container">
                <span className="badge btn-grad ">Licensed Professional Guide</span>
                <span className="badge btn-grad ">8+ Years Experience</span>
              </div>

              <h1 className="hero-main-title">
                Explore <br />
                <span className="gradient-text">Authentic Saigon</span>
              </h1>

              <p className="hero-sub">
                I am **Huyen (Wind)** — a licensed guide with a passion for showing <br />
                the real side of Ho Chi Minh City through storytelling and hidden gems.
              </p>

              <div className="hero-cta-group">
                <GlassElement
                  width={isMobile ? 130 : 150}
                  height={50}
                  radius={16}
                  depth={8}
                  blur={0.1}
                  chromaticAberration={0.5}
                >
                  <button className="nav-btn" style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', width: '100%', height: '100%', fontWeight: '600' }}>Start Journey</button>
                </GlassElement>

                <GlassElement
                  width={isMobile ? 130 : 150}
                  height={50}
                  radius={16}
                  depth={2}
                  blur={0.1}
                  chromaticAberration={0.5}
                >
                  <button className="nav-btn" style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', width: '100%', height: '100%', fontWeight: '600' }}>View Tour</button>
                </GlassElement>
              </div>
            </div>
          </GlassElement>

          <div className="scroll-indicator">
            <div className="mouse-icon"></div>
            <span>Scroll to Explore</span>
          </div>
        </div>
      </div>

      <div className="particles-layer"></div>
    </section>
  );
};

export default Hero;