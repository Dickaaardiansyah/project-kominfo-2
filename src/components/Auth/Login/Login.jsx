import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../styles/login.css'; 

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '', // Ubah dari username ke email sesuai API
    password: '',
    terms: false,
  });
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // API Base URL
  const API_BASE_URL = 'http://localhost:5000';

  useEffect(() => {
    const { email, password, terms } = form;
    setIsValid(email.trim() !== '' && password.trim() !== '' && terms);
  }, [form]);

  // Check jika sudah login, redirect ke home
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/'); // Redirect ke home jika sudah login
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    
    // Clear error saat user mengetik
    if (error) {
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return;

    setLoading(true);
    setError('');

    try {
      console.log('Attempting login with:', { email: form.email });

      // Kirim request ke API
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      console.log('Login response status:', response.status);

      const data = await response.json();
      console.log('Login response data:', data);

      if (response.ok && data.accessToken) {
        // Login berhasil
        console.log('Login successful!');
        
        // Simpan data ke localStorage
        localStorage.setItem('token', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        
        // Simpan user data jika ada
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
          localStorage.setItem('userId', data.user.id);
        }

        // Show success message
        alert(`Login berhasil! Selamat datang ${data.user?.name || form.email}`);
        
        // Trigger custom event untuk update navbar
        window.dispatchEvent(new Event('userLoggedIn'));
        
        // Redirect ke home
        navigate('/');
        
        // Tidak perlu refresh lagi karena navbar sudah listen event

      } else {
        // Login gagal
        throw new Error(data.msg || data.message || 'Login gagal');
      }

    } catch (error) {
      console.error('Login error:', error);
      
      // Handle different types of errors
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        setError('Gagal terhubung ke server. Pastikan server berjalan di localhost:5000');
      } else if (error.message.includes('401') || error.message.includes('Wrong')) {
        setError('Email atau password salah');
      } else if (error.message.includes('404') || error.message.includes('User not found')) {
        setError('Email tidak terdaftar');
      } else {
        setError(error.message || 'Terjadi kesalahan saat login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterClick = (e) => {
    e.preventDefault();
    navigate('/register');
  };

  return (
    <div className="container">
      <h1 className="title">Login</h1>

      <form className="form-container" onSubmit={handleSubmit}>
        {/* Error Message */}
        {error && (
          <div style={{
            backgroundColor: '#fee2e2',
            border: '1px solid #fecaca',
            color: '#dc2626',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '20px',
            textAlign: 'center',
            fontSize: '14px'
          }}>
            <i className="fas fa-exclamation-triangle" style={{ marginRight: '8px' }}></i>
            {error}
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-input"
            name="email"
            placeholder="Masukkan email"
            value={form.email}
            onChange={handleChange}
            disabled={loading}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-input"
            name="password"
            placeholder="Masukkan password"
            value={form.password}
            onChange={handleChange}
            disabled={loading}
            required
          />
        </div>

        <label className="checkbox-container">
          <div className="checkbox-wrapper">
            <input
              type="checkbox"
              className="checkbox"
              name="terms"
              checked={form.terms}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>
          <span className="checkbox-text">
            Saya menyetujui{' '}
            <a href="#" onClick={() => alert('Syarat dan Ketentuan')}>
              Syarat dan Ketentuan
            </a>{' '}
            dan{' '}
            <a href="#" onClick={() => alert('Kebijakan Privasi')}>
              Kebijakan Privasi
            </a>{' '}
            FishSnap:AI
          </span>
        </label>

        <button 
          className="login-btn" 
          type="submit"
          disabled={!isValid || loading}
          style={{
            opacity: (!isValid || loading) ? 0.6 : 1,
            cursor: (!isValid || loading) ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? (
            <>
              <span style={{ marginRight: '8px' }}>⏳</span>
              LOGGING IN...
            </>
          ) : (
            'LOGIN'
          )}
        </button>
      </form>

      <p className="register-link">
        Belum Punya akun?{' '}
        <a href="/register" onClick={handleRegisterClick}>
          Register Disini
        </a>
      </p>

      {/* Demo credentials - hapus di production */}
      <div style={{
        marginTop: '20px',
        padding: '15px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        fontSize: '12px',
        color: '#666'
      }}>
        <strong>Demo Account:</strong><br />
        Email: maulana@example.com<br />
        Password: password123
      </div>
    </div>
  );
}

export default Login;