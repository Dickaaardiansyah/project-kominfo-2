import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from './auth/AdminAuthContext';
import styles from "../../styles/admin/Dashboard.module.css";
import '../../styles/admin/dashboard.css';

function Header() {
    const navigate = useNavigate();
    const { adminInfo, logout, isAuthenticated } = useAdminAuth();
    const [showDropdown, setShowDropdown] = useState(false);

    // Debug log untuk melihat adminInfo
    useEffect(() => {
        console.log('Header - Admin Info:', adminInfo);
        console.log('Header - Is Authenticated:', isAuthenticated);
    }, [adminInfo, isAuthenticated]);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/admin/login');
        } catch (error) {
            console.error('Logout error:', error);
            navigate('/admin/login');
        }
    };

    const getInitials = (name) => {
        if (!name) return 'AD';
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    const getRoleDisplayName = (role) => {
        switch(role) {
            case 'super_admin':
                return 'Super Admin';
            case 'seller_verifier':
                return 'Verifikator Penjual';
            case 'admin':
                return 'Admin';
            default:
                return 'Admin';
        }
    };

    const getRoleBadgeColor = (role) => {
        switch(role) {
            case 'super_admin':
                return '#dc2626'; // Red
            case 'seller_verifier':
                return '#0891b2'; // Blue
            case 'admin':
                return '#059669'; // Green
            default:
                return '#6b7280'; // Gray
        }
    };

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
                
                {/* Admin Info Section */}
                <div className={styles.userInfo} style={{ position: 'relative' }}>
                    <div style={{ textAlign: 'right', marginRight: '12px' }}>
                        <span style={{ 
                            display: 'block', 
                            fontWeight: '600',
                            fontSize: '14px',
                            color: '#334155'
                        }}>
                            {adminInfo?.name || 'Loading...'}
                        </span>
                        {adminInfo?.role && (
                            <span style={{ 
                                display: 'inline-block',
                                fontSize: '11px',
                                background: getRoleBadgeColor(adminInfo.role),
                                color: 'white',
                                padding: '2px 8px',
                                borderRadius: '12px',
                                fontWeight: '500',
                                marginTop: '2px'
                            }}>
                                {getRoleDisplayName(adminInfo.role)}
                            </span>
                        )}
                    </div>
                    
                    <div 
                        className={styles.avatar} 
                        style={{ 
                            cursor: 'pointer',
                            background: 'linear-gradient(135deg, #0891b2, #0e7490)',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: '600',
                            fontSize: '12px'
                        }}
                        onClick={() => setShowDropdown(!showDropdown)}
                    >
                        {getInitials(adminInfo?.name)}
                    </div>

                    {/* Dropdown Menu */}
                    {showDropdown && (
                        <div style={{
                            position: 'absolute',
                            top: '100%',
                            right: '0',
                            marginTop: '8px',
                            background: 'white',
                            borderRadius: '12px',
                            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                            border: '1px solid #e5e7eb',
                            minWidth: '200px',
                            zIndex: 1000,
                            overflow: 'hidden'
                        }}>
                            {/* Profile Info */}
                            <div style={{
                                padding: '16px',
                                borderBottom: '1px solid #e5e7eb',
                                background: '#f8fafc'
                            }}>
                                <div style={{
                                    fontWeight: '600',
                                    fontSize: '14px',
                                    color: '#111827',
                                    marginBottom: '4px'
                                }}>
                                    {adminInfo?.name || 'Admin'}
                                </div>
                                <div style={{
                                    fontSize: '12px',
                                    color: '#6b7280',
                                    marginBottom: '6px'
                                }}>
                                    {adminInfo?.email || 'admin@fishmap.com'}
                                </div>
                                {adminInfo?.role && (
                                    <div style={{
                                        fontSize: '11px',
                                        background: getRoleBadgeColor(adminInfo.role),
                                        color: 'white',
                                        padding: '2px 8px',
                                        borderRadius: '8px',
                                        display: 'inline-block'
                                    }}>
                                        {getRoleDisplayName(adminInfo.role)}
                                    </div>
                                )}
                            </div>

                            {/* Menu Items */}
                            <div style={{ padding: '8px 0' }}>
                                <button
                                    style={{
                                        width: '100%',
                                        padding: '12px 16px',
                                        border: 'none',
                                        background: 'none',
                                        textAlign: 'left',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        color: '#374151',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        transition: 'background 0.2s ease'
                                    }}
                                    onMouseEnter={(e) => e.target.style.background = '#f3f4f6'}
                                    onMouseLeave={(e) => e.target.style.background = 'transparent'}
                                    onClick={() => {
                                        setShowDropdown(false);
                                        // Navigate to profile or settings
                                        console.log('Go to profile');
                                    }}
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                                    </svg>
                                    Profil Admin
                                </button>

                                <button
                                    style={{
                                        width: '100%',
                                        padding: '12px 16px',
                                        border: 'none',
                                        background: 'none',
                                        textAlign: 'left',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        color: '#374151',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        transition: 'background 0.2s ease'
                                    }}
                                    onMouseEnter={(e) => e.target.style.background = '#f3f4f6'}
                                    onMouseLeave={(e) => e.target.style.background = 'transparent'}
                                    onClick={() => {
                                        setShowDropdown(false);
                                        // Navigate to settings
                                        console.log('Go to settings');
                                    }}
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.82,11.69,4.82,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>
                                    </svg>
                                    Pengaturan
                                </button>

                                <div style={{
                                    margin: '8px 0',
                                    height: '1px',
                                    background: '#e5e7eb'
                                }} />

                                <button
                                    style={{
                                        width: '100%',
                                        padding: '12px 16px',
                                        border: 'none',
                                        background: 'none',
                                        textAlign: 'left',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        color: '#dc2626',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        transition: 'background 0.2s ease'
                                    }}
                                    onMouseEnter={(e) => e.target.style.background = '#fef2f2'}
                                    onMouseLeave={(e) => e.target.style.background = 'transparent'}
                                    onClick={handleLogout}
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
                                    </svg>
                                    Logout
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Click outside to close dropdown */}
            {showDropdown && (
                <div 
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 999
                    }}
                    onClick={() => setShowDropdown(false)}
                />
            )}
        </header>
    );
}

export default Header;