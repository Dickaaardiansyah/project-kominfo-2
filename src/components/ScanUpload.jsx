// D:\Projek Kominfo\project-kominfo-2\src\components\ScanUpload.jsx
import React, { useState, useRef } from 'react';

function ScanUpload() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isCamera, setIsCamera] = useState(false);
  const [stream, setStream] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Simulasi data ikan untuk demo
  const fishDatabase = [
    {
      name: "Ikan Tongkol",
      jenis: "Makanan",
      habitat: "Air Asin",
      kategori: "Air Asin",
      description: "Ikan tongkol adalah ikan laut yang populer dikonsumsi"
    },
    {
      name: "Ikan Gurame",
      jenis: "Makanan",
      habitat: "Air Tawar",
      kategori: "Air Tawar",
      description: "Ikan gurame adalah ikan air tawar yang mudah dibudidayakan"
    },
    {
      name: "Ikan Koi",
      jenis: "Hias",
      habitat: "Air Tawar",
      kategori: "Air Tawar",
      description: "Ikan koi adalah ikan hias yang berasal dari Jepang"
    }
  ];

  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target.result);
        analyzeImage();
      };
      reader.readAsDataURL(file);
    }
  };

  // Start camera
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } // Gunakan kamera belakang jika ada
      });
      setStream(mediaStream);
      setIsCamera(true);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Gagal mengakses kamera. Pastikan browser memiliki izin kamera.');
    }
  };

  // Capture photo from camera
  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0);
      
      const imageDataUrl = canvas.toDataURL('image/jpeg');
      setSelectedImage(imageDataUrl);
      stopCamera();
      analyzeImage();
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCamera(false);
  };

  // Simulate image analysis
  const analyzeImage = () => {
    setIsAnalyzing(true);
    
    // Simulasi delay analisis
    setTimeout(() => {
      // Simulasi hasil analisis random
      const randomFish = fishDatabase[Math.floor(Math.random() * fishDatabase.length)];
      setAnalysisResult(randomFish);
      setIsAnalyzing(false);
    }, 3000); // 3 detik delay untuk simulasi
  };

  // Save to database
  const saveToDatabase = async () => {
    try {
      const dataToSave = {
        image: selectedImage,
        fishData: analysisResult,
        timestamp: new Date().toISOString(),
        saved_to_catalog: false
      };

      // Simulasi API call - ganti dengan endpoint API Anda
      const response = await fetch('/api/save-scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSave)
      });

      if (response.ok) {
        alert('Data berhasil disimpan!');
      } else {
        throw new Error('Gagal menyimpan data');
      }
    } catch (error) {
      console.error('Error saving to database:', error);
      // Simulasi penyimpanan lokal jika API gagal
      const existingData = JSON.parse(localStorage.getItem('fishScans') || '[]');
      existingData.push({
        id: Date.now(),
        image: selectedImage,
        fishData: analysisResult,
        timestamp: new Date().toISOString(),
        saved_to_catalog: false
      });
      localStorage.setItem('fishScans', JSON.stringify(existingData));
      alert('Data disimpan secara lokal!');
    }
  };

  // Save to catalog
  const saveToCatalog = async () => {
    try {
      const dataToSave = {
        image: selectedImage,
        fishData: analysisResult,
        timestamp: new Date().toISOString(),
        saved_to_catalog: true
      };

      // Simulasi API call untuk katalog
      const response = await fetch('/api/save-to-catalog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSave)
      });

      if (response.ok) {
        alert('Data berhasil ditambahkan ke katalog!');
      } else {
        throw new Error('Gagal menambahkan ke katalog');
      }
    } catch (error) {
      console.error('Error saving to catalog:', error);
      // Simulasi penyimpanan lokal untuk katalog
      const existingCatalog = JSON.parse(localStorage.getItem('fishCatalog') || '[]');
      existingCatalog.push({
        id: Date.now(),
        image: selectedImage,
        fishData: analysisResult,
        timestamp: new Date().toISOString(),
        saved_to_catalog: true
      });
      localStorage.setItem('fishCatalog', JSON.stringify(existingCatalog));
      alert('Data ditambahkan ke katalog lokal!');
    }
  };

  // Reset scan
  const resetScan = () => {
    setSelectedImage(null);
    setAnalysisResult(null);
    setIsAnalyzing(false);
    stopCamera();
  };

  return (
    <div className="scan-container">
      <h2 className="section-title">Scan Ikanmu Disini</h2>
      <p className="section-subtitle">100% Otomatis dan Gratis</p>
      
      {!selectedImage && !isCamera && (
        <div className="scan-box">
          <div className="scan-icon">
            <i className="fas fa-camera"></i>
          </div>
          <p className="scan-text">Unggah Gambar atau Gunakan Kamera</p>
          <p className="scan-hint">Atau Drop File kamu</p>
          
          <input 
            type="file" 
            id="file-upload" 
            accept="image/*" 
            className="file-input" 
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
          
          <div className="button-group">
            <label htmlFor="file-upload" className="file-label">
              <i className="fas fa-upload"></i> Pilih File
            </label>
            <button onClick={startCamera} className="camera-button">
              <i className="fas fa-camera"></i> Buka Kamera
            </button>
          </div>
        </div>
      )}

      {isCamera && (
        <div className="camera-container">
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            className="camera-video"
          />
          <canvas ref={canvasRef} style={{ display: 'none' }} />
          <div className="camera-controls">
            <button onClick={capturePhoto} className="capture-button">
              <i className="fas fa-camera"></i> Ambil Foto
            </button>
            <button onClick={stopCamera} className="cancel-button">
              <i className="fas fa-times"></i> Batal
            </button>
          </div>
        </div>
      )}

      {selectedImage && (
        <div className="result-container">
          <div className="image-preview">
            <img src={selectedImage} alt="Preview" className="preview-image" />
          </div>

          {isAnalyzing && (
            <div className="analyzing-modal">
              <div className="analyzing-content">
                <div className="analyzing-spinner"></div>
                <p>Analyzing...</p>
              </div>
            </div>
          )}

          {analysisResult && !isAnalyzing && (
            <div className="analysis-result">
              <div className="result-card">
                <img src={selectedImage} alt={analysisResult.name} className="result-image" />
                <div className="result-info">
                  <h3 className="fish-name">{analysisResult.name}</h3>
                  <p><strong>Jenis:</strong> {analysisResult.jenis}</p>
                  <p><strong>Habitat:</strong> {analysisResult.habitat}</p>
                  <p><strong>Kategori:</strong> {analysisResult.kategori}</p>
                  <p className="fish-description">{analysisResult.description}</p>
                </div>
                <button onClick={resetScan} className="close-button">
                  <i className="fas fa-times"></i>
                </button>
              </div>
              
              <div className="action-buttons">
                <button onClick={saveToDatabase} className="save-button">
                  <i className="fas fa-save"></i> Simpan
                </button>
                <button onClick={saveToCatalog} className="catalog-button">
                  <i className="fas fa-plus"></i> Tambah ke Katalog +
                </button>
              </div>
            </div>
          )}

          {!analysisResult && !isAnalyzing && (
            <div className="action-buttons">
              <button onClick={resetScan} className="reset-button">
                <i className="fas fa-redo"></i> Scan Ulang
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ScanUpload;