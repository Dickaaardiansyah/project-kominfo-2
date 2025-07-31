// D:\Projek Kominfo\project-kominfo-2\src\routes\AppRoutes.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
<<<<<<< HEAD
import Toko from '../pages/Toko';
=======
import Register from '../pages/Register';
import Toko from '../pages/Toko';

>>>>>>> c28a1e734bc62d7538ec64835c5042f8d40cf19c
import Scan from '../pages/Scan';


export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
<<<<<<< HEAD
        <Route path="/toko" element={<Toko />} />
=======

        <Route path="/register" element={<Register />} />


        <Route path="/toko" element={<Toko />} />

>>>>>>> c28a1e734bc62d7538ec64835c5042f8d40cf19c
        <Route path="/scan" element={<Scan />} />
      </Routes>
    </BrowserRouter>
  );
}
