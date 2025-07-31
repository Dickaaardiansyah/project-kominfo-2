import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Toko from '../pages/Toko';

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/toko" element={<Toko />} />
      </Routes>
    </BrowserRouter>
  );
}