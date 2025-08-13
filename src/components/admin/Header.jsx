import React from 'react';
import styles from "../../styles/admin/Dashboard.module.css";
import '../../styles/admin/dashboard.css';

function Header() {
    return (
   
        <header className={styles.header}>
            <div className={styles.headerLeft}>
                <h1>Dashboard Verifikasi</h1>
                <p>Kelola pendaftaran penjual ikan baru di platform FishMap</p>
            </div>
            <div className={styles.headerActions}>
                <button className={`${styles.btn} ${styles.btnOutline}`}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3 18h6v-2H3v2zM3 6v2h18V6H3zm0 7h12v-2H3v2z" />
                    </svg>
                    Filter
                </button>
                <div className={styles.userInfo}>
                    <span>Admin FishMap</span>
                    <div className={styles.avatar}>FM</div>
                </div>
            </div>
        </header>
        // </main>
    );
}

export default Header;
