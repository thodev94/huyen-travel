"use client";
import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Gallery from './components/Gallery';
import Contact from './components/Contact';
import BackgroundCanvas from './components/BackgroundCanvas';
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
    <div className="main-wrapper">
      {/* <BackgroundCanvas /> */}
      {selectedTourId ? (
        <TourDetail tourId={selectedTourId} onClose={() => setSelectedTourId(null)} />
      ) : (
        <>
          <Navbar onSelectTour={setSelectedTourId} />
          <Hero />
          <About />
          <Services onSelectTour={setSelectedTourId} />
          <Gallery />
        </>
      )}
      <Contact />
      <MobileBottomNav onNavigate={handleMobileNav} />
      <FloatingContact />
    </div>
  );
};

export default App;
