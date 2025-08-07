// src/components/Profile/ProfileHeader.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

function ProfileHeader({ title }) {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate('/');
  };

  return (
    <div className="header">
      <button className="back-button" onClick={handleBackClick}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
        </svg>
      </button>
      <h1 className="page-title">{title}</h1>
    </div>
  );
}

export default ProfileHeader;