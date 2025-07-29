import React from 'react';

const Hero = () => {
  return (
    <section className="hero" id="home">
      <div className="hero-content">
        <h1>Discover the Wonders Colorful Fish in the Ocean</h1>
        <p>Learn about their habitat, types, and how to consume them, as well as their role in the delicious marine ecosystem.</p>
        <a href="#katalog" className="cta-button">Scan disini</a>
      </div>
      <div className="hero-image">
        <div className="fish-visual">
          <div className="dorsal-fin"></div>
          <div className="anal-fin"></div>
          <div className="pectoral-fin-left"></div>
          <div className="pectoral-fin-right"></div>
          <div className="betta-body"></div>
          <div className="caudal-fin"></div>
          <div className="tail-extension-1"></div>
          <div className="tail-extension-2"></div>
          
          <div className="bubble bubble-1"></div>
          <div className="bubble bubble-2"></div>
          <div className="bubble bubble-3"></div>
          <div className="bubble bubble-4"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;