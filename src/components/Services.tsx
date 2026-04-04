import React, { useRef } from 'react';
import { useWindowSize } from '../hooks/useWindowSize';

const services = [
  {
    title: "Hidden Gems of Saigon",
    desc: "Going beyond the landmarks into local markets and secret alleys to see authentic life."
  },
  {
    title: "10 Tastings Food Tour",
    desc: "A culinary journey through the city's best-kept food secrets with a local's palate."
  },
  {
    title: "Cu Chi Tunnels",
    desc: "Educational and engaging historical context for one of Vietnam's most iconic sites."
  },
  {
    title: "Mekong Delta Day Trip",
    desc: "A personalized escape to the lush delta with flexible pacing and local insights."
  },
  {
    title: "Coffee Culture",
    desc: "Experience the unique soul of Vietnamese coffee in the most atmospheric local spots."
  },
  {
    title: "Customized Itineraries",
    desc: "Full logistics support: from SIM cards to restaurant bookings and photo assistance."
  }
];

const Services: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { width } = useWindowSize();
  const isMobile = width < 768;

  return (
    <section id="services" className="services" ref={sectionRef} style={{ padding: isMobile ? '40px 15px' : '80px 20px', background: 'rgba(0, 0, 0, 0.4)' }}>
      <div className="services-inner" style={{ maxWidth: '1240px', margin: '0 auto' }}>
        <h2 className="section-title" style={{ textAlign: isMobile ? 'center' : 'left', color: 'white' }}>Expertise</h2>
        <div className="service-grid" style={{ 
          display: 'grid', 
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', 
          gap: '15px' 
        }}>
          {services.map((s, i) => (
            <div key={i} className="card-container">
              <div className="glass-panel" style={{ 
                width: '100%', 
                minHeight: isMobile ? '140px' : '160px', 
                padding: '15px',
                borderRadius: '12px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}>
                <h3 style={{ 
                  textTransform: 'uppercase', 
                  letterSpacing: '1px', 
                  color: 'var(--accent)', 
                  fontSize: '1rem',
                  marginBottom: '8px'
                }}>{s.title}</h3>
                <p style={{ 
                  fontSize: '0.85rem', 
                  color: 'rgba(255,255,255,0.7)',
                  lineHeight: '1.4'
                }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
