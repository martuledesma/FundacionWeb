import React, { useEffect, useRef, useState } from 'react';
import { getProyectosContent } from '../firebase';
import useHeroImageReady from '../hooks/useHeroImageReady';

const defaultProjects = [
  {
    id: 1,
    titulo: 'Enfocados',
    descripcion: 'Atención visual integral y gratuita, con acceso a anteojos recetados a costo social.',
    imagen: '',
    estado: 'Activo',
  },
  {
    id: 2,
    titulo: 'Escuela de oficios',
    descripcion: 'Cursos y talleres de oficios activos durante todo el año para abrir oportunidades concretas.',
    imagen: '',
    estado: 'Activo',
  },
  {
    id: 3,
    titulo: 'Jornadas de bienestar animal',
    descripcion: 'Vacunación y desparasitación para mascotas, acercando cuidado preventivo a la comunidad.',
    imagen: '',
    estado: 'Activo',
  },
];

const projectAreas = [
  {
    title: 'Educación e infraestructura',
    text: 'Fichas médicas escolares, escuelas refaccionadas y acompañamiento a instituciones educativas.',
  },
  {
    title: 'Oficios y oportunidades',
    text: 'Escuela de oficios y cursos durante todo el año para fortalecer la autonomía de jóvenes y adultos.',
  },
  {
    title: 'Salud visual',
    text: 'Proyecto Enfocados: atención visual integral y gratuita, más anteojos recetados a costo social.',
  },
  {
    title: 'Bienestar animal',
    text: 'Jornadas de vacunación y desparasitación para mascotas en el territorio.',
  },
];

const getStatusClass = (status = '') => {
  const normalized = status.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  if (normalized.includes('ultimos cupos')) return 'feature-status status-warning';
  if (normalized.includes('finalizado')) return 'feature-status status-finished';
  return 'feature-status status-active';
};

const getStatusLabel = (status) => (
  status === 'Últimos cupos' ? '⚠ Últimos cupos' : status
);

const Proyectos = () => {
  const [content, setContent] = useState({});
  const [contentLoaded, setContentLoaded] = useState(false);
  const [expandedProjects, setExpandedProjects] = useState({});
  const areasTrackRef = useRef(null);

  const toggleProjectExpand = (index) => {
    setExpandedProjects((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const scrollAreas = (direction) => {
    const track = areasTrackRef.current;
    if (!track) return;

    track.scrollBy({
      left: direction * Math.min(track.clientWidth * 0.82, 760),
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    let isMounted = true;
    const fallbackTimer = window.setTimeout(() => {
      if (isMounted) setContentLoaded(true);
    }, 4500);

    const loadContent = async () => {
      try {
        const data = await getProyectosContent();
        if (isMounted && data) {
          setContent(data);
        }
      } catch (error) {
        console.error('Error loading proyectos content:', error);
      } finally {
        if (isMounted) {
          window.clearTimeout(fallbackTimer);
          setContentLoaded(true);
        }
      }
    };

    loadContent();

    return () => {
      isMounted = false;
      window.clearTimeout(fallbackTimer);
    };
  }, []);

  const projects = content.items?.length ? content.items : defaultProjects;
  const heroImage = content.heroImage || projects.find((project) => project.imagen)?.imagen || '';
  const heroReady = useHeroImageReady(heroImage, !contentLoaded);

  useEffect(() => {
    if (!heroReady) return undefined;

    const track = areasTrackRef.current;
    if (!track) return undefined;

    const interval = window.setInterval(() => {
      const maxScroll = track.scrollWidth - track.clientWidth;
      if (maxScroll <= 0) return;

      if (track.scrollLeft >= maxScroll - 8) {
        track.scrollTo({ left: 0, behavior: 'smooth' });
        return;
      }

      track.scrollBy({ left: 4, behavior: 'auto' });
    }, 1400);

    return () => window.clearInterval(interval);
  }, [heroReady]);

  if (!heroReady) {
    return (
      <div className="page-loader">
        <span>Cargando contenido...</span>
      </div>
    );
  }

  return (
    <div className="proyectos-page">
      <header
        className="page-hero page-hero-photo"
        style={heroImage ? {
          backgroundImage: `linear-gradient(90deg, rgba(18, 24, 28, 0.78), rgba(18, 24, 28, 0.28)), url('${heroImage}')`,
        } : undefined}
      >
        <div className="page-hero-content">
          <div className="page-hero-copy">
            <span className="page-eyebrow">Proyectos</span>
            <h1>Donde hay una necesidad nace un proyecto.</h1>
            <p>
              {content.heroSubtitle || 'Impulsamos respuestas concretas en educación, salud, oficios y cuidado comunitario.'}
            </p>
          </div>
          <div className="page-hero-card">
            <span>Impacto territorial</span>
            <strong>Acciones sostenidas junto a escuelas, familias, vecinos e instituciones.</strong>
          </div>
        </div>
      </header>

      <section className="page-intro">
        <p>
          {content.introText || 'Somos una fundación que transforma necesidades concretas en proyectos: cursos de oficios, jornadas de vacunación y desparasitación para mascotas, atención visual gratuita y acompañamiento a escuelas.'}
        </p>
      </section>

      <section className="project-areas-section" aria-labelledby="project-areas-title">
        <div className="project-areas-header">
          <div className="project-section-heading">
            <span>Áreas de trabajo</span>
            <h2 id="project-areas-title" className="display-subtitle">
              <span className="title-line title-line-blue">Proyectos enfocados</span>
              <span className="title-line title-line-white">en necesidades reales</span>
            </h2>
          </div>
          <div className="project-carousel-controls">
            <button type="button" onClick={() => scrollAreas(-1)} aria-label="Ver áreas anteriores">
              ←
            </button>
            <button type="button" onClick={() => scrollAreas(1)} aria-label="Ver áreas siguientes">
              →
            </button>
          </div>
        </div>
        <div className="project-areas-carousel" ref={areasTrackRef}>
          {projectAreas.map((area, index) => (
            <article className="project-area-card" key={area.title}>
              <span className="project-area-number">{String(index + 1).padStart(2, '0')}</span>
              <h3>{area.title}</h3>
              <p>{area.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="projects-list-section" aria-labelledby="projects-list-title">
        <div className="project-section-heading">
          <span>En marcha</span>
          <h2 id="projects-list-title" className="display-subtitle">
            <span className="title-line title-line-blue">Proyectos</span>
            <span className="title-line title-line-white">activos</span>
          </h2>
        </div>
        <div className="feature-grid proyectos-feature-grid">
          {projects.map((project, index) => (
            <article className="feature-card" key={project.id || index}>
              {project.imagen && (
                <img src={project.imagen} alt={project.titulo} className="feature-card-img" loading="lazy" decoding="async" />
              )}
              <div className="feature-card-content">
                {project.estado && (
                  <span className={getStatusClass(project.estado)}>{getStatusLabel(project.estado)}</span>
                )}
                <h2>{project.titulo}</h2>
                <p className={expandedProjects[index] ? 'feature-description expanded' : 'feature-description'}>
                  {project.descripcion}
                </p>
                {project.descripcion && (
                  <button
                    type="button"
                    className="btn-small feature-toggle"
                    onClick={() => toggleProjectExpand(index)}
                  >
                    {expandedProjects[index] ? 'Ver menos' : 'Ver más'}
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Proyectos;
