import React from 'react';
import { GlassElement } from '../GlassElement/GlassElement';
import { useWindowSize } from '../hooks/useWindowSize';

const galleryImages = [
  "https://images.unsplash.com/photo-1583417319070-4a69db38a482?q=80&w=1200&auto=format&fit=crop", // Cityscape (Works)
  "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1200&auto=format&fit=crop", // Food (Works)
  "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?q=80&w=1200&auto=format&fit=crop", // Venice-like (Works)
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1200&auto=format&fit=crop", // Lake (Works)
  "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1200&auto=format&fit=crop", // Paris (Works - consistent loading)
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"  // Nature (Works)
];

const Gallery: React.FC = () => {
  const { width } = useWindowSize();
  const isMobile = width < 768;

  const bentoGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 285px)',
    gridTemplateRows: isMobile ? 'auto' : 'repeat(3, 200px)',
    gap: '20px',
    justifyContent: 'center',
    margin: '0 auto',
    width: 'max-content'
  };

  const getFullWidth = () => width * 0.9;

  // Bento configuration for 6 items to fill 3 rows (4 cols each)
  // [colSpan, rowSpan, width on desktop, height on desktop]
  const galleryItems = [
    { spanC: 2, spanR: 1, w: 590, h: 200 }, // Row 1, Col 1-2
    { spanC: 1, spanR: 1, w: 285, h: 200 }, // Row 1, Col 3
    { spanC: 1, spanR: 2, w: 285, h: 420 }, // Row 1-2, Col 4
    { spanC: 3, spanR: 1, w: 895, h: 200 }, // Row 2, Col 1-3
    { spanC: 1, spanR: 1, w: 285, h: 200 }, // Row 3, Col 1
    { spanC: 3, spanR: 1, w: 895, h: 200 }  // Row 3, Col 2-4
  ];

  return (
    <section id="gallery" className="gallery" style={{ padding: isMobile ? '60px 0' : '100px 0', background: 'rgba(0, 0, 0, 0.4)' }}>
      <div className="gallery-inner" style={{ maxWidth: '1240px', margin: '0 auto' }}>
        <h2 className="section-title" style={{ textAlign: 'left', marginBottom: '60px', color: 'white' }}>Saigon Journal</h2>

        <div style={bentoGridStyle}>
          {galleryImages.map((img, index) => {
            const config = galleryItems[index % galleryItems.length];
            const w = isMobile ? getFullWidth() : config.w;
            const h = isMobile ? 250 : config.h;

            return (
              <div
                key={index}
                style={{
                  gridColumn: isMobile ? 'span 1' : `span ${config.spanC}`,
                  gridRow: isMobile ? 'span 1' : `span ${config.spanR}`
                }}
              >
                <GlassElement
                  width={w}
                  height={h}
                  radius={24}
                  depth={5}
                  blur={0.2}
                  chromaticAberration={1.5}
                >
                  <div style={{
                    width: '100%',
                    height: '100%',
                    overflow: 'hidden',
                    position: 'relative',
                    borderRadius: '24px',
                    // background: '#111',
                    padding: 10
                  }}>
                    <img
                      src={img}
                      alt={`Saigon view ${index + 1}`}
                      loading="lazy"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                        borderRadius: '24px',

                        transition: 'transform 0.8s cubic-bezier(0.2, 1, 0.3, 1)',
                      }}
                      className="gallery-img"
                    />
                    <div style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      width: '100%',
                      padding: '24px',
                      background: 'linear-gradient(transparent, rgba(0,0,0,0.85))',
                      color: 'white',
                      fontSize: '0.75rem',
                      letterSpacing: '2px',
                      textTransform: 'uppercase',
                      zIndex: 2
                    }}>
                      Saigon // 0{index + 1}
                    </div>
                  </div>
                </GlassElement>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Gallery;
