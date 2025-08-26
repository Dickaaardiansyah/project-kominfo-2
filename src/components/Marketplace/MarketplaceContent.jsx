// Debug dan perbaiki MarketplaceContent.jsx - WITH REAL CATALOG DATA
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import StatsSection from './StatsSection';
import FilterSection from './FilterSection';
import ProductsGrid from './ProductsGrid';
import AddProductButton from './AddProductButton';
import RegistrationPrompt from './RegistrationPrompt';
import UploadIDPage from './UploadIDPage';
import MarketplaceBannerInfo from './MarketplaceBannerInfo';
import DebugPanel from './DebugPanel';

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
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  const [registrationPurpose, setRegistrationPurpose] = useState('marketplace');
  const [catalogRegistrationComplete, setCatalogRegistrationComplete] = useState(false);

  const [adminApprovalStatus, setAdminApprovalStatus] = useState('pending');
  const [isCheckingApproval, setIsCheckingApproval] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  console.log('🔍 Debug MarketplaceContent:', {
    catalogRegistrationMode,
    registrationPurpose,
    catalogRegistrationComplete,
    registrationStep,
    isRegistered,
    adminApprovalStatus,
    currentPath: location.pathname,
    productsCount: products.length
  });

  // LOAD status dari localStorage saat komponen mount
  useEffect(() => {
    const catalogRequestStatus = localStorage.getItem('catalogRequestSubmitted');
    if (catalogRequestStatus === 'true') {
      setCatalogRegistrationComplete(true);
      console.log('✅ Found existing catalog request status from localStorage');
    }

    const approvalStatus = localStorage.getItem('adminApprovalStatus');
    if (approvalStatus) {
      setAdminApprovalStatus(approvalStatus);
      console.log('✅ Found existing admin approval status:', approvalStatus);
    }
  }, []);

  // RESET status when switching to catalog mode for first time
  useEffect(() => {
    if (catalogRegistrationMode || location.state?.action === 'catalog-registration' || location.pathname.includes('/katalog/daftar')) {
      setRegistrationPurpose('catalog');
      console.log('✅ Set registration purpose to: catalog (detected from URL or mode)');

      const catalogRequestStatus = localStorage.getItem('catalogRequestSubmitted');
      if (!catalogRequestStatus || catalogRequestStatus !== 'true') {
        console.log('🔄 Resetting catalog status for new user');
        setCatalogRegistrationComplete(false);
        setAdminApprovalStatus('pending');
        setRegistrationStep('prompt');

        localStorage.removeItem('adminApprovalStatus');
      }
    } else {
      setRegistrationPurpose('marketplace');
      console.log('✅ Set registration purpose to: marketplace');

      if (location.pathname === '/marketplace') {
        setIsRegistered(true);
        console.log('✅ Force registered = true for /marketplace path');
      }
    }
  }, [catalogRegistrationMode, location.state, location.pathname]);

  // ⭐ NEW: Function to fetch real catalog data from API
  const fetchCatalogData = async (myDataOnly = false) => {
    try {
      setIsLoadingProducts(true);
      console.log(`🔄 Mengambil data katalog ${myDataOnly ? 'pribadi' : 'semua'} dari API...`);

      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
      };

      // Tambahkan header Authorization jika token tersedia
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      // Buat query string
      const queryParams = new URLSearchParams({ limit: 50 });
      if (myDataOnly && token) {
        queryParams.append('my_data_only', 'true');
      }

      const response = await fetch(`http://localhost:5000/api/catalog/entries?${queryParams.toString()}`, {
        method: 'GET',
        headers,
      });

      console.log('📡 Status respons API:', response.status);

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Respons API lengkap:', result);
        console.log('📊 Array data:', result.data);
        console.log('🔢 Jumlah data:', result.data?.length || 0);

        if (result.data && result.data.length > 0) {
          console.log('🐟 Contoh item katalog:', result.data[0]);
          // Transformasi data dari database ke format produk marketplace
          const transformedProducts = result.data.map(catalogItem => ({
            id: catalogItem.id,
            title: catalogItem.namaIkan || catalogItem.predictedFishName || 'I WTkan Tidak Dikenal',
            description: catalogItem.deskripsiTambahan || `${catalogItem.predictedFishName} - ${catalogItem.habitat || 'Habitat tidak diketahui'}`,
            price: generateRandomPrice(),
            originalPrice: Math.random() > 0.7 ? generateRandomPrice(true) : null,
            rating: generateRandomRating(),
            reviews: Math.floor(Math.random() * 200) + 10,
            category: mapCategoryToFilter(catalogItem.kategori),
            stock: Math.floor(Math.random() * 20) + 1,
            seller: catalogItem.user?.name || 'Penjual Tidak Dikenal',
            location: catalogItem.lokasiPenangkapan || 'Lokasi Tidak Dikenal',
            image: catalogItem.fishImage || generateFishImage(),
            catalogData: {
              predictedFishName: catalogItem.predictedFishName,
              habitat: catalogItem.habitat,
              consumptionSafety: catalogItem.amanDikonsumsi ? 'Aman dikonsumsi' : 'Tidak untuk konsumsi',
              dateFound: catalogItem.tanggalDitemukan,
              fishCondition: catalogItem.kondisiIkan,
              contributor: catalogItem.user?.name,
            },
          }));

          setProducts(transformedProducts);
          setFilteredProducts(transformedProducts);
          console.log(`✅ Memuat ${transformedProducts.length} produk dari database katalog`);
        } else {
          console.log('ℹ️ Tidak ada data katalog ditemukan di database');
          setProducts([]);
          setFilteredProducts([]);
        }
      } else {
        console.error('❌ Gagal mengambil data katalog:', response.status);
        setProducts([]);
        setFilteredProducts([]);
      }
    } catch (error) {
      console.error('❌ Error saat mengambil data katalog:', error);
      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  // Helper function to generate random price for display
  const generateRandomPrice = (isOriginal = false) => {
    const basePrice = Math.floor(Math.random() * 50000) + 15000; // 15k-65k
    const finalPrice = isOriginal ? basePrice + 5000 : basePrice;
    return `Rp ${finalPrice.toLocaleString('id-ID')}`;
  };

  // Helper function to generate random rating
  const generateRandomRating = () => {
    return parseFloat((Math.random() * 1.5 + 3.5).toFixed(1)); // 3.5-5.0
  };

  // Helper function to map database category to marketplace filter
  const mapCategoryToFilter = (kategori) => {
    const categoryMap = {
      'Ikan Konsumsi': 'terpopuler',
      'Ikan Hias': 'rating_tinggi',
      'Ikan Air Tawar': 'harga_rendah',
      'Ikan Laut': 'terbaru'
    };
    return categoryMap[kategori] || 'all';
  };

  // Helper function to generate fish image URL
  const generateFishImage = () => {
    const fishImages = [
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=300&h=200&fit=crop",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop",
      "https://images.unsplash.com/photo-1535591273668-578e31182c4f?w=300&h=200&fit=crop",
      "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=300&h=200&fit=crop",
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=300&h=200&fit=crop"
    ];
    return fishImages[Math.floor(Math.random() * fishImages.length)];
  };

  // ⭐ DEBUG: Function to test API directly
  const testAPIConnection = async () => {
    console.log('🧪 Testing API connection directly...');

    try {
      // Test 1: Basic API call
      const response = await fetch('http://localhost:5000/api/catalog/entries');
      console.log('🔗 API Response status:', response.status);
      console.log('🔗 API Response headers:', response.headers);

      if (response.ok) {
        const data = await response.json();
        console.log('📦 Raw API Data:', data);
        return data;
      } else {
        console.error('❌ API Error:', response.status, response.statusText);
        const errorText = await response.text();
        console.error('❌ Error body:', errorText);
      }
    } catch (error) {
      console.error('🚨 Network Error:', error);
      console.error('🚨 Error details:', error.message);
    }

    // Test 2: Check if server is running
    try {
      console.log('🏥 Testing server health...');
      const healthCheck = await fetch('http://localhost:5000/users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || 'test'}`
        }
      });
      console.log('🏥 Server health status:', healthCheck.status);
    } catch (healthError) {
      console.error('🚨 Server might not be running:', healthError.message);
    }
  };

  // ⭐ DEBUG: Add manual test button (temporary)
  const handleTestAPI = async () => {
    console.log('🔧 MANUAL API TEST STARTED');
    const result = await testAPIConnection();

    if (result && result.data) {
      alert(`API Test Result:\n\nStatus: SUCCESS\nData Count: ${result.data.length}\n\nCheck console for details`);
    } else {
      alert('API Test Result:\n\nStatus: FAILED\n\nCheck console for error details');
    }
  };

  // FUNGSI untuk check approval status dari server (OPTIMIZED)
  const checkApprovalStatus = async (showLoading = false) => {
    try {
      if (showLoading) setIsCheckingApproval(true);

      const token = localStorage.getItem('token');

      if (!token) {
        console.log('❌ No token found');
        return;
      }

      const response = await fetch('http://localhost:5000/api/catalog/approval-status', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Approval status from server:', result);

        const serverStatus = result.data?.request_status || 'pending';
        if (serverStatus !== adminApprovalStatus) {
          console.log(`🔄 Status changed: ${adminApprovalStatus} → ${serverStatus}`);
          setAdminApprovalStatus(serverStatus);
          localStorage.setItem('adminApprovalStatus', serverStatus);
          if (serverStatus === 'approved') {
            console.log('🎉 User approved by admin - will load products!');
            setRegistrationPurpose('marketplace');
            setTimeout(() => {
              alert('🎉 Selamat! Akun Anda telah disetujui admin!\n\nAnda sekarang dapat mengakses semua fitur marketplace.');
            }, 500);
          } else if (serverStatus === 'rejected') {
            alert('❌ Maaf, request catalog Anda ditolak admin.');
          }
        }
      } else {
        console.log('❌ Failed to check approval status:', response.status);
      }
    } catch (error) {
      console.error('❌ Error checking approval status:', error);
    } finally {
      if (showLoading) setIsCheckingApproval(false);
    }
  };

  // REAL-TIME check approval status dengan database
  useEffect(() => {
    if (location.pathname === '/marketplace') {
      console.log('🚀 Marketplace loaded - checking real approval status from database...');
      checkRealApprovalStatus();

      const interval = setInterval(() => {
        console.log('🔄 Auto-checking real approval status...');
        checkRealApprovalStatus();
      }, 10000);

      return () => {
        console.log('🛑 Clearing marketplace approval check interval');
        clearInterval(interval);
      };
    }
  }, [location.pathname]);

  // FUNGSI untuk check REAL approval status dari database
  const checkRealApprovalStatus = async (showLoading = false) => {
    try {
      if (showLoading) setIsCheckingApproval(true);

      const token = localStorage.getItem('token');

      if (!token) {
        console.log('❌ No token found');
        setAdminApprovalStatus('pending');
        localStorage.setItem('adminApprovalStatus', 'pending');
        return;
      }

      console.log('🔍 Checking REAL approval status from database...');

      const response = await fetch('http://localhost:5000/api/catalog/my-status', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ REAL approval status from database:', result);

        let dbStatus = result.data?.request_status || 'pending';

        const hasRequest = dbStatus !== 'none';
        if (hasRequest) {
          setCatalogRegistrationComplete(true);
          localStorage.setItem('catalogRequestSubmitted', 'true');
        } else {
          setCatalogRegistrationComplete(false);
          localStorage.removeItem('catalogRequestSubmitted');
        }

        if (dbStatus !== adminApprovalStatus) {
          console.log(`🔄 Status updated from database: ${adminApprovalStatus} → ${dbStatus}`);
          setAdminApprovalStatus(dbStatus);
          localStorage.setItem('adminApprovalStatus', dbStatus);
        }
      } else {
        console.log('❌ Failed to check approval status from database:', response.status);
      }
    } catch (error) {
      console.error('❌ Error checking real approval status:', error);
    } finally {
      if (showLoading) setIsCheckingApproval(false);
    }
  };

  // IMMEDIATE check saat page load/refresh + verify with server
  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      console.log('🚀 Page loaded - verifying catalog status with server...');
      verifyCatalogStatusWithServer();
    }
  }, []);

  // FUNGSI untuk verify status dengan server (lebih robust)
  const verifyCatalogStatusWithServer = async () => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        console.log('❌ No token found');
        return;
      }

      console.log('🔍 Verifying catalog status with server...');

      const response = await fetch('http://localhost:5000/api/catalog/my-status', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Server catalog status:', result);

        const serverStatus = result.data?.request_status || 'pending';
        const hasRequest = serverStatus !== 'none';

        if (hasRequest) {
          setCatalogRegistrationComplete(true);
          localStorage.setItem('catalogRequestSubmitted', 'true');
          if (serverStatus !== adminApprovalStatus) {
            setAdminApprovalStatus(serverStatus);
            localStorage.setItem('adminApprovalStatus', serverStatus);
          }
          if (serverStatus === 'approved') {
            setRegistrationPurpose('marketplace');
            if (location.pathname.includes('/katalog/daftar')) {
              navigate('/marketplace');
            }
          }
        } else {
          console.log('🔄 Resetting status - no request found');
          setCatalogRegistrationComplete(false);
          setAdminApprovalStatus('pending');
          setRegistrationStep('prompt');
          localStorage.removeItem('catalogRequestSubmitted');
          localStorage.removeItem('adminApprovalStatus');
        }
      } else {
        console.log('❌ Failed to verify catalog status with server');
      }
    } catch (error) {
      console.error('❌ Error verifying catalog status:', error);
    }
  };

  // ⭐ UPDATED: Load REAL catalog data instead of sample data
  useEffect(() => {
    if (location.pathname === '/marketplace' || adminApprovalStatus === 'approved') {
      console.log('📦 Memuat data katalog pengguna dari database...');
      fetchCatalogData(true); // Hanya ambil data pengguna
    } else {
      setProducts([]);
      setFilteredProducts([]);
    }
  }, [location.pathname, adminApprovalStatus]);

  // Filter products based on search and category
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
        product.seller.toLowerCase().includes(searchTermLower) ||
        product.location.toLowerCase().includes(searchTermLower)
      );
    }

    setFilteredProducts(filtered);
  }, [products, currentFilter, searchQuery]);

  const handleFilterChange = (filter) => {
    setCurrentFilter(filter);
  };

  const handleAddProduct = () => {
    if (adminApprovalStatus !== 'approved') {
      alert('❌ Anda belum disetujui admin untuk menambah produk');
      return;
    }

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
        image: generateFishImage()
      };

      const updatedProducts = [newProduct, ...products];
      setProducts(updatedProducts);
      alert('✅ Produk berhasil ditambahkan!');
    }
  };

  const handleViewProduct = (id) => {
    const product = products.find(p => p.id === id);
    if (product) {
      const catalogInfo = product.catalogData ?
        `\n\n📊 Info Katalog:\nNama Prediksi: ${product.catalogData.predictedFishName}\nHabitat: ${product.catalogData.habitat}\nKeamanan: ${product.catalogData.consumptionSafety}\nKontributor: ${product.catalogData.contributor}`
        : '';

      alert(`Melihat detail produk: ${product.title}\n\nHarga: ${product.price}\nStok: ${product.stock}\nPenjual: ${product.seller}\nLokasi: ${product.location}${catalogInfo}`);
    }
  };

  const handleEditProduct = (id) => {
    if (adminApprovalStatus !== 'approved') {
      alert('❌ Anda belum disetujui admin untuk mengedit produk');
      return;
    }

    const product = products.find(p => p.id === id);
    if (product) {
      const newTitle = prompt("Edit nama produk:", product.title);
      const newPrice = prompt("Edit harga produk:", product.price);

      if (newTitle && newPrice) {
        const updatedProducts = products.map(p =>
          p.id === id ? { ...p, title: newTitle, price: newPrice } : p
        );
        setProducts(updatedProducts);
        alert('✅ Produk berhasil diupdate!');
      }
    }
  };

  const handleRegisterClick = () => {
    console.log('🔤 Register clicked, going to upload-id step');
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

        try {
          const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
          const userName = userInfo.name || 'User';
          const userEmail = userInfo.email || '';

          if (userEmail) {
            console.log('📧 Sending review notification email...');

            const emailResponse = await fetch('http://localhost:5000/api/email/catalog-review', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                email: userEmail,
                name: userName
              })
            });

            const emailResult = await emailResponse.json();

            if (emailResponse.ok && emailResult.success) {
              console.log('✅ Review notification email sent:', emailResult.messageId);
            } else {
              console.log('⚠️ Failed to send email notification:', emailResult.msg);
            }
          } else {
            console.log('⚠️ No user email found, skipping email notification');
          }
        } catch (emailError) {
          console.log('⚠️ Email sending error:', emailError.message);
        }

        alert(`✅ Request catalog berhasil dikirim!\n\n${result.msg}\n\n📧 Email notifikasi telah dikirim ke email Anda.`);

        localStorage.setItem('catalogRequestSubmitted', 'true');
        localStorage.setItem('adminApprovalStatus', 'pending');

        setCatalogRegistrationComplete(true);
        setAdminApprovalStatus('pending');
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

  const handleClearCatalogStatus = () => {
    console.log('🗑️ Clearing ALL catalog status...');

    localStorage.removeItem('catalogRequestSubmitted');
    localStorage.removeItem('adminApprovalStatus');

    setCatalogRegistrationComplete(false);
    setAdminApprovalStatus('pending');
    setRegistrationStep('prompt');

    setTimeout(() => {
      verifyCatalogStatusWithServer();
    }, 500);

    alert('🔄 Status cleared! Page akan refresh status dari server.');
  };

  const handleSimulateApproval = () => {
    setAdminApprovalStatus('approved');
    localStorage.setItem('adminApprovalStatus', 'approved');
    alert('✅ Simulasi: Admin telah menyetujui akun Anda!');
  };

  // All the existing condition rendering logic remains the same...
  // (keeping all the existing conditional rendering for upload-id, rejected, pending, approved redirect, etc.)

  if (registrationStep === 'upload-id') {
    console.log('📄 Rendering UploadIDPage');
    return (
      <UploadIDPage
        onBack={handleBackToPrompt}
        onContinue={handleIDUploadComplete}
      />
    );
  }

  if (registrationPurpose === 'catalog' && adminApprovalStatus === 'rejected') {
    console.log('❌ Rendering Rejected Page');
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
            background: 'linear-gradient(135deg, #ef4444, #dc2626)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '24px',
            fontSize: '32px'
          }}>
            ❌
          </div>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#111827',
            marginBottom: '16px'
          }}>
            Request Katalog Ditolak
          </h2>
          <p style={{
            color: '#6b7280',
            fontSize: '16px',
            lineHeight: '1.5',
            marginBottom: '24px',
            maxWidth: '500px'
          }}>
            Maaf, request akses katalog Anda ditolak oleh admin. Silakan hubungi customer service untuk informasi lebih lanjut.
          </p>
          <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
            <button
              onClick={() => navigate('/contact')}
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
              Hubungi CS
            </button>
            <button
              onClick={() => navigate('/marketplace')}
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
              Kembali
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (registrationPurpose === 'catalog' && catalogRegistrationComplete && adminApprovalStatus === 'pending') {
    console.log('⏳ Rendering Pending Approval Page');
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
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '24px',
            fontSize: '32px',
            animation: 'pulse 2s infinite'
          }}>
            ⏳
          </div>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#111827',
            marginBottom: '16px'
          }}>
            Menunggu Persetujuan Admin
          </h2>
          <p style={{
            color: '#6b7280',
            fontSize: '16px',
            lineHeight: '1.5',
            marginBottom: '8px',
            maxWidth: '500px'
          }}>
            Request akses katalog Anda sedang dalam proses review oleh admin.
          </p>
          <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
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

  if (registrationPurpose === 'catalog' && catalogRegistrationComplete && adminApprovalStatus === 'approved' && location.pathname.includes('/katalog/daftar')) {
    console.log('🎉 User approved in catalog page - showing redirect page');

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
            🎉 Selamat! Anda Telah Disetujui!
          </h2>
          <p style={{
            color: '#6b7280',
            fontSize: '16px',
            lineHeight: '1.5',
            marginBottom: '24px',
            maxWidth: '500px'
          }}>
            Akun katalog Anda telah disetujui admin. Sekarang Anda dapat mengakses marketplace dan menambah produk.
          </p>

          <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
            <button
              onClick={() => {
                console.log('🔄 Manual redirect to marketplace');
                navigate('/marketplace');
              }}
              style={{
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 24px',
                fontSize: '16px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              🛒 Masuk Marketplace Sekarang
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (registrationPurpose === 'catalog' && !catalogRegistrationComplete) {
    console.log('🔍 Rendering Catalog Registration Prompt');
    return (
      <RegistrationPrompt
        onRegister={handleRegisterClick}
      />
    );
  }

  if (registrationPurpose === 'marketplace' && !isRegistered) {
    console.log('🔍 AUTO-REGISTER for marketplace mode');
    setIsRegistered(true);
  }

  // ⭐ MAIN MARKETPLACE RENDER - Now with real data
  if (location.pathname === '/marketplace') {
    console.log('🛒 Rendering Marketplace with REAL data, products count:', products.length);

    const isCatalogApproved = adminApprovalStatus === 'approved';

    return (
      <div className="marketplace-content">
        <DebugPanel
          registrationPurpose={registrationPurpose}
          catalogRegistrationComplete={catalogRegistrationComplete}
          adminApprovalStatus={adminApprovalStatus}
          registrationStep={registrationStep}
          onClearStatus={handleClearCatalogStatus}
          onSimulateApproval={handleSimulateApproval}
          onCheckDatabase={() => checkRealApprovalStatus(true)}
          onTestAPI={handleTestAPI}
        />

        {isCatalogApproved && (
          <div style={{
            backgroundColor: '#d1fae5',
            border: '1px solid #10b981',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '24px',
            textAlign: 'center'
          }}>
            <h3 style={{ color: '#065f46', fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
              🎉 Anda adalah Kontributor Katalog yang Disetujui!
            </h3>
            <p style={{ color: '#047857', fontSize: '14px', margin: '0 0 8px 0' }}>
              Sekarang Anda dapat menjual produk dan menambahkan ke katalog ikan
            </p>
          </div>
        )}

        {!isCatalogApproved && (
          <div style={{
            backgroundColor: '#f0fdf4',
            border: '1px solid #22c55e',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <ShoppingBag size={24} color="#22c55e" />
            <div style={{ flex: 1 }}>
              <h3 style={{
                color: '#15803d',
                fontSize: '16px',
                fontWeight: '600',
                margin: '0 0 4px 0'
              }}>
                🛒 Selamat Datang di Marketplace!
              </h3>
              <p style={{
                color: '#166534',
                fontSize: '14px',
                margin: '0 0 8px 0'
              }}>
                Jual beli ikan dan aksesorium aquarium dari katalog database.
              </p>
              <button
                onClick={() => navigate('/katalog/daftar')}
                style={{
                  backgroundColor: 'transparent',
                  color: '#22c55e',
                  border: '1px solid #22c55e',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                📋 Daftar Jadi Kontributor Katalog
              </button>
            </div>
          </div>
        )}

        {/* Loading indicator */}
        {isLoadingProducts && (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            color: '#6b7280'
          }}>
            <div style={{
              display: 'inline-block',
              width: '40px',
              height: '40px',
              border: '4px solid #e5e7eb',
              borderTop: '4px solid #3b82f6',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              marginBottom: '16px'
            }}></div>
            <p>Memuat data katalog dari database...</p>
          </div>
        )}

        {/* Empty state */}
        {!isLoadingProducts && products.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: '#6b7280'
          }}>
            <div style={{
              fontSize: '48px',
              marginBottom: '16px'
            }}>
              🐟
            </div>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Belum Ada Data Katalog
            </h3>
            <p style={{
              fontSize: '16px',
              marginBottom: '24px',
              maxWidth: '400px',
              margin: '0 auto 24px'
            }}>
              Database katalog ikan masih kosong. Jadilah kontributor pertama untuk menambahkan ikan ke katalog!
            </p>
            <button
              onClick={() => navigate('/scan')}
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
              🔍 Mulai Scan Ikan
            </button>
          </div>
        )}

        {/* Products display */}
        {!isLoadingProducts && products.length > 0 && (
          <>
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
          </>
        )}

        <AddProductButton onClick={handleAddProduct} />

        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="marketplace-content">
      <DebugPanel
        registrationPurpose={registrationPurpose}
        catalogRegistrationComplete={catalogRegistrationComplete}
        adminApprovalStatus={adminApprovalStatus}
        registrationStep={registrationStep}
        onClearStatus={handleClearCatalogStatus}
        onSimulateApproval={handleSimulateApproval}
      />

      <MarketplaceBannerInfo registrationPurpose={registrationPurpose} />

      <StatsSection products={filteredProducts} />

      <FilterSection
        currentFilter={currentFilter}
        onFilterChange={handleFilterChange}
        productCounts={{}}
      />

      <ProductsGrid
        products={filteredProducts}
        onViewProduct={handleViewProduct}
        onEditProduct={handleEditProduct}
      />

      {(adminApprovalStatus === 'approved' || registrationPurpose === 'marketplace') && location.pathname === '/marketplace' && (
        <AddProductButton onClick={handleAddProduct} />
      )}
    </div>
  );
}

export default MarketplaceContent;