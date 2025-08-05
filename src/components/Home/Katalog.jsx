import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import '../../styles/main.css';
import axios from 'axios';

function Katalog() {
  // State untuk filter aktif dan data ikan
  const [filter, setFilter] = useState('all');
  const [fishData, setFishData] = useState([]);
  const [allFishData, setAllFishData] = useState([]);
  const [loading, setLoading] = useState(true);

  // API Base URL
  const API_BASE_URL = 'http://localhost:5000';

  // Data placeholder untuk ikan (tetap ada sebagai fallback)
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

  // Fungsi untuk menentukan tipe ikan dari consumption_safety
  const determineType = (consumptionSafety) => {
    if (!consumptionSafety) return 'konsumsi';
    
    const safety = consumptionSafety.toLowerCase();
    if (safety.includes('aman') || safety.includes('konsumsi') || safety.includes('dimakan')) {
      return 'konsumsi';
    } else {
      return 'hias';
    }
  };

  // Fungsi untuk mengambil data dari API
  const fetchFishData = async () => {
    try {
      setLoading(true);
      
      // Ambil data dari API
      const response = await axios.get(`${API_BASE_URL}/api/get-scans`);
      
      if (response.data.status === 'success' && response.data.data.length > 0) {
        // Transform data dari API ke format yang sama dengan initialFishData
        const apiData = response.data.data.map(item => ({
          id: item.id,
          name: item.fish_name || item.predicted_class,
          type: determineType(item.consumption_safety),
          description: `Hasil scan dengan confidence ${item.confidence}`,
          size: 'Data tidak tersedia', // Bisa ditambah field ini nanti
          habitat: item.habitat || 'Tidak diketahui',
          // Tambahan data dari API (tidak ditampilkan tapi tersimpan)
          image: item.fish_image,
          confidence: item.confidence,
          consumption_safety: item.consumption_safety
        }));
        
        // Gabungkan data API dengan data placeholder
        const combinedData = [...apiData, ...initialFishData];
        setAllFishData(combinedData);
        setFishData(combinedData);
      } else {
        // Jika tidak ada data dari API, gunakan data placeholder
        setAllFishData(initialFishData);
        setFishData(initialFishData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      // Fallback ke data placeholder jika API error
      setAllFishData(initialFishData);
      setFishData(initialFishData);
    } finally {
      setLoading(false);
    }
  };

  // Load data saat komponen dimuat
  useEffect(() => {
    fetchFishData();
  }, []);

  // Fungsi untuk memfilter ikan berdasarkan tipe
  const filterFish = (type) => {
    setFilter(type);
    if (type === 'all') {
      setFishData(allFishData);
    } else {
      const filtered = allFishData.filter((fish) => fish.type === type);
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
      
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          Memuat data...
        </div>
      ) : (
        <div className="fish-grid">
          {fishData.map((fish) => (
            <div key={fish.id} className="fish-card">
              <div 
                className="fish-image"
                style={{
                  backgroundImage: fish.image ? `url(${fish.image})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                {!fish.image && <div style={{ height: '100%' }}></div>}
              </div>
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
      )}
      
      <div className="load-more">
        <NavLink to="/toko" className="load-more-btn">
          Muat Lebih Banyak
        </NavLink>
      </div>
    </section>
  );
}

export default Katalog;