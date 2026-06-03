"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import './NodeMapper.css';

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
  const isLarge = width >= 1600;
  const itemsToShow = isMobile ? 1 : (isLarge ? 3 : 2);

  useEffect(() => {
    if (!images || images.length <= 1) {
      setMounted(true);
      return;
    }
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
    <div className="slider-container">
      <div className="slider-track" style={{ transform: `translateX(-${currentIndex * (100 / itemsToShow)}%)` }}>
        {displayImages.map((src, idx) => (
          <div key={idx} className="slider-item" style={{ flex: `0 0 ${100 / itemsToShow}%`, padding: itemsToShow > 1 ? '0 10px' : '0' }}>
            <div className="slider-item-inner">
              <Image src={src} alt="Itinerary step illustration" fill className="slider-image" />
            </div>
          </div>
        ))}
      </div>

      {images.length > 1 && (
        <>
          <button onClick={prevSlide} aria-label="Previous image" className="slider-btn prev">&#8249;</button>
          <button onClick={nextSlide} aria-label="Next image" className="slider-btn next">&#8250;</button>
        </>
      )}
    </div>
  );
};

export const renderNode = (node: DocNode, index: number, isWhiteBackground?: boolean, stepImages?: string[], listIndex?: number) => {
  switch (node.type) {
    case 'heading':
      const HTag = `h${node.level}` as keyof JSX.IntrinsicElements;
      return <HTag key={index} className="node-heading">{node.text}</HTag>;

    case 'paragraph':
      if (node.text && (
        node.text.toLowerCase().includes('itinerary') || 
        node.text.toLowerCase().includes('highlights') ||
        node.text.toLowerCase().includes('hành trình')
      )) {
        return (
          <h2 key={index} className="itinerary-highlight">
            <span className="itinerary-highlight-icon">✓</span>
            {node.text.replace('✅', '').replace('🗺️', '').trim()}
          </h2>
        );
      }
      if (node.html) {
        return <p key={index} dangerouslySetInnerHTML={{ __html: node.html }} className="node-paragraph" />;
      }
      return <p key={index} className="node-paragraph">{node.text}</p>;

    case 'list-unordered':
      return (
        <ul key={index} className="node-list-unordered">
          {node.items?.map((item, i) => (
            <li key={i} className="node-list-item">{item}</li>
          ))}
        </ul>
      );

    case 'list-ordered':
      return (
        <div key={index} className="itinerary-timeline-vertical">
          <div className="itinerary-timeline-line" />
          {node.items?.map((item, i) => {
            const parts = item.split(':');
            const stepTitle = parts[0]?.trim();
            const stepDesc = parts.slice(1).join(':')?.trim();

            return (
              <div key={i} className="itinerary-step">
                <div className="itinerary-step-number">{i + 1}</div>
                <div className="itinerary-step-content">
                  <h4 className="itinerary-step-title">{stepTitle}</h4>
                  {stepDesc && <p className="itinerary-step-desc">{stepDesc}</p>}
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
          className="node-image"
        />
      );

    case 'table':
      return (
        <div key={index} className="node-table-wrapper">
          <table className="node-table">
            <tbody>
              {node.rows?.map((row, r) => (
                <tr key={r} className={r % 2 === 0 ? 'even' : 'odd'}>
                  {row.map((cell, c) => (
                    <td key={c}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    default:
      if (node.text) return <span key={index}>{node.text}</span>;
      return null;
  }
};
