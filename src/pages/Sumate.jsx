import React, { useEffect, useState } from 'react';
import { getSumateContent } from '../firebase';
import useHeroImageReady from '../hooks/useHeroImageReady';

const Sumate = () => {
  const [content, setContent] = useState({});
  const [contentLoaded, setContentLoaded] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const editableCarouselImages = (content.carouselImages || [])
    .filter((image) => image?.url)
    .map((image, index) => ({
      src: image.url,
      alt: image.alt || `Foto ${index + 1} de la fundación`,
    }));
  const visibleCarouselImages = editableCarouselImages;

  const goToPreviousSlide = () => {
    if (!visibleCarouselImages.length) return;
    setActiveSlide((prev) => (prev === 0 ? visibleCarouselImages.length - 1 : prev - 1));
  };

  const goToNextSlide = () => {
    if (!visibleCarouselImages.length) return;
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
        setContentLoaded(true);
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

  const heroImage = content.heroImage || visibleCarouselImages[0]?.src || '';
  const heroReady = useHeroImageReady(heroImage, !contentLoaded);

  if (!heroReady) {
    return (
      <div className="page-loader">
        <span>Cargando contenido...</span>
      </div>
    );
  }

  return (
    <div className="sumate-page">
      <header
        className="sumate-hero page-hero-photo"
        style={heroImage ? {
          backgroundImage: `linear-gradient(90deg, rgba(13, 76, 111, 0.54), rgba(255, 255, 255, 0.08) 46%, rgba(246, 189, 79, 0.16)), url('${heroImage}')`,
        } : undefined}
      >
        <div className="sumate-hero-content">
          <div className="page-hero-copy">
            <span className="page-eyebrow">Sumate</span>
            <h1>{content.title || 'Sumate a la Fundación'}</h1>
            <p>
              {content.heroSubtitle || 'Tu tiempo, tu ayuda o tu aporte pueden transformar una realidad cercana.'}
            </p>
          </div>
          <div className="page-hero-card">
            <span>Participación</span>
            <strong className="sumate-participation-copy">
              <span>Voluntariado, donaciones y difusión</span>
              <span>para llegar más lejos.</span>
            </strong>
          </div>
        </div>
      </header>

      <section className="sumate-content">
        <div className="sumate-text">
          {content.content ? (
            <p className="sumate-highlight-text">{content.content}</p>
          ) : (
            <p className="sumate-highlight-text" aria-label="Tu ayuda es fundamental para seguir transformando Yerba Buena.">
              <span className="sumate-highlight-line sumate-highlight-blue">
                Tu ayuda es fundamental para seguir transformando Yerba Buena.
              </span>
            </p>
          )}
          {content.contactInfo && (
            <p>
              {content.contactInfo}
            </p>
          )}
        </div>
      </section>

      <section className="sumate-gallery" aria-label="Fotos de la fundación">
        {visibleCarouselImages.length > 0 && (
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
              loading="lazy"
              decoding="async"
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
        )}
        <div className="sumate-gallery-action">
          <h2 className="display-subtitle display-subtitle-dark">
            <span className="title-line title-line-blue">¿Querés</span>
            <span className="title-line title-line-white">participar?</span>
          </h2>
          <div className="sumate-participation-tags" aria-label="Formas de participar">
            <span>Voluntariado</span>
            <span>Donaciones</span>
            <span>Difusión</span>
          </div>
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
