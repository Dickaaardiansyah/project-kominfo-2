// src/components/Marketplace/FilterSection.jsx
import React from 'react';

function FilterSection({ currentFilter, onFilterChange }) {
  const filters = [
    { id: 'all', label: 'Semua' },
    { id: 'terpopuler', label: 'Terpopuler' },
    { id: 'harga_rendah', label: 'Harga Rendah' },
    { id: 'terbaru', label: 'Terbaru' },
    { id: 'rating_tinggi', label: 'Rating Tinggi' },
    { id: 'promo', label: 'Promo' }
  ];

  return (
    <div className="filter-section">
      {filters.map(filter => (
        <button
          key={filter.id}
          className={`filter-button ${currentFilter === filter.id ? 'active' : ''}`}
          onClick={() => onFilterChange(filter.id)}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}

export default FilterSection;