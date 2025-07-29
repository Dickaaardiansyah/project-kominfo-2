import React from 'react';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="logo">Fishmap AI</div>
        <ul className="nav-menu">
          <li><a href="#home">Home</a></li>
          <li><a href="#katalog">Katalog</a></li>
          <li><a href="#gallery">Gallery</a></li>
          <li><a href="#cuaca">Cuaca</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
        <div className="user-icon">👤</div>
      </div>
    </nav>
  );
};

export default Navbar;