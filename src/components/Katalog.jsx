import React, { useState } from 'react';

const Katalog = () => {
  const [filter, setFilter] = useState('konsumsi');

  const filterFish = (type) => {
    setFilter(type);
  };

  return (
    <section className="section" id="katalog">
      <h2 className="section-title">Katalog</h2>
      <p className="section-subtitle">Maximize your business and grow it with our industry-leading AI solutions. Enjoy premium performance at a fraction of the cost of competitors—that's smart business!</p>
      
      <div className="katalog-filters">
        <button 
          className={`filter-btn ${filter === 'konsumsi' ? 'active' : ''}`} 
          onClick={() => filterFish('konsumsi')}>
          Konsumsi
        </button>
        <button 
          className={`filter-btn ${filter === 'hias' ? 'active' : ''}`} 
          onClick={() => filterFish('hias')}>
          Hias
        </button>
      </div>
      
      <div className="fish-grid">
        {/* Render fish cards based on filter */}
        {[...Array(6)].map((_, index) => (
          <div className="fish-card" key={index}>
            <div className="fish-image"></div>
            <div className="fish-info">
              <h3>{filter === 'konsumsi' ? 'Sun Ingold' : 'Betta Splendens'}</h3>
              <p>
                {filter === 'konsumsi' 
                  ? 'Sun Ingold is a natural food company for agriculture, including small, nutritious, and complex fish.' 
                  : 'Colorful ornamental fish for aquariums.'}
              </p>
              <div className="fish-stats">
                <span>Habitat: {filter === 'konsumsi' ? 'Laut dalam' : 'Air tawar'}</span>
                <span>Size: {filter === 'konsumsi' ? '15-25cm' : '5-7cm'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="load-more">
        <a href="#" className="load-more-btn">Selengkapnya</a>
      </div>
    </section>
  );
};

export default Katalog;