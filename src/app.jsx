import React, { useEffect, useState } from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import './index.css';
import Navbar from './components/navbar';
import Admin from './pages/Admin';

// Importación de Páginas
import Nosotros from './pages/Nosotros';
import Sumate from './pages/Sumate';
import Contacto from './pages/Contacto';
import Proyectos from './pages/Proyectos';
import Cursos from './pages/Cursos';

// Importación de fotos
import pro1 from './Assets/pro1.PNG';
import pro2 from './Assets/pro2.PNG';
import pro3 from './Assets/pro3.PNG';
import pro4 from './Assets/pro4.PNG';

import {
  onAuthStateChangedListener,
  saveSiteContent,
  subscribeSiteContent,
} from './firebase';

const defaultContent = {
  heroTitle: 'Fundación Construir Juntos',
  heroSubtitle: 'Transformando realidades en Yerba Buena, Tucumán',
  cards: [
    {
      id: 1,
      titulo: 'Campaña Útiles Escolares',
      desc: 'Entrega de kits para el inicio de clases en Yerba Buena.',
    },
    {
      id: 2,
      titulo: 'Colecta Tucumán',
      desc: 'Recaudación de alimentos y ropa para familias.',
    },
    {
      id: 3,
      titulo: 'Talleres Comunitarios',
      desc: 'Espacios de aprendizaje y contención en Lola Mora y Brasil.',
    },
  ],
  events: [
    { id: 101, fecha: '2026-03-25', titulo: 'Taller de Reciclado', lugar: 'Sede Fundación' },
    { id: 102, fecha: '2026-04-10', titulo: 'Colecta Yerba Buena', lugar: 'Plaza Principal' },
    { id: 103, fecha: '2026-04-18', titulo: 'Huerta Orgánica', lugar: 'Vivero Municipal' },
    { id: 104, fecha: '2026-04-28', titulo: 'Charla Comunitaria', lugar: 'Centro Vecinal' },
  ],
  contactAddress: 'Lola Mora y Brasil, Yerba Buena',
  footerText: '© 2026 Fundación Construir Juntos - Yerba Buena, Tucumán',
};

const imageMap = {
  1: pro1,
  2: pro2,
  3: pro3,
};

const parseLocalDate = (dateString) => {
  if (!dateString) return null;
  const [year, month, day] = dateString.split('-').map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
};

const formatEventDay = (dateString) => {
  const date = parseLocalDate(dateString);
  return date ? date.getDate() : '';
};

const formatEventMonth = (dateString) => {
  const date = parseLocalDate(dateString);
  return date ? date.toLocaleDateString('es-AR', { month: 'short' }).toUpperCase() : '';
};

