import React from "react";
import styles from "../../styles/admin/Dashboard.module.css";
import '../../styles/admin/dashboard.css';

function Sidebar() {
  return (
    <nav className={styles.sidebar}>
      {/* Logo & Toggle */}
      <div className={styles.logo}>
        <button className={styles.sidebarToggle}>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
          </svg>
        </button>
        <h2>
          <svg className={styles.fishIcon} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2c5.4 0 10 4.6 10 10 0 5.4-4.6 10-10 10S2 17.4 2 12 6.6 2 12 2zm-1 17.93c3.94-.49 7-3.85 7-7.93 0-.62-.08-1.21-.21-1.79L9 10v1c0 1.1-.9 2-2 2s-2-.9-2-2V9c0-1.1.9-2 2-2s2 .9 2 2v.17l8.79-.21C17.21 8.34 16.62 8.26 16 8.26c-4.08 0-7.44 3.06-7.93 7H9c-.55 0-1 .45-1 1s.45 1 1 1h-.93z" />
          </svg>
          <span>FishMap</span>
        </h2>
        <p>Sistem Verifikasi Penjual</p>
      </div>

      {/* Menu */}
      <ul className={styles.navMenu}>
        <li className={styles.navItem}>
          <a href="#" className={`${styles.navLink} ${styles.active}`}>
            <svg className={styles.navIcon} viewBox="0 0 24 24">
              <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
            </svg>
            <span>Dashboard</span>
          </a>
        </li>

        <li className={styles.navItem}>
          <a href="#" className={styles.navLink}>
            <svg className={styles.navIcon} viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
            <span>Menunggu Verifikasi</span>
            <span className={styles.badge}>12</span>
          </a>
        </li>

        <li className={styles.navItem}>
          <a href="#" className={styles.navLink}>
            <svg className={styles.navIcon} viewBox="0 0 24 24">
              <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
            </svg>
            <span>Disetujui</span>
            <span className={`${styles.badge} ${styles.success}`}>45</span>
          </a>
        </li>

        <li className={styles.navItem}>
          <a href="#" className={styles.navLink}>
            <svg className={styles.navIcon} viewBox="0 0 24 24">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
            <span>Ditolak</span>
            <span className={styles.badge}>8</span>
          </a>
        </li>

        <li className={styles.navItem}>
          <a href="#" className={styles.navLink}>
            <svg className={styles.navIcon} viewBox="0 0 24 24">
              <path d="M12 2c5.4 0 10 4.6 10 10 0 5.4-4.6 10-10 10S2 17.4 2 12 6.6 2 12 2zm-1 17.93c3.94-.49 7-3.85 7-7.93 0-.62-.08-1.21-.21-1.79L9 10v1c0 1.1-.9 2-2 2s-2-.9-2-2V9c0-1.1.9-2 2-2s2 .9 2 2v.17l8.79-.21C17.21 8.34 16.62 8.26 16 8.26c-4.08 0-7.44 3.06-7.93 7H9c-.55 0-1 .45-1 1s.45 1 1 1h-.93z" />
            </svg>
            <span>Penjual Ikan</span>
          </a>
        </li>

        <li className={styles.navItem}>
          <a href="#" className={styles.navLink}>
            <svg className={styles.navIcon} viewBox="0 0 24 24">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
            </svg>
            <span>Laporan</span>
          </a>
        </li>

        <li className={styles.navItem}>
          <a href="#" className={styles.navLink}>
            <svg className={styles.navIcon} viewBox="0 0 24 24">
              <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.82,11.69,4.82,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z" />
            </svg>
            <span>Pengaturan</span>
          </a>
        </li>
      </ul>
    </nav>
  );
}

export default Sidebar;
