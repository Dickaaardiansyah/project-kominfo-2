// src/components/Marketplace/StatsSection.jsx
import React from 'react';

function StatsSection() {
  return (
    <div className="stats-section">
      <div className="stat-card">
        <div className="stat-number">234</div>
        <div className="stat-label">Total Products</div>
      </div>
      <div className="stat-card">
        <div className="stat-number">67</div>
        <div className="stat-label">Categories</div>
      </div>
      <div className="stat-card">
        <div className="stat-number">1.2k</div>
        <div className="stat-label">Active Users</div>
      </div>
      <div className="stat-card">
        <div className="stat-number">4.8</div>
        <div className="stat-label">Rating</div>
      </div>
    </div>
  );
}

export default StatsSection;