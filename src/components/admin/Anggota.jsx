import React, { useState, useMemo } from 'react';
import styles from "../../styles/admin/Dashboard.module.css";
import Sidebar from '../admin/Sidebar';
import Header from '../admin/Header';

function Anggota() {
  // Sample data anggota
  const [anggotaData] = useState([
    {
      id: 1,
      nama: "Ahmad Rizky",
      email: "ahmad.rizky@email.com",
      telepon: "08123456789",
      alamat: "Jl. Merdeka No. 123, Jakarta",
      status: "Aktif",
      tanggalDaftar: "2024-01-15",
      jenisUsaha: "Penjual Ikan Laut"
    },
    {
      id: 2,
      nama: "Siti Nurhaliza",
      email: "siti.nur@email.com",
      telepon: "08234567890",
      alamat: "Jl. Sudirman No. 45, Bandung",
      status: "Aktif",
      tanggalDaftar: "2024-01-20",
      jenisUsaha: "Penjual Ikan Air Tawar"
    },
    {
      id: 3,
      nama: "Budi Santoso",
      email: "budi.santoso@email.com",
      telepon: "08345678901",
      alamat: "Jl. Diponegoro No. 67, Surabaya",
      status: "Tidak Aktif",
      tanggalDaftar: "2024-02-05",
      jenisUsaha: "Penjual Ikan Hias"
    },
    {
      id: 4,
      nama: "Maya Sari",
      email: "maya.sari@email.com",
      telepon: "08456789012",
      alamat: "Jl. Gatot Subroto No. 89, Yogyakarta",
      status: "Aktif",
      tanggalDaftar: "2024-02-10",
      jenisUsaha: "Penjual Ikan Laut"
    },
    {
      id: 5,
      nama: "Eko Prasetyo",
      email: "eko.prasetyo@email.com",
      telepon: "08567890123",
      alamat: "Jl. Ahmad Yani No. 12, Medan",
      status: "Aktif",
      tanggalDaftar: "2024-02-15",
      jenisUsaha: "Penjual Ikan Air Tawar"
    },
    {
      id: 6,
      nama: "Dewi Lestari",
      email: "dewi.lestari@email.com",
      telepon: "08678901234",
      alamat: "Jl. Pahlawan No. 34, Makassar",
      status: "Aktif",
      tanggalDaftar: "2024-02-20",
      jenisUsaha: "Penjual Ikan Hias"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua');
  const [sortBy, setSortBy] = useState('nama');
  const [sortOrder, setSortOrder] = useState('asc');

  // Filter dan search data
  const filteredData = useMemo(() => {
    let filtered = anggotaData;

    // Filter berdasarkan search term
    if (searchTerm) {
      filtered = filtered.filter(anggota =>
        anggota.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        anggota.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        anggota.telepon.includes(searchTerm) ||
        anggota.jenisUsaha.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter berdasarkan status
    if (statusFilter !== 'Semua') {
      filtered = filtered.filter(anggota => anggota.status === statusFilter);
    }

    // Sort data
    filtered.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];
      
      if (sortBy === 'tanggalDaftar') {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      }
      
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    return filtered;
  }, [anggotaData, searchTerm, statusFilter, sortBy, sortOrder]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
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
                <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2 .89 2-2 2-2-.89-2-2zM4 18v-4h3v4h2v-4h2l1.13-4.5c.33-.67.85-1.2 1.48-1.53L15.5 7H13V5h4l1.5 2.84c.15.28.15.62 0 .89L16.97 12H18v4c0 1.11-.89 2-2 2s-2-.89-2-2v-2h-2v4H4z"/>
                <path d="M12.5 11.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5S11 9.17 11 10s.67 1.5 1.5 1.5z"/>
                <path d="M5.5 6C6.33 6 7 5.33 7 4.5S6.33 3 5.5 3 4 3.67 4 4.5 4.67 6 5.5 6z"/>
              </svg>
              Daftar Anggota ({filteredData.length})
            </h2>
          </div>

          {/* Search and Filter Section */}
          <div style={{ 
            display: 'flex', 
            gap: '1rem', 
            marginBottom: '2rem', 
            flexWrap: 'wrap',
            alignItems: 'center'
          }}>
            {/* Search Input */}
            <div style={{ flex: '1', minWidth: '300px' }}>
              <input
                type="text"
                placeholder="Cari berdasarkan nama, email, telepon, atau jenis usaha..."
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

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                padding: '0.75rem 1rem',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '0.9rem',
                outline: 'none',
                backgroundColor: '#ffffff',
                cursor: 'pointer'
              }}
            >
              <option value="Semua">Semua Status</option>
              <option value="Aktif">Aktif</option>
              <option value="Tidak Aktif">Tidak Aktif</option>
            </select>

            {/* Export Button */}
            <button className={styles.btn + ' ' + styles.btnOutline}>
              <svg style={{ width: '16px', height: '16px', marginRight: '0.5rem' }} viewBox="0 0 24 24" fill="currentColor">
                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
              </svg>
              Export Data
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
                  <th 
                    style={{ 
                      padding: '1rem', 
                      textAlign: 'left', 
                      fontWeight: '600', 
                      color: '#1e293b',
                      cursor: 'pointer',
                      userSelect: 'none'
                    }}
                    onClick={() => handleSort('nama')}
                  >
                    Nama {sortBy === 'nama' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#1e293b' }}>
                    Kontak
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#1e293b' }}>
                    Alamat
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#1e293b' }}>
                    Jenis Usaha
                  </th>
                  <th 
                    style={{ 
                      padding: '1rem', 
                      textAlign: 'left', 
                      fontWeight: '600', 
                      color: '#1e293b',
                      cursor: 'pointer',
                      userSelect: 'none'
                    }}
                    onClick={() => handleSort('tanggalDaftar')}
                  >
                    Tanggal Daftar {sortBy === 'tanggalDaftar' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', color: '#1e293b' }}>
                    Status
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', color: '#1e293b' }}>
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((anggota, index) => (
                    <tr 
                      key={anggota.id}
                      style={{ 
                        borderBottom: '1px solid #e2e8f0',
                        backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9fafb'
                      }}
                    >
                      <td style={{ padding: '1rem' }}>
                        <div>
                          <div style={{ fontWeight: '600', color: '#1e293b', marginBottom: '0.25rem' }}>
                            {anggota.nama}
                          </div>
                          <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                            ID: #{anggota.id.toString().padStart(3, '0')}
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <div>
                          <div style={{ marginBottom: '0.25rem', fontSize: '0.9rem' }}>
                            {anggota.email}
                          </div>
                          <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                            {anggota.telepon}
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '1rem', fontSize: '0.9rem', color: '#475569', maxWidth: '200px' }}>
                        {anggota.alamat}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{
                          padding: '0.25rem 0.75rem',
                          backgroundColor: '#e0f2fe',
                          color: '#0891b2',
                          borderRadius: '20px',
                          fontSize: '0.8rem',
                          fontWeight: '500'
                        }}>
                          {anggota.jenisUsaha}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', fontSize: '0.9rem', color: '#475569' }}>
                        {new Date(anggota.tanggalDaftar).toLocaleDateString('id-ID')}
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'center' }}>
                        <span style={{
                          padding: '0.4rem 0.8rem',
                          borderRadius: '20px',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          backgroundColor: anggota.status === 'Aktif' ? '#dcfce7' : '#fee2e2',
                          color: anggota.status === 'Aktif' ? '#059669' : '#dc2626'
                        }}>
                          {anggota.status}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                          <button 
                            style={{
                              padding: '0.4rem',
                              border: 'none',
                              borderRadius: '6px',
                              backgroundColor: '#f1f5f9',
                              color: '#64748b',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease'
                            }}
                            onMouseOver={(e) => {
                              e.target.style.backgroundColor = '#0891b2';
                              e.target.style.color = '#ffffff';
                            }}
                            onMouseOut={(e) => {
                              e.target.style.backgroundColor = '#f1f5f9';
                              e.target.style.color = '#64748b';
                            }}
                            title="Lihat Detail"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z" />
                            </svg>
                          </button>
                          <button 
                            style={{
                              padding: '0.4rem',
                              border: 'none',
                              borderRadius: '6px',
                              backgroundColor: '#f1f5f9',
                              color: '#64748b',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease'
                            }}
                            onMouseOver={(e) => {
                              e.target.style.backgroundColor = '#059669';
                              e.target.style.color = '#ffffff';
                            }}
                            onMouseOut={(e) => {
                              e.target.style.backgroundColor = '#f1f5f9';
                              e.target.style.color = '#64748b';
                            }}
                            title="Edit"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" style={{ 
                      padding: '3rem', 
                      textAlign: 'center', 
                      color: '#64748b',
                      fontSize: '1.1rem'
                    }}>
                      <div>
                        <svg style={{ width: '48px', height: '48px', marginBottom: '1rem', opacity: '0.5' }} viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
                        </svg>
                        <div>Tidak ada anggota ditemukan</div>
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
              Menampilkan {filteredData.length} dari {anggotaData.length} anggota
              {searchTerm && ` untuk "${searchTerm}"`}
              {statusFilter !== 'Semua' && ` dengan status ${statusFilter}`}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Anggota;