import React, { useEffect, useState } from 'react';
import { getSumateContent } from '../firebase';

const Sumate = () => {
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="section">
        <p>Cargando contenido...</p>
      </div>
    );
  }

  return (
    <div className="section">
      <h1 className="section-title">{content.title || 'Sumate a la Fundación'}</h1>

      {/* Sección de texto informativo */}
      <div className="flex-col">
        <div className="card-wide">
          <div className="card-wide-content">
            <p style={{ whiteSpace: 'pre-wrap' }}>
              {content.content || 'Tu ayuda es fundamental para seguir transformando Yerba Buena. Podés colaborar como voluntario o con donaciones.'}
            </p>
            {content.contactInfo && (
              <p style={{ marginTop: '20px', whiteSpace: 'pre-wrap' }}>
                {content.contactInfo}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Sección del formulario */}
      <div className="form-section">
        <h2 className="section-subtitle">Formulario de Inscripción</h2>
        <div className="form-container">
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
  );
};

export default Sumate;