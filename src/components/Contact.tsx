import React from 'react';
import { useWindowSize } from '../hooks/useWindowSize';

const Contact: React.FC = () => {
  const { width } = useWindowSize();
  const isMobile = width < 768;

  const brands = ["SAIGON", "CULTURE", "TRADITION", "CUISINE", "NIGHTLIFE", "STORYTELLING", "AUTHENTICITY"];

  return (
    <footer id="contact" className="contact" style={{ background: '#000', color: 'white', overflow: 'hidden' }}>
      {/* 1. Brand Marquee */}
      <div className="brand-marquee-container">
        <div className="brand-marquee">
          {brands.concat(brands).map((brand, i) => (
            <span key={i} className="brand-item">{brand}</span>
          ))}
        </div>
      </div>

      <div className="contact-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: isMobile ? '20px' : '40px' }}>

        {/* 2. Main CTA Area with Rotating Text */}
        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: 'center', gap: '60px', marginBottom: '80px' }}>
          <div style={{ flex: 1, textAlign: isMobile ? 'center' : 'left' }}>
            <h2 style={{ fontSize: 'clamp(1.5rem, 6vw, 4.5rem)', fontWeight: 900, lineHeight: 1, margin: 0, textTransform: 'uppercase' }}>
              Let's create <br /> shared stories.
            </h2>
            <p style={{ marginTop: '30px', fontSize: '1.2rem', opacity: 0.6, maxWidth: '500px' }}>
              I am ready to show you the heart of Saigon. Reach out to start your private journey today.
            </p>
          </div>

          <div className="circular-text-container">
            <svg viewBox="0 0 100 100" className="circular-text">
              <path id="circlePath" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" fill="transparent" />
              <text fontFamily="'Inter', sans-serif" fontSize="9" fontWeight="bold" fill="white" letterSpacing="3.5">
                <textPath xlinkHref="#circlePath">
                  LICENSED PROFESSIONAL GUIDE • EST. 2016 •
                </textPath>
              </text>
            </svg>
            <div style={{ position: 'absolute', width: '10px', height: '100%', borderLeft: '1px solid var(--accent)' }}></div>
          </div>
        </div>

        {/* 3. Detailed Footer Info */}
        <div className="footer-main">
          <div className="footer-col">
            <h4>Background</h4>
            <p>Huyen (Wind) is a professional guide with over 8 years of experience. Specializing in cultural storytelling and finding the hidden gems that tourists usually miss.</p>
          </div>

          <div className="footer-col">
            <h4>Quick Links</h4>
            <a href="#hero">Profile</a>
            <a href="#about">About</a>
            <a href="#services">Services</a>
            <a href="#gallery">Journal</a>
          </div>

          <div className="footer-col">
            <h4>Connect</h4>
            <p>WhatsApp: +84 90 123 4567</p>
            <p>Email: guide@adventure.com</p>
            <div style={{ marginTop: '20px', display: 'flex', gap: '20px' }}>
              <a href="#">IG</a>
              <a href="#">FB</a>
              <a href="#">TA</a>
            </div>
          </div>
        </div>

        <div style={{ marginTop: isMobile ? '40px' : '80px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: isMobile ? '10px' : '30px', display: 'flex', justifyContent: 'space-between', opacity: 0.3, fontSize: '0.75rem', letterSpacing: '1px' }}>
          <span>© 2026 HUYEN PORTFOLIO</span>
          <span>SAIGON, VIETNAM</span>
        </div>
      </div>
    </footer>
  );
};

export default Contact;
