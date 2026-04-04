import React from 'react';
import { useWindowSize } from '../hooks/useWindowSize';

const About: React.FC = () => {
  const { width } = useWindowSize();
  const isMobile = width < 768;

  const bentoGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)',
    gridTemplateRows: isMobile ? 'auto' : 'repeat(2, 200px)',
    gap: '20px',
    color: '#FFFFFF',
    margin: 0
  };

  return (
    <section id="about" className="about" style={{ padding: isMobile ? '60px 15px' : '100px 20px', background: 'rgba(0, 0, 0, 0.4)' }}>
      <div className="about-inner" style={{ maxWidth: '1240px', margin: '0 auto' }}>
        <h2 className="section-title" style={{ color: 'white', textAlign: isMobile ? 'center' : 'left' }}>Personal Capabilities</h2>

        <div className="bento-grid" style={bentoGridStyle}>
          {/* Box 1: Langs */}
          <div className="glass-panel" style={{ padding: '10px', gridColumn: isMobile ? 'span 1' : 'span 2', borderRadius: '10px' }}>
            <h3 style={{ color: 'var(--accent)', marginBottom: '15px' }}>Languages</h3>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <span className="btn-grad">English (Fluent)</span>
              <span className="btn-grad">Vietnamese (Native)</span>
            </div>
          </div>

          {/* Box 2: Stats */}
          <div className="glass-panel" style={{ padding: '10px', textAlign: 'center', borderRadius: '10px' }}>
            <h2 style={{ fontSize: '3rem', margin: 0, color: 'var(--accent)' }}>4.9+</h2>
            <p style={{ color: 'var(--accent)' }}>Avg. Rating</p>
            <p style={{ fontSize: '0.8rem', color: 'var(--accent)' }}>500+ Reviews</p>
          </div>

          {/* Box 3: Skills */}
          <div className="glass-panel" style={{ padding: '10px', gridRow: isMobile ? 'span 1' : 'span 2', borderRadius: '10px' }}>
            <h3 style={{ color: 'var(--accent)', marginBottom: '15px' }}>Personal Perks</h3>
            <ul style={{ listStyle: 'none', lineHeight: '1.8' }}>
              <li>✓ Licensed Professional Guide</li>
              <li>✓ Tourism Degree</li>
              <li>✓ Photography Assistant</li>
              <li>✓ SIM Card & Local Logistics</li>
              <li>✓ Hidden Gems Specialist</li>
            </ul>
          </div>

          {/* Box 4: Philosophy */}
          <div className="glass-panel" style={{ padding: '10px', gridColumn: isMobile ? 'span 1' : 'span 3', borderRadius: '10px' }}>
            <h3 style={{ color: 'var(--accent)', marginBottom: '10px' }}>Guiding Style</h3>
            <p style={{ fontStyle: 'italic' }}>
              "My goal is for you to feel less like a tourist and more like exploring Saigon with a local friend. I personalize every moment to your pace."
            </p>
          </div>
        </div>
      </div>
    </section >
  );
};

export default About;
