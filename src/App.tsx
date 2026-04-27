"use client";
import React, { useState } from 'react';
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

  const handleMobileNav = (id: string) => {
    if (selectedTourId) {
      setSelectedTourId(null);
      // Wait for React to render the main page before scrolling
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <main id="main" className="main-wrapper">
      {/* <BackgroundCanvas /> */}
      <Navbar onSelectTour={setSelectedTourId} onNavigate={handleMobileNav} />

      {selectedTourId ? (
        <TourDetail tourId={selectedTourId} onClose={() => setSelectedTourId(null)} onSelectTour={setSelectedTourId} />
      ) : (
        <>
          <Hero onSelectTour={setSelectedTourId} />
          <About />
          <Services onSelectTour={setSelectedTourId} />
          <div style={{ maxWidth: "1536px", margin: "0 auto" }}> <Gallery onSelectTour={setSelectedTourId} /></div>
        </>
      )}
      <Contact />
      <MobileBottomNav onNavigate={handleMobileNav} />
      <FloatingContact />
    </main>
  );
};

export default App;
