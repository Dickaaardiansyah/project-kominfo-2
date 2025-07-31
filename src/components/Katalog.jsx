import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/main.css';

function Katalog() {
  // State untuk filter aktif dan data ikan
  const [filter, setFilter] = useState('all');
  const [fishData, setFishData] = useState([]);

  // Data placeholder untuk ikan
  const initialFishData = [
    {
      id: 1,
      name: 'Ikan Kakap',
      type: 'konsumsi',
      description: 'Ikan laut yang populer untuk konsumsi.',
      size: '30-60 cm',
      habitat: 'Perairan pantai',
    },
    {
      id: 2,
      name: 'Ikan Guppy',
      type: 'hias',
      description: 'Ikan hias kecil dengan warna cerah.',
      size: '3-6 cm',
      habitat: 'Akuarium',
    },
    {
      id: 3,
      name: 'Ikan Tongkol',
      type: 'konsumsi',
      description: 'Ikan pelagis yang sering diolah menjadi makanan.',
      size: '40-100 cm',
      habitat: 'Laut lepas',
    },
    {
      id: 4,
      name: 'Ikan Cupang',
      type: 'hias',
      description: 'Ikan hias dengan sirip indah.',
      size: '5-7 cm',
      habitat: 'Akuarium',
    },
  ];

  // Inisialisasi data ikan saat komponen dimuat
  useEffect(() => {
    setFishData(initialFishData);
  }, []);

  // Fungsi untuk memfilter ikan berdasarkan tipe
  const filterFish = (type) => {
    setFilter(type);
    if (type === 'all') {
      setFishData(initialFishData);
    } else {
      const filtered = initialFishData.filter((fish) => fish.type === type);
      setFishData(filtered);
    }
  };

  return (
    <section className="section" id="katalog">
      <h2 className="section-title">Katalog Ikan</h2>
      <p className="section-subtitle">
        Temukan berbagai jenis ikan konsumsi dan hias dengan informasi lengkap.
      </p>
      <div className="katalog-filters">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => filterFish('all')}
        >
          Semua
        </button>
        <button
          className={`filter-btn ${filter === 'konsumsi' ? 'active' : ''}`}
          onClick={() => filterFish('konsumsi')}
        >
          Konsumsi
        </button>
        <button
          className={`filter-btn ${filter === 'hias' ? 'active' : ''}`}
          onClick={() => filterFish('hias')}
        >
          Hias
        </button>
      </div>
      <div className="fish-grid">
        {fishData.map((fish) => (
          <div key={fish.id} className="fish-card">
            <div className="fish-image"></div>
            <div className="fish-info">
              <h3>{fish.name}</h3>
              <p>{fish.description}</p>
              <div className="fish-stats">
                <span>Ukuran: {fish.size}</span>
                <span>Habitat: {fish.habitat}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="load-more">
        <NavLink to="/toko" className="load-more-btn">
          Muat Lebih Banyak
        </NavLink>
      </div>
    </section>
  );
}

export default Katalog;