// src/components/History/HistoryHeader.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

function HistoryHeader({ title, currentFilter, onFilterChange }) {
  const navigate = useNavigate();

  const filters = [
    { id: 'all', label: 'Semua' },
    { id: 'completed', label: 'Selesai' },
    { id: 'pending', label: 'Pending' },
    { id: 'cancelled', label: 'Dibatalkan' }
  ];

  return (
    <div className="header">
      <div className="header-left">
        <button className="back-button" onClick={() => navigate(-1)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
          </svg>
        </button>
        <h1 className="page-title">{title}</h1>
      </div>
      
      <div className="filter-tabs">
        {filters.map(filter => (
          <button
            key={filter.id}
            className={`tab-button ${currentFilter === filter.id ? 'active' : ''}`}
            onClick={() => onFilterChange(filter.id)}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default HistoryHeader;