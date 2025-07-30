import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Katalog from '../components/Katalog';
import Gallery from '../components/Galeri';
import Weather from '../components/Cuaca';
import Contact from '../components/Kontak';
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