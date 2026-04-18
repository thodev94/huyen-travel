import React from 'react';
import Image from 'next/image';
import toursData from '../../../src/data/tours.json';
import { renderNode } from '../../../src/utils/NodeMapper';

export async function generateMetadata({ params }: { params: { id: string } }) {
  const tour = (toursData as any).find((t: any) => t.id === params.id);
  const base = process.env.NEXT_PUBLIC_METADATA_BASE ?? 'http://localhost:3002';
  const url = `${base}/tours/${params.id}`;
  const image = `${base}/images/AS11-40-5865HR.webp`;
  return {
    title: tour ? `${tour.title} — Huyen Tour` : 'Tour Detail',
    description: tour ? tour.brief : 'Tour detail view',
    openGraph: {
      title: tour ? `${tour.title} — Huyen Tour` : 'Tour Detail',
      description: tour ? tour.brief : 'Tour detail view',
      url,
      images: [{ url: image, width: 1200, height: 630 }],
    },
  };
}

export default function TourPage({ params }: { params: { id: string } }) {
  const tour = (toursData as any).find((t: any) => t.id === params.id);
  if (!tour) return <div style={{ padding: 40 }}>Tour not found</div>;

  const phone = '+84364399290';
  const whatsapp = `https://wa.me/${phone.replace('+', '')}?text=Hi,+I+am+interested+in+the+${encodeURIComponent(
    tour.title
  )}+tour.`;
  const sms = `sms:${phone}?body=Hi,+I+am+interested+in+the+${encodeURIComponent(tour.title)}+tour.`;

  return (
    <div style={{ width: '100%', minHeight: '100vh', background: 'var(--bg-soft)', paddingBottom: 20 }}>
      <div style={{ position: 'relative', width: '100%', height: '50vh', minHeight: 250, maxHeight: 600 }}>
        <Image src={tour.image || '/images/AS11-40-5865HR.webp'} alt={tour.title} fill style={{ objectFit: 'cover' }} />

        <div style={{ position: 'absolute', top: 40, left: 40, zIndex: 10 }}>
          <a href="/" style={{ textDecoration: 'none' }}>
            <button style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.2)', color: 'white', padding: '10px 20px', borderRadius: 30, border: '1px solid rgba(255,255,255,0.4)' }}>
              ← Back to Tours
            </button>
          </a>
        </div>
      </div>

      <div style={{ marginTop: -80, background: 'var(--bg-main)', borderRadius: 40, padding: '80px 50px', position: 'relative', zIndex: 5 }}>
        <h1 style={{ fontSize: '3.8rem', color: 'var(--color-primary-deep)', fontWeight: 900, marginBottom: 15, lineHeight: 1.1 }}>{tour.title}</h1>

        <div className="tag" style={{ display: 'inline-block', marginBottom: '40px' }}>{tour.category}</div>

        <div style={{ display: 'flex', gap: 15, marginBottom: 50, flexWrap: 'wrap' }}>
          <a href={whatsapp} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
            <button className="btn-primary" style={{ backgroundColor: '#25D366', display: 'flex', alignItems: 'center', gap: 10 }}>
              WhatsApp
            </button>
          </a>

          <a href={sms} style={{ textDecoration: 'none' }}>
            <button className="btn-accent">SMS</button>
          </a>
        </div>

        <div style={{ background: 'var(--bg-pure)', padding: 50, borderRadius: 24, boxShadow: '0 10px 40px rgba(47, 93, 80, 0.05)', border: '1px solid var(--border-color)', fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
          {(tour.nodes as any[]).map((node: any, idx: number) => renderNode(node, idx))}
        </div>
      </div>
    </div>
  );
}
