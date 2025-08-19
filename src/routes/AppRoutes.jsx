import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AdminAuthProvider } from "../components/admin/auth/AdminAuthContext";
import ProtectedAdminRoute from "../components/admin/auth/ProtectedAdminRoute";

import Layout from "../components/layout/Layout";
import Home from "../pages/Home";
import Toko from "../pages/Toko";
import Register from "../pages/Register";
import Login from "../pages/Login";
import Scan from "../pages/Scan";
import Profile from "../pages/Profile";
import History from "../pages/History";
import Marketplace from "../pages/Marketplace";
import AddKatalogPage from "../pages/AddKatalogPage";
import Dashboard from "../pages/admin/Dashboard";
import AdminLogin from "../pages/admin/Login";

export function AppRoutes() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <AdminAuthProvider>
        <Routes>
          {/* Semua halaman utama dibungkus Layout */}
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/toko" element={<Toko />} />
            <Route path="/scan" element={<Scan />} />
          </Route>

          {/* Halaman tanpa layout (termasuk AddKatalog) */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profil" element={<Profile />} />
          <Route path="/history" element={<History/>} />
          <Route path="/marketplace" element={<Marketplace/>} />
          <Route path="/katalog/tambah" element={<AddKatalogPage />} />
          
          {/* Admin Routes - Protected */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedAdminRoute>
                <Dashboard />
              </ProtectedAdminRoute>
            } 
          />
          
          {/* Admin routes dengan role-based access */}
          <Route 
            path="/admin/seller-requests" 
            element={
              <ProtectedAdminRoute requiredRole="seller_verifier">
                <Dashboard /> {/* Atau component khusus seller requests */}
              </ProtectedAdminRoute>
            } 
          />
          
          <Route 
            path="/admin/manage-admins" 
            element={
              <ProtectedAdminRoute requiredRole="super_admin">
                <Dashboard /> {/* Atau component khusus manage admins */}
              </ProtectedAdminRoute>
            } 
          />

          {/* 404 page */}
          <Route path="*" element={
            <div style={{
              minHeight: '100vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#f8fafc',
              fontFamily: 'Inter, sans-serif'
            }}>
              <div style={{
                textAlign: 'center',
                padding: '48px',
                background: 'white',
                borderRadius: '16px',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                maxWidth: '400px'
              }}>
                <div style={{
                  fontSize: '72px',
                  marginBottom: '16px'
                }}>
                  🐟
                </div>
                <h1 style={{
                  fontSize: '48px',
                  color: '#dc2626',
                  marginBottom: '16px',
                  fontWeight: 'bold',
                  margin: '0 0 16px 0'
                }}>
                  404
                </h1>
                <p style={{
                  color: '#6b7280',
                  marginBottom: '24px',
                  fontSize: '16px',
                  margin: '0 0 24px 0'
                }}>
                  Halaman tidak ditemukan di FishMap
                </p>
                <button
                  onClick={() => window.location.href = '/'}
                  style={{
                    background: 'linear-gradient(135deg, #0891b2, #0e7490)',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    marginRight: '12px'
                  }}
                >
                  Kembali ke Beranda
                </button>
                <button
                  onClick={() => window.history.back()}
                  style={{
                    background: 'transparent',
                    color: '#6b7280',
                    border: '1px solid #d1d5db',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  Kembali
                </button>
              </div>
            </div>
          } />
        </Routes>
      </AdminAuthProvider>
    </BrowserRouter>
  );
}