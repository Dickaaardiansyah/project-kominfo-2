// src/components/Marketplace/MarketplaceContent.jsx
import React, { useState, useEffect } from 'react';
import StatsSection from './StatsSection';
import FilterSection from './FilterSection';
import ProductsGrid from './ProductsGrid';
import AddProductButton from './AddProductButton';
import RegistrationPrompt from './RegistrationPrompt';
import UploadIDPage from './UploadIDPage';

function MarketplaceContent({ searchQuery, isRegistered, setIsRegistered }) {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentFilter, setCurrentFilter] = useState('all');
  const [registrationStep, setRegistrationStep] = useState('prompt');

  useEffect(() => {
    const sampleData = [
      {
        id: 1,
        title: "Clown Fish Premium",
        description: "Ikan badut yang cantik dan mudah dipelihara. Cocok untuk pemula.",
        price: "Rp 25.000",
        originalPrice: "Rp 30.000",
        rating: 4.8,
        reviews: 124,
        category: "terpopuler",
        stock: 15,
        seller: "AquaFish Store",
        location: "Jakarta Selatan",
        image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=300&h=200&fit=crop"
      },
      {
        id: 2,
        title: "Ikan Cupang Super Red",
        description: "Ikan cupang premium dengan warna merah menyala yang indah",
        price: "Rp 15.000",
        originalPrice: "Rp 20.000",
        rating: 4.6,
        reviews: 89,
        category: "harga_rendah",
        stock: 8,
        seller: "Betta Kingdom",
        location: "Bandung",
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop"
      },
      {
        id: 3,
        title: "Angelfish Black Diamond",
        description: "Ikan angel hitam elegan untuk aquarium besar",
        price: "Rp 45.000",
        originalPrice: null,
        rating: 4.9,
        reviews: 156,
        category: "rating_tinggi",
        stock: 5,
        seller: "Premium Aquatics",
        location: "Surabaya",
        image: "https://images.unsplash.com/photo-1520637836862-4d197d17c2a2?w=300&h=200&fit=crop"
      },
      {
        id: 4,
        title: "Neon Tetra School Pack",
        description: "Paket 10 ekor neon tetra untuk aquarium komunitas",
        price: "Rp 35.000",
        originalPrice: "Rp 40.000",
        rating: 4.7,
        reviews: 203,
        category: "promo",
        stock: 12,
        seller: "Tetra World",
        location: "Yogyakarta",
        image: "https://images.unsplash.com/photo-1535591273668-578e31182c4f?w=300&h=200&fit=crop"
      },
      {
        id: 5,
        title: "Goldfish Oranda",
        description: "Ikan mas koki oranda dengan tutup kepala yang indah",
        price: "Rp 50.000",
        originalPrice: null,
        rating: 4.5,
        reviews: 67,
        category: "terbaru",
        stock: 3,
        seller: "Goldfish Paradise",
        location: "Medan",
        image: "https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=300&h=200&fit=crop"
      },
      {
        id: 6,
        title: "Discus Blue Diamond",
        description: "Ikan discus biru premium untuk aquarium show tank",
        price: "Rp 150.000",
        originalPrice: "Rp 175.000",
        rating: 4.9,
        reviews: 45,
        category: "terpopuler",
        stock: 2,
        seller: "Discus Expert",
        location: "Jakarta Utara",
        image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=300&h=200&fit=crop"
      }
    ];
    
    setProducts(sampleData);
    setFilteredProducts(sampleData);
  }, []);

  useEffect(() => {
    let filtered = products;

    if (currentFilter !== 'all') {
      filtered = products.filter(product => product.category === currentFilter);
    }

    if (searchQuery && searchQuery.trim()) {
      const searchTermLower = searchQuery.toLowerCase();
      filtered = filtered.filter(product => 
        product.title.toLowerCase().includes(searchTermLower) ||
        product.description.toLowerCase().includes(searchTermLower) ||
        product.seller.toLowerCase().includes(searchTermLower)
      );
    }

    setFilteredProducts(filtered);
  }, [products, currentFilter, searchQuery]);

  const handleFilterChange = (filter) => {
    setCurrentFilter(filter);
  };

  const handleAddProduct = () => {
    const title = prompt("Masukkan nama produk:");
    const description = prompt("Masukkan deskripsi produk:");
    const price = prompt("Masukkan harga produk (contoh: Rp 25.000):");
    
    if (title && description && price) {
      const newProduct = {
        id: products.length + 1,
        title: title,
        description: description,
        price: price,
        originalPrice: null,
        rating: 0,
        reviews: 0,
        category: "terbaru",
        stock: 10,
        seller: "Toko Saya",
        location: "Jakarta",
        image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=300&h=200&fit=crop"
      };
      
      const updatedProducts = [newProduct, ...products];
      setProducts(updatedProducts);
      alert('Produk berhasil ditambahkan!');
    }
  };

  const handleViewProduct = (id) => {
    const product = products.find(p => p.id === id);
    if (product) {
      alert(`Melihat detail produk: ${product.title}\n\nHarga: ${product.price}\nStok: ${product.stock}\nPenjual: ${product.seller}`);
    }
  };

  const handleEditProduct = (id) => {
    const product = products.find(p => p.id === id);
    if (product) {
      const newTitle = prompt("Edit nama produk:", product.title);
      const newPrice = prompt("Edit harga produk:", product.price);
      
      if (newTitle && newPrice) {
        const updatedProducts = products.map(p => 
          p.id === id ? { ...p, title: newTitle, price: newPrice } : p
        );
        setProducts(updatedProducts);
        alert('Produk berhasil diupdate!');
      }
    }
  };

  const handleRegisterClick = () => {
    setRegistrationStep('upload-id');
  };

  const handleIDUploadComplete = () => {
    setRegistrationStep('complete');
    setIsRegistered(true);
  };

  const handleBackToPrompt = () => {
    setRegistrationStep('prompt');
  };

  if (registrationStep === 'upload-id') {
    return (
      <UploadIDPage 
        onBack={handleBackToPrompt}
        onContinue={handleIDUploadComplete}
      />
    );
  }

  if (!isRegistered) {
    return (
      <RegistrationPrompt 
        onRegister={handleRegisterClick}
      />
    );
  }

  return (
    <div className="marketplace-content">
      <StatsSection products={filteredProducts} />
      
      <FilterSection 
        currentFilter={currentFilter}
        onFilterChange={handleFilterChange}
        productCounts={{
          all: products.length,
          terpopuler: products.filter(p => p.category === 'terpopuler').length,
          harga_rendah: products.filter(p => p.category === 'harga_rendah').length,
          terbaru: products.filter(p => p.category === 'terbaru').length,
          rating_tinggi: products.filter(p => p.category === 'rating_tinggi').length,
          promo: products.filter(p => p.category === 'promo').length
        }}
      />
      
      <ProductsGrid 
        products={filteredProducts}
        onViewProduct={handleViewProduct}
        onEditProduct={handleEditProduct}
      />

      <AddProductButton onClick={handleAddProduct} />
    </div>
  );
}

export default MarketplaceContent;