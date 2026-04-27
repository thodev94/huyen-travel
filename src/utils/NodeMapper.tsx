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
      if (node.html) {
        return <p key={index} dangerouslySetInnerHTML={{ __html: node.html }} style={{ marginBottom: '10px', lineHeight: '1.5', color: !isWhiteBackground ? 'var(--text-dark)' : 'var(--text-secondary)' }} />;
      }
      return <p key={index} style={{ marginBottom: '10px', lineHeight: '1.5', color: !isWhiteBackground ? 'var(--text-dark)' : 'var(--text-secondary)' }}>{node.text}</p>;

    case 'list-unordered':
      return (
        <ul key={index} style={{ marginBottom: '20px', paddingLeft: '25px', lineHeight: '1.5', color: !isWhiteBackground ? 'var(--text-dark)' : 'var(--text-secondary)' }}>
          {node.items?.map((item, i) => (
            <li key={i} style={{ marginBottom: '10px' }}>{item}</li>
          ))}
        </ul>
      );

    case 'list-ordered':
      // Render as a clean Vertical Itinerary Timeline with an image on the side
      const listImage = (listIndex !== undefined && listIndex !== -1 && stepImages && stepImages[listIndex]) ? stepImages[listIndex] : null;

      return (
        <div key={index} className="list-ordered-container">
          {/* List Slider beside the steps */}
          {stepImages && stepImages.length > 0 && listIndex == 0 && (
            <AutoSlider images={stepImages} />
          )}
          <div className="itinerary-timeline-vertical">
            {/* Continuous Vertical Line */}
            <div className="itinerary-vertical-line"></div>

            {node.items?.map((item, i) => {
              return (
                <div key={i} className="itinerary-step-wrapper" style={{ marginBottom: i === (node.items?.length || 0) - 1 ? '0' : '30px' }}>

                  {/* Step Circle Marker */}
                  <div className="itinerary-step-marker">
                    {i + 1}
                  </div>

                  {/* Content Box */}
                  <div className="itinerary-content-box">
                    {/* Small Speech Bubble Arrow */}
                    <div className="itinerary-speech-arrow"></div>

                    <p style={{ color: 'var(--text-primary)', lineHeight: '1.7', margin: 0 }}>{item}</p>
                  </div>

                </div>
              );
            })}
          </div>


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
