import React, { useState, useEffect } from 'react';
import ProfileItem from './ProfileItem';
import { Calendar, User, Cake } from 'lucide-react';

function PersonalInfo() {
  const [personalData, setPersonalData] = useState({
    name: '',
    phone: '',
    birthday: localStorage.getItem('userBirthday') || '2004-12-20',
    gender: '',
    age: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const API_BASE_URL = 'http://localhost:5000';

  // Calculate age from birthday
  const calculateAge = (birthday) => {
    if (!birthday) return '18+';
    const birthDate = new Date(birthday);
    if (isNaN(birthDate)) return '18+';
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age.toString();
  };

  // Validate input fields
  const validateField = (field, value) => {
    switch (field) {
      case 'name':
        if (value.length < 2) return 'Nama minimal 2 karakter';
        return '';
      case 'phone':
        if (value.length < 8) return 'Nomor HP minimal 8 digit';
        if (!/^\d+$/.test(value)) return 'Nomor HP hanya boleh angka';
        return '';
      case 'birthday':
        const date = new Date(value);
        if (isNaN(date) || date > new Date()) return 'Tanggal lahir tidak valid';
        return '';
      case 'gender':
        if (value !== 'male' && value !== 'female' && value !== '(opsional)') return 'Jenis kelamin tidak valid';
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
          setError('Silakan login kembali untuk melihat data profil');
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
          const birthday = localStorage.getItem('userBirthday') || '2004-12-20';
          setPersonalData({
            name: data.name || 'Unknown',
            phone: data.phone || '',
            birthday: birthday,
            gender: data.gender || '(opsional)',
            age: calculateAge(birthday)
          });
          setInfoMessage('');
        } else {
          setError(data.msg || 'Gagal memuat data pengguna');
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
    setPersonalData(prev => {
      const updatedData = { ...prev, [field]: newValue };
      if (field === 'birthday') {
        updatedData.age = calculateAge(newValue);
        localStorage.setItem('userBirthday', newValue);
      }
      return updatedData;
    });
  };

  const personalItems = [
    {
      id: 'name',
      icon: <User size={20} />,
      label: 'Nama:',
      value: personalData.name,
      editable: true,
      onEdit: (value) => handleEdit('name', value)
    },
    {
      id: 'phone',
      icon: <User size={20} />,
      label: 'Nomor HP:',
      value: personalData.phone,
      editable: true,
      onEdit: (value) => handleEdit('phone', value)
    },
    {
      id: 'birthday',
      icon: <Cake size={20} />,
      label: 'Tanggal Lahir:',
      value: personalData.birthday,
      editable: true,
      onEdit: (value) => handleEdit('birthday', value)
    },
    {
      id: 'gender',
      icon: <User size={20} />,
      label: 'Jenis Kelamin:',
      value: personalData.gender,
      editable: true,
      onEdit: (value) => handleEdit('gender', value)
    },
    {
      id: 'age',
      icon: <User size={20} />,
      label: 'Umur:',
      value: personalData.age,
      editable: false
    }
  ];

  return (
    <div className="profile-section">
      <h2 className="section-title">Informasi Pribadi</h2>
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
      {!loading && !error && personalItems.map((item) => (
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

export default PersonalInfo;