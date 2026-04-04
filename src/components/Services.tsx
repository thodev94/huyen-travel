import React, { useRef } from 'react';
import { GlassElement } from '../GlassElement/GlassElement';
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

  const cardWidth = isMobile ? width * 0.9 :
    width < 1280 ? Math.min(width * 0.45, 400) : 380;
  const cardHeight = isMobile ? 220 : 300;

  return (
    <section id="services" className="services" ref={sectionRef}>
      <div className="services-inner">
        <h2 className="section-title">Expertise</h2>
        <div className="service-grid">
          {services.map((s, i) => (
            <div key={i} className="card-container" style={{ display: 'flex', justifyContent: 'center' }}>
              <GlassElement
                width={cardWidth}
                height={cardHeight}
                radius={20}
                depth={10}
                blur={0.5}
                chromaticAberration={1}
              >
                <div className="card" style={{ padding: isMobile ? '20px 25px' : '30px 40px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <h3 style={{ textTransform: 'uppercase', letterSpacing: '1px', fontSize: isMobile ? '1.1rem' : '1.3rem', color: 'var(--accent)' }}>{s.title}</h3>
                  <p style={{ marginTop: '10px', fontSize: isMobile ? '0.85rem' : '0.9rem', color: 'var(--text)' }}>{s.desc}</p>
                </div>
              </GlassElement>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
