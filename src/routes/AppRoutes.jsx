import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "../components/layout/Layout";
import Home from "../pages/Home";
import Toko from "../pages/Toko";
import Register from "../pages/Register";
import Login from "../pages/Login";
import Scan from "../pages/Scan";
import Profile from "../pages/Profile";
import History from "../pages/History";
import Marketplace from "../pages/Marketplace";
import AddKatalogPage from "../pages/AddKatalogPage"; // ⬅️ Import halaman AddKatalog

export function AppRoutes() {
  return (
    <BrowserRouter>
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
        <Route path="/katalog/tambah" element={<AddKatalogPage />} /> {/* ⬅️ Dipindah ke luar Layout */}
        
        {/* Optional: 404 page */}
        <Route path="*" element={<h1>404 - Halaman Tidak Ditemukan</h1>} />
      </Routes>
    </BrowserRouter>
  );
}