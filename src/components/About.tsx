import React from 'react';
import { GlassElement } from '../GlassElement/GlassElement';
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

  const getFullWidth = () => width * 0.9;

  return (
    <section id="about" className="about" style={{ paddingTop: '50px', background: 'rgba(0, 0, 0, 0.4)' }}>
      <div className="about-inner" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h2 className="section-title" style={{ color: 'white' }}>Personal Capabilities</h2>

        <div className="bento-grid" style={bentoGridStyle}>
          {/* Box 1: Langs */}
          <div style={{ gridColumn: isMobile ? 'span 1' : 'span 2', gridRow: 'span 1' }}>
            <GlassElement width={isMobile ? getFullWidth() : 590} height={200} radius={24} depth={5} blur={0.2}>
              <div style={{ padding: '30px' }}>
                <h3 style={{ color: 'var(--accent)', marginBottom: '15px' }}>Languages</h3>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <span className="btn-grad">English (Fluent)</span>
                  <span className="btn-grad">Vietnamese (Native)</span>
                </div>
              </div>
            </GlassElement>
          </div>

          {/* Box 2: Stats */}
          <div style={{ gridColumn: isMobile ? 'span 1' : 'span 1', gridRow: 'span 1' }}>
            <GlassElement width={isMobile ? getFullWidth() : 285} height={200} radius={24} depth={5} blur={0.2}>
              <div style={{ padding: '30px', textAlign: 'center' }}>
                <h2 style={{ fontSize: isMobile ? '2.5rem' : '3rem', margin: 0, color: 'var(--accent)' }}>4.9+</h2>
                <p style={{ color: 'var(--accent)' }}>Avg. Rating</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--accent)' }}>500+ Reviews</p>
              </div>
            </GlassElement>
          </div>

          {/* Box 3: Skills */}
          <div style={{ gridColumn: isMobile ? 'span 1' : 'span 1', gridRow: isMobile ? 'span 1' : 'span 2' }}>
            <GlassElement width={isMobile ? getFullWidth() : 285} height={isMobile ? 250 : 420} radius={24} depth={5} blur={0.2}>
              <div style={{ padding: '30px' }}>
                <h3 style={{ color: 'var(--accent)', marginBottom: '15px' }}>Personal Perks</h3>
                <ul style={{ listStyle: 'none', lineHeight: '1.8' }}>
                  <li>✓ Professional Licensed Guide</li>
                  <li>✓ Tourism Degree</li>
                  <li>✓ Photography Assistant</li>
                  <li>✓ SIM Card & Local Logistics</li>
                  <li>✓ Hidden Gems Specialist</li>
                </ul>
              </div>
            </GlassElement>
          </div>

          {/* Box 4: Philosophy */}
          <div style={{ gridColumn: isMobile ? 'span 1' : 'span 3', gridRow: 'span 1' }}>
            <GlassElement width={isMobile ? getFullWidth() : 895} height={200} radius={24} depth={5} blur={0.1}>
              <div style={{ padding: '30px' }}>
                <h3 style={{ color: 'var(--accent)', marginBottom: '10px' }}>Guiding Style</h3>
                <p style={{ fontStyle: 'italic', fontSize: isMobile ? '0.9rem' : '1rem' }}>
                  "My goal is for you to feel less like a tourist and more like exploring Saigon with a local friend. I personalize every moment to your pace."
                </p>
              </div>
            </GlassElement>
          </div>
        </div>
      </div>
    </section >
  );
};

export default About;
