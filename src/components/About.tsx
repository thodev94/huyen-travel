import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useWindowSize } from '../hooks/useWindowSize';
import aboutData from '../data/about.json';
import { renderNode, DocNode } from '../utils/NodeMapper';
import './About.css';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const About: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { width } = useWindowSize();
  const isMobile = width <= 768;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Use this flag for conditional rendering so server and initial client markup match
  const mobileRender = mounted && isMobile;
  const [isExpanded, setIsExpanded] = useState(false);

  useGSAP(() => {
    if (isMobile) return; // don't run ScrollTrigger/GSAP on mobile
    gsap.fromTo(
      '.about-anim',
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        }
      }
    );
  }, { scope: sectionRef });

  const bentoGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: mobileRender ? '1fr' : 'repeat(4, 1fr)',
    gridTemplateRows: mobileRender ? 'auto' : 'auto auto',
    gap: '16px',
    margin: 0
  };

  const journeyNodes: DocNode[] = (aboutData as any)['My Journey into the Tourism Business']?.nodes || [];

  const box1 = (
    <div className="glass-panel about-anim" style={{ padding: '24px', gridColumn: mobileRender ? 'span 1' : 'span 2' }}>
      <h3 style={{ color: 'var(--color-primary-deep)', marginBottom: '15px' }}>Languages</h3>
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <span className="tag">English (Fluent)</span>
        <span className="tag">Vietnamese (Native)</span>
      </div>
    </div>
  );

  const box2 = (
    <a
      href="https://www.withlocals.com/host/huyenbc46ed92ab/"
      target="_blank"
      rel="noopener noreferrer"
      className="glass-panel about-anim"
      style={{
        padding: '24px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        textDecoration: 'none',
        cursor: 'pointer'
      }}
    >
      <h2 style={{ fontSize: '3rem', margin: 0, color: 'var(--color-primary-bright)' }}>4.9+</h2>
      <p style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Avg. Rating</p>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>350+ Reviews</p>
      <div style={{ fontSize: '0.75rem', color: 'var(--color-accent-orange)', marginTop: '10px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
        View on Withlocals <span>↗</span>
      </div>
    </a>
  );

  const box3 = (
    <div className="glass-panel about-anim" style={{ padding: '24px', gridRow: mobileRender ? 'span 1' : 'span 2' }}>
      <h3 style={{ color: 'var(--color-primary-deep)', marginBottom: '15px' }}>Persk & Skills</h3>
      <ul style={{ listStyle: 'none', lineHeight: '2.2', padding: 0, color: 'var(--text-secondary)' }}>
        <li><span style={{ color: 'var(--color-secondary-teal)' }}>✓</span> Licensed Professional Guide</li>
        <li><span style={{ color: 'var(--color-secondary-teal)' }}>✓</span> Tourism Degree</li>
        <li><span style={{ color: 'var(--color-secondary-teal)' }}>✓</span> Photography Assistant</li>
        <li><span style={{ color: 'var(--color-secondary-teal)' }}>✓</span> SIM Card & Local Logistics</li>
        <li><span style={{ color: 'var(--color-secondary-teal)' }}>✓</span> Hidden Gems Specialist</li>
      </ul>
    </div>
  );

  const box4 = (
    <div className="glass-panel about-anim" style={{ padding: '30px', gridColumn: mobileRender ? 'span 1' : 'span 3', position: 'relative' }}>
      <div style={{
        maxHeight: isExpanded ? '5000px' : '280px',
        overflow: 'hidden',
        transition: 'max-height 0.8s ease-in-out',
        position: 'relative'
      }}>
        {journeyNodes.length > 0 && renderNode(journeyNodes[0], 0, true)}
        <img
          src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=300&h=300&fit=crop"
          alt="Huyen - Tour Guide"
          className="journey-avatar"
        />
        {journeyNodes.slice(1).map((node, i) => renderNode(node, i + 1, true))}

        {!isExpanded && (
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '100px',
            background: 'linear-gradient(to bottom, rgba(255,255,255,0) 0%, var(--bg-pure) 90%)',
            pointerEvents: 'none'
          }}></div>
        )}
      </div>

      <div style={{ textAlign: 'center', marginTop: '15px' }}>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="btn-secondary"
          style={{
            padding: '8px 24px',
            fontSize: '0.9rem',
            borderRadius: '20px'
          }}
        >
          {isExpanded ? 'Read Less ↑' : 'Read More ↓'}
        </button>
      </div>
    </div>
  );

  return (
    <section id="about" className="about" ref={sectionRef}>
      <div className="about-inner">
        <h2 className="section-title about-anim">About Me</h2>

        <div className="bento-grid" style={bentoGridStyle}>
          {mobileRender ? (
            <>
              {box4}
              {box1}
              {box2}
              {box3}
            </>
          ) : (
            <>
              {box1}
              {box2}
              {box3}
              {box4}
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default About;
