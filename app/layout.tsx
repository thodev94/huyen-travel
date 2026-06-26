import React from 'react';
import '../src/styles.css';
import '../src/components/Navbar/Navbar.css';
import '../src/components/Hero/Hero.css';
import '../src/components/About/About.css';
import '../src/components/Services/Services.css';
import '../src/components/Gallery/Gallery.css';
import '../src/components/Contact/Contact.css';
import '../src/components/FloatingContact/FloatingContact.css';
import '../src/components/MobileBottomNav/MobileBottomNav.css';
import '../src/utils/NodeMapper.css';
import 'react-datepicker/dist/react-datepicker.css';
import { ThemeProvider } from '../src/components/ThemeProvider';

export const metadata = {
  title: 'Huyen Tour — Authentic Vietnam tours',
  description: 'Licensed guide Huyen — Explore authentic Vietnam tours',
  metadataBase: process.env.NEXT_PUBLIC_METADATA_BASE ?? 'http://localhost:3002',
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
  robots: {
    index: true,
    follow: true
  }
};

// metadataBase is now included in the metadata object for Next.js v14 compatibility

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const BASE = process.env.NEXT_PUBLIC_METADATA_BASE ?? 'http://localhost:3002';

  const ld = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "name": "Huyen Tour",
    "description": "Licensed guide Huyen — Explore authentic Vietnam tours",
    "url": BASE,
    "telephone": "+84364399290",
    "logo": `${BASE}/images/AS11-40-5865HR.webp`,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Ho Chi Minh City",
      "addressCountry": "VN"
    }
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Basic viewport and canonical for SEO */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Primary meta description for search engines */}
        <meta name="description" content={metadata.description} />
        <meta name="theme-color" content="#780000" />
        <link rel="canonical" href={BASE} />

        {/* Preconnect to image CDNs used by the site to improve LCP */}
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://upload.wikimedia.org" crossOrigin="anonymous" />

        {/* Preconnect and load Google Fonts (Montserrat) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

        {/* Structured data (JSON-LD) */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      </head>
      <body>
        <ThemeProvider attribute="data-theme" defaultTheme="light" enableSystem={false}>
          <a href="#main" className="skip-link">Skip to content</a>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
