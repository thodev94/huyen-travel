import React from 'react';
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

export const renderNode = (node: DocNode, index: number) => {
  switch (node.type) {
    case 'heading':
      const HTag = `h${node.level}` as keyof JSX.IntrinsicElements;
      return <HTag key={index} style={{ color: 'var(--color-primary-deep)', marginTop: '40px', marginBottom: '20px' }}>{node.text}</HTag>;
    
    case 'paragraph':
      if (node.html) {
        return <p key={index} dangerouslySetInnerHTML={{ __html: node.html }} style={{ marginBottom: '20px', lineHeight: '1.8', color: 'var(--text-secondary)' }} />;
      }
      return <p key={index} style={{ marginBottom: '20px', lineHeight: '1.8', color: 'var(--text-secondary)' }}>{node.text}</p>;
    
    case 'list-unordered':
      return (
        <ul key={index} style={{ marginBottom: '30px', paddingLeft: '25px', lineHeight: '1.8', color: 'var(--text-secondary)' }}>
          {node.items?.map((item, i) => (
            <li key={i} style={{ marginBottom: '10px' }}>{item}</li>
          ))}
        </ul>
      );
      
    case 'list-ordered':
      // Render as a zigzag Itinerary Timeline
      return (
        <div key={index} className="itinerary-timeline" style={{ position: 'relative', margin: '60px 0', padding: '20px 0' }}>
          {/* Vertical Line */}
          <div className="itinerary-timeline-line" style={{
            position: 'absolute',
            left: '50%',
            top: 0,
            bottom: 0,
            width: '4px',
            background: 'var(--border-color)',
            transform: 'translateX(-50%)',
            zIndex: 1
          }}></div>

          {node.items?.map((item, i) => {
            const isEven = i % 2 === 0;
            const imgSrc = TEMPORARY_IMAGES[i % TEMPORARY_IMAGES.length];
            return (
              <div key={i} className={`itinerary-item ${isEven ? 'even' : 'odd'}`}>
                {/* Step Circle Marker */}
                <div className="itinerary-step-marker" style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  background: 'var(--color-primary-bright)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  zIndex: 2,
                  boxShadow: '0 0 0 6px var(--bg-pure)'
                }}>
                  {i + 1}
                </div>

                {/* Arrow pointing down below the step (except last item) */}
                {i < (node.items?.length || 0) - 1 && (
                  <div className="itinerary-arrow" style={{
                    position: 'absolute',
                    left: '50%',
                    top: 'calc(50% + 35px)',
                    transform: 'translateX(-50%)',
                    color: 'var(--color-accent-orange)',
                    fontSize: '1.5rem',
                    zIndex: 2,
                    textShadow: '0 2px 5px rgba(0,0,0,0.1)'
                  }}>
                    ↓
                  </div>
                )}

                {/* Content Box */}
                <div className="itinerary-item-left">
                  <div className="itinerary-text-box" style={{
                    background: 'var(--bg-main)',
                    padding: '30px',
                    borderRadius: '16px',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
                    border: '1px solid var(--border-color)',
                    width: '100%',
                    maxWidth: '800px'
                  }}>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', margin: 0 }}>{item}</p>
                  </div>
                </div>

                {/* Image Box */}
                <div className="itinerary-item-right">
                  <Image src={imgSrc} alt={`Stop ${i + 1}`} width={800} height={280} style={{
                    objectFit: 'cover',
                    borderRadius: '16px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.08)'
                  }} />
                </div>
              </div>
            );
          })}
        </div>
      );

    case 'image':
      const imgSrc = node.src || TEMPORARY_IMAGES[0];
      return <Image key={index} src={imgSrc} alt="" width={800} height={450} style={{ maxWidth: '100%', borderRadius: '12px', margin: '30px 0', boxShadow: '0 8px 25px rgba(0,0,0,0.05)' }} />;
    
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
