import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Katalog from './components/Katalog';
import Gallery from './components/Gallery';
import Cuaca from './components/Cuaca';
import Contact from './components/Contact';
import OfficeMap from './components/OfficeMap';
import Footer from './components/Footer';
import '@fortawesome/fontawesome-free/css/all.min.css';

function App() {
  return (
    <div className="App">
      <Navbar />
      <main>
        <Hero />
        <Katalog />
        <Gallery />
        <Cuaca />
        <Contact />
        <OfficeMap />
      </main>
      <Footer />
    </div>
  );
}

export default App;