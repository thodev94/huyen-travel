import React, { useRef } from 'react';

const Hero: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);

  return (
    <section id="hero" className="hero" ref={heroRef}>
      {/* Lớp nền có chiều sâu */}
      <div className="hero-bg-overlay" />

      <div className="hero-content">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '900px', padding: 'clamp(20px, 5vw, 40px) 10px' }}>
            <div className="hero-inner-container">
              {/* Badge chứng thực */}
              <div className="badge-container" style={{ flexWrap: 'wrap', justifyContent: 'center' }}>
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

              <div className="hero-cta-group" style={{ flexWrap: 'wrap' }}>
                <div className="glass-panel" style={{ borderRadius: '50px' }}>
                  <button className="nav-btn" style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', padding: '12px 30px', fontWeight: '600', minWidth: '120px' }}>Start Journey</button>
                </div>

                <div className="glass-panel" style={{ borderRadius: '50px' }}>
                  <button className="nav-btn" style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', padding: '12px 30px', fontWeight: '600', minWidth: '120px' }}>View Tour</button>
                </div>
              </div>
            </div>
          </div>

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