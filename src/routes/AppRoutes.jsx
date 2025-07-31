// D:\Projek Kominfo\project-kominfo-2\src\routes\AppRoutes.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
<<<<<<< HEAD
import Toko from '../pages/Toko';
=======
import Scan from '../pages/Scan';
>>>>>>> b1685766d6427785b029fd70ebf3bc93852a6584

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
<<<<<<< HEAD
        <Route path="/toko" element={<Toko />} />
=======
        <Route path="/scan" element={<Scan />} />
>>>>>>> b1685766d6427785b029fd70ebf3bc93852a6584
      </Routes>
    </BrowserRouter>
  );
}