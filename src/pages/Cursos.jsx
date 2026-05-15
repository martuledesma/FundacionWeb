import React, { useEffect, useState } from 'react';
import { getCursosContent } from '../firebase';
import pro2 from '../Assets/pro2.PNG';
import pro3 from '../Assets/pro3.PNG';
import pro4 from '../Assets/pro4.PNG';

const defaultCourses = [
  {
    id: 1,
    nombre: 'Taller de reciclado',
    descripcion: 'Encuentros prácticos para aprender a reutilizar materiales y cuidar el ambiente desde casa.',
    imagen: pro2,
    fecha: 'Sábados',
    lugar: 'Sede de la fundación',
    estado: 'Activo',
    link: '',
  },
  {
    id: 2,
    nombre: 'Apoyo escolar',
    descripcion: 'Acompañamiento educativo para niños, niñas y adolescentes de la comunidad.',
    imagen: pro3,
    fecha: 'Durante la semana',
    lugar: 'Yerba Buena',
    estado: 'Activo',
    link: '',
  },
  {
    id: 3,
    nombre: 'Huerta y alimentación saludable',
    descripcion: 'Talleres para aprender técnicas básicas de huerta y promover hábitos saludables.',
    imagen: pro4,
    fecha: 'Próximamente',
    lugar: 'A confirmar',
    estado: 'Próximamente',
    link: '',
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

const Cursos = () => {
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const data = await getCursosContent();
        if (data) {
          setContent(data);
        }
      } catch (error) {
        console.error('Error loading cursos content:', error);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, []);

  const courses = content.items?.length ? content.items : defaultCourses;

  if (loading) {
    return (
      <div className="section">
        <p>Cargando contenido...</p>
      </div>
    );
  }

  return (
    <div className="cursos-page">
      <header className="page-hero">
        <div className="page-hero-content">
          <h1>{content.title || 'Cursos y talleres'}</h1>
          <p>
            {content.heroSubtitle || 'Espacios de aprendizaje, encuentro y crecimiento para la comunidad.'}
          </p>
        </div>
      </header>

      <section className="page-intro">
        <p>
          {content.introText || 'Estos espacios están pensados para aprender haciendo, compartir saberes y abrir nuevas oportunidades de participación.'}
        </p>
      </section>

      <section className="feature-grid courses-grid" aria-label="Listado de cursos y talleres">
        {courses.map((course, index) => (
          <article className="feature-card course-card" key={course.id || index}>
            {course.imagen && (
              <img src={course.imagen} alt={course.nombre} className="feature-card-img" />
            )}
            <div className="feature-card-content">
              {course.estado && (
                <span className={getStatusClass(course.estado)}>{getStatusLabel(course.estado)}</span>
              )}
              <h2>{course.nombre}</h2>
              <p>{course.descripcion}</p>
              <div className="course-meta">
                {course.fecha && <span>{course.fecha}</span>}
                {course.lugar && <span>{course.lugar}</span>}
              </div>
              {course.link && (
                <a className="btn-small course-link" href={course.link} target="_blank" rel="noreferrer">
                  Inscribirme
                </a>
              )}
            </div>
          </article>
        ))}
      </section>
    </div>
  );
};

export default Cursos;
