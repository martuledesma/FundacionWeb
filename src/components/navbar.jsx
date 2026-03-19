import React from 'react';
// Importamos el logo desde la carpeta Assets (fijate la A mayúscula)
import logoImg from '../Assets/logo.jpg'; 

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo-container">
        <a href="/">
          <img src={logoImg} alt="Logo Fundación Construir Juntos" className="logo-img" />
        </a>
      </div>
      <ul className="nav-links">
        <li><a href="#inicio">Inicio</a></li>
        <li><a href="#novedades">Novedades</a></li>
        <li><a href="#donar" className="btn-nav">Donar Ahora</a></li>
      </ul>
    </nav>
  );
};

export default Navbar;