import React from 'react';
import '../src/styles.css';
import '../src/components/Navbar.css';
import '../src/components/Hero.css';
import '../src/components/About.css';
import '../src/components/Services.css';
import '../src/components/Gallery.css';
import '../src/components/Contact.css';
import '../src/components/FloatingContact.css';
import '../src/components/MobileBottomNav.css';
import '../src/utils/NodeMapper.css';

export const metadata = {
  title: 'Huyen Tour — Authentic Vietnam tours',
  description: 'Licensed guide Huyen — Explore authentic Vietnam tours',
  openGraph: {
    title: 'Huyen Tour — Authentic Vietnam tours',
    description: 'Licensed guide Huyen — Explore authentic Vietnam tours',
    url: '/',
    images: [
      {
        url: '/images/AS11-40-5865HR.webp',
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Huyen Tour — Authentic Vietnam tours',
    description: 'Licensed guide Huyen — Explore authentic Vietnam tours',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body>{children}</body>
    </html>
  );
}
