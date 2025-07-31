// D:\Projek Kominfo\project-kominfo-2\src\components\ScanUpload.jsx
import React from 'react';

function ScanUpload() {
  return (
    <div className="scan-container">
      <h2 className="section-title">Scan Ikanmu Disini</h2>
      <p className="section-subtitle">100% Otomatis dan Gratis</p>
      
      <div className="scan-box">
        <div className="scan-icon">
          <i className="fas fa-camera"></i>
        </div>
        <p className="scan-text">Unggah Gambar</p>
        <p className="scan-hint">Atau Drop File kamu</p>
        
        <input 
          type="file" 
          id="file-upload" 
          accept="image/*" 
          className="file-input" 
        />
        <label htmlFor="file-upload" className="file-label">
          Pilih File
        </label>
      </div>
    </div>
  );
}

export default ScanUpload;