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
    <div className="glass-panel about-anim" style={{
      padding: '24px',
      gridColumn: mobileRender ? 'span 1' : 'span 2',
      background: '#FFFFFF',
      borderRadius: '24px',
      borderTop: '4px solid #E53935',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.04)'
    }}>
      <h3 style={{ color: '#E53935', marginBottom: '15px', fontWeight: '800' }}>Languages</h3>
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <span className="tag" style={{
          background: '#FEF2F2',
          border: '1px solid #FCA5A5',
          color: '#EF4444',
          borderRadius: '8px',
          padding: '8px 16px',
          fontWeight: '700',
          fontSize: '0.85rem'
        }}>ENGLISH (FLUENT)</span>
        <span className="tag" style={{
          background: '#FFFBEB',
          border: '1px solid #FDE68A',
          color: '#D97706',
          borderRadius: '8px',
          padding: '8px 16px',
          fontWeight: '700',
          fontSize: '0.85rem'
        }}>VIETNAMESE (NATIVE)</span>
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
        alignItems: 'center',
        textDecoration: 'none',
        cursor: 'pointer',
        background: '#10B981',
        borderRadius: '24px',
        color: '#FFFFFF',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.04)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
        <h2 style={{ fontSize: '3rem', margin: 0, color: '#FFFFFF', fontWeight: '800' }}>4.9+</h2>
        <span style={{ fontSize: '2.2rem', color: '#FBBF24' }}>★</span>
      </div>
      <p style={{ color: '#FFFFFF', fontWeight: 700, margin: '2px 0 0' }}>Avg. Rating</p>
      <p style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.8)', margin: '2px 0 12px' }}>350+ Reviews</p>
      <div style={{
        background: '#FFFFFF',
        color: '#0F172A',
        border: '2px solid #0F172A',
        padding: '8px 20px',
        borderRadius: '30px',
        fontSize: '0.75rem',
        fontWeight: '800',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
      }}>
        View on Withlocals ↗
      </div>
    </a>
  );

  const box3 = (
    <div className="glass-panel about-anim" style={{
      padding: '24px',
      gridRow: mobileRender ? 'span 1' : 'span 2',
      background: '#FFFFFF',
      borderRadius: '24px',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.04)'
    }}>
      <h3 style={{ color: '#E53935', marginBottom: '20px', fontWeight: '800' }}>Perks & Skills</h3>
      <ul style={{ listStyle: 'none', lineHeight: '2.5', padding: 0, color: 'var(--text-secondary)' }}>
        <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><span style={{ color: '#E53935', fontWeight: 'bold' }}>✓</span> Licensed Professional Guide</li>
        <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><span style={{ color: '#E53935', fontWeight: 'bold' }}>✓</span> Tourism Degree</li>
        <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><span style={{ color: '#E53935', fontWeight: 'bold' }}>✓</span> Photography Assistant</li>
        <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><span style={{ color: '#E53935', fontWeight: 'bold' }}>✓</span> SIM Card & Local Logistics</li>
        <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><span style={{ color: '#E53935', fontWeight: 'bold' }}>✓</span> Hidden Gems Specialist</li>
      </ul>
    </div>
  );

  const box4 = (
    <div className="glass-panel about-anim" style={{
      padding: '30px',
      gridColumn: mobileRender ? 'span 1' : 'span 3',
      position: 'relative',
      background: '#FFFFFF',
      borderRadius: '24px',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.04)'
    }}>
      <div style={{
        maxHeight: isExpanded ? '5000px' : '280px',
        overflow: 'hidden',
        transition: 'max-height 0.8s ease-in-out',
        position: 'relative'
      }}>
        {journeyNodes.length > 0 && renderNode(journeyNodes[0], 0, true)}
        <img
          src="/images/avatar/avatar.png"
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
            background: 'linear-gradient(to bottom, rgba(255,255,255,0) 0%, #FFFFFF 90%)',
            pointerEvents: 'none'
          }}></div>
        )}
      </div>

      <div style={{ textAlign: 'center', marginTop: '15px' }}>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          style={{
            padding: '10px 30px',
            fontSize: '0.9rem',
            borderRadius: '20px',
            background: '#E53935',
            color: '#FFFFFF',
            border: 'none',
            fontWeight: '700',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(229, 57, 53, 0.2)'
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
