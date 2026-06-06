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

const App: React.FC = () => {
  const [selectedTourId, setSelectedTourId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  // Read ?tour parameter from URL on initial load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tourId = params.get('tour');
      if (tourId) {
        setSelectedTourId(tourId);
      }
    }
  }, []);

  // Update ?tour parameter in URL when selectedTourId changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const currentTour = params.get('tour');
      
      if (selectedTourId) {
        if (currentTour !== selectedTourId) {
          params.set('tour', selectedTourId);
          window.history.replaceState(window.history.state || {}, "", `${window.location.pathname}?${params.toString()}`);
        }
      } else {
        if (currentTour) {
          params.delete('tour');
          const searchStr = params.toString();
          const searchPart = searchStr ? `?${searchStr}` : '';
          const hashPart = window.location.hash || '';
          window.history.replaceState(window.history.state || {}, "", `${window.location.pathname}${searchPart}${hashPart}`);
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
