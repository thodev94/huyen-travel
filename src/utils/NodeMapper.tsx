"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';

export interface DocNode {
  type: string;
  text?: string;
  html?: string;
  level?: number;
  items?: string[];
  src?: string;
  rows?: string[][];

}

import { useWindowSize } from '../hooks/useWindowSize';

const AutoSlider = ({ images }: { images: string[] }) => {
  const [shuffledImages, setShuffledImages] = useState<string[]>(images);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const { width } = useWindowSize();
  const isMobile = width <= 768;
  const isLarge = width >= 1600; // Show 3 images on screens 1600px and up (like 1920px)
  const itemsToShow = isMobile ? 1 : (isLarge ? 3 : 2);

  useEffect(() => {
    if (!images || images.length <= 1) {
      setMounted(true);
      return;
    }
    // Shuffle images array using Fisher-Yates algorithm
    const shuffled = [...images];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setShuffledImages(shuffled);
    setMounted(true);
  }, [images]);

  if (!images || images.length === 0) return null;

  const displayImages = mounted ? shuffledImages : images;
  const maxIndex = Math.max(0, displayImages.length - itemsToShow);

  const nextSlide = () => {
    setCurrentIndex(prev => prev >= maxIndex ? 0 : prev + 1);
  };

  const prevSlide = () => {
    setCurrentIndex(prev => prev <= 0 ? maxIndex : prev - 1);
  };

  return (
    <div className="list-step-image" style={{
      position: 'relative',
      display: 'flex',
      overflow: 'hidden',
      background: 'transparent',
      boxShadow: 'none',
      borderRadius: 0,
      minHeight: isMobile ? '300px' : '400px'
    }}>
      <div style={{
        display: 'flex',
        width: '100%',
        flex: 1,
        transition: 'transform 0.5s ease-in-out',
        transform: `translateX(-${currentIndex * (100 / itemsToShow)}%)`
      }}>
        {displayImages.map((src, idx) => (
          <div key={idx} style={{
            flex: `0 0 ${100 / itemsToShow}%`,
            position: 'relative',
            height: '100%',
            padding: itemsToShow > 1 ? '0 10px' : '0'
          }}>
            <div style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 15px 35px rgba(0, 0, 0, 0.12)'
            }}>
              <Image
                src={src}
                alt="Itinerary step illustration"
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
          </div>
        ))}
      </div>

      {images.length > 1 && (
        <>
          <button onClick={prevSlide} aria-label="Previous image" style={{
            position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: itemsToShow > 1 ? '20px' : '10px', zIndex: 10,
            background: 'rgba(255,255,255,0.85)', border: 'none', borderRadius: '50%',
            width: '40px', height: '40px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)', color: 'var(--color-primary-deep)', fontSize: '1.5rem', fontWeight: 'bold'
          }}>
            &#8249;
          </button>
          <button onClick={nextSlide} aria-label="Next image" style={{
            position: 'absolute', top: '50%', transform: 'translateY(-50%)', right: itemsToShow > 1 ? '20px' : '10px', zIndex: 10,
            background: 'rgba(255,255,255,0.85)', border: 'none', borderRadius: '50%',
            width: '40px', height: '40px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)', color: 'var(--color-primary-deep)', fontSize: '1.5rem', fontWeight: 'bold'
          }}>
            &#8250;
          </button>
        </>
      )}
    </div>
  );
};

