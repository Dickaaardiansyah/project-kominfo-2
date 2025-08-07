// src/components/History/Sidebar.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

function Sidebar({ activeItem }) {
  const navigate = useNavigate();

  const navItems = [
    {
      id: 'profile',
      icon: <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>,
      label: 'Profile'
    },
    {
      id: 'history',
      icon: <path d="M13,3A9,9 0 0,0 4,12H1L4.96,16.03L9,12H6A7,7 0 0,1 13,5A7,7 0 0,1 20,12A7,7 0 0,1 13,19C11.07,19 9.32,18.21 8.06,16.94L6.64,18.36C8.27,20 10.5,21 13,21A9,9 0 0,0 22,12A9,9 0 0,0 13,3Z"/>,
      label: 'History'
    },
    {
      id: 'marketplace',
      icon: <path d="M12,18H6V14H12M21,14V12L20,7H4L3,12V14H4V20H14V14H18V20H20V14M20,4H4V6H20V4Z"/>,
      label: 'Marketplace'
    }
  ];

  return (
    <div className="sidebar">
      {navItems.map(item => (
        <button
          key={item.id}
          className={`nav-item ${activeItem === item.id ? 'active' : ''}`}
          onClick={() => navigate(`/${item.id}`)}
        >
          <svg className="nav-icon" viewBox="0 0 24 24">
            {item.icon}
          </svg>
          {item.label}
        </button>
      ))}
    </div>
  );
}

export default Sidebar;