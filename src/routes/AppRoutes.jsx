// D:\Projek Kominfo\project-kominfo-2\src\routes\AppRoutes.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";

import Toko from "../pages/Toko";

import Register from "../pages/Register";

import Scan from "../pages/Scan";

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/toko" element={<Toko />} />

        <Route path="/register" element={<Register />} />

        <Route path="/toko" element={<Toko />} />

        <Route path="/scan" element={<Scan />} />
      </Routes>
    </BrowserRouter>
  );
}
