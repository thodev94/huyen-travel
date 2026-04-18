"use client";
import React, { useEffect, useMemo, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import toursData from '../data/tours.json';
import { renderNode, DocNode } from '../utils/NodeMapper';
import { useWindowSize } from '../hooks/useWindowSize';

gsap.registerPlugin(useGSAP);

interface TourDetailProps {
  tourId: string;
  onClose?: () => void;
}

const BANNER_IMAGES = [
  "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=2000&auto=format&fit=crop", // Halong bay
  "https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=2000&auto=format&fit=crop", // Hoi An
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2000&auto=format&fit=crop", // Mountain
  "https://images.unsplash.com/photo-1583417319070-4a69db38a482?q=80&w=2000&auto=format&fit=crop", // Market
  "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2000&auto=format&fit=crop", // River
  "https://images.unsplash.com/photo-1534008897995-27a23e859048?q=80&w=2000&auto=format&fit=crop"  // Sapa
];

const TourDetail: React.FC<TourDetailProps> = ({ tourId, onClose }) => {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const { width } = useWindowSize();
  const isMobile = width < 768;
  const tourIndex = toursData.findIndex(t => t.id === tourId);
  const tour = toursData[tourIndex];

  useGSAP(() => {
    const tl = gsap.timeline();
    tl.from('.detail-anim', {
      opacity: 0,
      y: isMobile ? 15 : 30,
      duration: isMobile ? 0.4 : 0.8,
      stagger: isMobile ? 0.05 : 0.1,
      ease: 'power3.out'
    });
  }, { scope: containerRef });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const bannerImg = useMemo(() => {
    return BANNER_IMAGES[Math.max(0, tourIndex) % BANNER_IMAGES.length];
  }, [tourIndex]);

  if (!tour) return null;

  const phoneNumber = '+84364399290'; 
  const whatsappLink = `https://wa.me/${phoneNumber.replace('+', '')}?text=Hi,+I+am+interested+in+the+${encodeURIComponent(tour.title)}+tour.`;
  const smsLink = `sms:${phoneNumber}?body=Hi,+I+am+interested+in+the+${encodeURIComponent(tour.title)}+tour.`;

  return (
    <div ref={containerRef} style={{
      width: '100%',
      minHeight: '100vh',
      background: 'var(--bg-soft)',
      paddingBottom: '20px', /* Reduced padding since footer is right below */
      overflowX: 'hidden'
    }}>
      
      {/* Banner Area */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: isMobile ? '35vh' : '50vh',
        minHeight: '250px',
        maxHeight: '600px'
      }}>
        <Image
          src={bannerImg}
          alt={tour.title}
          fill
          style={{ objectFit: 'cover' }}
        />
        {/* Dark overlay for contrast */}
        <div style={{ 
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, 
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.2) 100%)' 
        }} />

        {/* Floating Back Button */}
        <div style={{ position: 'absolute', top: isMobile ? '20px' : '40px', left: isMobile ? '20px' : '40px', zIndex: 10 }}>
          <button 
            onClick={() => (onClose ? onClose() : router.push('/'))}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '8px',
              background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.4)',
              color: 'white', padding: '10px 20px', borderRadius: '30px', fontWeight: 600, cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)', transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
            onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
          >
            <span style={{ fontSize: '1.2rem' }}>←</span> Back to Tours
          </button>
        </div>
      </div>

      {/* Main Content Area overlapping the banner */}
      <div style={{ 
        width: '100%', 
        margin: isMobile ? '-40px 0 0 0' : '-80px 0 0 0', 
        background: 'var(--bg-main)',
        borderRadius: isMobile ? '24px 24px 0 0' : '40px 40px 0 0',
        padding: isMobile ? '40px 20px' : '80px 50px',
        position: 'relative',
        zIndex: 5,
        boxShadow: '0 -10px 40px rgba(0,0,0,0.08)'
      }}>

        {/* Title */}
        <h1 className="detail-anim" style={{ 
          fontSize: isMobile ? '2.2rem' : '3.8rem', 
          color: 'var(--color-primary-deep)', 
          fontWeight: 900,
          marginBottom: '15px',
          lineHeight: 1.1
        }}>
          {tour.title}
        </h1>
        
        <div className="tag detail-anim" style={{ 
          display: 'inline-block',
          marginBottom: '40px'
        }}>
          {tour.category}
        </div>

        {/* Action Buttons */}
        <div className="detail-anim" style={{ 
          display: 'flex', 
          gap: '15px', 
          marginBottom: '50px',
          flexWrap: 'wrap'
        }}>
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
            <button className="btn-primary" style={{ 
              backgroundColor: '#25D366', 
              boxShadow: '0 4px 15px rgba(37, 211, 102, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
            >
              <Image src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" width={22} height={22} style={{ filter: 'brightness(0) invert(1)' }} />
              WhatsApp
            </button>
          </a>
          
          <a href={smsLink} style={{ textDecoration: 'none' }}>
            <button className="btn-accent" style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
            >
              <span style={{ fontSize: '1.2rem' }}>✉️</span> SMS
            </button>
          </a>
        </div>

        {/* Content Body */}
        <div className="tour-content detail-anim" style={{
          background: 'var(--bg-pure)',
          padding: isMobile ? '30px 20px' : '50px',
          borderRadius: '24px',
          boxShadow: '0 10px 40px rgba(47, 93, 80, 0.05)',
          border: '1px solid var(--border-color)',
          fontSize: '1.1rem',
          color: 'var(--text-secondary)'
        }}>
          {(tour.nodes as DocNode[]).map((node, index) => renderNode(node, index))}
        </div>

      </div>
    </div>
  );
};

export default TourDetail;
