import React, { useEffect, useState } from 'react';
import { getProyectosContent } from '../firebase';
import useHeroImageReady from '../hooks/useHeroImageReady';

const defaultProjects = [
  {
    id: 1,
    titulo: 'Acompañamiento escolar',
    descripcion: 'Espacios de apoyo para fortalecer trayectorias educativas y acompañar a familias de la comunidad.',
    imagen: '',
    estado: 'Activo',
  },
  {
    id: 2,
    titulo: 'Campañas solidarias',
    descripcion: 'Colectas de alimentos, ropa y útiles para responder a necesidades concretas del territorio.',
    imagen: '',
    estado: 'Activo',
  },
  {
    id: 3,
    titulo: 'Huerta comunitaria',
    descripcion: 'Un proyecto de aprendizaje, producción y encuentro para promover hábitos saludables.',
    imagen: '',
    estado: 'Próximamente',
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

  const toggleProjectExpand = (index) => {
    setExpandedProjects((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  useEffect(() => {
    const loadContent = async () => {
      try {
        const data = await getProyectosContent();
        if (data) {
          setContent(data);
        }
      } catch (error) {
        console.error('Error loading proyectos content:', error);
      } finally {
        setContentLoaded(true);
      }
    };

    loadContent();
  }, []);

  const projects = content.items?.length ? content.items : defaultProjects;
  const heroImage = content.heroImage || projects.find((project) => project.imagen)?.imagen || '';
  const heroReady = useHeroImageReady(heroImage, !contentLoaded);

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
            <h1>{content.title || 'Conocé nuestros proyectos'}</h1>
            <p>
              {content.heroSubtitle || 'Impulsamos iniciativas que acompañan, fortalecen y generan oportunidades en la comunidad.'}
            </p>
          </div>
          <div className="page-hero-card">
            <span>{projects.length}+ iniciativas</span>
            <strong>Acciones sostenidas junto a vecinos, instituciones y voluntarios.</strong>
          </div>
        </div>
      </header>

      <section className="page-intro">
        <p>
          {content.introText || 'Cada proyecto nace de escuchar necesidades concretas y trabajar junto a vecinos, instituciones y voluntarios para construir respuestas sostenidas.'}
        </p>
      </section>

      <section className="feature-grid" aria-label="Listado de proyectos">
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
      </section>
    </div>
  );
};

export default Proyectos;