export const renderNode = (node: DocNode, index: number, isWhiteBackground?: boolean, stepImages?: string[], listIndex?: number) => {
  switch (node.type) {
    case 'heading':
      const HTag = `h${node.level}` as keyof JSX.IntrinsicElements;
      return <HTag key={index} style={{ color: 'var(--color-primary-deep)', marginTop: '40px', marginBottom: '20px' }}>{node.text}</HTag>;

    case 'paragraph':
      if (node.text && (
        node.text.toLowerCase().includes('itinerary') || 
        node.text.toLowerCase().includes('highlights') ||
        node.text.toLowerCase().includes('hành trình')
      )) {
        return (
          <h2 key={index} style={{
            fontSize: '1.45rem',
            fontWeight: 800,
            color: '#0F172A',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginTop: '36px',
            marginBottom: '20px'
          }}>
            <span style={{
              width: '26px',
              height: '26px',
              borderRadius: '50%',
              backgroundColor: 'rgba(34, 197, 94, 0.1)',
              color: '#22C55E',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.85rem',
              fontWeight: 'bold'
            }}>✓</span>
            {node.text.replace('✅', '').replace('🗺️', '').trim()}
          </h2>
        );
      }
      if (node.html) {
        return <p key={index} dangerouslySetInnerHTML={{ __html: node.html }} style={{ marginBottom: '12px', lineHeight: '1.6', color: '#475569', fontSize: '1.02rem' }} />;
      }
      return <p key={index} style={{ marginBottom: '12px', lineHeight: '1.6', color: '#475569', fontSize: '1.02rem' }}>{node.text}</p>;

    case 'list-unordered':
      return (
        <ul key={index} style={{ marginBottom: '20px', paddingLeft: '20px', lineHeight: '1.6', color: '#475569' }}>
          {node.items?.map((item, i) => (
            <li key={i} style={{ marginBottom: '8px' }}>{item}</li>
          ))}
        </ul>
      );

    case 'list-ordered':
      return (
        <div key={index} className="itinerary-timeline-vertical" style={{
          position: 'relative',
          paddingLeft: '32px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          marginTop: '24px',
          marginBottom: '32px'
        }}>
          {/* Continuous Vertical Line */}
          <div style={{
            position: 'absolute',
            left: '11px',
            top: '12px',
            bottom: '12px',
            width: '2px',
            backgroundColor: '#E2E8F0',
          }} />

          {node.items?.map((item, i) => {
            const parts = item.split(':');
            const stepTitle = parts[0]?.trim();
            const stepDesc = parts.slice(1).join(':')?.trim();

            return (
              <div key={i} style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'flex-start',
              }}>
                {/* Step Circle Marker */}
                <div style={{
                  position: 'absolute',
                  left: '-32px',
                  top: '4px',
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: '#16A34A',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  zIndex: 2,
                }}>
                  {i + 1}
                </div>

                {/* Content Box */}
                <div style={{
                  width: '100%',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  padding: '18px 24px',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.02)',
                  border: '1px solid rgba(0, 0, 0, 0.03)',
                  marginLeft: '12px'
                }}>
                  <h4 style={{
                    fontSize: '1.05rem',
                    fontWeight: 700,
                    color: '#0F172A',
                    margin: '0 0 6px 0',
                    lineHeight: '1.3'
                  }}>
                    {stepTitle}
                  </h4>
                  {stepDesc && (
                    <p style={{
                      fontSize: '0.92rem',
                      color: '#64748B',
                      margin: 0,
                      lineHeight: '1.5',
                      fontWeight: 400
                    }}>
                      {stepDesc}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      );

    case 'image':
      if (!node.src) return null;
      return (
        <Image
          key={index}
          src={node.src}
          alt={node?.text || ''}
          width={800}
          height={450}
          style={{ maxWidth: '100%', borderRadius: '12px', margin: '20px 0', boxShadow: '0 8px 25px rgba(0,0,0,0.05)' }}
        />
      );

    case 'table':
      return (
        <div key={index} style={{ overflowX: 'auto', marginBottom: '30px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--text-primary)', textAlign: 'left' }}>
            <tbody>
              {node.rows?.map((row, r) => (
                <tr key={r} style={{ borderBottom: '1px solid var(--border-color)', background: r % 2 === 0 ? 'var(--bg-pure)' : 'var(--bg-main)' }}>
                  {row.map((cell, c) => (
                    <td key={c} style={{ padding: '15px' }}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    default:
      if (node.text) {
        return <span key={index}>{node.text}</span>;
      }
      return null;
  }
};
