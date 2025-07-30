import React, { useState, useEffect } from 'react';
import '../styles/main.css';

function Cuaca() {
  // State untuk jenis peta dan tips cuaca
  const [mapType, setMapType] = useState('wind');
  const [weatherTips, setWeatherTips] = useState([]);

  // Data placeholder untuk kartu cuaca
  const weatherData = [
    {
      id: 1,
      icon: '☀️',
      temperature: '28°C',
      condition: 'Cerah',
      details: 'Kelembapan: 65% | Angin: 10 km/j',
    },
    {
      id: 2,
      icon: '🌧️',
      temperature: '24°C',
      condition: 'Hujan Ringan',
      details: 'Kelembapan: 80% | Angin: 15 km/j',
    },
    {
      id: 3,
      icon: '☁️',
      temperature: '26°C',
      condition: 'Berawan',
      details: 'Kelembapan: 70% | Angin: 12 km/j',
    },
  ];

  // Data placeholder untuk tips cuaca
  const tipsData = [
    [
      'Gunakan pelindung matahari saat memancing di cuaca cerah.',
      'Pastikan peralatan tahan air untuk menghadapi hujan.',
      'Perhatikan arah angin untuk navigasi kapal.',
      'Pantau prakiraan cuaca setiap jam.',
    ],
    [
      'Hindari memancing saat badai petir.',
      'Gunakan jaket pelampung saat ombak besar.',
      'Cek suhu air sebelum menyelam.',
      'Simpan peralatan di tempat kering.',
    ],
    [
      'Periksa peralatan sebelum berlayar.',
      'Gunakan pakaian hangat di cuaca dingin.',
      'Pantau perubahan cuaca mendadak.',
      'Selalu bawa alat komunikasi cadangan.',
    ],
  ];

  // Fungsi untuk mengubah jenis peta
  const changeMapView = (type) => {
    setMapType(type);
  };

  // Fungsi untuk memperbarui tips cuaca
  const updateWeatherTips = () => {
    const randomIndex = Math.floor(Math.random() * tipsData.length);
    setWeatherTips(tipsData[randomIndex]);
  };

  // Inisialisasi tips cuaca dan atur pembaruan berkala
  useEffect(() => {
    updateWeatherTips();
    const interval = setInterval(updateWeatherTips, 10000); // Perbarui setiap 10 detik
    return () => clearInterval(interval); // Bersihkan interval saat komponen unmount
  }, []);

  // URL peta Ventusky berdasarkan jenis peta
  const mapUrls = {
    wind: 'https://www.ventusky.com/?p=-6.2;106.8;5&l=wind-10m',
    temperature: 'https://www.ventusky.com/?p=-6.2;106.8;5&l=temperature-2m',
    precipitation: 'https://www.ventusky.com/?p=-6.2;106.8;5&l=rain',
  };

  return (
    <section className="section" id="cuaca">
      <h2 className="section-title">Informasi Cuaca</h2>
      <p className="section-subtitle">
        Pantau kondisi cuaca terkini untuk perjalanan laut yang aman dan nyaman.
      </p>
      <div className="weather-container">
        {weatherData.map((weather) => (
          <div key={weather.id} className="weather-card">
            <div className="weather-icon">{weather.icon}</div>
            <div className="weather-temp">{weather.temperature}</div>
            <div className="weather-condition">{weather.condition}</div>
            <div className="weather-details">{weather.details}</div>
          </div>
        ))}
      </div>
      <div className="map-controls">
        <button
          className={`map-control-btn ${mapType === 'wind' ? 'active' : ''}`}
          onClick={() => changeMapView('wind')}
        >
          Angin
        </button>
        <button
          className={`map-control-btn ${mapType === 'temperature' ? 'active' : ''}`}
          onClick={() => changeMapView('temperature')}
        >
          Suhu
        </button>
        <button
          className={`map-control-btn ${mapType === 'precipitation' ? 'active' : ''}`}
          onClick={() => changeMapView('precipitation')}
        >
          Curah Hujan
        </button>
      </div>
      <div className="map-container">
        <div className="map-label">Peta Cuaca: {mapType.charAt(0).toUpperCase() + mapType.slice(1)}</div>
        <iframe
          src={mapUrls[mapType]}
          className="satellite-map"
          title="Peta Cuaca Ventusky"
        ></iframe>
      </div>
      <div className="weather-tips">
        <h3>Tips Cuaca untuk Pelaut</h3>
        <ul>
          {weatherTips.map((tip, index) => (
            <li key={index}>{tip}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default Cuaca;