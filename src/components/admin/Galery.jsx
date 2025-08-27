import React, { useState, useMemo } from 'react';
import styles from "../../styles/admin/Dashboard.module.css";
import Sidebar from '../admin/Sidebar';
import Header from '../admin/Header';

function Galery() {
  // Sample data galeri
  const [galeriData, setGaleriData] = useState([
    {
      id: 1,
      nama: "Ikan Kakap Merah Segar",
      gambar: "https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=300&h=200&fit=crop",
      deskripsi: "Ikan kakap merah segar hasil tangkapan nelayan lokal dengan kualitas premium. Cocok untuk berbagai olahan masakan."
    },
    {
      id: 2,
      nama: "Ikan Tongkol Premium",
      gambar: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=300&h=200&fit=crop",
      deskripsi: "Ikan tongkol berkualitas tinggi, daging tebal dan segar. Ideal untuk pembuatan abon ikan dan masakan tradisional."
    },
    {
      id: 3,
      nama: "Ikan Bandeng Tanpa Duri",
      gambar: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop",
      deskripsi: "Ikan bandeng yang sudah diproses tanpa duri, memudahkan konsumsi terutama untuk anak-anak."
    },
    {
      id: 4,
      nama: "Udang Vaname Jumbo",
      gambar: "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=300&h=200&fit=crop",
      deskripsi: "Udang vaname jumbo segar dengan ukuran besar. Tekstur kenyal dan rasa manis alami."
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    nama: '',
    gambar: '',
    deskripsi: ''
  });
  const [previewImage, setPreviewImage] = useState('');

  // Filter data berdasarkan search
  const filteredData = useMemo(() => {
    if (!searchTerm) return galeriData;
    
    return galeriData.filter(item =>
      item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.deskripsi.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [galeriData, searchTerm]);

  // Handle form input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validasi file type
      if (!file.type.startsWith('image/')) {
        alert('File harus berupa gambar!');
        return;
      }
      
      // Validasi ukuran file (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Ukuran file maksimal 5MB!');
        return;
      }

      // Convert to base64 untuk preview dan storage
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target.result;
        setPreviewImage(result);
        setFormData(prev => ({
          ...prev,
          gambar: result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Open modal untuk create
  const handleCreate = () => {
    setEditingItem(null);
    setFormData({ nama: '', gambar: '', deskripsi: '' });
    setPreviewImage('');
    setIsModalOpen(true);
  };

  // Open modal untuk edit
  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      nama: item.nama,
      gambar: item.gambar,
      deskripsi: item.deskripsi
    });
    setPreviewImage(item.gambar);
    setIsModalOpen(true);
  };

  // Handle delete
  const handleDelete = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus item ini?')) {
      setGaleriData(prev => prev.filter(item => item.id !== id));
    }
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.nama || !formData.gambar || !formData.deskripsi) {
      alert('Semua field harus diisi dan gambar harus dipilih!');
      return;
    }

    if (editingItem) {
      // Update existing item
      setGaleriData(prev => prev.map(item => 
        item.id === editingItem.id 
          ? { ...item, ...formData }
          : item
      ));
    } else {
      // Create new item
      const newItem = {
        id: Math.max(...galeriData.map(item => item.id)) + 1,
        ...formData
      };
      setGaleriData(prev => [...prev, newItem]);
    }

    setIsModalOpen(false);
    setFormData({ nama: '', gambar: '', deskripsi: '' });
    setPreviewImage('');
    setEditingItem(null);
  };

  return (
    <div className="containerAdmin">
      <Sidebar />
      <main className={styles.mainContent}>
        <Header />
        <div className={styles.verificationSection}>
          {/* Header Section */}
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              <svg className={styles.sectionIcon} viewBox="0 0 24 24" fill="currentColor">
                <path d="M22 16V4c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2zm-11.5-9L8 10.5l1.5 1.5L8 15h2.5l1.5-3 1.5 3H16l-1.5-3 1.5-3h-2.5L12 12 10.5 9h-2.5z"/>
                <path d="M2 6v14c0 1.1.9 2 2 2h14v-2H4V6H2z"/>
              </svg>
              Galeri ({filteredData.length})
            </h2>
          </div>

          {/* Search and Create Section */}
          <div style={{ 
            display: 'flex', 
            gap: '1rem', 
            marginBottom: '2rem', 
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            {/* Search Input */}
            <div style={{ flex: '1', minWidth: '300px' }}>
              <input
                type="text"
                placeholder="Cari berdasarkan nama atau deskripsi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  outline: 'none',
                  transition: 'border-color 0.3s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = '#0891b2'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>

            {/* Create Button */}
            <button 
              onClick={handleCreate}
              className={styles.btn + ' ' + styles.btnSuccess}
            >
              <svg style={{ width: '16px', height: '16px', marginRight: '0.5rem' }} viewBox="0 0 24 24" fill="currentColor">
                <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
              </svg>
              Tambah Gambar
            </button>
          </div>

          {/* Table */}
          <div style={{ 
            overflowX: 'auto',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                <tr>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#1e293b', width: '150px' }}>
                    Gambar
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#1e293b' }}>
                    Nama
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#1e293b' }}>
                    Deskripsi
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', color: '#1e293b', width: '120px' }}>
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((item, index) => (
                    <tr 
                      key={item.id}
                      style={{ 
                        borderBottom: '1px solid #e2e8f0',
                        backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9fafb'
                      }}
                    >
                      <td style={{ padding: '1rem' }}>
                        <img 
                          src={item.gambar} 
                          alt={item.nama}
                          style={{
                            width: '100px',
                            height: '70px',
                            objectFit: 'cover',
                            borderRadius: '8px',
                            border: '2px solid #e2e8f0'
                          }}
                        />
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ fontWeight: '600', color: '#1e293b', fontSize: '1rem' }}>
                          {item.nama}
                        </div>
                      </td>
                      <td style={{ padding: '1rem', fontSize: '0.9rem', color: '#475569', maxWidth: '400px' }}>
                        {item.deskripsi}
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                          <button 
                            onClick={() => handleEdit(item)}
                            style={{
                              padding: '0.5rem 0.75rem',
                              border: 'none',
                              borderRadius: '6px',
                              backgroundColor: '#059669',
                              color: '#ffffff',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease',
                              fontSize: '0.8rem',
                              fontWeight: '500'
                            }}
                            onMouseOver={(e) => e.target.style.backgroundColor = '#047857'}
                            onMouseOut={(e) => e.target.style.backgroundColor = '#059669'}
                            title="Edit"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDelete(item.id)}
                            style={{
                              padding: '0.5rem 0.75rem',
                              border: 'none',
                              borderRadius: '6px',
                              backgroundColor: '#dc2626',
                              color: '#ffffff',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease',
                              fontSize: '0.8rem',
                              fontWeight: '500'
                            }}
                            onMouseOver={(e) => e.target.style.backgroundColor = '#b91c1c'}
                            onMouseOut={(e) => e.target.style.backgroundColor = '#dc2626'}
                            title="Hapus"
                          >
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" style={{ 
                      padding: '3rem', 
                      textAlign: 'center', 
                      color: '#64748b',
                      fontSize: '1.1rem'
                    }}>
                      <div>
                        <svg style={{ width: '48px', height: '48px', marginBottom: '1rem', opacity: '0.5' }} viewBox="0 0 24 24" fill="currentColor">
                          <path d="M22 16V4c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2z"/>
                          <path d="M2 6v14c0 1.1.9 2 2 2h14v-2H4V6H2z"/>
                        </svg>
                        <div>Tidak ada data galeri ditemukan</div>
                        {searchTerm && (
                          <div style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
                            Coba ubah kata kunci pencarian
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          {filteredData.length > 0 && (
            <div style={{ 
              marginTop: '1.5rem', 
              padding: '1rem', 
              backgroundColor: '#f8fafc', 
              borderRadius: '8px',
              fontSize: '0.9rem',
              color: '#64748b'
            }}>
              Menampilkan {filteredData.length} dari {galeriData.length} item galeri
              {searchTerm && ` untuk "${searchTerm}"`}
            </div>
          )}
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '2rem'
          }}>
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              padding: '2rem',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)'
            }}>
              {/* Modal Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '2rem',
                paddingBottom: '1rem',
                borderBottom: '1px solid #e2e8f0'
              }}>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  color: '#1e293b',
                  margin: 0
                }}>
                  {editingItem ? 'Edit Gambar' : 'Tambah Gambar Baru'}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '1.5rem',
                    cursor: 'pointer',
                    color: '#64748b',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = '#f1f5f9';
                    e.target.style.color = '#1e293b';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.color = '#64748b';
                  }}
                >
                  ×
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.75rem',
                    fontWeight: '500',
                    color: '#1e293b'
                  }}>
                    Nama *
                  </label>
                  <input
                    type="text"
                    name="nama"
                    value={formData.nama}
                    onChange={handleInputChange}
                    placeholder="Masukkan nama gambar"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      outline: 'none',
                      transition: 'border-color 0.3s ease'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#0891b2'}
                    onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                    required
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.75rem',
                    fontWeight: '500',
                    color: '#1e293b'
                  }}>
                    Gambar *
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      outline: 'none',
                      backgroundColor: '#f8fafc',
                      cursor: 'pointer',
                      transition: 'border-color 0.3s ease'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#0891b2'}
                    onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                  />
                  <div style={{ 
                    fontSize: '0.8rem', 
                    color: '#64748b', 
                    marginTop: '0.5rem' 
                  }}>
                    Format yang didukung: JPG, PNG, GIF. Maksimal 5MB.
                  </div>
                  {previewImage && (
                    <div style={{ marginTop: '1rem' }}>
                      <div style={{ 
                        fontSize: '0.9rem', 
                        fontWeight: '500', 
                        color: '#1e293b', 
                        marginBottom: '0.5rem' 
                      }}>
                        Preview:
                      </div>
                      <div style={{ position: 'relative', display: 'inline-block' }}>
                        <img 
                          src={previewImage} 
                          alt="Preview"
                          style={{
                            width: '200px',
                            height: '150px',
                            objectFit: 'cover',
                            borderRadius: '8px',
                            border: '2px solid #e2e8f0'
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setPreviewImage('');
                            setFormData(prev => ({ ...prev, gambar: '' }));
                          }}
                          style={{
                            position: 'absolute',
                            top: '5px',
                            right: '5px',
                            background: 'rgba(220, 38, 38, 0.9)',
                            border: 'none',
                            borderRadius: '50%',
                            width: '24px',
                            height: '24px',
                            color: 'white',
                            cursor: 'pointer',
                            fontSize: '14px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          title="Hapus gambar"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div style={{ marginBottom: '2rem' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.75rem',
                    fontWeight: '500',
                    color: '#1e293b'
                  }}>
                    Deskripsi *
                  </label>
                  <textarea
                    name="deskripsi"
                    value={formData.deskripsi}
                    onChange={handleInputChange}
                    placeholder="Masukkan deskripsi gambar"
                    rows="4"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      outline: 'none',
                      resize: 'vertical',
                      fontFamily: 'inherit',
                      transition: 'border-color 0.3s ease'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#0891b2'}
                    onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                    required
                  />
                </div>

                {/* Modal Actions */}
                <div style={{
                  display: 'flex',
                  gap: '1rem',
                  justifyContent: 'flex-end'
                }}>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    style={{
                      padding: '0.75rem 1.5rem',
                      border: '2px solid #e2e8f0',
                      backgroundColor: '#ffffff',
                      color: '#64748b',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: '500',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.borderColor = '#0891b2';
                      e.target.style.color = '#0891b2';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.borderColor = '#e2e8f0';
                      e.target.style.color = '#64748b';
                    }}
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    style={{
                      padding: '0.75rem 1.5rem',
                      border: 'none',
                      backgroundColor: '#0891b2',
                      color: '#ffffff',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: '500',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#0e7490'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#0891b2'}
                  >
                    {editingItem ? 'Perbarui' : 'Simpan'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Galery;