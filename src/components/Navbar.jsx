// src/components/Navbar.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const dropdownRef = useRef(null);

  // Check login status saat component mount dan saat localStorage berubah
  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (token && userData) {
        setIsLoggedIn(true);
        try {
          setUser(JSON.parse(userData));
        } catch (error) {
          console.error('Error parsing user data:', error);
          setUser({ name: 'User' }); // Fallback
        }
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    };

    // Check initial status
    checkLoginStatus();

    // Listen for storage changes (login/logout dari tab lain)
    const handleStorageChange = (e) => {
      if (e.key === 'token' || e.key === 'user') {
        checkLoginStatus();
      }
    };

    // Listen for custom login event
    const handleLoginEvent = () => {
      checkLoginStatus();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('userLoggedIn', handleLoginEvent);
    window.addEventListener('userLoggedOut', handleLoginEvent);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userLoggedIn', handleLoginEvent);
      window.removeEventListener('userLoggedOut', handleLoginEvent);
    };
  }, []);

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

  const handleRegisterClick = () => {
    setShowDropdown(false);
    navigate('/register');
  };

  const handleProfilePageClick = () => {
    setShowDropdown(false);
    navigate('/profil');
  };

  const handleLogoutClick = () => {
    setShowDropdown(false);
    
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    
    // Update state
    setIsLoggedIn(false);
    setUser(null);
    
    // Trigger custom event untuk components lain
    window.dispatchEvent(new Event('userLoggedOut'));
    
    // Navigate to home
    navigate('/');
    
    alert('Anda telah logout');
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
        
        {/* Conditional Rendering berdasarkan login status */}
        {!isLoggedIn ? (
          // Not logged in - show Login/Register buttons
          <div className="auth-buttons">
            <button 
              onClick={handleLoginClick}
              style={{
                padding: '8px 16px',
                marginRight: '8px',
                backgroundColor: 'transparent',
                color: 'white',
                border: '1px solid white',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                transition: 'all 0.3s'
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = 'white';
                e.target.style.color = '#333';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = 'white';
              }}
            >
              Login
            </button>
            <button 
              onClick={handleRegisterClick}
              style={{
                padding: '8px 16px',
                backgroundColor: 'white',
                color: '#333',
                border: '1px solid white',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.3s'
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = '#f0f0f0';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = 'white';
              }}
            >
              Register
            </button>
          </div>
        ) : (
          // Logged in - show Profile dropdown
          <div className="profile-dropdown" ref={dropdownRef}>
            <div 
              className="user-profile" 
              onClick={handleProfileClick}
              style={{ 
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                padding: '8px 12px',
                borderRadius: '8px',
                transition: 'background-color 0.3s',
                backgroundColor: showDropdown ? 'rgba(255, 255, 255, 0.1)' : 'transparent'
              }}
            >
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: '#4a90e2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '14px',
                fontWeight: 'bold'
              }}>
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <span style={{ color: 'white', fontSize: '14px' }}>
                {user?.name || 'User'}
              </span>
              <span style={{ 
                color: 'white', 
                fontSize: '12px', 
                transform: showDropdown ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s'
              }}>
                ▼
              </span>
            </div>
            
            {/* Dropdown Menu untuk User yang sudah login */}
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
                  minWidth: '200px',
                  zIndex: 1000,
                  marginTop: '8px',
                  overflow: 'hidden'
                }}
              >
                {/* User Info */}
                <div style={{
                  padding: '12px 16px',
                  borderBottom: '1px solid #f0f0f0',
                  backgroundColor: '#f8f9fa'
                }}>
                  <div style={{ fontWeight: '600', color: '#333', fontSize: '14px' }}>
                    {user?.name || 'User'}
                  </div>
                  <div style={{ color: '#666', fontSize: '12px' }}>
                    {user?.email || 'user@example.com'}
                  </div>
                </div>

                {/* Menu Items */}
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
                    borderBottom: '1px solid #f0f0f0',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                  onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  <span style={{ fontSize: '16px' }}>👤</span>
                  My Profile
                </div>
                
                <div 
                  onClick={handleLogoutClick}
                  style={{
                    padding: '12px 16px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    color: '#dc3545',
                    fontSize: '14px',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#fff5f5'}
                  onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  <span style={{ fontSize: '16px' }}>🚪</span>
                  Logout
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      <style jsx>{`
        .auth-buttons {
          display: flex;
          align-items: center;
        }
        
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
          .auth-buttons {
            gap: 8px;
          }
          
          .auth-buttons button {
            padding: 6px 12px !important;
            font-size: 12px !important;
          }
          
          .dropdown-menu {
            right: -10px;
            min-width: 180px;
          }
          
          .user-profile span {
            display: none;
          }
        }
      `}</style>
    </nav>
  );
}

export default Navbar;