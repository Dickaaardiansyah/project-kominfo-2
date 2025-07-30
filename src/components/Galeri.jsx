import React from 'react';
import '../styles/main.css';

function Galeri() {
  // Data placeholder untuk item galeri
  const galleryItems = [
    { id: 1, title: 'Terumbu Karang', description: 'Keindahan terumbu karang di laut Indonesia.' },
    { id: 2, title: 'Ikan Hias Tropis', description: 'Beragam ikan hias di ekosistem laut.' },
    { id: 3, title: 'Biodiversitas Laut', description: 'Keajaiban flora dan fauna bawah laut.' },
    { id: 4, title: 'Ekosistem Mangrove', description: 'Peran mangrove dalam ekosistem laut.' },
  ];

  return (
    <section className="section" id="galeri">
      <h2 className="section-title">Galeri Keajaiban Laut</h2>
      <p className="section-subtitle">
        Jelajahi keindahan bawah laut melalui koleksi gambar yang menakjubkan.
      </p>
      <div className="gallery-container">
        {galleryItems.map((item) => (
          <div key={item.id} className="gallery-item">
            <div className="gallery-image"></div>
            <div className="gallery-info">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Galeri;