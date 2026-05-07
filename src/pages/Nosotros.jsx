import React, { useEffect, useState } from 'react';
import { subscribeNosotrosContent } from '../firebase';

function Nosotros() {
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeNosotrosContent(
      (snapshot) => {
        if (snapshot.exists()) {
          setContent(snapshot.data());
        }
        setLoading(false);
      },
      (error) => {
        console.error('Error loading nosotros content:', error);
        setLoading(false);
      }
    );

    return unsubscribe;
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
      <h1 className="section-title">{content.title || 'Sobre la Fundación'}</h1>

      {/* Contenido principal */}
      <div className="flex-col">
        <div className="card-wide">
          <div className="card-wide-content">
            <p style={{ whiteSpace: 'pre-wrap' }}>
              {content.content || 'Somos un grupo de vecinos de Yerba Buena trabajando por el bien común...'}
            </p>
            {content.additionalText && (
              <p style={{ marginTop: '20px', whiteSpace: 'pre-wrap' }}>
                {content.additionalText}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Sección del equipo */}
      {content.teamCards && content.teamCards.length > 0 && (
        <div className="team-section">
          <h2 className="section-subtitle">Nuestro Equipo</h2>
          <div className="team-grid">
            {content.teamCards.map((member, index) => (
              <div className="team-card" key={member.id || index}>
                {member.imagen && (
                  <div className="team-image">
                    <img src={member.imagen} alt={member.nombre} />
                  </div>
                )}
                <div className="team-info">
                  <h3>{member.nombre}</h3>
                  <p>{member.descripcion}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Nosotros;