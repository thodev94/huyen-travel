"use client";
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Gallery from './components/Gallery';
import Contact from './components/Contact';
import TourDetail from './components/TourDetail';
import FloatingContact from './components/FloatingContact';
import MobileBottomNav from './components/MobileBottomNav';
// global styles are imported from app/globals.css for Next.js

const TOUR_DETAIL_PATH = '/tour';

const getTourIdFromUrl = () => {
  if (typeof window === 'undefined') return null;

  const pathMatch = window.location.pathname.match(/^\/tours?\/([^/?#]+)/);
  if (pathMatch?.[1]) {
    return decodeURIComponent(pathMatch[1]);
  }

  const params = new URLSearchParams(window.location.search);
  return params.get('tour') || params.get('') || null;
};
const App: React.FC = () => {
  const [selectedTourId, setSelectedTourId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  // Read tour id from URL on initial load
  useEffect(() => {
    const tourId = getTourIdFromUrl();
    if (tourId) {
      setSelectedTourId(tourId);
    }
  }, []);

  // Update URL when selectedTourId changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (selectedTourId) {
        const nextPath = `${TOUR_DETAIL_PATH}/${encodeURIComponent(selectedTourId)}`;
        if (window.location.pathname !== nextPath || window.location.search) {
          window.history.replaceState(window.history.state || {}, "", `${nextPath}${window.location.hash || ''}`);
        }
      } else {
        const params = new URLSearchParams(window.location.search);
        const hadTourQuery = params.has('tour') || params.has('');

        if (hadTourQuery || /^\/tours?\//.test(window.location.pathname)) {
          params.delete('tour');
          params.delete('');
          const searchStr = params.toString();
          const searchPart = searchStr ? `?${searchStr}` : '';
          const hashPart = window.location.hash || '';
          window.history.replaceState(window.history.state || {}, "", `/${searchPart}${hashPart}`);
        }
      }
    }
  }, [selectedTourId]);

  // Force scroll to top ONLY when entering a tour detail page
  useEffect(() => {
    if (!selectedTourId) return;

    const forceScrollTop = () => {
      window.scrollTo(0, 0);
    };

    // Run immediately
    forceScrollTop();

    // Run after a short delay to override browser scroll restoration
    const timer1 = setTimeout(forceScrollTop, 50);
    const timer2 = setTimeout(forceScrollTop, 200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [selectedTourId]);

  const handleMobileNav = (id: string) => {
    if (selectedTourId) {
      setSelectedTourId(null);
      // Wait for React to render the main page before scrolling
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <main id="main" className="main-wrapper">
      {/* <BackgroundCanvas /> */}
      <Navbar onSelectTour={setSelectedTourId} onNavigate={handleMobileNav} selectedTourId={selectedTourId} />
      {selectedTourId ? (
        <TourDetail tourId={selectedTourId} onClose={() => setSelectedTourId(null)} onSelectTour={setSelectedTourId} />
      ) : (
        <>
          <Hero onSelectTour={setSelectedTourId} />
          <About />
          <Services onSelectTour={setSelectedTourId} />
          <div className="gallery-wrapper"> <Gallery onSelectTour={setSelectedTourId} /></div>
        </>
      )}
      <Contact />
      <MobileBottomNav onNavigate={handleMobileNav} />
      <FloatingContact />
    </main>
  );
};

export default App;
