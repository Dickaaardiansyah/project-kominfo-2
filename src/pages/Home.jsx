import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Home/Hero';
import Katalog from '../components/Home/Katalog';
import Gallery from '../components/Home/Galeri';
import Weather from '../components/Home/Cuaca';
import Contact from '../components/Home/Kontak';
import Footer from '../components/Footer';
import '../styles/main.css';

function Home() {
  return (
    <div className="home">
      <Navbar />
      <Hero />
      <Katalog />
      <Gallery />
      <Weather />
      <Contact />
      <Footer />
    </div>
  );
}

export default Home;