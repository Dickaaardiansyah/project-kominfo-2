import React, { useState, useEffect } from 'react';
import styles from "../../styles/admin/Dashboard.module.css";

function Verifcard() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingId, setProcessingId] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedAppId, setSelectedAppId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const API_BASE_URL = 'http://localhost:5000';

  // ⭐ Load pending requests from API
  useEffect(() => {
    loadPendingRequests();
  }, []);

  const loadPendingRequests = async () => {
    try {
      const token = localStorage.getItem('adminAccessToken'); // Admin token
      if (!token) {
        setError('Token admin tidak ditemukan');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/catalog/admin/pending-requests`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const result = await response.json();
        console.log('📋 Pending requests loaded:', result.data);
        setApplications(result.data || []);
      } else {
        const errorResult = await response.json();
        setError(errorResult.msg || 'Gagal memuat data pending requests');
      }
    } catch (error) {
      console.error('Error loading pending requests:', error);
      setError('Gagal terhubung ke server');
    } finally {
      setLoading(false);
    }
  };

  // ⭐ Approve application
  const approveApplication = async (userId) => {
    if (processingId) return; // Prevent double click

    setProcessingId(userId);
    try {
      const token = localStorage.getItem('adminAccessToken');
      const response = await fetch(`${API_BASE_URL}/api/catalog/admin/approve/${userId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();

      if (response.ok) {
        console.log('✅ Application approved:', result);

        // Remove approved application from list
        setApplications(prevApps => prevApps.filter(app => app.id !== userId));

        // Show success message
        alert(`✅ Request dari ${result.data.user_name} berhasil disetujui!`);

        // Optional: Show toast notification
        showToast(`${result.data.user_name} sekarang menjadi kontributor katalog`, 'success');

      } else {
        console.error('❌ Approval failed:', result);
        alert(`❌ Gagal menyetujui: ${result.msg}`);
      }
    } catch (error) {
      console.error('Error approving application:', error);
      alert('❌ Gagal menyetujui aplikasi. Coba lagi nanti.');
    } finally {
      setProcessingId(null);
    }
  };

  // ⭐ Reject application
  const rejectApplication = async () => {
    if (!selectedAppId || !rejectionReason.trim()) {
      alert('Alasan penolakan harus diisi');
      return;
    }

    try {
      const token = localStorage.getItem('adminAccessToken');

      const response = await fetch(`${API_BASE_URL}/api/catalog/admin/reject/${selectedAppId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          rejection_reason: rejectionReason
        })
      });

      const result = await response.json();

      if (response.ok) {
        console.log('❌ Application rejected:', result);

        // Remove rejected application from list
        setApplications(prevApps => prevApps.filter(app => app.id !== selectedAppId));

        // Close modal and reset
        setShowRejectModal(false);
        setSelectedAppId(null);
        setRejectionReason('');

        // Show success message
        alert(`❌ Request dari ${result.data.user_name} ditolak.`);

        showToast(`Request ${result.data.user_name} ditolak`, 'warning');

      } else {
        console.error('❌ Rejection failed:', result);
        alert(`❌ Gagal menolak: ${result.msg}`);
      }
    } catch (error) {
      console.error('Error rejecting application:', error);
      alert('❌ Gagal menolak aplikasi. Coba lagi nanti.');
    }
  };

  // ⭐ Open reject modal
  const openRejectModal = (userId) => {
    setSelectedAppId(userId);
    setShowRejectModal(true);
    setRejectionReason('');
  };

  // ⭐ Close reject modal
  const closeRejectModal = () => {
    setShowRejectModal(false);
    setSelectedAppId(null);
    setRejectionReason('');
  };

  // ⭐ View details (for future implementation)
  const viewDetails = (userId) => {
    const app = applications.find(a => a.id === userId);
    if (app) {
      alert(`Detail untuk ${app.nama}:\n\nEmail: ${app.email}\nTelepon: ${app.telepon}\nTanggal Request: ${app.tanggalDaftar}`);
    }
  };

  // ⭐ Show toast notification
  const showToast = (message, type = 'info') => {
    const colors = {
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6'
    };

    const toast = document.createElement('div');
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${colors[type]};
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 9999;
      max-width: 400px;
      font-weight: 500;
      animation: slideIn 0.3s ease-out;
    `;
    toast.textContent = message;

    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
  };

  // ⭐ Loading state
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '200px',
        color: '#666'
      }}>
        <div>
          <div style={{ marginBottom: '10px' }}>🔄 Memuat data request...</div>
          <div style={{ fontSize: '14px' }}>Mengambil data dari server...</div>
        </div>
      </div>
    );
  }

  // ⭐ Error state
  if (error) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '200px',
        color: '#dc2626',
        textAlign: 'center'
      }}>
        <div>
          <div style={{ marginBottom: '10px' }}>❌ {error}</div>
          <button
            onClick={loadPendingRequests}
            style={{
              padding: '8px 16px',
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            🔄 Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  // ⭐ Empty state
  if (applications.length === 0) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '200px',
        color: '#666',
        textAlign: 'center'
      }}>
        <div>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📝</div>
          <div style={{ fontSize: '18px', marginBottom: '8px' }}>Tidak ada request pending</div>
          <div style={{ fontSize: '14px', opacity: 0.7 }}>Semua request katalog sudah diproses</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={styles.applicationsGrid}>
        {applications.map((app) => (
          <div key={app.id} className={styles.applicationCard}>
            <div className={styles.applicationHeader}>
              <div className={styles.applicantInfo}>
                <div className={styles.applicantAvatar}>
                  {app.nama.split(' ').map((n) => n[0]).join('')}
                </div>
                <div className={styles.applicantDetails}>
                  <h3>{app.nama}</h3>
                  <p>{app.usaha}</p>
                </div>
              </div>
              <div className={`${styles.applicationStatus} ${styles.statusPending}`}>
                Menunggu Review
              </div>
            </div>

            <div className={styles.applicationDetails}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Tanggal Request</span>
                <span className={styles.detailValue}>{app.tanggalDaftar}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Registrasi</span>
                <span className={styles.detailValue}>{app.tanggalRegistrasi}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>No. Telepon</span>
                <span className={styles.detailValue}>{app.telepon || 'Tidak tersedia'}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Email</span>
                <span className={styles.detailValue}>{app.email}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Jenis Kontribusi</span>
                <span className={styles.detailValue}>{app.jenisKontribusi}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Status</span>
                <span className={styles.detailValue}>{app.pengalaman}</span>
              </div>
              {app.daysWaiting > 0 && (
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Menunggu</span>
                  <span className={styles.detailValue}>
                    {app.daysWaiting} hari
                    {app.daysWaiting > 2 && <span style={{ color: '#f59e0b' }}> ⚠️</span>}
                  </span>
                </div>
              )}
            </div>

            <div className={styles.applicationDocuments}>
              <div className={styles.documentsTitle}>Status Verifikasi:</div>
              <div className={styles.documentsList}>
                {app.dokumen.map((doc, index) => (
                  <div key={index} className={styles.documentItem}>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z" />
                    </svg>
                    {doc}
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.applicationActions}>
              <button
                className={`${styles.btn} ${styles.btnSecondary}`}
                onClick={() => viewDetails(app.id)}
              >
                Detail
              </button>
              <button
                className={`${styles.btn} ${styles.btnDanger}`}
                onClick={() => openRejectModal(app.id)}
                disabled={processingId === app.id}
              >
                Tolak
              </button>
              <button
                className={`${styles.btn} ${styles.btnSuccess}`}
                onClick={() => approveApplication(app.id)}
                disabled={processingId === app.id}
              >
                {processingId === app.id ? '⏳ Memproses...' : 'Setujui'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ⭐ Reject Modal */}
      {showRejectModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>Tolak Request Akses Katalog</h3>
              <button
                className={styles.modalClose}
                onClick={closeRejectModal}
              >
                ×
              </button>
            </div>
            <div className={styles.modalBody}>
              <p>Berikan alasan penolakan untuk user:</p>
              <p><strong>{applications.find(a => a.id === selectedAppId)?.nama}</strong></p>

              <textarea
                placeholder="Masukkan alasan penolakan..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                  marginTop: '10px'
                }}
              />
            </div>
            <div className={styles.modalFooter}>
              <button
                className={`${styles.btn} ${styles.btnSecondary}`}
                onClick={closeRejectModal}
              >
                Batal
              </button>
              <button
                className={`${styles.btn} ${styles.btnDanger}`}
                onClick={rejectApplication}
                disabled={!rejectionReason.trim()}
              >
                Tolak Request
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .modalOverlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        
        .modal {
          background: white;
          border-radius: 8px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
          max-width: 500px;
          width: 90%;
          max-height: 90vh;
          overflow-y: auto;
        }
        
        .modalHeader {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .modalClose {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #6b7280;
        }
        
        .modalBody {
          padding: 20px;
        }
        
        .modalFooter {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          padding: 20px;
          border-top: 1px solid #e5e7eb;
        }
        
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </>
  );
}

export default Verifcard;