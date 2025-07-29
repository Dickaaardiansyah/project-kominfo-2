import React from 'react';

const Footer = () => {
  const footerSections = [
    {
      title: 'Dinas Perikanan',
      content: <p>Pengelolaan, pembinaan, dan pengembangan sektor perikanan di Kabupaten Contoh.</p>,
      social: true
    },
    {
      title: 'Tautan Cepat',
      links: [
        { text: 'Beranda', url: '#home' },
        { text: 'Profil', url: '#' },
        { text: 'Layanan', url: '#' },
        { text: 'Publikasi', url: '#' },
        { text: 'Berita', url: '#' },
        { text: 'Kontak', url: '#contact' }
      ]
    },
    {
      title: 'Layanan Publik',
      links: [
        { text: 'Perizinan Usaha', url: '#' },
        { text: 'Sertifikasi Produk', url: '#' },
        { text: 'Pelatihan', url: '#' },
        { text: 'Pengaduan', url: '#' },
        { text: 'Data Statistik', url: '#' }
      ]
    },
    {
      title: 'Kontak',
      contact: [
        { icon: 'fas fa-map-marker-alt', text: 'Jl. Perikanan No. 123, Kabupaten Contoh' },
        { icon: 'fas fa-phone-alt', text: '(021) 12345678' },
        { icon: 'fas fa-envelope', text: 'perikanan@kabupaten.go.id' }
      ]
    }
  ];

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          {footerSections.map((section, index) => (
            <div className="footer-section" key={index}>
              <h3>{section.title}</h3>
              
              {section.content && section.content}
              
              {section.social && (
                <div className="social-icons">
                  <a href="#"><i className="fab fa-facebook-f"></i></a>
                  <a href="#"><i className="fab fa-twitter"></i></a>
                  <a href="#"><i className="fab fa-instagram"></i></a>
                  <a href="#"><i className="fab fa-youtube"></i></a>
                </div>
              )}
              
              {section.links && (
                <ul>
                  {section.links.map((link, i) => (
                    <li key={i}>
                      <a href={link.url}>{link.text}</a>
                    </li>
                  ))}
                </ul>
              )}
              
              {section.contact && (
                <ul>
                  {section.contact.map((contact, i) => (
                    <li className="contact-item" key={i}>
                      <i className={contact.icon}></i>
                      <span>{contact.text}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
        
        <div className="footer-divider">
          <p>&copy; 2025 Dinas Perikanan Kabupaten Contoh. Seluruh hak cipta dilindungi.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;