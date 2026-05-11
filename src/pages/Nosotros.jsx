import React, { useEffect, useState } from 'react';
import { getNosotrosContent } from '../firebase';

function Nosotros() {
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(true);
  const [expandedMembers, setExpandedMembers] = useState({});

  const toggleMemberExpand = (index) => {
    setExpandedMembers((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  useEffect(() => {
    const loadContent = async () => {
      try {
        const data = await getNosotrosContent();
        if (data) {
          setContent(data);
        }
      } catch (error) {
        console.error('Error loading nosotros content:', error);
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
                  <p className={expandedMembers[index] ? 'team-description expanded' : 'team-description'}>
                    {member.descripcion}
                  </p>
                  {member.descripcion && member.descripcion.length > 140 && (
                    <button
                      type="button"
                      className="btn-small team-toggle"
                      onClick={() => toggleMemberExpand(index)}
                    >
                      {expandedMembers[index] ? 'Ver menos' : 'Ver más'}
                    </button>
                  )}
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