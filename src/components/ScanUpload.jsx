import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function ScanUpload() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isCamera, setIsCamera] = useState(false);
  const [stream, setStream] = useState(null);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  
  // ⭐ Permission system states
  const [userStatus, setUserStatus] = useState(null);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);
  const [isRequestingAccess, setIsRequestingAccess] = useState(false);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  const API_BASE_URL = 'http://localhost:5000';

  // ⭐ Check user catalog access status
  useEffect(() => {
    checkUserCatalogStatus();
  }, []);

  const checkUserCatalogStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setUserStatus({ 
          can_access_catalog: false, 
          role: 'guest',
          request_status: 'none',
          is_email_verified: false 
        });
        setIsCheckingStatus(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/catalog/my-status`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const result = await response.json();
        setUserStatus(result.data);
        console.log('🔍 User catalog status:', result.data);
      } else {
        console.error('Failed to get user status:', response.statusText);
        // Fallback to basic user status
        setUserStatus({ 
          can_access_catalog: false, 
          role: 'user',
          request_status: 'none',
          is_email_verified: true 
        });
      }
    } catch (error) {
      console.error('Error checking user status:', error);
      setUserStatus({ 
        can_access_catalog: false, 
        role: 'user',
        request_status: 'none',
        is_email_verified: true 
      });
    } finally {
      setIsCheckingStatus(false);
    }
  };

  // ⭐ UPDATED: Request catalog access (now pending approval)
const requestCatalogAccess = () => {
  // Direct to catalog registration page
  navigate('/katalog/daftar');
};

  // ⭐ Show success toast notification
  const showSuccessToast = (message) => {
    const toast = document.createElement('div');
    toast.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #3b82f6, #2563eb);
        color: white;
        padding: 16px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 9999;
        max-width: 400px;
        animation: slideIn 0.3s ease-out;
      ">
        <div style="display: flex; align-items: center; gap: 10px;">
          <span style="font-size: 20px;">📨</span>
          <span style="font-weight: 500;">${message}</span>
        </div>
      </div>
    `;

    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
    `;
    document.head.appendChild(style);
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.remove();
      style.remove();
    }, 5000);
  };

  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Silakan pilih file gambar yang valid');
        return;
      }

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
        video: { facingMode: 'environment' }
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
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`${API_BASE_URL}/predict-image`, {
        method: 'POST',
        mode: 'cors',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      
      if (result.status === 'success') {
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
      setError('Gagal menganalisis gambar: ' + error.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Save to database
  const saveToDatabase = async () => {
    if (!analysisResult || !selectedImage) {
      alert('Tidak ada data untuk disimpan');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const formData = new FormData();
      
      if (imageFile) {
        formData.append('image', imageFile);
      }
      
      formData.append('fish_name', analysisResult.name || analysisResult.predicted_class);
      formData.append('predicted_class', analysisResult.predicted_class);
      formData.append('confidence', parseFloat(analysisResult.confidence.replace('%', '')));
      formData.append('habitat', analysisResult.habitat);
      formData.append('konsumsi', analysisResult.konsumsi);
      formData.append('top_predictions', JSON.stringify(analysisResult.top_predictions));
      formData.append('timestamp', new Date().toISOString());
      formData.append('saved_to_catalog', 'false');

      const response = await fetch(`${API_BASE_URL}/api/save-scan`, {
        method: 'POST',
        mode: 'cors',
        body: formData
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const result = await response.json();

      if (result.status === 'success' || result.success) {
        alert('Data berhasil disimpan ke database!');
      } else {
        throw new Error(result.message || 'Gagal menyimpan data');
      }

    } catch (error) {
      console.error('Error saving to database:', error);
      setError('Gagal menyimpan data: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Navigate to AddKatalog page with data
  const goToAddKatalog = () => {
    if (!analysisResult || !selectedImage) {
      alert('Tidak ada data hasil analisis');
      return;
    }

    const catalogData = {
      predictedFishName: analysisResult.name || analysisResult.predicted_class,
      aiAccuracy: parseFloat(analysisResult.confidence.replace('%', '')) / 100,
      fishImage: selectedImage,
      namaIkan: analysisResult.name || analysisResult.predicted_class,
      kategori: analysisResult.konsumsi === 'Dapat dikonsumsi' ? 'Ikan Konsumsi' : 'Ikan Hias',
      habitat: analysisResult.habitat,
      tingkatKeamanan: 0.98,
      amanDikonsumsi: analysisResult.konsumsi === 'Dapat dikonsumsi',
      jauhDariPabrik: true,
      scanTimestamp: new Date().toISOString(),
      originalImageFile: imageFile
    };

    localStorage.setItem('pendingCatalogData', JSON.stringify(catalogData));
    navigate('/katalog/tambah');
  };

  // Reset scan
  const resetScan = () => {
    setSelectedImage(null);
    setImageFile(null);
    setAnalysisResult(null);
    setIsAnalyzing(false);
    setError(null);
    setIsSaving(false);
    stopCamera();
  };

  // ⭐ UPDATED: Render permission status info
  const renderPermissionInfo = () => {
    if (isCheckingStatus) {
      return (
        <div className="permission-info checking">
          <i className="fas fa-spinner fa-spin"></i> 
          Mengecek status akses katalog...
        </div>
      );
    }

    if (!userStatus) return null;

    if (userStatus.role === 'guest') {
      return (
        <div className="permission-info guest">
          <i className="fas fa-info-circle"></i>
          <span>Silakan login untuk mengakses fitur katalog</span>
        </div>
      );
    }

    if (!userStatus.is_email_verified) {
      return (
        <div className="permission-info warning">
          <i className="fas fa-exclamation-triangle"></i>
          <span>Verifikasi email terlebih dahulu untuk request akses katalog</span>
        </div>
      );
    }

    if (userStatus.can_access_catalog) {
      return (
        <div className="permission-info success">
          <i className="fas fa-check-circle"></i>
          <span>✨ Anda dapat menambahkan hasil scan ke katalog publik</span>
        </div>
      );
    }

    // ⭐ UPDATED: Handle pending status
    if (userStatus.request_status === 'pending') {
      const requestDate = userStatus.request_date ? new Date(userStatus.request_date) : null;
      const daysWaiting = requestDate ? Math.floor((new Date() - requestDate) / (1000 * 60 * 60 * 24)) : 0;
      
      return (
        <div className="permission-info pending">
          <i className="fas fa-clock"></i>
          <span>
            📨 Request akses katalog sedang direview admin 
            {daysWaiting > 0 && ` (${daysWaiting} hari yang lalu)`}
          </span>
        </div>
      );
    }

    if (userStatus.request_status === 'rejected') {
      return (
        <div className="permission-info rejected">
          <i className="fas fa-times-circle"></i>
          <span>❌ Request akses katalog ditolak. Alasan: {userStatus.rejection_reason}</span>
        </div>
      );
    }

    return (
      <div className="permission-info info">
        <i className="fas fa-info-circle"></i>
        <span>Request akses katalog untuk dapat berkontribusi ke database publik</span>
      </div>
    );
  };

  // ⭐ UPDATED: Render catalog button
  const renderCatalogButton = () => {
    if (isCheckingStatus || !userStatus) return null;

    // Guest user - show login prompt
    if (userStatus.role === 'guest') {
      return (
        <button 
          onClick={() => navigate('/login')}
          className="login-button"
        >
          <i className="fas fa-sign-in-alt"></i> 
          Login untuk Akses Katalog
        </button>
      );
    }

    // User can access catalog (approved contributor)
    if (userStatus.can_access_catalog) {
      return (
        <button 
          onClick={goToAddKatalog} 
          className="catalog-button"
          disabled={isSaving}
        >
          <i className="fas fa-plus"></i> 
          Tambah ke Katalog +
        </button>
      );
    }

    // User email not verified
    if (!userStatus.is_email_verified) {
      return (
        <button 
          className="catalog-button disabled"
          disabled
          title="Verifikasi email terlebih dahulu"
        >
          <i className="fas fa-envelope"></i> 
          Verifikasi Email Dulu
        </button>
      );
    }

    // ⭐ UPDATED: User request pending
    if (userStatus.request_status === 'pending') {
      return (
        <button 
          className="catalog-button pending"
          disabled
          title="Request sedang direview admin"
        >
          <i className="fas fa-clock"></i> 
          Sedang Direview Admin...
        </button>
      );
    }

    // User request rejected
    if (userStatus.request_status === 'rejected') {
      return (
        <button 
          className="catalog-button rejected"
          disabled
          title={`Ditolak: ${userStatus.rejection_reason}`}
        >
          <i className="fas fa-ban"></i> 
          Request Ditolak
        </button>
      );
    }

    // ⭐ User can request access
    return (
      <button 
        onClick={requestCatalogAccess}
        className="request-access-button"
        disabled={isRequestingAccess}
      >
        <i className="fas fa-paper-plane"></i> 
        {isRequestingAccess ? 'Mengirim Request...' : 'Request Akses Katalog'}
      </button>
    );
  };

  return (
    <div className="scan-container">
      <h2 className="section-title">Scan Ikanmu Disini</h2>
      <p className="section-subtitle">100% Otomatis dan Gratis</p>
      
      {/* Permission Status Info */}
      {renderPermissionInfo()}
      
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

          {isSaving && (
            <div className="analyzing-modal">
              <div className="analyzing-content">
                <div className="analyzing-spinner"></div>
                <p>Menyimpan data...</p>
                <p style={{ fontSize: '14px', color: '#666' }}>
                  Mengirim ke database...
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
                  
                  <div className="main-info">
                    <p><strong>Habitat:</strong> {analysisResult.habitat}</p>
                    <p><strong>Konsumsi:</strong> {analysisResult.konsumsi}</p>
                    <p><strong>Confidence:</strong> {analysisResult.confidence}</p>
                  </div>

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
                <button 
                  onClick={saveToDatabase} 
                  className="save-button"
                  disabled={isSaving}
                >
                  <i className="fas fa-save"></i> 
                  {isSaving ? 'Menyimpan...' : 'Simpan'}
                </button>
                
                {/* ⭐ UPDATED: Conditional catalog button */}
                {renderCatalogButton()}
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