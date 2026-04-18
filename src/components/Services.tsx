import React, { useRef, useState } from 'react';
import { useWindowSize } from '../hooks/useWindowSize';
import toursData from '../data/tours.json';
import './Services.css';

interface ServicesProps {
  onSelectTour: (tourId: string) => void;
}

const BANNER_IMAGES = [
  "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1583417319070-4a69db38a482?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1534008897995-27a23e859048?q=80&w=600&auto=format&fit=crop"
];

const Services: React.FC<ServicesProps> = ({ onSelectTour }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const { width } = useWindowSize();
  const isMobile = width < 768;
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = ['all', ...Array.from(new Set(toursData.map(t => t.category)))];

  const filteredTours = activeCategory === 'all' 
    ? toursData 
    : toursData.filter(t => t.category === activeCategory);

  return (
    <section id="services" className="services" ref={sectionRef}>
      <div className="services-inner">
        <h2 className="section-title">Our Tours</h2>
        
        {/* Category Menu */}
        <div style={{
          display: 'flex',
          gap: '12px',
          justifyContent: isMobile ? 'center' : 'flex-start',
          marginBottom: '40px',
          flexWrap: 'wrap'
        }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={activeCategory === cat ? 'btn-primary' : 'btn-secondary'}
              style={{ padding: '8px 24px', textTransform: 'capitalize' }}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="service-grid">
          {filteredTours.map(s => {
            const originalIndex = toursData.findIndex(t => t.id === s.id);
            const coverImage = BANNER_IMAGES[originalIndex % BANNER_IMAGES.length];
            
            return (
              <div key={s.id} className="card-container" onClick={() => onSelectTour(s.id)} style={{ cursor: 'pointer' }}>
                <div className="service-card">
                  
                  <div className="service-img-wrapper">
                    <img src={coverImage} alt={s.title} loading="lazy" />
                  </div>

                  <div className="card-content">
                    <div className="tag" style={{
                      alignSelf: 'flex-start',
                      marginBottom: '15px'
                    }}>
                      {s.category}
                    </div>
                <h3 style={{ 
                  color: 'var(--color-primary-deep)', 
                  fontSize: '1.25rem',
                  marginBottom: '15px',
                  lineHeight: '1.3'
                }}>{s.title}</h3>
                <p style={{ 
                  fontSize: '0.9rem', 
                  color: 'var(--text-secondary)',
                  lineHeight: '1.6',
                  flexGrow: 1,
                  marginBottom: '20px'
                }}>{s.brief}</p>
                
                  <div style={{
                    marginTop: 'auto',
                    alignSelf: 'flex-start',
                    color: 'var(--color-accent-orange)',
                    fontSize: '0.95rem',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    View Experiences
                    <span style={{ fontSize: '1.2rem', transition: 'transform 0.3s' }} className="arrow">→</span>
                  </div>
                </div>
              </div>
            </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;
