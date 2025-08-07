// src/components/Profile/ProfileItem.jsx
import React from 'react';

function ProfileItem({ icon, label, value, editable }) {
  const handleEditClick = () => {
    // Logika untuk mengedit item
    console.log(`Edit ${label}`);
  };

  return (
    <div className="profile-item">
      <div className="item-content">
        {icon && (
          <svg className="item-icon" viewBox="0 0 24 24">
            {icon}
          </svg>
        )}
        <span className="item-label">{label}</span>
        <span className="item-value">{value}</span>
      </div>
      {editable && (
        <button className="edit-button" onClick={handleEditClick}>
          <svg className="edit-icon" viewBox="0 0 24 24">
            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
          </svg>
        </button>
      )}
    </div>
  );
}

export default ProfileItem;