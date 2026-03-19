import React, { useState } from 'react';

const InstagramFeed = () => {
  // Simulamos lo que nos devolvería la API de Instagram
  const [fotos] = useState([
    { id: 1, url: 'https://via.placeholder.com/300', caption: 'Colecta en Yerba Buena' },
    { id: 2, url: 'https://via.placeholder.com/300', caption: 'Campaña Escolar 2026' },
    { id: 3, url: 'https://via.placeholder.com/300', caption: 'Evento en Lola Mora y Brasil' }
  ]);

  return (
    <section className="section">
      <h2 className="section-title">Últimas Actividades</h2>
      <div className="grid">
        {fotos.map(foto => (
          <div key={foto.id} className="card">
            <img src={foto.url} alt={foto.caption} style={{width: '100%', borderRadius: '10px'}} />
            <p style={{marginTop: '10px', fontWeight: 'bold'}}>{foto.caption}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default InstagramFeed;