import React from 'react';
import { Routes, Route } from 'react-router-dom'; 
import './index.css'; 
import Navbar from './components/navbar';

// Importación de Páginas
import Nosotros from './pages/Nosotros';
import Sumate from './pages/Sumate';
import Contacto from './pages/Contacto';

// Importación de fotos
import pro1 from './Assets/pro1.png';
import pro2 from './Assets/pro2.png';
import pro3 from './Assets/pro3.png';

const acciones = [
  { id: 1, titulo: "Campaña Útiles Escolares", desc: "Entrega de kits para el inicio de clases en Yerba Buena.", imagen: pro1 },
  { id: 2, titulo: "Colecta Tucumán", desc: "Recaudación de alimentos y ropa para familias.", imagen: pro2 },
  { id: 3, titulo: "Talleres Comunitarios", desc: "Espacios de aprendizaje y contención en Lola Mora y Brasil.", imagen: pro3 }
];

const eventosData = [
  { id: 101, fecha: "2026-03-25", titulo: "Taller de Reciclado", lugar: "Sede Fundación" },
  { id: 102, fecha: "2026-04-10", titulo: "Colecta Yerba Buena", lugar: "Plaza Principal" },
  { id: 103, fecha: "2026-04-18", titulo: "Huerta Orgánica", lugar: "Vivero Municipal" },
  { id: 104, fecha: "2026-04-28", titulo: "Charla Comunitaria", lugar: "Centro Vecinal" },
];

function App() {
  const hoy = new Date();
  const limiteDosMeses = new Date();
  limiteDosMeses.setMonth(hoy.getMonth() + 2);

  const eventosProximos = eventosData.filter(ev => {
    const fechaEv = new Date(ev.fecha);
    return fechaEv >= hoy && fechaEv <= limiteDosMeses;
  });

  return (
    <div className="App">
      <Navbar />
      
      <Routes>
        {/* PÁGINA DE INICIO (HOME) */}
        <Route path="/" element={
          <>
            <header className="hero">
              <div className="hero-content">
                <h1>Fundación Construir Juntos</h1>
                <p>Transformando realidades en Yerba Buena, Tucumán</p>
              </div>
            </header>

            <section id="novedades" className="section bg-grey">
              <h2 className="section-title">Nuestras Últimas Acciones</h2>
              <div className="flex-col"> 
                {acciones.map((item) => (
                  <div key={item.id} className="card-wide">
                    <img src={item.imagen} alt={item.titulo} className="card-wide-img" />
                    <div className="card-wide-content">
                      <h3>{item.titulo}</h3>
                      <p>{item.desc}</p>
                      <a href="#" className="btn-small">Leer más</a>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section id="contacto" className="section bg-white">
              <div className="split-container">
                <div className="split-left">
                  <h2 className="section-subtitle">📍 Dónde Estamos</h2>
                  <div className="map-wrapper-split">
                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3559.432658428469!2d-65.313437!3d-26.815234!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94225d3ad0971b31%3A0x33e5c94c9a544f80!2sYerba%20Buena%2C%20Tucum%C3%A1n!5e0!3m2!1ses!2sar!4v1710880000000!5m2!1ses!2sar" width="100%" height="400" style={{ border: 0 }} allowFullScreen="" loading="lazy"></iframe>
                    <p className="address-text">Lola Mora y Brasil, Yerba Buena</p>
                  </div>
                </div>
                <div className="split-right">
                  <h2 className="section-subtitle">📅 Próximos Eventos</h2>
                  <div className="eventos-lista-split">
                    {eventosProximos.map(ev => (
                      <div key={ev.id} className="evento-item-mini">
                        <div className="evento-fecha-mini">
                          <span className="ev-dia">{new Date(ev.fecha).getDate() + 1}</span>
                          <span className="ev-mes">{new Date(ev.fecha).toLocaleDateString('es-AR', { month: 'short' }).toUpperCase()}</span>
                        </div>
                        <div className="evento-info">
                          <h4>{ev.titulo}</h4>
                          <p>{ev.lugar}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </>
        } />

        {/* OTRAS PÁGINAS */}
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/sumate" element={<Sumate />} />
      </Routes>

      <footer className="footer">
        <p>© 2026 Fundación Construir Juntos - Yerba Buena, Tucumán</p>
      </footer>
    </div>
  );
}

export default App;