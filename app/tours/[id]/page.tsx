import React from 'react';
import TourDetail from '../../../src/components/TourDetail';
import toursData from '../../../src/data/tours.json';

export async function generateMetadata({ params }: { params: { id: string } }) {
  const tour = (toursData as any).find((t: any) => t.id === params.id);
  return {
    title: tour ? `${tour.title} — Huyen Tour` : 'Tour Detail',
    description: tour ? tour.brief : 'Tour detail view',
  };
}

export default function TourPage({ params }: { params: { id: string } }) {
  return <TourDetail tourId={params.id} />;
}
