// Dashboard.jsx - Updated with state management
import React, { useState, useEffect } from 'react'
import styles from "../../styles/admin/Dashboard.module.css";
import Sidebar from '../../components/admin/Sidebar';
import Header from '../../components/admin/Header';
import Grid from '../../components/admin/Grid';
import Verif from '../../components/admin/Verif';
import Verifcard from '../../components/admin/Verifcard';

function Dashboard() {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [applications, setApplications] = useState([]);
    const [stats, setStats] = useState({
        pending: 12,
        approved: 45,
        rejected: 8,
        total: 247
    });

    useEffect(() => {
        // Load initial data
        loadApplications();
        
        // Load saved sidebar state
        const savedState = localStorage.getItem('sidebarCollapsed');
        if (savedState === 'true') {
            setSidebarCollapsed(true);
        }
    }, []);

    const loadApplications = () => {
        // Simulate API call
        const mockApplications = [
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
                status: 'pending',
                tanggalDaftar: '02 Agustus 2025',
                telepon: '+62 813-4567-8901',
                email: 'budi.santoso@email.com',
                jenisIkan: 'Cakalang, Tongkol',
                namaUsaha: 'Budi Fish Smoke',
                kapasitas: '100+ kg ikan asap',
                dokumen: ['KTP', 'NPWP', 'Sertifikat Halal']
            }
        ];
        setApplications(mockApplications);
    };

    const toggleSidebar = () => {
        setSidebarCollapsed(!sidebarCollapsed);
        localStorage.setItem('sidebarCollapsed', !sidebarCollapsed);
    };

    const toggleMobileSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const updateStats = () => {
        const pendingCount = applications.filter(app => app.status === 'pending').length;
        setStats(prev => ({ ...prev, pending: pendingCount }));
    };

    const handleApprove = (applicantId) => {
        setApplications(prev => prev.filter(app => app.id !== applicantId));
        updateStats();
    };

    const handleReject = (applicantId) => {
        setApplications(prev => prev.filter(app => app.id !== applicantId));
        updateStats();
    };

    return (
        <div className="containerAdmin">
            {/* Sidebar Overlay for Mobile */}
            <div 
                className={`${styles.sidebarOverlay} ${sidebarOpen ? styles.show : ''}`}
                onClick={() => setSidebarOpen(false)}
            ></div>
            
            <Sidebar 
                collapsed={sidebarCollapsed}
                mobileOpen={sidebarOpen}
                onToggle={toggleSidebar}
                stats={stats}
            />
            
            <main className={styles.mainContent}>
                <Header onToggleMobileMenu={toggleMobileSidebar} />
                <Grid stats={stats} />
                <div className={styles.verificationSection}>
                    <Verif />
                    <Verifcard 
                        applications={applications}
                        onApprove={handleApprove}
                        onReject={handleReject}
                    />
                </div>
            </main>
        </div>
    )
}

export default Dashboard