function App() {
  const [user, setUser] = useState(null);
  const [content, setContent] = useState(defaultContent);
  const [loading, setLoading] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const unsubscribe = onAuthStateChangedListener((currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeSiteContent(
      (snapshot) => {
        if (snapshot.exists()) {
          setContent({ ...defaultContent, ...snapshot.data() });
        } else {
          setContent(defaultContent);
        }
        setLoading(false);
      },
      (error) => {
        console.error('Firebase content error:', error);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  const acciones = content.cards || defaultContent.cards;
  const eventosData = content.events || defaultContent.events;
  const novedadesSlides = acciones.map((item, index) => ({
    ...item,
    imagen: item.imagen || imageMap[item.id] || [pro1, pro2, pro3, pro4][index] || pro4,
  }));
  const heroBackground = content.heroImage || novedadesSlides[0]?.imagen || pro1;

  // Mostrar eventos de hoy en adelante
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const eventosProximos = eventosData.filter((ev) => {
    const fechaEv = parseLocalDate(ev.fecha);
    if (!fechaEv) return false;
    fechaEv.setHours(0, 0, 0, 0);
    return fechaEv >= hoy;
  });
  const visibleEventos = eventosProximos.slice(0, 4);

  useEffect(() => {
    if (novedadesSlides.length <= 1) return undefined;

    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % novedadesSlides.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [novedadesSlides.length]);

  const handleSaveContent = async (newContent) => {
    await saveSiteContent(newContent);
  };

  const moveSlide = (direction) => {
    setActiveSlide((prev) => {
      const total = novedadesSlides.length;
      if (!total) return 0;
      return (prev + direction + total) % total;
    });
  };

  const activeSlideIndex = novedadesSlides.length ? activeSlide % novedadesSlides.length : 0;
  const activeNovedad = novedadesSlides[activeSlideIndex];

  return (
    <div className="App">
      <Navbar />

      <Routes>
        {/* PÁGINA DE INICIO (HOME) */}
        <Route
          path="/"
          element={
            <>
              <header
                className="home-hero"
                style={{
                  backgroundImage: `linear-gradient(90deg, rgba(18, 24, 28, 0.78), rgba(18, 24, 28, 0.28)), url('${heroBackground}')`,
                }}
              >
                <div className="home-hero-content">
                  <span className="home-eyebrow">Yerba Buena, Tucumán</span>
                  <h1>{content.heroTitle || defaultContent.heroTitle}</h1>
                  <p>{content.heroSubtitle || defaultContent.heroSubtitle}</p>
                  <div className="home-hero-actions">
                    <Link className="home-primary-link" to="/sumate">Sumate</Link>
                    <Link className="home-secondary-link" to="/proyectos">Ver proyectos</Link>
                  </div>
                </div>
              </header>

              <main className="home-shell">
                <section className="home-action-bar" aria-label="Accesos destacados">
                  <div className="home-action-item">
                    <span>Ubicación</span>
                    <strong>{content.contactAddress || defaultContent.contactAddress}</strong>
                  </div>
                  <div className="home-action-item">
                    <span>Actividades</span>
                    <strong>{acciones.length}+ iniciativas activas</strong>
                  </div>
                  <div className="home-action-item">
                    <span>Agenda</span>
                    <strong>{eventosProximos.length || eventosData.length}+ eventos</strong>
                  </div>
                  <Link className="home-action-button" to="/contacto">Contactar</Link>
                </section>

                <section className="home-stats" aria-label="Resumen de impacto">
                  <article>
                    <strong>{acciones.length}+</strong>
                    <p>Novedades, campañas y espacios comunitarios para acompañar a familias.</p>
                  </article>
                  <article>
                    <strong>{eventosProximos.length || eventosData.length}+</strong>
                    <p>Eventos y encuentros pensados para sostener el trabajo territorial.</p>
                  </article>
                  <article>
                    <strong>Yerba Buena</strong>
                    <p>Presencia cercana desde Lola Mora y Brasil, con mirada comunitaria.</p>
                  </article>
                </section>

                <section id="novedades" className="home-feature-section">
                  <div className="home-section-heading">
                    <h2>Novedades</h2>
                    {novedadesSlides.length > 1 && (
                      <div className="home-heading-controls" aria-label="Controles de novedades">
                        <button type="button" onClick={() => moveSlide(-1)} aria-label="Ver novedad anterior">
                          ‹
                        </button>
                        <button type="button" onClick={() => moveSlide(1)} aria-label="Ver novedad siguiente">
                          ›
                        </button>
                      </div>
                    )}
                  </div>
                  {novedadesSlides.length > 0 && (
                    <div className="home-carousel" aria-label="Carrusel de novedades">
                      <div className="home-carousel-frame">
                        <img
                          src={activeNovedad?.imagen}
                          alt={activeNovedad?.titulo}
                          className="home-carousel-image"
                        />
                        <div className="home-carousel-caption">
                          <span>Novedad destacada</span>
                          <h3>{activeNovedad?.titulo}</h3>
                          <p>{activeNovedad?.desc}</p>
                          <Link to="/sumate">Participar</Link>
                        </div>
                      </div>
                      <div className="home-carousel-dots" aria-label="Seleccionar novedad">
                        {novedadesSlides.map((slide, index) => (
                          <button
                            type="button"
                            key={slide.id || index}
                            className={`home-carousel-dot ${activeSlideIndex === index ? 'active' : ''}`}
                            onClick={() => setActiveSlide(index)}
                            aria-label={`Ver ${slide.titulo}`}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </section>

                <section className="home-services-section" aria-labelledby="acciones-title">
                  <div className="home-section-heading">
                    <h2 id="acciones-title">Acciones comunitarias</h2>
                    <Link className="home-more-link" to="/proyectos">Ver más</Link>
                  </div>
                  <div className="home-services-grid">
                    {novedadesSlides.slice(0, 3).map((item, index) => (
                      <article className="home-service-card" key={item.id || index}>
                        <img src={item.imagen} alt={item.titulo} />
                        <div>
                          <span>{String(index + 1).padStart(2, '0')}</span>
                          <h3>{item.titulo}</h3>
                          <p>{item.desc}</p>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              </main>

              <section id="contacto" className="home-dark-section">
                <div className="home-dark-card">
                  <div className="home-dark-info">
                    <span>Territorio</span>
                    <h2>Construimos comunidad desde el encuentro cotidiano</h2>
                    <p>
                      Nos encontramos en {content.contactAddress || defaultContent.contactAddress}.
                      Desde allí coordinamos campañas, talleres y actividades abiertas.
                    </p>
                    <ul className="home-benefits">
                      <li>Campañas solidarias</li>
                      <li>Talleres y acompañamiento</li>
                      <li>Agenda comunitaria</li>
                    </ul>
                  </div>
                  <div
                    className="home-dark-map"
                    style={{ backgroundImage: `url('${heroBackground}')` }}
                  >
                    <iframe
                      title="Mapa de ubicación Fundación Construir Juntos"
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3559.432658428469!2d-65.313437!3d-26.815234!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94225d3ad0971b31%3A0x33e5c94c9a544f80!2sYerba%20Buena%2C%20Tucum%C3%A1n!5e0!3m2!1ses!2sar!4v1710880000000!5m2!1ses!2sar"
                      width="100%"
                      height="400"
                      style={{ border: 0 }}
                      allowFullScreen=""
                      loading="lazy"
                    ></iframe>
                    <div className="home-map-label">
                      <span>Dirección</span>
                      <strong>{content.contactAddress || defaultContent.contactAddress}</strong>
                    </div>
                  </div>
                </div>

                <div className="home-events-panel">
                  <div className="home-section-heading home-section-heading-light">
                    <h2>Próximos eventos</h2>
                    <Link className="home-more-link" to="/contacto">Consultar</Link>
                  </div>
                  <div className="home-events-grid">
                    {(visibleEventos.length ? visibleEventos : eventosData.slice(0, 4)).map((ev) => (
                      <article key={ev.id} className="evento-item-mini">
                        <div className="evento-fecha-mini">
                          <span className="ev-dia">{formatEventDay(ev.fecha)}</span>
                          <span className="ev-mes">{formatEventMonth(ev.fecha)}</span>
                        </div>
                        <div className="evento-info">
                          <h4>{ev.titulo}</h4>
                          <p>{ev.lugar}</p>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              </section>
            </>
          }
        />

        {/* OTRAS PÁGINAS */}
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/proyectos" element={<Proyectos />} />
        <Route path="/cursos" element={<Cursos />} />
        <Route path="/sumate" element={<Sumate />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/admin" element={<Admin user={user} content={content} loading={loading} onSave={handleSaveContent} />} />
      </Routes>

      <footer className="footer">
        <p>{content.footerText || defaultContent.footerText}</p>
      </footer>
    </div>
  );
}

export default App;
