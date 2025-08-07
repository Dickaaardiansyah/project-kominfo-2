// src/components/Navbar.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    if (location.pathname === '/') {
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      navigate(`/#${targetId.replace('#', '')}`);
    }
  };

  const handleProfileClick = (e) => {
    e.stopPropagation();
    setShowDropdown(!showDropdown);
  };

  const handleLoginClick = () => {
    setShowDropdown(false);
    navigate('/login');
  };

  const handleProfilePageClick = () => {
    setShowDropdown(false);
    navigate('/profil');
  };

  const handleRegisterClick = () => {
    setShowDropdown(false);
    navigate('/register');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close dropdown when route changes
  useEffect(() => {
    setShowDropdown(false);
  }, [location.pathname]);

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
        
        {/* Profile Dropdown */}
        <div className="profile-dropdown" ref={dropdownRef}>
          <div 
            className="user-icon" 
            onClick={handleProfileClick}
            style={{ 
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '50%',
              transition: 'background-color 0.3s',
              backgroundColor: showDropdown ? 'rgba(255, 255, 255, 0.1)' : 'transparent'
            }}
          >
            👤
          </div>
          
          {/* Dropdown Menu */}
          {showDropdown && (
            <div 
              className="dropdown-menu"
              style={{
                position: 'absolute',
                top: '100%',
                right: '0',
                backgroundColor: 'white',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                minWidth: '180px',
                zIndex: 1000,
                marginTop: '8px',
                overflow: 'hidden'
              }}
            >
              {/* Menu Items */}
              <div 
                onClick={handleLoginClick}
                style={{
                  padding: '12px 16px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  color: '#333',
                  fontSize: '14px',
                  borderBottom: '1px solid #f0f0f0',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                <span style={{ fontSize: '16px' }}>🔑</span>
                Login
              </div>
              
              <div 
                onClick={handleRegisterClick}
                style={{
                  padding: '12px 16px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  color: '#333',
                  fontSize: '14px',
                  borderBottom: '1px solid #f0f0f0',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                <span style={{ fontSize: '16px' }}>📝</span>
                Register
              </div>
              
              <div 
                onClick={handleProfilePageClick}
                style={{
                  padding: '12px 16px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  color: '#333',
                  fontSize: '14px',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                <span style={{ fontSize: '16px' }}>👤</span>
                Profile
              </div>
            </div>
          )}
        </div>
      </div>
      
      <style jsx>{`
        .profile-dropdown {
          position: relative;
        }
        
        .dropdown-menu {
          animation: dropdownFadeIn 0.2s ease-out;
        }
        
        @keyframes dropdownFadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .dropdown-menu div:hover {
          background-color: #f8f9fa !important;
        }
        
        @media (max-width: 768px) {
          .dropdown-menu {
            right: -10px;
            min-width: 160px;
          }
        }
      `}</style>
    </nav>
  );
}

export default Navbar;