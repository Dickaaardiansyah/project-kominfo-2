// D:\Projek Kominfo\project-kominfo-2\src\components\ScanUpload.jsx
import React, { useState, useRef } from 'react';

function ScanUpload() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageFile, setImageFile] = useState(null); // Untuk menyimpan file asli
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isCamera, setIsCamera] = useState(false);
  const [stream, setStream] = useState(null);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // API Base URL
  const API_BASE_URL = 'http://localhost:5000';

  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validasi tipe file
      if (!file.type.startsWith('image/')) {
        alert('Silakan pilih file gambar yang valid');
        return;
      }

      // Validasi ukuran file (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('Ukuran file terlalu besar. Maksimal 10MB');
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target.result);
        setError(null);
        analyzeImage(file);
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
      setError(null);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setError('Gagal mengakses kamera. Pastikan browser memiliki izin kamera.');
    }
  };

  // Convert data URL to File
  const dataURLtoFile = (dataURL, filename) => {
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
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
      
      const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);
      setSelectedImage(imageDataUrl);
      
      // Convert to file for API
      const file = dataURLtoFile(imageDataUrl, 'camera-capture.jpg');
      setImageFile(file);
      
      stopCamera();
      setError(null);
      analyzeImage(file);
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

  // Analyze image using API
  const analyzeImage = async (file) => {
    setIsAnalyzing(true);
    setError(null);
    setAnalysisResult(null);
    
    try {
      // Prepare FormData for API
      const formData = new FormData();
      formData.append('image', file);

      // Make API request dengan headers CORS
      const response = await fetch(`${API_BASE_URL}/predict-image`, {
        method: 'POST',
        mode: 'cors', // Explicitly set CORS mode
        headers: {
          // Jangan set Content-Type untuk FormData, biarkan browser yang set
        },
        body: formData,
      });

      // Log response untuk debugging
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('API Response:', result);
      
      if (result.status === 'success') {
        // Format result sesuai dengan struktur yang diharapkan
        const formattedResult = {
          name: result.info.nama_indonesia || result.predicted_class,
          predicted_class: result.predicted_class,
          confidence: (result.confidence * 100).toFixed(2) + '%',
          habitat: result.info.habitat || 'Tidak diketahui',
          konsumsi: result.info.konsumsi || 'Tidak diketahui',
          top_predictions: result.top_3_predictions.map(pred => ({
            class: pred.class,
            confidence: (pred.confidence * 100).toFixed(2) + '%'
          }))
        };
        
        setAnalysisResult(formattedResult);
      } else {
        throw new Error(result.message || 'Gagal menganalisis gambar');
      }
    } catch (error) {
      console.error('Error analyzing image:', error);
      
      // Handle different types of errors
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        setError(`CORS Error: Server API tidak mengizinkan akses dari browser. 
                  Pastikan server API mengaktifkan CORS untuk ${window.location.origin}. 
                  Server status: ${API_BASE_URL} - Coba refresh halaman dan pastikan server berjalan.`);
      } else if (error.message.includes('NetworkError')) {
        setError('Network Error: Tidak dapat terhubung ke server API. Pastikan server berjalan di localhost:5000');
      } else if (error.message.includes('413')) {
        setError('File terlalu besar untuk diproses');
      } else if (error.message.includes('415')) {
        setError('Format file tidak didukung');
      } else {
        setError('Gagal menganalisis gambar: ' + error.message);
      }
    } finally {
      setIsAnalyzing(false);
    }
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

      // Ganti dengan endpoint API Anda untuk menyimpan data
      const response = await fetch(`${API_BASE_URL}/api/save-scan`, {
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
      // Fallback ke localStorage jika API gagal
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

      // Ganti dengan endpoint API Anda untuk katalog
      const response = await fetch(`${API_BASE_URL}/api/save-to-catalog`, {
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
      // Fallback ke localStorage jika API gagal
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
    setImageFile(null);
    setAnalysisResult(null);
    setIsAnalyzing(false);
    setError(null);
    stopCamera();
  };

  return (
    <div className="scan-container">
      <h2 className="section-title">Scan Ikanmu Disini</h2>
      <p className="section-subtitle">100% Otomatis dan Gratis</p>
      
      {/* Error Display */}
      {error && (
        <div className="error-message" style={{
          backgroundColor: '#fee2e2',
          border: '1px solid #fecaca',
          color: '#dc2626',
          padding: '12px',
          borderRadius: '8px',
          margin: '16px 0',
          textAlign: 'center'
        }}>
          <i className="fas fa-exclamation-triangle" style={{ marginRight: '8px' }}></i>
          {error}
        </div>
      )}
      
      {!selectedImage && !isCamera && (
        <div className="scan-box">
          <div className="scan-icon">
            <i className="fas fa-camera"></i>
          </div>
          <p className="scan-text">Unggah Gambar atau Gunakan Kamera</p>
          <p className="scan-hint">Atau Drop File kamu (Max 10MB)</p>
          
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
                <p>Menganalisis gambar...</p>
                <p style={{ fontSize: '14px', color: '#666' }}>
                  Mengirim ke AI server...
                </p>
              </div>
            </div>
          )}

          {analysisResult && !isAnalyzing && (
            <div className="analysis-result">
              <div className="result-card">
                <img src={selectedImage} alt={analysisResult.name} className="result-image" />
                <div className="result-info">
                  <h3 className="fish-name">{analysisResult.name}</h3>
                  
                  {/* Informasi Utama */}
                  <div className="main-info">
                    <p><strong>Habitat:</strong> {analysisResult.habitat}</p>
                    <p><strong>Konsumsi:</strong> {analysisResult.konsumsi}</p>
                    <p><strong>Confidence:</strong> {analysisResult.confidence}</p>
                  </div>

                  {/* Top 3 Predictions */}
                  <div className="predictions-section">
                    <h4>Top 3 Prediksi:</h4>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                      {analysisResult.top_predictions.map((pred, index) => (
                        <li key={index} style={{ 
                          padding: '4px 0', 
                          borderBottom: index < 2 ? '1px solid #eee' : 'none' 
                        }}>
                          <span>{index + 1}. {pred.class}</span>
                          <span style={{ float: 'right', color: '#666' }}>
                            {pred.confidence}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
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