// src/components/History/FishScanDetailModal.jsx
import React from 'react';
import { X, Save, Plus, Fish, MapPin, Calendar, Target } from 'lucide-react';

function FishScanDetailModal({ fishScan, isOpen, onClose, onSave, onAddToCatalog }) {
  if (!isOpen || !fishScan) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Generate mock top predictions if not available
  const topPredictions = fishScan.fishData.top_predictions || [
    { class: fishScan.fishData.predicted_class, confidence: fishScan.fishData.confidence },
    { class: "Alternative Fish 1", confidence: "85.3%" },
    { class: "Alternative Fish 2", confidence: "78.9%" }
  ];

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSave = () => {
    onSave && onSave(fishScan.id);
  };

  const handleAddToCatalog = () => {
    onAddToCatalog && onAddToCatalog(fishScan);
  };

  return (
    <div className="modal-overlay" onClick={handleBackdropClick}>
      <div className="modal-content fish-detail-modal">
        <div className="modal-header">
          <h2>Detail Hasil Scan</h2>
          <button className="close-button" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="modal-body">
          <div className="result-card">
            <div className="image-section">
              <img 
                src={fishScan.image || "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=250&fit=crop"} 
                alt={fishScan.fishData.name} 
                className="result-image" 
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=250&fit=crop";
                }}
              />
              <div className="scan-badge">
                <span className="scan-id">ID: {fishScan.id}</span>
              </div>
            </div>

            <div className="result-info">
              <h3 className="fish-name">{fishScan.fishData.name}</h3>
              
              {/* Scan Metadata */}
              <div className="scan-metadata">
                <div className="metadata-item">
                  <Calendar size={16} />
                  <span>{formatDate(fishScan.date)}</span>
                </div>
                <div className="metadata-item">
                  <Target size={16} />
                  <span>Akurasi: {fishScan.fishData.confidence}</span>
                </div>
              </div>

              {/* Main Info */}
              <div className="main-info">
                <div className="info-row">
                  <div className="info-label">
                    <Fish size={16} />
                    <span>Nama Latin:</span>
                  </div>
                  <span className="info-value">{fishScan.fishData.predicted_class}</span>
                </div>

                <div className="info-row">
                  <div className="info-label">
                    <MapPin size={16} />
                    <span>Habitat:</span>
                  </div>
                  <span className="info-value">{fishScan.fishData.habitat}</span>
                </div>

                <div className="info-row">
                  <div className="info-label">
                    <span>🍽️</span>
                    <span>Konsumsi:</span>
                  </div>
                  <span className={`info-value badge ${fishScan.fishData.konsumsi === 'Dapat dikonsumsi' ? 'consumable' : 'ornamental'}`}>
                    {fishScan.fishData.konsumsi}
                  </span>
                </div>
              </div>

              {/* Top Predictions */}
              <div className="predictions-section">
                <h4>Top 3 Prediksi AI:</h4>
                <div className="predictions-list">
                  {topPredictions.slice(0, 3).map((pred, index) => (
                    <div key={index} className="prediction-item">
                      <div 
                        className="prediction-rank"
                        style={{
                          backgroundColor: index === 0 ? '#007bff' : index === 1 ? '#28a745' : '#ffc107'
                        }}
                      >
                        <span className="rank-number">{index + 1}</span>
                      </div>
                      <div className="prediction-info">
                        <span className="prediction-class">{pred.class}</span>
                        <div className="confidence-bar">
                          <div 
                            className="confidence-fill" 
                            style={{ 
                              width: pred.confidence,
                              backgroundColor: index === 0 ? '#007bff' : index === 1 ? '#28a745' : '#ffc107'
                            }}
                          ></div>
                        </div>
                      </div>
                      <span className="prediction-confidence">{pred.confidence}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Info */}
              <div className="status-info">
                <div className={`status-badge ${fishScan.status}`}>
                  {fishScan.status === 'saved' ? 'Tersimpan' : 
                   fishScan.status === 'completed' ? 'Selesai' : 
                   'Aktif'}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <div className="action-buttons">
            <button 
              onClick={handleSave} 
              className="save-button"
            >
              <Save size={16} />
              Simpan
            </button>
            <button 
              onClick={handleAddToCatalog} 
              className="catalog-button"
            >
              <Plus size={16} />
              Tambah ke Katalog
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FishScanDetailModal;