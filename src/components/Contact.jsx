import React from 'react';

const Contact = () => {
  const contactInfo = [
    { 
      icon: 'fas fa-map-marker-alt', 
      title: 'Alamat Kantor', 
      content: 'Jl. Perikanan No. 123, Kelurahan Contoh, Kecamatan Contoh, Kabupaten Contoh, Provinsi Contoh' 
    },
    { 
      icon: 'fas fa-phone-alt', 
      title: 'Telepon', 
      content: ['(021) 12345678', '(021) 87654321'] 
    },
    { 
      icon: 'fas fa-envelope', 
      title: 'Email', 
      content: ['perikanan@kabupaten.go.id', 'info.perikanan@kabupaten.go.id'] 
    },
    { 
      icon: 'fas fa-clock', 
      title: 'Jam Kerja', 
      content: ['Senin - Kamis: 08.00 - 16.00 WIB', 'Jumat: 08.00 - 16.30 WIB'] 
    }
  ];

  const socialMedia = [
    { icon: 'fab fa-facebook-f', url: '#' },
    { icon: 'fab fa-twitter', url: '#' },
    { icon: 'fab fa-instagram', url: '#' },
    { icon: 'fab fa-youtube', url: '#' }
  ];

  return (
    <section id="contact" className="contact-section">
      <div className="contact-container">
        <h2 className="contact-title">Hubungi Kami</h2>
        <div className="contact-divider"></div>
        <p className="contact-subtitle">Silakan hubungi kami untuk informasi lebih lanjut atau pengaduan terkait sektor perikanan</p>
        
        <div className="contact-grid">
          <div className="contact-form-container">
            <div className="contact-card">
              <h3>Kirim Pesan</h3>
              <form className="contact-form">
                <div className="form-group">
                  <label htmlFor="name">Nama Lengkap</label>
                  <input type="text" id="name" placeholder="Masukkan nama Anda" />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Alamat Email</label>
                  <input type="email" id="email" placeholder="Masukkan email Anda" />
                </div>
                <div className="form-group">
                  <label htmlFor="subject">Subjek</label>
                  <input type="text" id="subject" placeholder="Masukkan subjek pesan" />
                </div>
                <div className="form-group">
                  <label htmlFor="message">Pesan</label>
                  <textarea id="message" rows="5" placeholder="Tulis pesan Anda"></textarea>
                </div>
                <button type="submit">Kirim Pesan <i className="fas fa-paper-plane ml-2"></i></button>
              </form>
            </div>
          </div>
          
          <div className="contact-info-container">
            <div className="contact-card">
              <h3>Informasi Kontak</h3>
              {contactInfo.map((item, index) => (
                <div className="contact-info-item" key={index}>
                  <div className="contact-info-icon">
                    <i className={item.icon}></i>
                  </div>
                  <div>
                    <h4>{item.title}</h4>
                    {Array.isArray(item.content) ? (
                      item.content.map((line, i) => <p key={i}>{line}</p>)
                    ) : (
                      <p>{item.content}</p>
                    )}
                  </div>
                </div>
              ))}
              <div className="social-links">
                <h4>Sosial Media</h4>
                <div className="social-icons">
                  {socialMedia.map((social, index) => (
                    <a href={social.url} key={index}>
                      <i className={social.icon}></i>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;