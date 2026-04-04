import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Gallery from './components/Gallery';
import Contact from './components/Contact';
import BackgroundCanvas from './components/BackgroundCanvas';
import './styles.css';

const App: React.FC = () => {

  return (
    <div className="main-wrapper">
      <BackgroundCanvas />
      <Navbar />
      <Hero />
      <About />
      <Services />
      <Gallery />
      <Contact />
    </div>
  );
};

export default App;
