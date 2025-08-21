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

  // Fungsi untuk memperbarui token akses menggunakan refresh token
  const refreshAccessToken = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/token`, {
        method: 'POST',
        credentials: 'include', // Sertakan cookie (refreshToken ada di cookie HTTP-only)
      });

      if (!response.ok) {
        throw new Error('Gagal memperbarui token');
      }

      const data = await response.json();
      localStorage.setItem('token', data.accessToken); // Simpan token akses baru
      return data.accessToken;
    } catch (err) {
      console.error('Kesalahan saat memperbarui token:', err);
      setError('Sesi telah berakhir. Silakan login kembali.');
      localStorage.removeItem('token');
      throw err;
    }
  };

  // Hitung usia dari tanggal lahir
  const calculateAge = (birthday) => {
    if (!birthday) {
      setDebugInfo(prev => prev + ' [Tanggal lahir tidak tersedia, menggunakan default]');
      return '18+';
    }
    const birthDate = new Date(birthday);
    if (isNaN(birthDate)) {
      setDebugInfo(prev => prev + ' [Format tanggal lahir tidak valid]');
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

  // Validasi input
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

  // Ambil data pengguna dengan refresh token otomatis jika token kedaluwarsa
  useEffect(() => {
    const fetchUserData = async (retry = true) => {
      try {
        let token = localStorage.getItem('token');
        if (!token) {
          setError('Silakan login kembali untuk melihat data profil');
          setDebugInfo('Token tidak ditemukan di localStorage');
          setLoading(false);
          return;
        }

        setLoading(true);
        setDebugInfo('Mengambil data pengguna...');
        const response = await fetch(`${API_BASE_URL}/users`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();
        console.log('Respon API:', data);

        if (!response.ok) {
          if (data.msg === 'Token expired' && retry) {
            // Perbarui token dan coba lagi
            token = await refreshAccessToken();
            return fetchUserData(false); // Coba sekali lagi setelah refresh
          } else {
            throw new Error(data.msg || 'Gagal memuat data pengguna');
          }
        }

        const birthday = localStorage.getItem('profileBirthday') || '2004-12-20';
        
        // Ambil phone dan gender dari respon database
        const phone = data.phone || localStorage.getItem('profilePhone') || '';
        const gender = data.gender || localStorage.getItem('profileGender') || '';

        // Hanya set debug info jika ada data yang hilang
        if (!data.phone && !data.gender) {
          setDebugInfo('Beberapa data profil hilang dari database');
        } else if (!data.phone) {
          setDebugInfo('Data nomor telepon hilang dari database');
        } else if (!data.gender) {
          setDebugInfo('Data jenis kelamin hilang dari database');
        } else {
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

        // Perbarui nilai sementara untuk form
        setTempPhone(phone || '');
        setTempGender(gender || '');

        // Tampilkan form hanya jika data phone/gender benar-benar tidak ada
        if ((!data.phone && !localStorage.getItem('profilePhone')) ||
            (!data.gender && !localStorage.getItem('profileGender'))) {
          if (!hasCompletedOnboarding) {
            setShowMissingDataForm(true);
            setInfoMessage('Nomor HP atau Jenis Kelamin tidak tersedia. Silakan lengkapi data Anda.');
          } else {
            setInfoMessage('');
          }
        } else {
          setInfoMessage('Data profil berhasil dimuat dari database.');
          setShowMissingDataForm(false);
        }
      } catch (err) {
        setError(err.message || 'Gagal terhubung ke server');
        setInfoMessage('Pastikan server berjalan di localhost:5000');
        setDebugInfo(`Kesalahan API: ${err.message}`);
        console.error('Kesalahan saat mengambil data pengguna:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Tangani pengeditan field dan perbarui langsung ke database
  const handleEdit = async (field, newValue) => {
    const validationError = validateField(field, newValue);
    if (validationError) {
      setError(validationError);
      return;
    }

    let token = localStorage.getItem('token');
    if (!token) {
      setError('Silakan login kembali untuk memperbarui data');
      return;
    }

    try {
      setLoading(true);
      const updateData = { [field]: newValue };
      const response = await fetch(`${API_BASE_URL}/users/update`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });

      const data = await response.json();
      if (!response.ok) {
        if (data.msg === 'Token expired') {
          // Coba perbarui token dan ulangi permintaan
          token = await refreshAccessToken();
          const retryResponse = await fetch(`${API_BASE_URL}/users/update`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(updateData)
          });

          if (!retryResponse.ok) {
            throw new Error((await retryResponse.json()).msg || 'Gagal memperbarui data');
          }
        } else {
          throw new Error(data.msg || 'Gagal memperbarui data');
        }
      }

      setError('');
      setInfoMessage('Data berhasil diperbarui di database!');
      setPersonalData(prev => ({
        ...prev,
        [field]: newValue,
        age: field === 'birthday' ? calculateAge(newValue) : prev.age
      }));
      if (field === 'birthday') {
        localStorage.setItem('profileBirthday', newValue);
      }
    } catch (err) {
      setError(err.message || 'Gagal terhubung ke server');
      setInfoMessage('Pastikan server berjalan di localhost:5000');
      console.error('Kesalahan saat memperbarui data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Tangani pengiriman form data yang hilang
  const handleMissingDataSubmit = async (e) => {
    e.preventDefault();
    const phoneError = validateField('phone', tempPhone);
    const genderError = validateField('gender', tempGender);

    if (phoneError || genderError) {
      setError(phoneError || genderError);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Silakan login kembali untuk memperbarui data');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/users/update`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ phone: tempPhone, gender: tempGender })
      });

      if (!response.ok) {
        throw new Error('Gagal memperbarui data profil');
      }

      setPersonalData(prev => ({
        ...prev,
        phone: tempPhone,
        gender: tempGender
      }));
      localStorage.setItem('profilePhone', tempPhone);
      localStorage.setItem('profileGender', tempGender);
      localStorage.setItem('profileOnboardingCompleted', 'true');
      setHasCompletedOnboarding(true);
      setShowMissingDataForm(false);
      setInfoMessage('Data profil berhasil diperbarui!');
      setError('');
    } catch (err) {
      setError(err.message || 'Gagal terhubung ke server');
      setInfoMessage('Pastikan server berjalan di localhost:5000');
    }
  };

  // Tangani pembatalan form data yang hilang
  const handleMissingDataCancel = () => {
    setShowMissingDataForm(false);
    localStorage.setItem('profileOnboardingCompleted', 'true');
    setHasCompletedOnboarding(true);
    setInfoMessage('');
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
      icon: <Calendar size={20} />,
      label: 'Tanggal Lahir:',
      value: personalData.birthday,
      editable: true,
      onEdit: (value) => handleEdit('birthday', value),
      tooltip: 'Tanggal lahir disimpan di browser Anda'
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
      icon: <Cake size={20} />,
      label: 'Usia:',
      value: personalData.age,
      editable: false,
      tooltip: 'Usia dihitung otomatis dari tanggal lahir'
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
      {debugInfo && (
        <div className="debug-info" style={{
          backgroundColor: '#fef3c7',
          color: '#92400e',
          padding: '16px',
          borderRadius: '8px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span style={{ fontSize: '16px' }}>🛠️</span>
          Debug: {debugInfo}
        </div>
      )}
      {showMissingDataForm && (
        <div className="missing-data-form" style={{
          backgroundColor: 'white',
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