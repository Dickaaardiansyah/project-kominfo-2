import React, { useState, useEffect } from 'react';
import ProfileItem from './ProfileItem';
import { User, Lock, Mail } from 'lucide-react';

function AccountInfo() {
  const [accountData, setAccountData] = useState({
    username: '',
    password: '***********',
    email: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const API_BASE_URL = 'http://localhost:5000';

  // Validate input fields
  const validateField = (field, value) => {
    switch (field) {
      case 'username':
        if (value.length < 2) return 'Nama pengguna minimal 2 karakter';
        return '';
      case 'email':
        if (!value.includes('@')) return 'Format email tidak valid';
        return '';
      case 'password':
        if (value !== '***********' && value.length < 6) return 'Password minimal 6 karakter';
        return '';
      default:
        return '';
    }
  };

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Silakan login kembali untuk melihat data akun');
          setLoading(false);
          return;
        }

        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/users`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();
        if (response.ok) {
          setAccountData({
            username: data.name || 'Unknown',
            password: '***********',
            email: data.email || ''
          });
          setInfoMessage('');
        } else {
          setError(data.msg || 'Gagal memuat data akun');
          setInfoMessage('Periksa koneksi Anda atau login kembali');
        }
      } catch (err) {
        setError('Gagal terhubung ke server');
        setInfoMessage('Pastikan server berjalan di localhost:5000');
        console.error('Fetch user error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Handle field edits
  const handleEdit = (field, newValue) => {
    const validationError = validateField(field, newValue);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError('');
    setInfoMessage('Perubahan disimpan sementara. Untuk memperbarui data di server, silakan registrasi ulang.');
    setAccountData(prev => ({
      ...prev,
      [field]: newValue
    }));
  };

  const accountItems = [
    {
      id: 'username',
      icon: <User size={20} />,
      label: 'Nama Pengguna:',
      value: accountData.username,
      editable: true,
      onEdit: (value) => handleEdit('username', value)
    },
    {
      id: 'password',
      icon: <Lock size={20} />,
      label: 'Kata Sandi:',
      value: accountData.password,
      editable: true,
      onEdit: (value) => handleEdit('password', value)
    },
    {
      id: 'email',
      icon: <Mail size={20} />,
      label: 'Alamat Email:',
      value: accountData.email,
      editable: true,
      onEdit: (value) => handleEdit('email', value)
    }
  ];

  return (
    <div className="profile-section">
      <h2 className="section-title">Informasi Akun</h2>
      {loading && (
        <div className="loading" style={{ padding: '20px', textAlign: 'center' }}>
          <span className="loading-spinner" style={{
            width: '16px',
            height: '16px',
            border: '2px solid transparent',
            borderTop: '2px solid #007AFF',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            display: 'inline-block',
            marginRight: '8px'
          }}></span>
          Memuat data...
        </div>
      )}
      {error && (
        <div className="error-message" style={{
          backgroundColor: '#dc2626',
          color: 'white',
          padding: '16px',
          borderRadius: '8px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span style={{ fontSize: '16px' }}>⚠️</span>
          {error}
        </div>
      )}
      {infoMessage && (
        <div className="info-message" style={{
          backgroundColor: '#2563eb',
          color: 'white',
          padding: '16px',
          borderRadius: '8px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span style={{ fontSize: '16px' }}>ℹ️</span>
          {infoMessage}
        </div>
      )}
      {!loading && !error && accountItems.map((item) => (
        <ProfileItem
          key={item.id}
          {...item}
        />
      ))}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default AccountInfo;