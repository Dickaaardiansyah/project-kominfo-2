import React, { useState, useEffect } from 'react';

const Cuaca = () => {
  const [mapView, setMapView] = useState('radar');
  const [weatherTips, setWeatherTips] = useState([]);
  const [mapTips, setMapTips] = useState([]);
  const [mapTitle, setMapTitle] = useState('Membaca Peta Radar:');

  useEffect(() => {
    updateWeatherTips();
  }, []);

  const updateWeatherTips = () => {
    const now = new Date();
    const hour = now.getHours();
    
    if (hour >= 6 && hour < 18) {
      setWeatherTips([
        'Waktu terbaik untuk memancing: pagi dan sore hari',
        'Gunakan tabir surya SPF 50+',
        'Periksa prakiraan angin sebelum berlayar',
        'Bawa cukup air minum untuk menghindari dehidrasi'
      ]);
    } else {
      setWeatherTips([
        'Hindari berlayar jauh di malam hari',
        'Pastikan lampu navigasi berfungsi',
        'Waspada terhadap perubahan angin malam',
        'Beberapa spesies ikan lebih aktif di malam hari'
      ]);
    }
  };

  const changeMapView = (viewType) => {
    setMapView(viewType);
    
    switch(viewType) {
      case 'radar':
        setMapTitle('Membaca Peta Radar:');
        setMapTips([
          { color: '#3b82f6', text: 'Warna Biru: Hujan ringan (0-2 mm/jam)' },
          { color: '#10b981', text: 'Warna Hijau-Kuning: Hujan sedang (2-10 mm/jam)' },
          { color: '#ef4444', text: 'Warna Merah: Hujan lebat/badai (>10 mm/jam)' },
          { color: '#f1f5f9', text: 'Area Putih: Awan tebal tanpa hujan' }
        ]);
        break;
      case 'satellite':
        setMapTitle('Membaca Peta Satelit:');
        setMapTips([
          { color: '#ffffff', text: 'Warna Putih: Awan tebal/tinggi' },
          { color: '#94a3b8', text: 'Warna Abu-abu: Awan rendah/kabut' },
          { color: '#000000', text: 'Area Hitam: Langit cerah' },
          { text: 'Awan bergerak menunjukkan arah angin' }
        ]);
        break;
      // ... tambahkan case lainnya sesuai kebutuhan
    }
  };

  const weatherData = [
    { icon: '☀️', day: 'Hari Ini', temp: '28°C', condition: 'Cerah', details: ['Kelembapan: 75%', 'Angin: 10 km/jam'] },
    { icon: '⛅', day: 'Besok', temp: '26°C', condition: 'Berawan', details: ['Kelembapan: 80%', 'Angin: 15 km/jam'] },
    { icon: '🌧️', day: 'Lusa', temp: '24°C', condition: 'Hujan Ringan', details: ['Kelembapan: 85%', 'Angin: 20 km/jam'] }
  ];

  return (
    <section className="section" id="cuaca">
      <h2 className="section-title">Cuaca & Kondisi Laut</h2>
      
      <div className="weather-container">
        {weatherData.map((weather, index) => (
          <div className="weather-card" key={index}>
            <div className="weather-icon">{weather.icon}</div>
            <h3>{weather.day}</h3>
            <div className="weather-temp">{weather.temp}</div>
            <div className="weather-condition">{weather.condition}</div>
            <div className="weather-details">
              {weather.details.map((detail, i) => <div key={i}>{detail}</div>)}
            </div>
          </div>
        ))}
      </div>
      
      <div className="weather-tips">
        <h3>Tips Aktivitas Laut:</h3>
        <ul id="weather-tips-list">
          {weatherTips.map((tip, index) => (
            <li key={index}>{tip}</li>
          ))}
        </ul>
      </div>
      
      <h3 style={{ marginBottom: '1rem', color: '#f1f5f9' }}>Peta Satelit Cuaca</h3>
      
      <div className="map-controls">
        {['radar', 'satellite', 'lightning', 'wind', 'waves'].map((view) => (
          <button
            key={view}
            className={`map-control-btn ${mapView === view ? 'active' : ''}`}
            onClick={() => changeMapView(view)}
          >
            {view.charAt(0).toUpperCase() + view.slice(1)}
          </button>
        ))}
      </div>
      
      <div className="map-container">
        <div className="map-label">Lokasi: Perairan Bali (Lat: -8.253, Long: 114.385)</div>
        <iframe 
          src={`https://www.ventusky.com/?p=-8.253;114.385;11&l=${mapView}`}
          className="satellite-map"
          allowFullScreen
          title="Ventusky Weather Map"
        ></iframe>
      </div>
      
      <div className="weather-tips">
        <h3 id="map-reading-title">{mapTitle}</h3>
        <ul id="map-reading-list">
          {mapTips.map((tip, index) => (
            <li key={index}>
              {tip.color && <strong style={{ color: tip.color }}>{tip.text.split(':')[0]}:</strong>}
              {tip.color ? tip.text.split(':').slice(1).join(':') : tip.text}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Cuaca;