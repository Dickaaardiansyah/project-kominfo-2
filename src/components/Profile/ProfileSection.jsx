// src/components/Profile/ProfileSection.jsx
import React from 'react';
import ProfileItem from './ProfileItem';

function ProfileSection({ title, items }) {
  return (
    <div className="profile-section">
      <h2 className="section-title">{title}</h2>
      {items.map((item, index) => (
        <ProfileItem
          key={index}
          icon={item.icon}
          label={item.label}
          value={item.value}
          editable={item.editable}
        />
      ))}
    </div>
  );
}

export default ProfileSection;