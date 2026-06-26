import React from 'react';
import App from '../../../src/App';
import toursData from '../../../src/data/tours.json';

export const runtime = 'edge';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const p = await params;
  const tour = (toursData as any).find((t: any) => t.id === p.id);
  const base = process.env.NEXT_PUBLIC_METADATA_BASE ?? 'http://localhost:3002';
  const url = `${base}/tour/${p.id}`;
  const image = `${base}/images/AS11-40-5865HR.webp`;

  return {
    title: tour ? `${tour.title} - Huyen Tour` : 'Tour Detail',
    description: tour ? tour.brief : 'Tour detail view',
    openGraph: {
      title: tour ? `${tour.title} - Huyen Tour` : 'Tour Detail',
      description: tour ? tour.brief : 'Tour detail view',
      url,
      images: [{ url: image, width: 1200, height: 630 }],
    },
  };
}

export default async function TourPage({ params }: { params: Promise<{ id: string }> }) {
  const p = await params;
  return <App initialTourId={p.id} />;
}