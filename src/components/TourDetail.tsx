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
import styles from './TourDetail.module.css';

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

  // Phân tách các node paragraph giới thiệu và itinerary
  const { headerParagraphs, remainingNodes } = useMemo(() => {
    const header: DocNode[] = [];
    const remaining: DocNode[] = [];
    let foundList = false;

    if (!tour) return { headerParagraphs: header, remainingNodes: remaining };

    for (const node of tour.nodes as DocNode[]) {
      if (
        node.type === 'list-ordered' ||
        node.type === 'list-unordered' ||
        node.type === 'image' ||
        node.type === 'table'
      ) {
        foundList = true;
      }
      if (!foundList && node.type === 'paragraph') {
        header.push(node);
      } else {
        remaining.push(node);
      }
    }
    return { headerParagraphs: header, remainingNodes: remaining };
  }, [tour]);

  // Trích xuất Title, Subtitle và Description từ header paragraphs để hiển thị đẹp đẽ
  const { displayTitle, displaySubtitle, displayDesc, paragraphsToSkip } = useMemo(() => {
    let title = tour?.title || '';
    let subtitle = tour?.category || '';
    let desc = tour?.brief || '';
    let skip = 0;

    if (!tour) return { displayTitle: title, displaySubtitle: subtitle, displayDesc: desc, paragraphsToSkip: skip };

    if (headerParagraphs.length >= 1) {
      const firstText = headerParagraphs[0].text || '';
      const isTitleLike = firstText.toLowerCase() === tour.title.toLowerCase() ||
        tour.title.toLowerCase().includes(firstText.toLowerCase()) ||
        firstText.toLowerCase().includes(tour.title.toLowerCase());

      if (isTitleLike) {
        title = firstText;
        skip = 1;

        if (headerParagraphs.length >= 2) {
          subtitle = headerParagraphs[1].text || tour.category;
          skip = 2;

          if (headerParagraphs.length >= 3) {
            desc = headerParagraphs[2].text || tour.brief;
            skip = 3;
          } else {
            desc = tour.brief || '';
          }
        } else {
          subtitle = tour.category;
          desc = tour.brief || '';
        }
      } else {
        title = tour.title;
        subtitle = tour.category;
        desc = firstText;
        skip = 1;
      }
    }

    return { displayTitle: title, displaySubtitle: subtitle, displayDesc: desc, paragraphsToSkip: skip };
  }, [tour, headerParagraphs]);

  if (!tour) return null;

  const phoneNumber = '+84364399290';
  const whatsappLink = `https://wa.me/${phoneNumber.replace('+', '')}?text=Hi,+I+am+interested+in+the+${encodeURIComponent(tour.title)}+tour.`;
  const smsLink = `sms:${phoneNumber}?body=Hi,+I+am+interested+in+the+${encodeURIComponent(tour.title)}+tour.`;

  const folder = (tour as any).folder as keyof typeof imageMap;
  const folderImages = imageMap[folder] || [];
  const gridImages = folderImages.slice(0, 3);

  return (
    <div ref={containerRef} style={{
      width: '100%',
      minHeight: '100vh',
      background: 'var(--bg-soft)',
      paddingTop: isMobile ? '40px' : '80px',
      paddingBottom: '80px',
    }}>
      <div style={{
        maxWidth: "1400px",
        margin: '0 auto',
        padding: '0 20px',
        position: 'relative',
        zIndex: 5,
      }}>
        {/* Back Button */}
        <div className="detail-anim" style={{ marginBottom: '30px' }}>
          <button
            onClick={onClose}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'transparent',
              border: 'none',
              color: 'var(--color-primary-bright)',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '1rem',
              transition: 'transform 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(-4px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}
          >
            ← Back to All Tours
          </button>
        </div>

        {/* Two-Column Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'minmax(0, 1.5fr) minmax(0, 1fr)',
          gap: '40px',
          alignItems: 'start'
        }}>
          {/* Left Column: Itinerary Details (no card wrapper) */}
          <div className="detail-anim" style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
          }}>
            {/* Header info */}
            <div>
              <h1 style={{
                fontSize: isMobile ? '2.2rem' : '2.8rem',
                color: '#0F172A',
                fontWeight: 900,
                lineHeight: 1.15,
                margin: '0 0 8px 0',
                letterSpacing: '-1px'
              }}>
                {displayTitle}
              </h1>
              <p style={{
                fontSize: isMobile ? '1.05rem' : '1.15rem',
                color: '#16A34A',
                fontWeight: 600,
                margin: '0 0 16px 0'
              }}>
                {displaySubtitle}
              </p>
              {displayDesc && (
                <p style={{
                  fontSize: '1.05rem',
                  color: '#475569',
                  lineHeight: '1.6',
                  margin: '0 0 24px 0',
                  fontWeight: 450
                }}>
                  {displayDesc}
                </p>
              )}
            </div>

            {/* Image Grid */}
            {gridImages.length > 0 && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : (gridImages.length === 1 ? '1fr' : (gridImages.length === 2 ? '1fr 1fr' : '1.2fr 1fr')),
                gap: '16px',
                margin: '12px 0 24px 0',
                width: '100%',
              }}>
                {gridImages.length === 1 && (
                  <div style={{ position: 'relative', width: '100%', height: isMobile ? '260px' : '380px', borderRadius: '20px', overflow: 'hidden' }}>
                    <Image src={gridImages[0]} alt={tour.title} fill sizes="(max-width: 768px) 100vw, 800px" style={{ objectFit: 'cover' }} />
                  </div>
                )}
                {gridImages.length === 2 && (
                  <>
                    <div style={{ position: 'relative', width: '100%', height: isMobile ? '200px' : '300px', borderRadius: '20px', overflow: 'hidden' }}>
                      <Image src={gridImages[0]} alt={tour.title} fill sizes="400px" style={{ objectFit: 'cover' }} />
                    </div>
                    <div style={{ position: 'relative', width: '100%', height: isMobile ? '200px' : '300px', borderRadius: '20px', overflow: 'hidden' }}>
                      <Image src={gridImages[1]} alt={tour.title} fill sizes="400px" style={{ objectFit: 'cover' }} />
                    </div>
                  </>
                )}
                {gridImages.length >= 3 && (
                  <>
                    <div style={{ position: 'relative', width: '100%', height: isMobile ? '300px' : '380px', borderRadius: '20px', overflow: 'hidden' }}>
                      <Image src={gridImages[0]} alt={tour.title} fill sizes="(max-width: 768px) 100vw, 500px" style={{ objectFit: 'cover' }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div style={{ position: 'relative', width: '100%', height: isMobile ? '142px' : '182px', borderRadius: '20px', overflow: 'hidden' }}>
                        <Image src={gridImages[1]} alt={tour.title} fill sizes="300px" style={{ objectFit: 'cover' }} />
                      </div>
                      <div style={{ position: 'relative', width: '100%', height: isMobile ? '142px' : '182px', borderRadius: '20px', overflow: 'hidden' }}>
                        <Image src={gridImages[2]} alt={gridImages[2].includes('guide') ? 'Tour guide on boat' : tour.title} fill sizes="300px" style={{ objectFit: 'cover' }} />
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Remaining header paragraphs if any */}
            {headerParagraphs.slice(paragraphsToSkip).map((node, idx) => (
              <p key={idx} style={{ fontSize: '1.05rem', color: '#475569', lineHeight: '1.6', margin: '0 0 16px 0' }}>
                {node.text}
              </p>
            ))}

            {/* Remaining Nodes (Itinerary vertical timeline + other descriptions) */}
            <div style={{ fontSize: '1.05rem', color: 'var(--text-secondary)' }}>
              {(() => {
                const stepImages = stepImagesMap[folder] || [];
                let listOrderedCount = 0;
                return remainingNodes.map((node, index) => {
                  let currentListIndex = -1;
                  if (node.type === 'list-ordered') {
                    currentListIndex = listOrderedCount;
                    listOrderedCount++;
                  }
                  return renderNode(node, index, false, stepImages, currentListIndex);
                });
              })()}
            </div>
          </div>

          {/* Right Column: Sticky Booking & Info Sidebar */}
          {!isMobile ? (
            <div className={`detail-anim ${styles.rightColumnScroll}`} style={{
              position: 'sticky',
              top: '100px',
              alignSelf: 'start',
              background: '#FFFFFF',
              padding: '24px',
              borderRadius: '24px',
              boxShadow: '0 15px 35px rgba(0, 0, 0, 0.04)',
              border: '1px solid rgba(0, 0, 0, 0.05)',
              display: 'flex',
              flexDirection: 'column',
              zIndex: 10,
              maxHeight: 'calc(100vh - 140px)',
              overflowY: 'auto',
            }}>
              {/* Sidebar Cover Image with Category Tag overlay */}
              {(() => {
                const coverImg = folderImages.length > 0 ? folderImages[0] : null;
                if (!coverImg) return null;
                return (
                  <div style={{
                    position: 'relative',
                    width: '100%',
                    height: '210px',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    marginBottom: '20px'
                  }}>
                    <Image
                      src={coverImg}
                      alt={tour.title}
                      fill
                      sizes="400px"
                      style={{ objectFit: 'cover' }}
                      priority
                    />
                    <span style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      background: '#FFFFFF',
                      color: '#E53935',
                      padding: '4px 12px',
                      borderRadius: '30px',
                      fontWeight: 800,
                      fontSize: '0.7rem',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.08)'
                    }}>
                      {tour.category}
                    </span>
                  </div>
                );
              })()}

              <h3 style={{
                fontSize: '1.45rem',
                color: '#E53935',
                fontWeight: 850,
                textTransform: 'uppercase',
                margin: '0 0 10px 0',
                letterSpacing: '-0.5px',
                lineHeight: '1.2'
              }}>
                {tour.title}
              </h3>

              {tour.brief && (
                <p style={{
                  fontSize: '0.88rem',
                  color: '#64748B',
                  lineHeight: '1.5',
                  margin: '0 0 24px 0',
                  fontWeight: 450
                }}>
                  {tour.brief}
                </p>
              )}

              {/* Booking CTAs */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: 'none' }}
                >
                  <button style={{
                    width: '100%',
                    backgroundColor: '#22C55E',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    borderRadius: '12px',
                    fontWeight: 700,
                    fontSize: '0.92rem',
                    padding: '13px 20px',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(34, 197, 94, 0.15)',
                    transition: 'all 0.2s ease',
                  }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#16A34A';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#22C55E';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                    Book via WhatsApp
                  </button>
                </a>

                <a href={smsLink} style={{ textDecoration: 'none' }}>
                  <button style={{
                    width: '100%',
                    backgroundColor: '#EA580C',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    borderRadius: '12px',
                    fontWeight: 700,
                    fontSize: '0.92rem',
                    padding: '13px 20px',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(234, 88, 12, 0.15)',
                    transition: 'all 0.2s ease',
                  }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#D97706';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#EA580C';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                      <line x1="12" y1="18" x2="12.01" y2="18" />
                    </svg>
                    Send SMS Inquiry
                  </button>
                </a>
              </div>

              {/* Trust Badges */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                borderTop: '1px solid #F1F5F9',
                paddingTop: '20px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '6px',
                    backgroundColor: 'rgba(139, 92, 246, 0.1)',
                    color: '#8B5CF6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.85rem'
                  }}>
                    👤
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#475569', lineHeight: '1.2' }}>
                    <strong style={{ color: '#0F172A' }}>Private Tour</strong>
                    <div style={{ color: '#64748B', fontSize: '0.75rem', marginTop: '1px' }}>Custom for you</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '6px',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    color: '#3B82F6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.85rem'
                  }}>
                    📅
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#475569', lineHeight: '1.2' }}>
                    <strong style={{ color: '#0F172A' }}>Flexible Schedule</strong>
                    <div style={{ color: '#64748B', fontSize: '0.75rem', marginTop: '1px' }}>Change on the fly</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '6px',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    color: '#EF4444',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.85rem'
                  }}>
                    🛡️
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#475569', lineHeight: '1.2' }}>
                    <strong style={{ color: '#0F172A' }}>No Tourist Traps</strong>
                    <div style={{ color: '#64748B', fontSize: '0.75rem', marginTop: '1px' }}>Pure exploration</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '6px',
                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                    color: '#22C55E',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.85rem'
                  }}>
                    ✓
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#475569', lineHeight: '1.2' }}>
                    <strong style={{ color: '#0F172A' }}>Licensed Guide</strong>
                    <div style={{ color: '#64748B', fontSize: '0.75rem', marginTop: '1px' }}>Professional English speaker</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Mobile Sticky Booking Footer */
            <div style={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              padding: '15px 20px',
              boxShadow: '0 -8px 30px rgba(0,0,0,0.1)',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '10px',
              zIndex: 999
            }}>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: 'none' }}
              >
                <button className="btn-primary" style={{
                  width: '100%',
                  backgroundColor: '#25D366',
                  color: 'white',
                  borderRadius: '10px',
                  fontSize: '0.9rem',
                  padding: '12px 10px',
                  boxShadow: 'none',
                }}>
                  💬 WhatsApp
                </button>
              </a>

              <a href={smsLink} style={{ textDecoration: 'none' }}>
                <button className="btn-accent" style={{
                  width: '100%',
                  borderRadius: '10px',
                  fontSize: '0.9rem',
                  padding: '12px 10px',
                  boxShadow: 'none'
                }}>
                  ✉️ SMS
                </button>
              </a>
            </div>
          )}
        </div>

        {/* Gallery Section below */}
        <div style={{ marginTop: '60px' }}>
          <Gallery onSelectTour={onSelectTour} />
        </div>
      </div>
    </div>
  );
};


export default TourDetail;
