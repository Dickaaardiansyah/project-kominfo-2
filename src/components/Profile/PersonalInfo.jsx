import React, { useState, useEffect } from 'react';
import ProfileItem from './ProfileItem';
import { Calendar, User, Cake, Info } from 'lucide-react';

function PersonalInfo() {
  const [personalData, setPersonalData] = useState({
    name: '',
    phone: '',
    birthday: localStorage.getItem('profileBirthday') || '2004-12-20',
    gender: '',
    age: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [debugInfo, setDebugInfo] = useState('');
  const [showMissingDataForm, setShowMissingDataForm] = useState(false);
  const [tempPhone, setTempPhone] = useState('');
  const [tempGender, setTempGender] = useState('');
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(
    localStorage.getItem('profileOnboardingCompleted') === 'true'
  );
  const API_BASE_URL = 'http://localhost:5000';

  // Calculate age from birthday
  const calculateAge = (birthday) => {
    if (!birthday) {
      setDebugInfo(prev => prev + ' [No birthday provided, using default]');
      return '18+';
    }
    const birthDate = new Date(birthday);
    if (isNaN(birthDate)) {
      setDebugInfo(prev => prev + ' [Invalid birthday format]');
      return '18+';
    }
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
        if (!value) return 'Nama wajib diisi';
        if (value.length < 2) return 'Nama minimal 2 karakter';
        return '';
      case 'phone':
        if (!value) return 'Nomor HP wajib diisi';
        if (value.length < 8) return 'Nomor HP minimal 8 digit';
        if (!/^\d+$/.test(value)) return 'Nomor HP hanya boleh angka';
        return '';
      case 'birthday':
        const date = new Date(value);
        if (isNaN(date) || date > new Date()) return 'Tanggal lahir tidak valid';
        return '';
      case 'gender':
        if (!value) return 'Jenis kelamin wajib diisi';
        if (value !== 'male' && value !== 'female') return 'Jenis kelamin harus Laki-laki atau Perempuan';
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
          setDebugInfo('No token found in localStorage');
          setLoading(false);
          return;
        }

        setLoading(true);
        setDebugInfo('Fetching user data...');
        const response = await fetch(`${API_BASE_URL}/users`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();
        console.log('API Response:', data);

        if (response.ok) {
          const birthday = localStorage.getItem('profileBirthday') || '2004-12-20';
          
          // ✅ PERBAIKAN: Ambil phone dan gender dari database response
          // Jika tidak ada di database, fallback ke localStorage
          const phone = data.phone || localStorage.getItem('profilePhone') || '';
          const gender = data.gender || localStorage.getItem('profileGender') || '';

          // Hanya set debug info jika ada masalah atau data missing
          if (!data.phone && !data.gender) {
            setDebugInfo('Some profile data missing from database');
          } else if (!data.phone) {
            setDebugInfo('Phone data missing from database');
          } else if (!data.gender) {
            setDebugInfo('Gender data missing from database');
          } else {
            // Data lengkap dari database, tidak perlu debug message
            setDebugInfo('');
          }

          const newPersonalData = {
            name: data.name || 'Unknown',
            phone: phone || '(tidak tersedia)',
            birthday: birthday,
            gender: gender || '(tidak tersedia)',
            age: calculateAge(birthday)
          };

          setPersonalData(newPersonalData);

          // Update temp values for form
          setTempPhone(phone || '');
          setTempGender(gender || '');

          // ✅ PERBAIKAN: Show form hanya jika benar-benar tidak ada data phone/gender
          // baik dari database maupun localStorage
          if ((!data.phone && !localStorage.getItem('profilePhone')) ||
              (!data.gender && !localStorage.getItem('profileGender'))) {
            if (!hasCompletedOnboarding) {
              setShowMissingDataForm(true);
              setInfoMessage('Nomor HP atau Jenis Kelamin tidak tersedia. Silakan lengkapi data Anda.');
            } else {
              setInfoMessage('');  // Tidak perlu message jika sudah complete
            }
          } else {
            setInfoMessage('Data profil berhasil dimuat dari database.');
            setShowMissingDataForm(false);
          }
        } else {
          setError(data.msg || 'Gagal memuat data pengguna');
          setInfoMessage('Periksa koneksi Anda atau login kembali');
          setDebugInfo(`API Error: ${data.msg || 'Unknown error'}`);
        }
      } catch (err) {
        setError('Gagal terhubung ke server');
        setInfoMessage('Pastikan server berjalan di localhost:5000');
        setDebugInfo(`Fetch Error: ${err.message}`);
        console.error('Fetch user error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [hasCompletedOnboarding]);

  // Handle field edits
  const handleEdit = (field, newValue) => {
    const validationError = validateField(field, newValue);
    if (validationError) {
      setError(validationError);
      setDebugInfo(`Validation failed for ${field}: ${validationError}`);
      return;
    }

    setError('');
    
    // ✅ PERBAIKAN: Update info message untuk menjelaskan bahwa data disimpan lokal
    if (field === 'phone' || field === 'gender') {
      setInfoMessage('Perubahan disimpan di perangkat Anda. Data database tidak berubah.');
    } else {
      setInfoMessage('Perubahan disimpan sementara di perangkat Anda.');
    }
    
    setPersonalData(prev => {
      const updatedData = { ...prev, [field]: newValue };
      if (field === 'birthday') {
        updatedData.age = calculateAge(newValue);
        localStorage.setItem('profileBirthday', newValue);
      } else if (field === 'phone') {
        localStorage.setItem('profilePhone', newValue);
      } else if (field === 'gender') {
        localStorage.setItem('profileGender', newValue);
      }
      return updatedData;
    });
  };

  // Handle missing data form submission
  const handleMissingDataSubmit = (e) => {
    e.preventDefault();
    const phoneError = validateField('phone', tempPhone);
    const genderError = validateField('gender', tempGender);
    if (phoneError || genderError) {
      setError(phoneError || genderError);
      return;
    }

    setError('');
    setPersonalData(prev => ({
      ...prev,
      phone: tempPhone,
      gender: tempGender
    }));
    localStorage.setItem('profilePhone', tempPhone);
    localStorage.setItem('profileGender', tempGender);
    localStorage.setItem('profileOnboardingCompleted', 'true');
    setHasCompletedOnboarding(true);
    setInfoMessage('Data nomor HP dan jenis kelamin berhasil disimpan.');
    setShowMissingDataForm(false);
  };

  // Handle form cancellation
  const handleMissingDataCancel = () => {
    setTempPhone(localStorage.getItem('profilePhone') || '');
    setTempGender(localStorage.getItem('profileGender') || '');
    setShowMissingDataForm(false);
    setError('');
    localStorage.setItem('profileOnboardingCompleted', 'true');
    setHasCompletedOnboarding(true);
    setInfoMessage('');
  };

  // Map data to profile items
  const personalItems = [
    {
      id: 'name',
      icon: <User size={20} />,
      label: 'Nama:',
      value: personalData.name,
      editable: true,
      onEdit: (value) => handleEdit('name', value),
      tooltip: 'Nama lengkap Anda'
    },
    {
      id: 'phone',
      icon: <User size={20} />,
      label: 'Nomor HP:',
      value: personalData.phone,
      editable: true,
      onEdit: (value) => handleEdit('phone', value),
      tooltip: personalData.phone === '(tidak tersedia)' ? 
        'Nomor HP belum tersedia' : 
        'Nomor HP Anda'
    },
    {
      id: 'birthday',
      icon: <Cake size={20} />,
      label: 'Tanggal Lahir:',
      value: personalData.birthday,
      editable: true,
      onEdit: (value) => handleEdit('birthday', value),
      tooltip: 'Tanggal lahir digunakan untuk menghitung umur'
    },
    {
      id: 'gender',
      icon: <User size={20} />,
      label: 'Jenis Kelamin:',
      value: personalData.gender === 'male' ? 'Laki-laki' : 
             personalData.gender === 'female' ? 'Perempuan' : 
             personalData.gender,
      editable: true,
      onEdit: (value) => handleEdit('gender', value),
      tooltip: personalData.gender === '(tidak tersedia)' ? 
        'Jenis kelamin belum tersedia' : 
        'Jenis kelamin Anda'
    },
    {
      id: 'age',
      icon: <User size={20} />,
      label: 'Umur:',
      value: personalData.age,
      editable: false,
      tooltip: 'Umur dihitung berdasarkan tanggal lahir'
    }
  ];

  return (
    <div className="profile-section" style={{ padding: '20px' }}>
      <h2 className="section-title" style={{ fontSize: '24px', fontWeight: '600', marginBottom: '20px' }}>
        Informasi Pribadi
      </h2>
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
          <Info size={16} />
          {infoMessage}
        </div>
      )}
      {debugInfo && process.env.NODE_ENV === 'development' && (
        <div className="debug-message" style={{
          backgroundColor: '#f59e0b',
          color: 'white',
          padding: '16px',
          borderRadius: '8px',
          marginBottom: '20px',
          fontSize: '12px'
        }}>
          <span style={{ fontSize: '14px' }}>🛠️ Debug:</span> {debugInfo}
        </div>
      )}
      {showMissingDataForm && (
        <div className="missing-data-form" style={{
          backgroundColor: '#fff',
          border: '1px solid #e5e7eb',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '20px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>
            Lengkapi Profil Anda
          </h3>
          <p style={{ fontSize: '14px', color: '#374151', marginBottom: '16px' }}>
            Beberapa informasi profil Anda belum lengkap. Silakan isi di bawah untuk melengkapi profil Anda.
          </p>
          <form onSubmit={handleMissingDataSubmit}>
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', fontWeight: '500' }}>
                Nomor HP
              </label>
              <input
                type="tel"
                value={tempPhone}
                onChange={(e) => setTempPhone(e.target.value)}
                placeholder="Masukkan nomor HP (min. 8 digit)"
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
                required
              />
            </div>
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', fontWeight: '500' }}>
                Jenis Kelamin
              </label>
              <select
                value={tempGender}
                onChange={(e) => setTempGender(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
                required
              >
                <option value="">Pilih jenis kelamin</option>
                <option value="male">Laki-laki</option>
                <option value="female">Perempuan</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                type="submit"
                style={{
                  backgroundColor: '#007AFF',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Simpan Profil
              </button>
              <button
                type="button"
                onClick={handleMissingDataCancel}
                style={{
                  backgroundColor: '#6b7280',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Lewati
              </button>
            </div>
          </form>
        </div>
      )}
      {!loading && !error && (
        <div className="profile-items" style={{ marginBottom: '20px' }}>
          {personalItems.map((item) => (
            <div key={item.id} className="profile-item-wrapper" style={{ position: 'relative' }}>
              <ProfileItem {...item} />
              {item.tooltip && (
                <span
                  className="tooltip"
                  style={{
                    position: 'absolute',
                    top: '0',
                    right: '0',
                    fontSize: '12px',
                    color: '#6b7280',
                    cursor: 'help'
                  }}
                  title={item.tooltip}
                >
                  <Info size={14} />
                </span>
              )}
            </div>
          ))}
        </div>
      )}
      <div className="action-info" style={{
        marginTop: '20px',
        padding: '15px',
        backgroundColor: '#f3f4f6',
        borderRadius: '8px',
        textAlign: 'center'
      }}>
        <p style={{ color: '#374151', fontSize: '14px', marginBottom: '10px' }}>
          💡 <strong>Catatan:</strong> Data Anda sudah tersimpan aman di database. 
          Edit di halaman ini bersifat sementara dan tidak mengubah data asli di server.
        </p>
        <p style={{ color: '#374151', fontSize: '12px', marginBottom: '10px' }}>
          Untuk mengubah data permanen, silakan registrasi ulang dengan informasi baru.
        </p>
        <button
          onClick={() => window.location.href = '/register'}
          style={{
            backgroundColor: '#007AFF',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '4px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Pergi ke Halaman Registrasi
        </button>
      </div>
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .tooltip:hover:after {
          content: attr(title);
          position: absolute;
          top: -30px;
          right: 0;
          background: #1f2937;
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          z-index: 10;
        }
      `}</style>
    </div>
  );
}

export default PersonalInfo;