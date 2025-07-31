import React, { useState, useEffect } from 'react';
import '../../../styles/login.css'; 

function Login() {
  const [form, setForm] = useState({
    username: '',
    password: '',
    terms: false,
  });
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const { username, password, terms } = form;
    setIsValid(username.trim() !== '' && password.trim() !== '' && terms);
  }, [form]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid) return;

    setLoading(true);
    setTimeout(() => {
      alert(`Login berhasil!\nUsername: ${form.username}`);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="container">
      <h1 className="title">Login</h1>

      <form className="form-container" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Masukkan Namamu Disini</label>
          <input
            type="text"
            className="form-input"
            name="username"
            placeholder="Username atau email"
            value={form.username}
            onChange={handleChange}
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

        <button className="login-btn" disabled={!isValid || loading}>
          {loading ? 'LOGGING IN...' : 'LOGIN'}
        </button>
      </form>

      <p className="register-link">
        Belum Punya akun?{' '}
        <a href="/register">
          Register Disini
        </a>
      </p>
    </div>
  );
}

export default Login;
