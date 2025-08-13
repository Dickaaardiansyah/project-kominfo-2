import React from 'react';
import styles from "../../styles/admin/Dashboard.module.css";

function Verifcard() {
  const applications = [
    {
      id: 'ahmad',
      nama: 'Ahmad Wijaya',
      usaha: 'Ikan Segar & Olahan • Jakarta Selatan',
      status: 'pending',
      tanggalDaftar: '08 Agustus 2025',
      telepon: '+62 812-3456-7890',
      email: 'ahmad.wijaya@email.com',
      jenisIkan: 'Kakap, Tuna, Salmon',
      namaUsaha: 'FishMart Ahmad',
      kapasitas: '50+ kg ikan segar',
      dokumen: ['KTP', 'NPWP', 'Izin Usaha Perikanan', 'Sertifikat Halal']
    },
    {
      id: 'budi',
      nama: 'Budi Santoso',
      usaha: 'Pengolahan Ikan Asap • Surabaya',
      status: 'approved',
      tanggalDaftar: '02 Agustus 2025',
      telepon: '+62 813-4567-8901',
      email: 'budi.santoso@email.com',
      jenisIkan: 'Cakalang, Tongkol',
      namaUsaha: 'Budi Fish Smoke',
      kapasitas: '100+ kg ikan asap',
      dokumen: ['KTP', 'NPWP', 'Sertifikat Halal']
    }
  ];

  const viewDetails = (id) => console.log('Lihat detail:', id);
  const openRejectModal = (id) => console.log('Tolak aplikasi:', id);
  const approveApplication = (id) => console.log('Setujui aplikasi:', id);

  return (
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
            <div
              className={`${styles.applicationStatus} ${
                app.status === 'pending'
                  ? styles.statusPending
                  : app.status === 'approved'
                  ? styles.statusApproved
                  : styles.statusRejected
              }`}
            >
              {app.status === 'pending'
                ? 'Menunggu'
                : app.status === 'approved'
                ? 'Disetujui'
                : 'Ditolak'}
            </div>
          </div>

          <div className={styles.applicationDetails}>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Tanggal Daftar</span>
              <span className={styles.detailValue}>{app.tanggalDaftar}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>No. Telepon</span>
              <span className={styles.detailValue}>{app.telepon}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Email</span>
              <span className={styles.detailValue}>{app.email}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Jenis Ikan</span>
              <span className={styles.detailValue}>{app.jenisIkan}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Nama Usaha</span>
              <span className={styles.detailValue}>{app.namaUsaha}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Kapasitas/Hari</span>
              <span className={styles.detailValue}>{app.kapasitas}</span>
            </div>
          </div>

          <div className={styles.applicationDocuments}>
            <div className={styles.documentsTitle}>Dokumen yang Diunggah:</div>
            <div className={styles.documentsList}>
              {app.dokumen.map((doc, index) => (
                <a key={index} href="#" className={styles.documentItem}>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                  </svg>
                  {doc}
                </a>
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
            >
              Tolak
            </button>
            <button
              className={`${styles.btn} ${styles.btnSuccess}`}
              onClick={() => approveApplication(app.id)}
            >
              Setujui
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Verifcard;
