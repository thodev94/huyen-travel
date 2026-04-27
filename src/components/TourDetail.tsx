"use client";
import React, { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import toursData from '../data/tours.json';
import { renderNode, DocNode } from '../utils/NodeMapper';
import imageMapData from '../data/imageMap.json';
import stepImagesData from '../data/stepImages.json';

const imageMap: Record<string, string[]> = imageMapData;
const stepImagesMap: Record<string, string[]> = stepImagesData;
import { useWindowSize } from '../hooks/useWindowSize';
import Gallery from './Gallery';

gsap.registerPlugin(useGSAP);

interface TourDetailProps {
  tourId: string;
  onClose?: () => void;
  onSelectTour?: (id: string) => void;
}

const BANNER_IMAGES = [
  "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=2000&auto=format&fit=crop", // Halong bay
  "https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=2000&auto=format&fit=crop", // Hoi An
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2000&auto=format&fit=crop", // Mountain
  "https://images.unsplash.com/photo-1583417319070-4a69db38a482?q=80&w=2000&auto=format&fit=crop", // Market
  "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2000&auto=format&fit=crop", // River
  "https://images.unsplash.com/photo-1534008897995-27a23e859048?q=80&w=2000&auto=format&fit=crop"  // Sapa
];

const TourDetail: React.FC<TourDetailProps> = ({ tourId, onClose, onSelectTour }) => {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const { width } = useWindowSize();
  const isMobile = width <= 768;
  const tourIndex = toursData.findIndex(t => t.id === tourId);
  const tour = toursData[tourIndex];

  useGSAP(() => {
    if (isMobile) return; // disable detail animations on mobile
    const tl = gsap.timeline();
    tl.from('.detail-anim', {
      opacity: 0,
      y: 30,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power3.out'
    });
  }, { scope: containerRef });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [tourId]);


  if (!tour) return null;

  const phoneNumber = '+84364399290';
  const whatsappLink = `https://wa.me/${phoneNumber.replace('+', '')}?text=Hi,+I+am+interested+in+the+${encodeURIComponent(tour.title)}+tour.`;
  const smsLink = `sms:${phoneNumber}?body=Hi,+I+am+interested+in+the+${encodeURIComponent(tour.title)}+tour.`;

  return (
    <div ref={containerRef} style={{
      width: '100%',
      minHeight: '100vh',
      background: 'var(--bg-soft)',
      // paddingBottom: '20px', /* Reduced padding since footer is right below */
      paddingTop: isMobile ? '50px' : '100px', /* Added for fixed navbar */
      overflowX: 'hidden',

    }}>

      <div style={{
        width: '100%',
        background: 'var(--bg-soft)',
        padding: '20px 10px',
        position: 'relative',
        zIndex: 5,
        boxShadow: '0 -10px 40px rgba(0,0,0,0.08)',
        maxWidth: "1536px",
        margin: '0 auto',
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
          marginBottom: isMobile ? '10px' : '40px'
        }}>
          {tour.category}
        </div>


        {/* Content Body */}
        <div className="tour-content detail-anim" style={{
          background: 'var(--bg-black)',
          padding: isMobile ? '10px 20px' : '50px',
          borderRadius: isMobile ? '16px' : '24px',
          boxShadow: '0 10px 40px rgba(47, 93, 80, 0.05)',
          border: '1px solid var(--border-color)',
          fontSize: '1.1rem',
          color: 'var(--text-dark)'

        }}>
          {(() => {
            const folder = (tour as any).folder as keyof typeof stepImagesMap;
            const stepImages = stepImagesMap[folder] || [];
            let listOrderedCount = 0;
            return (tour.nodes as DocNode[]).map((node, index) => {
              let currentListIndex = -1;
              if (node.type === 'list-ordered') {
                currentListIndex = listOrderedCount;
                listOrderedCount++;
              }
              return renderNode(node, index, false, stepImages, currentListIndex);
            });
          })()}
        </div>

        {/* Gallery for this tour */}
        <Gallery onSelectTour={onSelectTour} />

      </div>
    </div>
  );
};


export default TourDetail;
