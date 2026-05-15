import React, { useEffect, useState } from 'react';
import { getSumateContent } from '../firebase';
import pro1 from '../Assets/pro1.PNG';
import pro2 from '../Assets/pro2.PNG';
import pro3 from '../Assets/pro3.PNG';
import pro4 from '../Assets/pro4.PNG';

const carouselImages = [
  { src: pro1, alt: 'Actividad comunitaria de la fundación' },
  { src: pro2, alt: 'Campaña solidaria de la fundación' },
  { src: pro3, alt: 'Voluntariado y acompañamiento comunitario' },
  { src: pro4, alt: 'Acción territorial de la fundación' },
];

const Sumate = () => {
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const editableCarouselImages = (content.carouselImages || [])
    .filter((image) => image?.url)
    .map((image, index) => ({
      src: image.url,
      alt: image.alt || `Foto ${index + 1} de la fundación`,
    }));
  const visibleCarouselImages = editableCarouselImages.length > 0 ? editableCarouselImages : carouselImages;

  const goToPreviousSlide = () => {
    setActiveSlide((prev) => (prev === 0 ? visibleCarouselImages.length - 1 : prev - 1));
  };

  const goToNextSlide = () => {
    setActiveSlide((prev) => (prev === visibleCarouselImages.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    const loadContent = async () => {
      try {
        const data = await getSumateContent();
        if (data) {
          setContent(data);
        }
      } catch (error) {
        console.error('Error loading sumate content:', error);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, []);

  useEffect(() => {
    if (activeSlide >= visibleCarouselImages.length) {
      setActiveSlide(0);
    }
  }, [activeSlide, visibleCarouselImages.length]);

  useEffect(() => {
    if (!isFormOpen) {
      return undefined;
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsFormOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isFormOpen]);

  if (loading) {
    return (
      <div className="section">
        <p>Cargando contenido...</p>
      </div>
    );
  }

  return (
    <div className="sumate-page">
      <header className="sumate-hero">
        <div className="sumate-hero-content">
          <h1>{content.title || 'Sumate a la Fundación'}</h1>
          <p>
            {content.heroSubtitle || 'Tu tiempo, tu ayuda o tu aporte pueden transformar una realidad cercana.'}
          </p>
        </div>
      </header>

      <section className="sumate-content">
        <div className="sumate-text">
          <p>
            {content.content || 'Tu ayuda es fundamental para seguir transformando Yerba Buena. Podés colaborar como voluntario o con donaciones.'}
          </p>
          {content.contactInfo && (
            <p>
              {content.contactInfo}
            </p>
          )}
        </div>
      </section>

      <section className="sumate-options" aria-label="Formas de participar">
        <article className="sumate-option">
          <span className="sumate-option-icon">V</span>
          <h3>Voluntariado</h3>
          <p>Acompañá actividades, talleres y acciones comunitarias con tu tiempo.</p>
        </article>
        <article className="sumate-option">
          <span className="sumate-option-icon">D</span>
          <h3>Donaciones</h3>
          <p>Sumá alimentos, ropa, útiles o recursos para sostener los proyectos.</p>
        </article>
        <article className="sumate-option">
          <span className="sumate-option-icon">+</span>
          <h3>Difusión</h3>
          <p>Ayudanos a llegar a más familias compartiendo nuestras campañas.</p>
        </article>
      </section>

      <section className="sumate-gallery" aria-label="Fotos de la fundación">
        <div className="sumate-carousel">
          <button
            type="button"
            className="carousel-control carousel-control-prev"
            onClick={goToPreviousSlide}
            aria-label="Ver imagen anterior"
          >
            ‹
          </button>
          <img
            src={visibleCarouselImages[activeSlide].src}
            alt={visibleCarouselImages[activeSlide].alt}
            className="sumate-carousel-image"
          />
          <button
            type="button"
            className="carousel-control carousel-control-next"
            onClick={goToNextSlide}
            aria-label="Ver imagen siguiente"
          >
            ›
          </button>
          <div className="carousel-dots" aria-label="Seleccionar imagen">
            {visibleCarouselImages.map((image, index) => (
              <button
                key={`${image.src}-${index}`}
                type="button"
                className={index === activeSlide ? 'carousel-dot active' : 'carousel-dot'}
                onClick={() => setActiveSlide(index)}
                aria-label={`Ver imagen ${index + 1}`}
              />
            ))}
          </div>
        </div>
        <div className="sumate-gallery-action">
          <h2>¿Querés participar?</h2>
          <p>Completá tus datos y nos pondremos en contacto para coordinar cómo podés sumarte.</p>
          <button type="button" className="btn-nav sumate-form-button" onClick={() => setIsFormOpen(true)}>
            Completar formulario
          </button>
        </div>
      </section>

      {isFormOpen && (
        <div className="form-modal" role="dialog" aria-modal="true" aria-labelledby="sumate-form-title">
          <div className="form-modal-backdrop" onClick={() => setIsFormOpen(false)} />
          <div className="form-modal-content">
            <button
              type="button"
              className="form-modal-close"
              onClick={() => setIsFormOpen(false)}
              aria-label="Cerrar formulario"
            >
              ×
            </button>
            <h2 id="sumate-form-title">Formulario de Inscripción</h2>
            <div className="form-container modal-form-container">
              <iframe
                src="https://docs.google.com/forms/d/e/1FAIpQLSdAJZBc6HjZr7HJBFH4cGfKiOHR00rD_cVbP07BwireSUuyDA/viewform?embedded=true"
                width="640"
                height="1211"
                frameBorder="0"
                marginHeight="0"
                marginWidth="0"
                title="Formulario de inscripción Fundación Construir Juntos"
              >
                Cargando…
              </iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sumate;
