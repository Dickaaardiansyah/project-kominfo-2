import React from 'react';

const Gallery = () => {
  const galleryItems = [
    { title: 'Coral Reef' },
    { title: 'Tropical Fish' },
    { title: 'Deep Sea' }
  ];

  return (
    <section className="section" id="gallery">
      <h2 className="section-title">Gallery</h2>
      <p className="section-subtitle">Explore stunning images of marine life and ocean ecosystems.</p>
      
      <div className="gallery-container">
        {galleryItems.map((item, index) => (
          <div className="gallery-item" key={index}>
            <div className="gallery-image"></div>
            <div className="gallery-info">
              <h3>{item.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Gallery;