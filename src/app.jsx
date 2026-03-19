import React from 'react';
// Importamos el CSS para que la página deje de verse como texto plano
import './index.css'; 
import Navbar from './components/navbar';
import InstagramFeed from './components/InstagramFeed';

function App() {
  return (
    <div className="App">
      {/* 1. Barra de Navegación */}
      <Navbar />
      
      {/* 2. Sección Principal (Hero) */}
      <header id="inicio" className="hero">
        <div className="hero-content">
          <h1>Transformando realidades en Yerba Buena</h1>
          <p>Lola Mora y Brasil - Tucumán</p>
          <a href="#contacto" className="btn-main">Quiero Ayudar</a>
        </div>
      </header>

      {/* 3. Feed de Instagram (Dinamismo con React) */}
      <InstagramFeed />

      {/* 4. Ubicación con Google Maps */}
      <section id="ubicacion" className="section bg-grey">
        <h2 className="section-title">Nuestra Ubicación</h2>
        <div className="map-container">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3560.123456789!2d-65.293456!3d-26.812345!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjbCsDQ4JzQ0LjQiUyA2NcKwMTcnMzYuNCJX!5e0!3m2!1ses!2sar!4v1234567890" 
            width="100%" 
            height="450" 
            style={{ border: 0, borderRadius: '15px' }} 
            allowFullScreen="" 
            loading="lazy"
          ></iframe>
        </div>
      </section>

      {/* 5. Footer */}
      <footer className="footer">
        <p>© 2026 Fundación Construir Juntos - Yerba Buena, Tucumán</p>
      </footer>
    </div>
  );
}

export default App;