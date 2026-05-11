import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ADMIN_EMAIL,
  logout as firebaseLogout,
  signIn as firebaseSignIn,
  subscribeSiteContent,
  saveSiteContent,
  subscribeNosotrosContent,
  saveNosotrosContent,
  subscribeSumateContent,
  saveSumateContent,
  subscribeContactoContent,
  saveContactoContent,
} from '../firebase';

const Admin = ({ user, content, loading, onSave }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formState, setFormState] = useState(content || {});
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [activeTab, setActiveTab] = useState('homepage');

  const [nosotrosContent, setNosotrosContent] = useState({});
  const [sumateContent, setSumateContent] = useState({});
  const [contactoContent, setContactoContent] = useState({});

  useEffect(() => {
    if (content) {
      setFormState(content);
    }
  }, [content]);

  useEffect(() => {
    const unsubscribeNosotros = subscribeNosotrosContent(
      (snapshot) => {
        setNosotrosContent(snapshot.exists() ? snapshot.data() : { teamCards: [] });
      },
      (error) => console.error('Nosotros content error:', error)
    );

    const unsubscribeSumate = subscribeSumateContent(
      (snapshot) => {
        if (snapshot.exists()) {
          setSumateContent(snapshot.data());
        }
      },
      (error) => console.error('Sumate content error:', error)
    );

    const unsubscribeContacto = subscribeContactoContent(
      (snapshot) => {
        if (snapshot.exists()) {
          setContactoContent(snapshot.data());
        }
      },
      (error) => console.error('Contacto content error:', error)
    );

    return () => {
      unsubscribeNosotros();
      unsubscribeSumate();
      unsubscribeContacto();
    };
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    setError('');
    setSuccessMessage('');

    const emailTrimmed = email.trim();
    const passwordTrimmed = password.trim();

    try {
      await firebaseSignIn(emailTrimmed, passwordTrimmed);
    } catch (err) {
      console.error('Login error:', err);
      const code = err?.code || 'auth/unknown';
      const message = err?.message || 'Error al iniciar sesión. Revisa tu email y contraseña.';
      setError(`Error al iniciar sesión (${code}): ${message}`);
    }
  };

  const handleLogout = async () => {
    await firebaseLogout();
  };

  const updateField = (field, value, page = activeTab) => {
    if (page === 'homepage') {
      setFormState((prev) => ({ ...prev, [field]: value }));
    } else if (page === 'nosotros') {
      setNosotrosContent((prev) => ({ ...prev, [field]: value }));
    } else if (page === 'sumate') {
      setSumateContent((prev) => ({ ...prev, [field]: value }));
    } else if (page === 'contacto') {
      setContactoContent((prev) => ({ ...prev, [field]: value }));
    }
  };

  const updateCard = (index, field, value) => {
    setFormState((prev) => ({
      ...prev,
      cards: prev.cards.map((card, idx) =>
        idx === index ? { ...card, [field]: value } : card
      ),
    }));
  };

  const updateEvent = (index, field, value) => {
    setFormState((prev) => ({
      ...prev,
      events: prev.events.map((event, idx) =>
        idx === index ? { ...event, [field]: value } : event
      ),
    }));
  };

  const updateNosotrosCard = (index, field, value) => {
    setNosotrosContent((prev) => ({
      ...prev,
      teamCards: (prev.teamCards || []).map((card, idx) =>
        idx === index ? { ...card, [field]: value } : card
      ),
    }));
  };



  const addNewCard = () => {
    setFormState((prev) => ({
      ...prev,
      cards: [...(prev.cards || []), { id: Date.now(), titulo: '', desc: '', imagen: '' }],
    }));
  };

  const addNewNosotrosCard = () => {
    setNosotrosContent((prev) => ({
      ...prev,
      teamCards: [...(prev.teamCards || []), { id: Date.now(), nombre: '', descripcion: '', imagen: '' }],
    }));
  };

  const deleteCard = (index) => {
    setFormState((prev) => ({
      ...prev,
      cards: prev.cards.filter((_, idx) => idx !== index),
    }));
  };

  const deleteNosotrosCard = (index) => {
    setNosotrosContent((prev) => ({
      ...prev,
      teamCards: (prev.teamCards || []).filter((_, idx) => idx !== index),
    }));
  };

  const handleSave = async () => {
    setError('');
    setSuccessMessage('');

    try {
      if (activeTab === 'homepage') {
        await saveSiteContent(formState);
      } else if (activeTab === 'nosotros') {
        await saveNosotrosContent(nosotrosContent);
      } else if (activeTab === 'sumate') {
        await saveSumateContent(sumateContent);
      } else if (activeTab === 'contacto') {
        await saveContactoContent(contactoContent);
      }
      setSuccessMessage('El cambio se efectuó correctamente.');
    } catch (err) {
      console.error('Save error:', err);
      setError(`No se pudo guardar. ${err?.message || 'Revisa la conexión o configuración de Firebase.'}`);
    }
  };

  if (loading) {
    return (
      <div className="admin-page">
        <h2>Administrador</h2>
        <p>Cargando datos...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="admin-page">
        <h2>Inicio de sesión de administrador</h2>
        <form className="admin-form" onSubmit={handleLogin}>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label>
            Contraseña
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          <button type="submit" className="btn-nav">
            Iniciar sesión
          </button>

          {error && <p className="form-error">{error}</p>}
        </form>

        <p className="admin-note">
          Solo el administrador podrá modificar las cards, eventos y textos.
        </p>
        <p className="admin-note">
          Asegúrate de habilitar Email/Password en Firebase Auth y de que el usuario exista con el email {ADMIN_EMAIL}.
        </p>

        <Link to="/">Volver a la página principal</Link>
      </div>
    );
  }

  if (user.email !== ADMIN_EMAIL) {
    return (
      <div className="admin-page">
        <h2>Acceso restringido</h2>
        <p>Solo el administrador puede editar el contenido.</p>
        <button className="btn-nav" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'homepage':
        return (
          <>
            <div className="editor-block">
              <h3>Imagen de Portada</h3>
              <label>
                URL de la imagen del hero
                <input
                  type="url"
                  placeholder="https://ejemplo.com/portada.jpg"
                  value={formState?.heroImage || ''}
                  onChange={(e) => updateField('heroImage', e.target.value)}
                />
              </label>
              {formState?.heroImage && (
                <label>
                  Preview
                  <img
                    src={formState.heroImage}
                    alt="Preview portada"
                    style={{ maxWidth: '400px', marginTop: '10px', borderRadius: '8px' }}
                  />
                </label>
              )}
            </div>

            <div className="editor-block">
              <h3>Texto principal</h3>
              <label>
                Título de portada
                <input
                  type="text"
                  value={formState?.heroTitle || ''}
                  onChange={(e) => updateField('heroTitle', e.target.value)}
                />
              </label>
              <label>
                Subtítulo
                <input
                  type="text"
                  value={formState?.heroSubtitle || ''}
                  onChange={(e) => updateField('heroSubtitle', e.target.value)}
                />
              </label>
            </div>

            <div className="editor-block">
              <h3>Cards destacadas</h3>
              <button className="btn-nav" onClick={addNewCard}>
                Agregar nueva card
              </button>
              {formState?.cards?.map((card, index) => (
                <div className="editor-card" key={card.id || index}>
                  <h4>Card {card.id || index + 1}</h4>
                  <label>
                    Título
                    <input
                      type="text"
                      value={card.titulo}
                      onChange={(e) => updateCard(index, 'titulo', e.target.value)}
                    />
                  </label>
                  <label>
                    Descripción
                    <textarea
                      value={card.desc}
                      onChange={(e) => updateCard(index, 'desc', e.target.value)}
                    />
                  </label>
                  <label>
                    URL de la imagen
                    <input
                      type="url"
                      placeholder="https://ejemplo.com/imagen.jpg"
                      value={card.imagen}
                      onChange={(e) => updateCard(index, 'imagen', e.target.value)}
                    />
                  </label>
                  {card.imagen && (
                    <label>
                      Preview
                      <img src={card.imagen} alt="Preview" style={{ maxWidth: '200px', marginTop: '10px', borderRadius: '8px' }} />
                    </label>
                  )}
                  <button className="btn-delete" onClick={() => deleteCard(index)}>
                    Eliminar card
                  </button>
                </div>
              ))}
            </div>

            <div className="editor-block">
              <h3>Eventos del calendario</h3>
              {formState?.events?.map((event, index) => (
                <div className="editor-event" key={event.id || index}>
                  <h4>Evento {event.id || index + 1}</h4>
                  <label>
                    Fecha
                    <input
                      type="date"
                      value={event.fecha}
                      onChange={(e) => updateEvent(index, 'fecha', e.target.value)}
                    />
                  </label>
                  <label>
                    Título
                    <input
                      type="text"
                      value={event.titulo}
                      onChange={(e) => updateEvent(index, 'titulo', e.target.value)}
                    />
                  </label>
                  <label>
                    Lugar
                    <input
                      type="text"
                      value={event.lugar}
                      onChange={(e) => updateEvent(index, 'lugar', e.target.value)}
                    />
                  </label>
                </div>
              ))}
            </div>

            <div className="editor-block">
              <h3>Textos adicionales</h3>
              <label>
                Dirección de contacto
                <input
                  type="text"
                  value={formState?.contactAddress || ''}
                  onChange={(e) => updateField('contactAddress', e.target.value)}
                />
              </label>
              <label>
                Texto de pie de página
                <input
                  type="text"
                  value={formState?.footerText || ''}
                  onChange={(e) => updateField('footerText', e.target.value)}
                />
              </label>
            </div>
          </>
        );

      case 'nosotros':
        return (
          <>
            <div className="editor-block">
              <h3>Contenido de la página "Nosotros"</h3>
              <label>
                Título principal
                <input
                  type="text"
                  value={nosotrosContent?.title || ''}
                  onChange={(e) => updateField('title', e.target.value, 'nosotros')}
                />
              </label>
              <label>
                Contenido principal
                <textarea
                  rows="10"
                  value={nosotrosContent?.content || ''}
                  onChange={(e) => updateField('content', e.target.value, 'nosotros')}
                />
              </label>
              <label>
                Texto adicional
                <textarea
                  rows="5"
                  value={nosotrosContent?.additionalText || ''}
                  onChange={(e) => updateField('additionalText', e.target.value, 'nosotros')}
                />
              </label>
            </div>

            <div className="editor-block">
              <h3>Equipo - Miembros</h3>
              <button className="btn-nav" onClick={addNewNosotrosCard}>
                Agregar nuevo miembro
              </button>
              {nosotrosContent?.teamCards?.map((card, index) => (
                <div className="editor-card" key={card.id || index}>
                  <h4>Miembro {card.id || index + 1}</h4>
                  <label>
                    Nombre
                    <input
                      type="text"
                      value={card.nombre}
                      onChange={(e) => updateNosotrosCard(index, 'nombre', e.target.value)}
                    />
                  </label>
                  <label>
                    Descripción
                    <textarea
                      value={card.descripcion}
                      onChange={(e) => updateNosotrosCard(index, 'descripcion', e.target.value)}
                    />
                  </label>
                  <label>
                    URL de la imagen
                    <input
                      type="url"
                      placeholder="https://ejemplo.com/imagen.jpg"
                      value={card.imagen}
                      onChange={(e) => updateNosotrosCard(index, 'imagen', e.target.value)}
                    />
                  </label>
                  {card.imagen && (
                    <label>
                      Preview
                      <img src={card.imagen} alt="Preview" style={{ maxWidth: '200px', marginTop: '10px', borderRadius: '8px' }} />
                    </label>
                  )}
                  <button className="btn-delete" onClick={() => deleteNosotrosCard(index)}>
                    Eliminar miembro
                  </button>
                </div>
              ))}
            </div>
          </>
        );

      case 'sumate':
        return (
          <div className="editor-block">
            <h3>Contenido de la página "Sumate"</h3>
            <label>
              Título principal
              <input
                type="text"
                value={sumateContent?.title || ''}
                onChange={(e) => updateField('title', e.target.value, 'sumate')}
              />
            </label>
            <label>
              Contenido principal
              <textarea
                rows="10"
                value={sumateContent?.content || ''}
                onChange={(e) => updateField('content', e.target.value, 'sumate')}
              />
            </label>
            <label>
              Información de contacto
              <textarea
                rows="5"
                value={sumateContent?.contactInfo || ''}
                onChange={(e) => updateField('contactInfo', e.target.value, 'sumate')}
              />
            </label>
          </div>
        );

      case 'contacto':
        return (
          <div className="editor-block">
            <h3>Contenido de la página "Contacto"</h3>
            <label>
              Título de introducción
              <input
                type="text"
                value={contactoContent?.introTitle || ''}
                onChange={(e) => updateField('introTitle', e.target.value, 'contacto')}
              />
            </label>
            <label>
              Texto de introducción
              <textarea
                rows="3"
                value={contactoContent?.introText || ''}
                onChange={(e) => updateField('introText', e.target.value, 'contacto')}
              />
            </label>
            <label>
              Nombre completo (etiqueta)
              <input
                type="text"
                value={contactoContent?.nameLabel || ''}
                onChange={(e) => updateField('nameLabel', e.target.value, 'contacto')}
              />
            </label>
            <label>
              Email (etiqueta)
              <input
                type="text"
                value={contactoContent?.emailLabel || ''}
                onChange={(e) => updateField('emailLabel', e.target.value, 'contacto')}
              />
            </label>
            <label>
              Mensaje (etiqueta)
              <input
                type="text"
                value={contactoContent?.messageLabel || ''}
                onChange={(e) => updateField('messageLabel', e.target.value, 'contacto')}
              />
            </label>
            <label>
              Texto del botón
              <input
                type="text"
                value={contactoContent?.buttonText || ''}
                onChange={(e) => updateField('buttonText', e.target.value, 'contacto')}
              />
            </label>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <h2>Panel de administración</h2>
          <p>Modifica la información que se muestra en las páginas.</p>
        </div>
        <button className="btn-nav" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </div>

      <div className="admin-tabs">
        <button
          className={`tab-button ${activeTab === 'homepage' ? 'active' : ''}`}
          onClick={() => setActiveTab('homepage')}
        >
          Inicio
        </button>
        <button
          className={`tab-button ${activeTab === 'nosotros' ? 'active' : ''}`}
          onClick={() => setActiveTab('nosotros')}
        >
          Nosotros
        </button>
        <button
          className={`tab-button ${activeTab === 'sumate' ? 'active' : ''}`}
          onClick={() => setActiveTab('sumate')}
        >
          Sumate
        </button>
        <button
          className={`tab-button ${activeTab === 'contacto' ? 'active' : ''}`}
          onClick={() => setActiveTab('contacto')}
        >
          Contacto
        </button>
      </div>

      {error && <p className="form-error">{error}</p>}
      {successMessage && <p className="form-success">{successMessage}</p>}

      {renderTabContent()}

      <button className="btn-nav" onClick={handleSave}>
        Guardar cambios
      </button>
    </div>
  );
};

export default Admin;
