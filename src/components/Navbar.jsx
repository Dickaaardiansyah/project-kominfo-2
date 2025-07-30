import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';

function Navbar() {
  // Fungsi untuk smooth scroll ke elemen dengan ID
  const handleSmoothScroll = (e, targetId) => {
    e.preventDefault();
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    } else {
      console.warn(`Elemen dengan ID ${targetId} tidak ditemukan.`);
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };

  // Inisialisasi event listener untuk smooth scroll
  useEffect(() => {
    const links = document.querySelectorAll('.nav-menu a');
    links.forEach((link) => {
      link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        handleSmoothScroll(e, targetId);
      });
    });

    // Cleanup event listeners
    return () => {
      links.forEach((link) => {
        link.removeEventListener('click', handleSmoothScroll);
      });
    };
  }, []);

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="logo">Fishmap AI</div>
        <ul className="nav-menu">
          <li>
            <NavLink
              to="#home"
              className={({ isActive }) => (isActive ? 'active' : '')}
              onClick={(e) => handleSmoothScroll(e, '#home')}
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="#katalog"
              className={({ isActive }) => (isActive ? 'active' : '')}
              onClick={(e) => handleSmoothScroll(e, '#katalog')}
            >
              Katalog
            </NavLink>
          </li>
          <li>
            <NavLink
              to="#galeri"
              className={({ isActive }) => (isActive ? 'active' : '')}
              onClick={(e) => handleSmoothScroll(e, '#galeri')}
            >
              Galeri
            </NavLink>
          </li>
          <li>
            <NavLink
              to="#cuaca"
              className={({ isActive }) => (isActive ? 'active' : '')}
              onClick={(e) => handleSmoothScroll(e, '#cuaca')}
            >
              Cuaca
            </NavLink>
          </li>
          <li>
            <NavLink
              to="#kontak"
              className={({ isActive }) => (isActive ? 'active' : '')}
              onClick={(e) => handleSmoothScroll(e, '#kontak')}
            >
              Kontak
            </NavLink>
          </li>
        </ul>
        <div className="user-icon">👤</div>
      </div>
    </nav>
  );
}

export default Navbar;