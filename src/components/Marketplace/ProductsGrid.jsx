// src/components/Marketplace/ProductsGrid.jsx
import React from 'react';

function ProductsGrid({ products, onViewProduct, onEditProduct }) {
  if (products.length === 0) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '60px 20px', 
        color: '#888',
        fontSize: '18px'
      }}>
        Produk tidak ditemukan
      </div>
    );
  }

  return (
    <div className="products-grid">
      {products.map(product => (
        <div 
          key={product.id}
          className="product-card"
          onClick={() => onViewProduct(product.id)}
        >
          <div 
            className="product-image" 
            style={{ 
              backgroundImage: `url('${product.image}')`, 
              backgroundSize: 'cover', 
              backgroundPosition: 'center' 
            }}
          ></div>
          <div className="product-info">
            <div className="product-title">{product.title}</div>
            <div className="product-price">{product.price}</div>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              marginTop: '15px'
            }}>
              <button 
                className="edit-btn" 
                onClick={(e) => {
                  e.stopPropagation();
                  onEditProduct(product.id);
                }}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: '#ff6b35', 
                  cursor: 'pointer', 
                  fontSize: '18px'
                }}
              >
                ✏️
              </button>
              <button className="add-to-cart">Beli Aja</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProductsGrid;