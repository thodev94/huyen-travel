"use client";
import React, { useEffect, useMemo, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import toursData from '../../data/tours.json';
import { renderNode, DocNode } from '../../utils/NodeMapper';
import imageMapData from '../../data/imageMap.json';
import stepImagesData from '../../data/stepImages.json';
import { useWindowSize } from '../../hooks/useWindowSize';
import Gallery from '../Gallery';
import styles from './TourDetail.module.css';

const imageMap: Record<string, string[]> = imageMapData;
const stepImagesMap: Record<string, string[]> = stepImagesData;
gsap.registerPlugin(useGSAP);

interface TourDetailProps {
  tourId: string;
  onClose?: () => void;
  onSelectTour?: (id: string) => void;
}

const TourDetail: React.FC<TourDetailProps> = ({ tourId, onClose, onSelectTour }) => {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const { width } = useWindowSize();
  const isMobile = width <= 768;
  const tourIndex = toursData.findIndex(t => t.id === tourId);
  const tour = toursData[tourIndex];

  useGSAP(() => {
    if (isMobile) return;
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
    <div ref={containerRef} className={`${styles.container} ${isMobile ? styles.containerMobile : styles.containerDesktop}`}>
      <div className={styles.inner}>
        <div className="detail-anim" style={{ marginBottom: '30px' }}>
          <button onClick={onClose} className={styles.backBtn}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back to All Tours
          </button>
        </div>

        <div className={`${styles.grid} ${isMobile ? styles.gridMobile : styles.gridDesktop}`}>
          <div className={`detail-anim ${styles.leftCol}`}>
            <div>
              <h1 className={`${styles.title} ${isMobile ? styles.titleMobile : styles.titleDesktop}`}>
                {displayTitle}
              </h1>
              <p className={`${styles.subtitle} ${isMobile ? styles.subtitleMobile : styles.subtitleDesktop}`}>
                {displaySubtitle}
              </p>
              {displayDesc && (
                <p className={styles.desc}>
                  {displayDesc}
                </p>
              )}
            </div>

            {gridImages.length > 0 && (
              <div className={`${styles.imgGrid} ${gridImages.length === 1 ? styles.imgGridCols1 : (gridImages.length === 2 ? styles.imgGridCols2 : styles.imgGridCols3)}`}>
                {gridImages.length === 1 && (
                  <div className={styles.imgWrapper} style={{ height: isMobile ? '260px' : '380px' }}>
                    <Image src={gridImages[0]} alt={tour.title} fill sizes="(max-width: 768px) 100vw, 800px" style={{ objectFit: 'cover' }} />
                  </div>
                )}
                {gridImages.length === 2 && (
                  <>
                    <div className={styles.imgWrapper} style={{ height: isMobile ? '200px' : '300px' }}>
                      <Image src={gridImages[0]} alt={tour.title} fill sizes="400px" style={{ objectFit: 'cover' }} />
                    </div>
                    <div className={styles.imgWrapper} style={{ height: isMobile ? '200px' : '300px' }}>
                      <Image src={gridImages[1]} alt={tour.title} fill sizes="400px" style={{ objectFit: 'cover' }} />
                    </div>
                  </>
                )}
                {gridImages.length >= 3 && (
                  <>
                    <div className={styles.imgWrapper} style={{ height: isMobile ? '300px' : '380px' }}>
                      <Image src={gridImages[0]} alt={tour.title} fill sizes="(max-width: 768px) 100vw, 500px" style={{ objectFit: 'cover' }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div className={styles.imgWrapper} style={{ height: isMobile ? '142px' : '182px' }}>
                        <Image src={gridImages[1]} alt={tour.title} fill sizes="300px" style={{ objectFit: 'cover' }} />
                      </div>
                      <div className={styles.imgWrapper} style={{ height: isMobile ? '142px' : '182px' }}>
                        <Image src={gridImages[2]} alt={gridImages[2].includes('guide') ? 'Tour guide on boat' : tour.title} fill sizes="300px" style={{ objectFit: 'cover' }} />
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {headerParagraphs.slice(paragraphsToSkip).map((node, idx) => (
              <p key={idx} className={styles.desc}>
                {node.text}
              </p>
            ))}

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

          {!isMobile ? (
            <div className={`detail-anim ${styles.sidebar} ${styles.rightColumnScroll}`}>
              {(() => {
                const coverImg = folderImages.length > 0 ? folderImages[0] : null;
                if (!coverImg) return null;
                return (
                  <div className={styles.sidebarCover}>
                    <Image src={coverImg} alt={tour.title} fill sizes="400px" style={{ objectFit: 'cover' }} priority />
                    <span className={styles.sidebarTag}>{tour.category}</span>
                  </div>
                );
              })()}

              <h3 className={styles.sidebarTitle}>{tour.title}</h3>

              {tour.brief && <p className={styles.sidebarDesc}>{tour.brief}</p>}

              <div className={styles.bookBtns}>
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                  <button className={styles.btnWhatsapp}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                    Book via WhatsApp
                  </button>
                </a>
                <a href={smsLink} style={{ textDecoration: 'none' }}>
                  <button className={styles.btnSms}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                      <line x1="12" y1="18" x2="12.01" y2="18" />
                    </svg>
                    Send SMS Inquiry
                  </button>
                </a>
              </div>

              <div className={styles.trustBadges}>
                <div className={styles.trustBadge}>
                  <div className={`${styles.trustIcon} ${styles.trustIconPrivate}`}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                  <div className={styles.trustText}>
                    <strong className={styles.trustTextTitle}>Private Tour</strong>
                    <div className={styles.trustTextDesc}>Custom for you</div>
                  </div>
                </div>

                <div className={styles.trustBadge}>
                  <div className={`${styles.trustIcon} ${styles.trustIconFlexible}`}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                  </div>
                  <div className={styles.trustText}>
                    <strong className={styles.trustTextTitle}>Flexible Schedule</strong>
                    <div className={styles.trustTextDesc}>Change on the fly</div>
                  </div>
                </div>

                <div className={styles.trustBadge}>
                  <div className={`${styles.trustIcon} ${styles.trustIconNoTraps}`}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  </div>
                  <div className={styles.trustText}>
                    <strong className={styles.trustTextTitle}>No Tourist Traps</strong>
                    <div className={styles.trustTextDesc}>Pure exploration</div>
                  </div>
                </div>

                <div className={styles.trustBadge}>
                  <div className={`${styles.trustIcon} ${styles.trustIconLicensed}`}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <div className={styles.trustText}>
                    <strong className={styles.trustTextTitle}>Licensed Guide</strong>
                    <div className={styles.trustTextDesc}>Professional English speaker</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.mobileFooter}>
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                <button className={`${styles.mobileBtn} ${styles.mobileWhatsapp}`}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  WhatsApp
                </button>
              </a>
              <a href={smsLink} style={{ textDecoration: 'none' }}>
                <button className={`${styles.mobileBtn} ${styles.mobileSms}`}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  SMS
                </button>
              </a>
            </div>
          )}
        </div>
        <div style={{ marginTop: '60px' }}>
          <Gallery onSelectTour={onSelectTour} />
        </div>
      </div>
    </div>
  );
};

export default TourDetail;
