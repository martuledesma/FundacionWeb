import React, { useEffect, useState } from 'react';
import { getProyectosContent } from '../firebase';
import pro1 from '../Assets/pro1.PNG';
import pro2 from '../Assets/pro2.PNG';
import pro3 from '../Assets/pro3.PNG';

const defaultProjects = [
  {
    id: 1,
    titulo: 'Acompañamiento escolar',
    descripcion: 'Espacios de apoyo para fortalecer trayectorias educativas y acompañar a familias de la comunidad.',
    imagen: pro1,
    estado: 'Activo',
  },
  {
    id: 2,
    titulo: 'Campañas solidarias',
    descripcion: 'Colectas de alimentos, ropa y útiles para responder a necesidades concretas del territorio.',
    imagen: pro2,
    estado: 'Activo',
  },
  {
    id: 3,
    titulo: 'Huerta comunitaria',
    descripcion: 'Un proyecto de aprendizaje, producción y encuentro para promover hábitos saludables.',
    imagen: pro3,
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
  const [loading, setLoading] = useState(true);

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
        setLoading(false);
      }
    };

    loadContent();
  }, []);

  const projects = content.items?.length ? content.items : defaultProjects;

  if (loading) {
    return (
      <div className="section">
        <p>Cargando contenido...</p>
      </div>
    );
  }

  return (
    <div className="proyectos-page">
      <header className="page-hero">
        <div className="page-hero-content">
          <h1>{content.title || 'Conocé nuestros proyectos'}</h1>
          <p>
            {content.heroSubtitle || 'Impulsamos iniciativas que acompañan, fortalecen y generan oportunidades en la comunidad.'}
          </p>
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
              <img src={project.imagen} alt={project.titulo} className="feature-card-img" />
            )}
            <div className="feature-card-content">
              {project.estado && (
                <span className={getStatusClass(project.estado)}>{getStatusLabel(project.estado)}</span>
              )}
              <h2>{project.titulo}</h2>
              <p>{project.descripcion}</p>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
};

export default Proyectos;
