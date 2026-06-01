import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { getNosotrosContent } from '../firebase';
import useHeroImageReady from '../hooks/useHeroImageReady';

const defaultClosingValues = ['Servicio', 'Trabajo', 'Impacto'];

function Nosotros() {
  const [content, setContent] = useState({});
  const [contentLoaded, setContentLoaded] = useState(false);
  const [expandedMembers, setExpandedMembers] = useState({});
  const teamTrackRef = useRef(null);

  const toggleMemberExpand = (index) => {
    setExpandedMembers((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const scrollTeam = (direction) => {
    const track = teamTrackRef.current;
    if (!track) return;

    track.scrollBy({
      left: direction * Math.min(track.clientWidth * 0.78, 720),
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    const loadContent = async () => {
      try {
        const data = await getNosotrosContent();
        if (data) {
          setContent(data);
        }
      } catch (error) {
        console.error('Error loading nosotros content:', error);
      } finally {
        setContentLoaded(true);
      }
    };

    loadContent();
  }, []);

  const heroImage = content.heroImage || '';
  const heroReady = useHeroImageReady(heroImage, !contentLoaded);
  const closingValues = Array.from(
    { length: 3 },
    (_, index) => content.closingValues?.[index] || defaultClosingValues[index]
  );

  if (!heroReady) {
    return (
      <div className="page-loader">
        <span>Cargando contenido...</span>
      </div>
    );
  }

  return (
    <div className="nosotros-page">
      <header
        className="nosotros-hero page-hero-photo"
        style={heroImage ? {
          backgroundImage: `linear-gradient(90deg, rgba(18, 24, 28, 0.78), rgba(18, 24, 28, 0.28)), url('${heroImage}')`,
        } : undefined}
      >
        <div className="nosotros-hero-content">
          <div className="page-hero-copy">
            <span className="page-eyebrow">Nosotros</span>
            <h1>{content.title || 'Sobre la Fundación'}</h1>
            <p>
              {content.heroSubtitle || 'Construimos comunidad con compromiso, cercanía y trabajo compartido.'}
            </p>
          </div>
          <div className="page-hero-card">
            <span>Fundación Construir Juntos</span>
            <strong>Cercanía, compromiso y trabajo territorial.</strong>
          </div>
        </div>
      </header>

      {/* Sección del equipo */}
      <section className="team-section team-carousel-section">
        <div className="team-carousel-header">
          <div>
            <span>Nosotros</span>
            <h2>Las personas detrás de cada proyecto</h2>
          </div>
          <div className="team-carousel-controls">
            <button type="button" onClick={() => scrollTeam(-1)} aria-label="Ver integrantes anteriores">
              ←
            </button>
            <button type="button" onClick={() => scrollTeam(1)} aria-label="Ver integrantes siguientes">
              →
            </button>
          </div>
        </div>

        <div className="team-carousel-track" ref={teamTrackRef}>
          <article className="team-carousel-intro">
            <span>Sobre nosotros</span>
            <p>
              {content.content || 'Somos un grupo de vecinos de Yerba Buena trabajando por el bien común...'}
            </p>
            {content.additionalText && <p>{content.additionalText}</p>}
          </article>

          {(content.teamCards || []).map((member, index) => (
            <article
              className={`team-card team-carousel-card ${expandedMembers[index] ? 'is-expanded' : ''}`}
              key={member.id || index}
              tabIndex="0"
              onClick={() => toggleMemberExpand(index)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  toggleMemberExpand(index);
                }
              }}
            >
              {member.imagen && (
                <div className="team-image">
                  <img src={member.imagen} alt={member.nombre} loading="lazy" decoding="async" />
                </div>
              )}
              <div className="team-card-overlay">
                <h3>{member.nombre}</h3>
                <p>{member.descripcion}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="nosotros-closing" aria-label="Cómo trabajamos">
        <div className="nosotros-closing-values">
          {closingValues.map((value, index) => (
            <div key={`${value}-${index}`}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <strong>{value}</strong>
            </div>
          ))}
        </div>
        <div className="nosotros-closing-cta">
          <div>
            <h2>{content.closingTitle || 'Construimos comunidad con acciones concretas'}</h2>
            <p>
              {content.closingText || 'Conocé nuestros proyectos o sumate para acompañar el trabajo de la fundación.'}
            </p>
          </div>
          <div className="nosotros-closing-actions">
            <Link to="/proyectos">
              {content.closingProjectsLabel || 'Conocé nuestros proyectos'}
            </Link>
            <Link to="/sumate">
              {content.closingJoinLabel || 'Sumate'}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Nosotros;
