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

const TEMPORARY_IMAGES = [
  "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1583417319070-4a69db38a482?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=600&auto=format&fit=crop"
];

const AutoSlider = ({ images }: { images: string[] }) => {
  const [shuffledImages, setShuffledImages] = useState<string[]>(images);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

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

  useEffect(() => {
    if (!mounted || shuffledImages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % shuffledImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [mounted, shuffledImages]);

  if (!images || images.length === 0) return null;

  const displayImages = mounted ? shuffledImages : images;

  return (
    <div className="list-step-image" style={{ position: 'relative' }}>
      {displayImages.map((src, idx) => (
        <Image 
          key={src}
          src={src} 
          alt="Itinerary step illustration"
          fill
          style={{ 
            objectFit: 'cover',
            opacity: mounted ? (currentIndex === idx ? 1 : 0) : (idx === 0 ? 1 : 0),
            transition: 'opacity 1s ease-in-out'
          }}
        />
      ))}
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
          <div className="itinerary-timeline-vertical">
            {/* Continuous Vertical Line */}
            <div style={{
              position: 'absolute',
              left: '15px',
              top: '30px',
              bottom: '30px',
              width: '2px',
              background: 'linear-gradient(to bottom, var(--color-primary-bright), var(--color-accent-orange))',
              zIndex: 1,
              opacity: 0.5
            }}></div>

            {node.items?.map((item, i) => {
              return (
                <div key={i} style={{ display: 'flex', position: 'relative', marginBottom: i === (node.items?.length || 0) - 1 ? '0' : '30px', width: "100%" }}>

                  {/* Step Circle Marker */}
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'var(--color-primary-bright)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '0.9rem',
                    zIndex: 2,
                    boxShadow: '0 0 0 6px var(--bg-black)',
                    flexShrink: 0,
                    marginRight: '20px',
                    marginTop: '10px'
                  }}>
                    {i + 1}
                  </div>

                  {/* Content Box */}
                  <div style={{
                    background: 'var(--bg-main)',
                    padding: '20px 25px',
                    borderRadius: '16px',
                    border: '1px solid var(--border-color)',
                    flex: 1,
                    boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
                    position: 'relative'
                  }}>
                    {/* Small Speech Bubble Arrow */}
                    <div style={{
                      position: 'absolute',
                      left: '-8px',
                      top: '16px',
                      width: '0',
                      height: '0',
                      borderTop: '8px solid transparent',
                      borderBottom: '8px solid transparent',
                      borderRight: '8px solid var(--border-color)'
                    }}></div>
                    <div style={{
                      position: 'absolute',
                      left: '-7px',
                      top: '16px',
                      width: '0',
                      height: '0',
                      borderTop: '8px solid transparent',
                      borderBottom: '8px solid transparent',
                      borderRight: '8px solid var(--bg-main)'
                    }}></div>

                    <p style={{ color: 'var(--text-primary)', lineHeight: '1.7', margin: 0 }}>{item}</p>
                  </div>

                </div>
              );
            })}
          </div>

          {/* List Slider beside the steps */}
          {stepImages && stepImages.length > 0 && (
            <AutoSlider images={stepImages} />
          )}
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
