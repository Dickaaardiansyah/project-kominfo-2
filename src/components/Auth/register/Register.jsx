// src/pages/Register.jsx
import React, { useState } from 'react';
import '../../../styles/register.css';

function Register() {
  const [form, setForm] = useState({
    nama: '',
    email: '',
    password: '',
    phone: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Form submitted! (Demo)');
    console.log(form);
  };

  const handleBack = () => {
    alert('Kembali ke halaman sebelumnya (Demo)');
  };

  return (
    <div className="register-page">

      <div className="container">
        <div className="header">
          <button className="back-btn" onClick={handleBack}>←</button>
          <h1 className="title">Selamat Datang</h1>
        </div>

        <p className="subtitle">Pertama-tama, siapa nama panggilanmu?</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Masukkan Namamu Disini</label>
            <input
              type="text"
              className="form-input"
              name="nama"
              placeholder="Nama lengkap"
              value={form.nama}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input"
              name="email"
              placeholder="email@example.com"
              value={form.email}
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

          <div className="form-group">
            <label className="form-label">Nomer HP</label>
            <div className="phone-group">
              <input type="text" className="form-input country-code" value="+62" readOnly />
              <input
                type="tel"
                className="form-input phone-input"
                name="phone"
                placeholder="812345678"
                value={form.phone}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="button-group">
            <button type="button" className="btn btn-back" onClick={handleBack}>
              ←
            </button>
            <button type="submit" className="btn btn-primary">
              Berikutnya
            </button>
          </div>
        </form>
      </div>

    </div>
  );
}

export default Register;
