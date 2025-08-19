// src/pages/Marketplace.jsx
import React, { useState } from 'react';
import Sidebar from '../components/Marketplace/Sidebar';
import MarketplaceHeader from '../components/Marketplace/MarketplaceHeader';
import MarketplaceContent from '../components/Marketplace/MarketplaceContent';
import '../styles/Marketplace.css';

function Marketplace() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  return (
    <div className="marketplace-container">
      <Sidebar />
      <div className="main-content">
        <MarketplaceHeader 
          title="Marketplace" 
          onSearchChange={handleSearchChange}
          searchQuery={searchQuery}
        />
        <MarketplaceContent searchQuery={searchQuery} />
      </div>
    </div>
  );
}

export default Marketplace;