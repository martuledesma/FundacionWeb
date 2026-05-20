import React, { useEffect, useState } from 'react';
import { getContactoContent } from '../firebase';
import pro4 from '../Assets/pro4.PNG';

const Contacto = () => {
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const data = await getContactoContent();
        if (data) {
          setContent(data);
        }
      } catch (error) {
        console.error('Error loading contacto content:', error);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, []);

  if (loading) {
    return (
      <div className="section">
        <p>Cargando contenido...</p>
      </div>
    );
  }

  const heroImage = content.heroImage || pro4;

  return (
    <div className="contacto-page">
      <header
        className="page-hero page-hero-photo"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(18, 24, 28, 0.78), rgba(18, 24, 28, 0.28)), url('${heroImage}')`,
        }}
      >
        <div className="page-hero-content">
          <div className="page-hero-copy">
            <span className="page-eyebrow">Contacto</span>
            <h1>{content.introTitle || 'Hablemos'}</h1>
            <p>{content.introText || 'Dejanos tu mensaje y nos pondremos en contacto a la brevedad.'}</p>
          </div>
          <div className="page-hero-card">
            <span>Yerba Buena</span>
            <strong>Lola Mora y Brasil, Tucumán.</strong>
          </div>
        </div>
      </header>

      <section className="contact-page-section">
      <div className="split-container">
        {/* LADO IZQUIERDO: FORMULARIO */}
        <div className="split-left">
          <p className="contact-intro">
            {content.introText || 'Dejanos tu mensaje y nos pondremos en contacto a la brevedad.'}
          </p>
          <form className="contacto-form" onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
              <label htmlFor="nombre">{content.nameLabel || 'Nombre Completo'}</label>
              <input type="text" id="nombre" placeholder="Tu nombre..." required />
            </div>

            <div className="form-group">
              <label htmlFor="email">{content.emailLabel || 'Correo Electrónico'}</label>
              <input type="email" id="email" placeholder="ejemplo@correo.com" required />
            </div>

            <div className="form-group">
              <label htmlFor="mensaje">{content.messageLabel || 'Mensaje'}</label>
              <textarea id="mensaje" placeholder="¿Cómo podemos ayudarte?" required></textarea>
            </div>

            <button type="submit" className="btn-nav">{content.buttonText || 'Enviar Mensaje'}</button>
          </form>
        </div>

        {/* LADO DERECHO: DATOS DE LA SEDE */}
        <div className="split-right">
          <div className="info-contacto-card">
            <div className="info-item">
              <h3>📍 Ubicación</h3>
              <p>Lola Mora y Brasil, Yerba Buena, Tucumán.</p>
            </div>

            <div className="info-item">
              <h3>📞 Teléfono</h3>
              <p>+54 381 457-0541</p>
            </div>

            <div className="info-item">
              <h3>📧 Email</h3>
              <p>contacto@fundacionconstruirjuntos.org</p>
            </div>

            <div className="info-item">
              <h3>⏰ Horarios de Atención</h3>
              <p>Lunes a Viernes: 09:00 a 18:00 hs</p>
            </div>
          </div>
        </div>
      </div>
      </section>
    </div>
  );
};

export default Contacto;
