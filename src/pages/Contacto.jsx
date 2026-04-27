import React from 'react';

const Contacto = () => {
  return (
    <div className="page-container">
      <h2 className="page-title">Contacto</h2>
      
      <div className="split-container">
        {/* LADO IZQUIERDO: FORMULARIO */}
        <div className="split-left">
          <p className="contact-intro">Dejanos tu mensaje y nos pondremos en contacto a la brevedad.</p>
          <form className="contacto-form" onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
              <label htmlFor="nombre">Nombre Completo</label>
              <input type="text" id="nombre" placeholder="Tu nombre..." required />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Correo Electrónico</label>
              <input type="email" id="email" placeholder="ejemplo@correo.com" required />
            </div>
            
            <div className="form-group">
              <label htmlFor="mensaje">Mensaje</label>
              <textarea id="mensaje" placeholder="¿Cómo podemos ayudarte?" required></textarea>
            </div>
            
            <button type="submit" className="btn-nav">Enviar Mensaje</button>
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
    </div>
  );
};

export default Contacto;