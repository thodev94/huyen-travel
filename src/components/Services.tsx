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
    <section id="services" className="services" ref={sectionRef} style={{ padding: isMobile ? '60px 15px' : '100px 50px' }}>
      <div className="services-inner">
        <h2 className="section-title" style={{ textAlign: isMobile ? 'center' : 'left' }}>Expertise</h2>
        <div className="service-grid">
          {services.map((s, i) => (
            <div key={i} className="card-container" style={{ display: 'flex', justifyContent: 'center' }}>
              <div className="glass-panel" style={{ width: '100%', minHeight: '220px', padding: '10px', borderRadius: '10px' }}>
                <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '10px' }}>
                  <h3 style={{ textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--accent)' }}>{s.title}</h3>
                  <p style={{ marginTop: '10px', fontSize: '0.9rem', color: 'var(--text)' }}>{s.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
