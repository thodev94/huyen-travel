import React, { useState, useRef, useEffect } from 'react';
import { useWindowSize } from '../../hooks/useWindowSize';
import aboutData from '../../../public/data/about.json';
import { renderNode, DocNode } from '../../utils/NodeMapper';
import './About.css';

const About: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { width } = useWindowSize();
  const isMobile = width <= 768;
  const [mounted, setMounted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const journeyNodes: DocNode[] = (aboutData as any)['My Journey into the Tourism Business']?.nodes || [];

  const box2 = (
    <a
      href="https://www.withlocals.com/host/huyenbc46ed92ab/"
      target="_blank"
      rel="noopener noreferrer"
      className="box2 about-anim"
    >
      <div className="box2-rating-wrap">
        <h2 className="box2-rating">4.9+</h2>
        <svg className="box2-rating-icon" width="32" height="32" viewBox="0 0 24 24" fill="#FBBF24">
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
        <svg className="box2-rating-icon" width="32" height="32" viewBox="0 0 24 24" fill="#FBBF24">
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
        <svg className="box2-rating-icon" width="32" height="32" viewBox="0 0 24 24" fill="#FBBF24">
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
        <svg className="box2-rating-icon" width="32" height="32" viewBox="0 0 24 24" fill="#FBBF24">
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
        <svg className="box2-rating-icon" width="32" height="32" viewBox="0 0 24 24" fill="#FBBF24">
          <path d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4V6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z" />
        </svg>

      </div>
      <p className="box2-reviews">400+ Reviews</p>
      <div className="box2-btn">
        Reviews on Withlocals
        <svg className="box2-btn-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="7" y1="17" x2="17" y2="7" />
          <polyline points="7 7 17 7 17 17" />
        </svg>
      </div>
      <div className="box2-languages">
        <h3>Languages</h3>
        <div className="tags-wrapper">
          <span className="tag-en">ENGLISH (FLUENT)</span>
          <span className="tag-vi">VIETNAMESE (NATIVE)</span>
        </div>
      </div>
    </a>
  );

  const box3 = (
    <div className="box3 about-anim">
      <h3>Perks & Skills</h3>
      <ul className="box3-list">
        <li>
          <svg className="box3-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Licensed Professional Guide
        </li>
        <li>
          <svg className="box3-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Tourism Degree
        </li>
        <li>
          <svg className="box3-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Photography Assistant
        </li>
        <li>
          <svg className="box3-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Private small &amp; large group Leading
        </li>
        <li>
          <svg className="box3-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Hidden Gems Specialist
        </li>
      </ul>
    </div>
  );

  const box4 = (
    <div className="box4 about-anim">
      <div className={`box4-content-wrap ${isExpanded ? 'expanded' : 'collapsed'}`}>
        {journeyNodes.length > 0 && renderNode(journeyNodes[0], 0, true)}
        <img
          src="/images/avatar/avatar.png"
          alt="Huyen - Tour Guide"
          className="journey-avatar"
        />
        {journeyNodes.slice(1).map((node, i) => renderNode(node, i + 1, true))}

        {!isExpanded && <div className="box4-fade"></div>}
      </div>

      <div className="box4-btn-wrap">
        <button onClick={() => setIsExpanded(!isExpanded)} className="box4-btn">
          {isExpanded ? 'Read Less ↑' : 'Read More ↓'}
        </button>
      </div>
    </div>
  );

  return (
    <section id="about" className="about" ref={sectionRef}>
      <div className="about-inner">
        <h2 className="section-title about-anim">About Me</h2>

        <div className="bento-grid">
          {box2}
          {box3}
          {box4}
        </div>
      </div>
    </section>
  );
};

export default About;
