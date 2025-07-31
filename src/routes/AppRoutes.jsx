// D:\Projek Kominfo\project-kominfo-2\src\routes\AppRoutes.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
<<<<<<< HEAD
import Register from '../pages/Register';
=======
<<<<<<< HEAD
import Toko from '../pages/Toko';
=======
import Scan from '../pages/Scan';
>>>>>>> b1685766d6427785b029fd70ebf3bc93852a6584
>>>>>>> 4b8ff3ea58d5e1b9df6c5dcaa402aa304c8885fe

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
<<<<<<< HEAD
        <Route path="/register" element={<Register />} />
=======
<<<<<<< HEAD
        <Route path="/toko" element={<Toko />} />
=======
        <Route path="/scan" element={<Scan />} />
>>>>>>> b1685766d6427785b029fd70ebf3bc93852a6584
>>>>>>> 4b8ff3ea58d5e1b9df6c5dcaa402aa304c8885fe
      </Routes>
    </BrowserRouter>
  );
}
