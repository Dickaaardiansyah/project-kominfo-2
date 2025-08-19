import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../../data/userLogin'; // Import API function
import '../../../styles/login.css'; 

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '',
    password: '',
    terms: false,
  });
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

    // Gunakan API function yang sudah rapi
    const result = await loginUser({
      email: form.email,
      password: form.password
    });

    if (result.success) {
      // Login berhasil
      alert(`Login berhasil! Selamat datang ${result.user?.name || form.email}`);
      
      // Trigger custom event untuk update navbar
      window.dispatchEvent(new Event('userLoggedIn'));
      
      // Redirect ke home
      navigate('/');
      
    } else {
      // Login gagal
      setError(result.message);
    }

    setLoading(false);
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