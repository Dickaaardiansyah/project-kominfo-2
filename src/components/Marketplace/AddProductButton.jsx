// src/components/Marketplace/AddProductButton.jsx
import React from 'react';

function AddProductButton({ onClick }) {
  return (
    <button 
      className="add-product-btn"
      onClick={onClick}
    >
      +
    </button>
  );
}

export default AddProductButton;