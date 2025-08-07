// src/pages/Marketplace.jsx
import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Marketplace/Sidebar';
import MarketplaceHeader from '../components/Marketplace/MarketplaceHeader';
import StatsSection from '../components/Marketplace/StatsSection';
import FilterSection from '../components/Marketplace/FilterSection';
import ProductsGrid from '../components/Marketplace/ProductsGrid';
import AddProductButton from '../components/Marketplace/AddProductButton';
import '../styles/Marketplace.css';

function Marketplace() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentFilter, setCurrentFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Ini bisa diganti dengan API call
    const sampleData = [
      {
        id: 1,
        title: "Clown Fish",
        description: "Ikan badut yang cantik dan mudah dipelihara",
        price: "Rp25.000",
        rating: 4.8,
        category: "terpopuler",
        image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=300&h=200&fit=crop"
      },
      {
        id: 2,
        title: "Ikan Cupang",
        description: "Ikan cupang premium dengan warna indah",
        price: "Rp15.000",
        rating: 4.6,
        category: "harga_rendah",
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop"
      },
      // Data produk lainnya...
    ];
    
    setProducts(sampleData);
    setFilteredProducts(sampleData);
  }, []);

  const handleFilterChange = (filter) => {
    setCurrentFilter(filter);
    filterProducts(filter, searchTerm);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    filterProducts(currentFilter, term);
  };

  const filterProducts = (filter, term) => {
    let result = products;
    
    if (filter !== 'all') {
      result = result.filter(product => product.category === filter);
    }
    
    if (term) {
      const searchTermLower = term.toLowerCase();
      result = result.filter(product => 
        product.title.toLowerCase().includes(searchTermLower) ||
        product.description.toLowerCase().includes(searchTermLower)
      );
    }
    
    setFilteredProducts(result);
  };

  const handleAddProduct = () => {
    const newProduct = {
      id: products.length + 1,
      title: prompt("Masukkan nama produk:"),
      description: prompt("Masukkan deskripsi produk:"),
      price: prompt("Masukkan harga produk:"),
      rating: 0,
      category: "terbaru",
      image: "https://via.placeholder.com/300x200?text=Produk+Baru"
    };
    
    if (newProduct.title && newProduct.description && newProduct.price) {
      const updatedProducts = [newProduct, ...products];
      setProducts(updatedProducts);
      filterProducts(currentFilter, searchTerm);
    }
  };

  return (
    <div className="marketplace-container">
      <Sidebar activeItem="marketplace" />
      <div className="main-content">
        <MarketplaceHeader 
          title="Marketplace" 
          onSearch={handleSearch}
        />
        
        <StatsSection />
        
        <div style={{ display: 'flex', gap: '15px', marginBottom: '30px', alignItems: 'center' }}>
          <select 
            className="category-dropdown" 
            style={{ 
              backgroundColor: '#222', 
              color: '#fff', 
              border: 'none', 
              padding: '10px 20px', 
              borderRadius: '20px', 
              cursor: 'pointer', 
              fontSize: '14px'
            }}
          >
            <option>Kategori</option>
            <option>Ikan Hias</option>
            <option>Ikan Konsumsi</option>
            <option>Aksesoris</option>
          </select>
          
          <div className="search-bar" style={{ flex: 1, maxWidth: 'none' }}>
            <svg className="search-icon" viewBox="0 0 24 24">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
            <input 
              type="text" 
              className="search-input" 
              placeholder="Cari produk..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          
          <button 
            className="search-button" 
            style={{ 
              backgroundColor: '#4CAF50', 
              border: 'none', 
              borderRadius: '50%', 
              width: '40px', 
              height: '40px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              cursor: 'pointer'
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
          </button>
        </div>
        
        <FilterSection 
          currentFilter={currentFilter}
          onFilterChange={handleFilterChange}
        />
        
        <ProductsGrid 
          products={filteredProducts}
          onViewProduct={(id) => console.log('View product:', id)}
          onEditProduct={(id) => console.log('Edit product:', id)}
        />
      </div>
      
      <AddProductButton onClick={handleAddProduct} />
    </div>
  );
}

export default Marketplace;