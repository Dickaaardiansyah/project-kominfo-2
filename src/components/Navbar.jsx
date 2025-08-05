import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    if (location.pathname === '/') {
      // Sudah di halaman Home, scroll langsung
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      // Belum di halaman home → navigasi dulu ke /#target
      navigate(`/#${targetId.replace('#', '')}`);
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="logo">Fishmap AI</div>
        <ul className="nav-menu">
          {['home', 'katalog', 'galeri', 'cuaca', 'kontak'].map((id) => (
            <li key={id}>
              <a href={`#${id}`} onClick={(e) => handleNavClick(e, `#${id}`)}>
                {id.charAt(0).toUpperCase() + id.slice(1)}
              </a>
            </li>
          ))}
        </ul>
        <div className="user-icon">👤</div>
      </div>
    </nav>
  );
}

export default Navbar;
