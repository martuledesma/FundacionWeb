import React, { useEffect, useRef, useState } from 'react';
import { getCursosContent } from '../firebase';
import useHeroImageReady from '../hooks/useHeroImageReady';

const defaultCourses = [
  {
    id: 1,
    nombre: 'Taller de reciclado',
    descripcion: 'Encuentros prácticos para aprender a reutilizar materiales y cuidar el ambiente desde casa.',
    imagen: '',
    fecha: 'Sábados',
    lugar: 'Sede de la fundación',
    estado: 'Activo',
    link: '',
  },
  {
    id: 2,
    nombre: 'Apoyo escolar',
    descripcion: 'Acompañamiento educativo para niños, niñas y adolescentes de la comunidad.',
    imagen: '',
    fecha: 'Durante la semana',
    lugar: 'Yerba Buena',
    estado: 'Activo',
    link: '',
  },
  {
    id: 3,
    nombre: 'Huerta y alimentación saludable',
    descripcion: 'Talleres para aprender técnicas básicas de huerta y promover hábitos saludables.',
    imagen: '',
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

const getStatusPriority = (status = '') => {
  const normalized = status.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  if (normalized.includes('ultimos cupos')) return 0;
  if (normalized.includes('activo')) return 1;
  if (normalized.includes('finalizado')) return 3;
  return 2;
};

const getStatusLabel = (status) => (
  status === 'Últimos cupos' ? '⚠ Últimos cupos' : status
);

const Cursos = () => {
  const [content, setContent] = useState({});
  const [contentLoaded, setContentLoaded] = useState(false);
  const [expandedCourses, setExpandedCourses] = useState({});
  const coursesTrackRef = useRef(null);
  const galleryTrackRef = useRef(null);

  const toggleCourseExpand = (index) => {
    setExpandedCourses((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const scrollCourses = (direction) => {
    const track = coursesTrackRef.current;
    if (!track) return;

    track.scrollBy({
      left: direction * Math.min(track.clientWidth * 0.78, 720),
      behavior: 'smooth',
    });
  };

  const scrollGallery = (direction) => {
    const track = galleryTrackRef.current;
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
        const data = await getCursosContent();
        if (isMounted && data) {
          setContent(data);
        }
      } catch (error) {
        console.error('Error loading cursos content:', error);
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

  const courses = (content.items?.length ? content.items : defaultCourses)
    .map((course, index) => ({ course, index }))
    .sort((a, b) => getStatusPriority(a.course.estado) - getStatusPriority(b.course.estado) || a.index - b.index)
    .map(({ course }) => course);
  const configuredGalleryImages = (content.galleryImages || [])
    .filter((image) => image?.url)
    .slice(0, 3);
  const fallbackGalleryImages = courses
    .filter((course) => course.imagen)
    .slice(0, 3)
    .map((course) => ({
      url: course.imagen,
      alt: course.nombre,
    }));
  const galleryImages = configuredGalleryImages.length ? configuredGalleryImages : fallbackGalleryImages;
  const heroImage = content.heroImage || courses.find((course) => course.imagen)?.imagen || '';
  const heroReady = useHeroImageReady(heroImage, !contentLoaded);

  if (!heroReady) {
    return (
      <div className="page-loader">
        <span>Cargando contenido...</span>
      </div>
    );
  }

  return (
    <div className="cursos-page">
      <header
        className="page-hero page-hero-photo"
        style={heroImage ? {
          backgroundImage: `linear-gradient(90deg, rgba(13, 76, 111, 0.54), rgba(255, 255, 255, 0.08) 46%, rgba(246, 189, 79, 0.16)), url('${heroImage}')`,
        } : undefined}
      >
        <div className="page-hero-content">
          <div className="page-hero-copy">
            <span className="page-eyebrow">{content.heroEyebrow || 'Cursos y talleres'}</span>
            <h1>{content.title || 'Cursos y talleres'}</h1>
            <p>
              {content.heroSubtitle || 'Espacios de aprendizaje, encuentro y crecimiento para la comunidad.'}
            </p>
          </div>
          <div className="page-hero-card">
            <span>{content.heroCardEyebrow || 'Aprender haciendo'}</span>
            <strong>{content.heroCardText || 'Encuentros prácticos para compartir saberes y abrir oportunidades.'}</strong>
          </div>
        </div>
      </header>

      <section className="courses-carousel-section" aria-label="Listado de cursos y talleres">
        <div className="courses-carousel-header">
          <div>
            <span>{content.carouselEyebrow || 'Aprender haciendo'}</span>
            <h2 className="display-subtitle">{content.carouselTitle || 'Explorá nuestros cursos y talleres'}</h2>
          </div>
          <div className="courses-carousel-controls">
            <button type="button" onClick={() => scrollCourses(-1)} aria-label="Ver cursos anteriores">
              ←
            </button>
            <button type="button" onClick={() => scrollCourses(1)} aria-label="Ver cursos siguientes">
              →
            </button>
          </div>
        </div>

        <div className="courses-carousel-track" ref={coursesTrackRef}>
          {courses.map((course, index) => (
            <article
              className={`course-carousel-card ${expandedCourses[index] ? 'is-expanded' : ''}`}
              key={course.id || index}
              tabIndex="0"
              onClick={() => toggleCourseExpand(index)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  toggleCourseExpand(index);
                }
              }}
            >
              {course.imagen && (
                <img src={course.imagen} alt={course.nombre} loading="lazy" decoding="async" />
              )}
              <div className="course-carousel-overlay">
                {course.estado && (
                  <span className={getStatusClass(course.estado)}>{getStatusLabel(course.estado)}</span>
                )}
                <h2>{course.nombre}</h2>
                <div className="course-carousel-details">
                  <p>{course.descripcion}</p>
                  <div className="course-meta">
                    {course.fecha && <span>{course.fecha}</span>}
                    {course.lugar && <span>{course.lugar}</span>}
                  </div>
                  {course.link && (
                    <a
                      className="course-carousel-link"
                      href={course.link}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(event) => event.stopPropagation()}
                    >
                      {content.enrollmentLabel || 'Inscribirme'}
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {galleryImages.length > 0 && (
        <section className="courses-gallery-section" aria-label="Galería de cursos y talleres">
          <div className="courses-gallery-header">
            <div>
              <span>{content.galleryEyebrow || 'Momentos compartidos'}</span>
              <h2 className="display-subtitle">{content.galleryTitle || 'Aprender también es encontrarnos'}</h2>
            </div>
            <div className="courses-carousel-controls">
              <button type="button" onClick={() => scrollGallery(-1)} aria-label="Ver fotos anteriores">
                ←
              </button>
              <button type="button" onClick={() => scrollGallery(1)} aria-label="Ver fotos siguientes">
                →
              </button>
            </div>
          </div>

          <div className="courses-gallery-track" ref={galleryTrackRef}>
            {galleryImages.map((image, index) => (
              <figure className="courses-gallery-card" key={image.id || `${image.url}-${index}`}>
                <img
                  src={image.url}
                  alt={image.alt || `Foto ${index + 1} de cursos y talleres`}
                  loading="lazy"
                  decoding="async"
                />
              </figure>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Cursos;
