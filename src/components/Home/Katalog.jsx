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
      image: null // Placeholder tidak punya gambar
    },
    {
      id: 2,
      name: 'Ikan Guppy',
      type: 'hias',
      description: 'Ikan hias kecil dengan warna cerah.',
      size: '3-6 cm',
      habitat: 'Akuarium',
      image: null
    },
    {
      id: 3,
      name: 'Ikan Tongkol',
      type: 'konsumsi',
      description: 'Ikan pelagis yang sering diolah menjadi makanan.',
      size: '40-100 cm',
      habitat: 'Laut lepas',
      image: null
    },
    {
      id: 4,
      name: 'Ikan Cupang',
      type: 'hias',
      description: 'Ikan hias dengan sirip indah.',
      size: '5-7 cm',
      habitat: 'Akuarium',
      image: null
    },
  ];

  // Fungsi untuk menentukan tipe ikan dari consumption_safety
  const determineType = (consumptionSafety) => {
    if (!consumptionSafety) return 'konsumsi';
    
    const safety = consumptionSafety.toLowerCase();
    if (safety.includes('aman') || safety.includes('konsumsi') || safety.includes('dimakan') || safety.includes('dapat dikonsumsi')) {
      return 'konsumsi';
    } else {
      return 'hias';
    }
  };

  // Fungsi untuk memvalidasi dan memformat base64 image
  const formatImageData = (fishImage) => {
    if (!fishImage) {
      console.log('No fish image data');
      return null;
    }
    
    console.log('Raw fish image data:', {
      length: fishImage.length,
      starts_with: fishImage.substring(0, 30),
      has_data_prefix: fishImage.startsWith('data:')
    });
    
    try {
      // Jika sudah dalam format data URL yang lengkap
      if (fishImage.startsWith('data:image/')) {
        console.log('Image already has data: prefix');
        return fishImage;
      }
      
      // Jika hanya base64 string tanpa prefix, tambahkan prefix
      if (fishImage.length > 50) {
        const formatted = `data:image/jpeg;base64,${fishImage}`;
        console.log('Added data: prefix to base64');
        return formatted;
      }
      
      console.log('Image data too short, treating as invalid');
      return null;
    } catch (error) {
      console.error('Error formatting image data:', error);
      return null;
    }
  };

  // Fungsi untuk mengambil data dari API
  const fetchFishData = async () => {
    try {
      setLoading(true);
      
      console.log('Fetching data from API...');
      
      // Ambil data dari API
      const response = await axios.get(`${API_BASE_URL}/api/get-scans`);
      
      console.log('API Response:', response.data);
      
      if (response.data.status === 'success' && response.data.data.length > 0) {
        // Transform data dari API ke format yang sama dengan initialFishData
        const apiData = response.data.data.map(item => {
          console.log('Raw API item:', {
            id: item.id,
            fish_name: item.fish_name,
            fish_image_exists: !!item.fish_image,
            fish_image_length: item.fish_image ? item.fish_image.length : 0
          });
          
          const formattedImage = formatImageData(item.fish_image);
          
          console.log(`Item ${item.id} processed:`, {
            name: item.fish_name,
            originalImageExists: !!item.fish_image,
            formattedImageExists: !!formattedImage,
            formattedImageValid: formattedImage && formattedImage.startsWith('data:')
          });
          
          return {
            id: `api_${item.id}`, // Prefix untuk membedakan dengan placeholder
            name: item.fish_name || item.predicted_class,
            type: determineType(item.consumption_safety),
            description: `Hasil scan dengan confidence ${item.confidence}`,
            size: 'Data tidak tersedia', // Bisa ditambah field ini nanti
            habitat: item.habitat || 'Tidak diketahui',
            image: formattedImage,
            // Tambahan data dari API (tidak ditampilkan tapi tersimpan)
            confidence: item.confidence,
            consumption_safety: item.consumption_safety,
            prediction_date: item.prediction_date,
            isFromAPI: true
          };
        });
        
        console.log('Transformed API data:', apiData);
        
        // Gabungkan data API dengan data placeholder
        const combinedData = [...apiData, ...initialFishData];
        setAllFishData(combinedData);
        setFishData(combinedData);
      } else {
        console.log('No data from API, using placeholder data');
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

  // Fungsi untuk handle error loading image
  const handleImageError = (e) => {
    console.error('Image failed to load:', e.target.style.backgroundImage);
    e.target.style.backgroundImage = 'none';
    e.target.style.backgroundColor = '#f0f0f0';
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
          Semua ({allFishData.length})
        </button>
        <button
          className={`filter-btn ${filter === 'konsumsi' ? 'active' : ''}`}
          onClick={() => filterFish('konsumsi')}
        >
          Konsumsi ({allFishData.filter(f => f.type === 'konsumsi').length})
        </button>
        <button
          className={`filter-btn ${filter === 'hias' ? 'active' : ''}`}
          onClick={() => filterFish('hias')}
        >
          Hias ({allFishData.filter(f => f.type === 'hias').length})
        </button>
      </div>
      
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          Memuat data...
        </div>
      ) : (
        <div className="fish-grid">
          {fishData.map((fish) => {
            console.log(`Rendering fish ${fish.id}:`, {
              name: fish.name,
              hasImage: !!fish.image,
              imagePreview: fish.image ? fish.image.substring(0, 50) + '...' : 'null'
            });
            
            return (
              <div key={fish.id} className="fish-card">
                <div 
                  className="fish-image"
                  style={{
                    backgroundImage: fish.image ? `url("${fish.image}")` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundColor: '#f0f0f0',
                    minHeight: '200px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative'
                  }}
                  onError={handleImageError}
                >
                  {!fish.image && (
                    <div style={{ 
                      color: '#999', 
                      fontSize: '14px',
                      textAlign: 'center'
                    }}>
                      <i className="fas fa-fish" style={{ fontSize: '24px', marginBottom: '8px', display: 'block' }}></i>
                      Tidak ada gambar
                    </div>
                  )}
                  
                  {/* Debug info - hapus setelah debugging */}
                  {fish.image && (
                    <div style={{
                      position: 'absolute',
                      bottom: '4px',
                      left: '4px',
                      backgroundColor: 'rgba(0,0,0,0.7)',
                      color: 'white',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontSize: '10px'
                    }}>
                      IMG: {fish.image.substring(0, 20)}...
                    </div>
                  )}
                  
                  {/* Badge untuk item dari API */}
                  {fish.isFromAPI && (
                    <div style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      backgroundColor: '#4a90e2',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '10px',
                      fontWeight: 'bold'
                    }}>
                      SCAN
                    </div>
                  )}
                </div>
                <div className="fish-info">
                  <h3>{fish.name}</h3>
                  <p>{fish.description}</p>
                  <div className="fish-stats">
                    <span>Ukuran: {fish.size}</span>
                    <span>Habitat: {fish.habitat}</span>
                  </div>
                  
                  {/* Tampilkan info tambahan untuk data dari API */}
                  {fish.isFromAPI && (
                    <div style={{ 
                      marginTop: '8px', 
                      fontSize: '12px', 
                      color: '#666',
                      borderTop: '1px solid #eee',
                      paddingTop: '8px'
                    }}>
                      <div>🎯 Confidence: {fish.confidence}</div>
                      {fish.prediction_date && (
                        <div>📅 Scan: {new Date(fish.prediction_date).toLocaleDateString('id-ID')}</div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      {fishData.length === 0 && !loading && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          Tidak ada data ikan untuk kategori ini.
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