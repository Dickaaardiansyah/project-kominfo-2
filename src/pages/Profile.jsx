// src/pages/Profile.jsx
import React from 'react';
import Sidebar from '../components/Profile/Sidebar';
import ProfileHeader from '../components/Profile/ProfileHeader';
import ProfileSection from '../components/Profile/ProfileSection';
import '../styles/Profile.css';

function Profile() {
  const accountInfo = [
    {
      icon: (
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
      ),
      label: "Username:",
      value: "Mas Dicka",
      editable: true
    },
    {
      icon: (
        <path d="M12 17c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6-9h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM8.9 6c0-1.71 1.39-3.1 3.1-3.1s3.1 1.39 3.1 3.1v2H8.9V6z"/>
      ),
      label: "Password:",
      value: "***********",
      editable: true
    },
    {
      icon: (
        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
      ),
      label: "Email Address:",
      value: "r****@gmail.com",
      editable: true
    }
  ];

  const personalInfo = [
    {
      label: "Age:",
      value: "18+",
      editable: false
    },
    {
      label: "Birthday:",
      value: "Dec 20, 2004",
      editable: false
    },
    {
      label: "Gender:",
      value: "(opsional)",
      editable: false
    }
  ];

  return (
    <div className="profile-container">
      <Sidebar />
      <div className="main-content">
        <ProfileHeader title="Profile" />
        
        <ProfileSection 
          title="Account Info" 
          items={accountInfo} 
        />
        
        <ProfileSection 
          title="Personal" 
          items={personalInfo} 
        />
      </div>
    </div>
  );
}

export default Profile;