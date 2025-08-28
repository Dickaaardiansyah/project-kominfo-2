// Debug dan perbaiki MarketplaceContent.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import StatsSection from './StatsSection';
import FilterSection from './FilterSection';
import ProductsGrid from './ProductsGrid';
import AddProductButton from './AddProductButton';
import RegistrationPrompt from './RegistrationPrompt';
import UploadIDPage from './UploadIDPage';

function MarketplaceContent({ 
  searchQuery, 
  isRegistered, 
  setIsRegistered, 
  catalogRegistrationMode = false 
}) {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentFilter, setCurrentFilter] = useState('all');
  const [registrationStep, setRegistrationStep] = useState('prompt');
  
  const [registrationPurpose, setRegistrationPurpose] = useState('marketplace');
  const [catalogRegistrationComplete, setCatalogRegistrationComplete] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();

  // ⭐ DEBUG: Tambah console.log untuk debug
  console.log('🔍 Debug MarketplaceContent:', {
    catalogRegistrationMode,
    registrationPurpose,
    catalogRegistrationComplete,
    registrationStep,
    isRegistered
  });

  useEffect(() => {
    if (catalogRegistrationMode || location.state?.action === 'catalog-registration') {
      setRegistrationPurpose('catalog');
      console.log('✅ Set registration purpose to: catalog');
    }
  }, [catalogRegistrationMode, location.state]);

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
    console.log('📤 Register clicked, going to upload-id step');
    setRegistrationStep('upload-id');
  };

  const submitCatalogRequest = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        alert('Silakan login terlebih dahulu');
        navigate('/login');
        return;
      }

      console.log('📨 Submitting catalog request...');
      
      const response = await fetch('http://localhost:5000/api/catalog/request-access', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          reason: 'Registrasi sebagai kontributor katalog ikan melalui marketplace'
        })
      });

      const result = await response.json();

      if (response.ok) {
        console.log('✅ Catalog request successful:', result);
        alert(`✅ Request catalog berhasil dikirim!\n\n${result.msg}`);
        setCatalogRegistrationComplete(true);
      } else {
        console.error('❌ Catalog request failed:', result);
        alert(`❌ Gagal mengirim request katalog.\n\nError: ${result.msg}`);
      }
    } catch (error) {
      console.error('❌ Error submitting catalog request:', error);
      alert('❌ Terjadi error saat mengirim request katalog.');
    }
  };

  const handleIDUploadComplete = async () => {
    console.log('📋 ID Upload complete, purpose:', registrationPurpose);
    setRegistrationStep('complete');
    
    if (registrationPurpose === 'catalog') {
      console.log('📨 Submitting catalog request for catalog purpose...');
      await submitCatalogRequest();
    } else {
      console.log('✅ Setting marketplace registration as complete');
      setIsRegistered(true);
    }
  };

  const handleBackToPrompt = () => {
    setRegistrationStep('prompt');
  };

  // ⭐ KONDISI 1: Show upload page when in upload step
  if (registrationStep === 'upload-id') {
    console.log('🔄 Rendering UploadIDPage');
    return (
      <UploadIDPage 
        onBack={handleBackToPrompt}
        onContinue={handleIDUploadComplete}
      />
    );
  }

  // ⭐ KONDISI 2: Show success page for catalog registration FIRST (paling penting!)
  if (registrationPurpose === 'catalog' && catalogRegistrationComplete) {
    console.log('🎉 Rendering Catalog Success Page');
    return (
      <div className="marketplace-content">
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '400px',
          textAlign: 'center',
          padding: '40px 20px',
          backgroundColor: '#f8f9fa'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, #10b981, #059669)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '24px',
            fontSize: '32px'
          }}>
            ✅
          </div>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#111827',
            marginBottom: '16px'
          }}>
            Request Katalog Berhasil Dikirim!
          </h2>
          <p style={{
            color: '#6b7280',
            fontSize: '16px',
            lineHeight: '1.5',
            marginBottom: '8px',
            maxWidth: '500px'
          }}>
            Request akses katalog Anda telah berhasil dikirim ke admin untuk direview.
          </p>
          <p style={{
            color: '#10b981',
            fontSize: '16px',
            fontWeight: '600',
            marginBottom: '24px'
          }}>
            ⏰ Proses review membutuhkan waktu 1-3 hari kerja
          </p>
          <p style={{
            color: '#6b7280',
            fontSize: '14px',
            marginBottom: '32px',
            maxWidth: '400px'
          }}>
            📧 Anda akan mendapat notifikasi email ketika request sudah diproses oleh tim kami.
          </p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => navigate('/scan')}
              style={{
                backgroundColor: '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 24px',
                fontSize: '16px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              Kembali ke Scan
            </button>
            <button
              onClick={() => navigate('/marketplace')}
              style={{
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 24px',
                fontSize: '16px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              Lanjut ke Marketplace
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ⭐ KONDISI 3: Show registration prompt for catalog (belum selesai)
  if (registrationPurpose === 'catalog' && !catalogRegistrationComplete) {
    console.log('📝 Rendering Catalog Registration Prompt');
    return (
      <RegistrationPrompt 
        onRegister={handleRegisterClick}
      />
    );
  }

  // ⭐ KONDISI 4: Show registration prompt for marketplace
  if (registrationPurpose === 'marketplace' && !isRegistered) {
    console.log('📝 Rendering Marketplace Registration Prompt');
    return (
      <RegistrationPrompt 
        onRegister={handleRegisterClick}
      />
    );
  }

  // ⭐ KONDISI 5: Show normal marketplace content
  console.log('🛍️ Rendering Normal Marketplace Content');
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