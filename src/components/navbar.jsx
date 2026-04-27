import React from 'react';
import { Link } from 'react-router-dom'; // <--- IMPORTANTE: Importamos el "enchufe" de rutas
import logo from '../Assets/logo.jpg'; 

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="logo-container">
                {/* Link a la página principal */}
                <Link to="/">
                    <img src={logo} alt="Logo Fundación" className="logo-img" />
                </Link>
            </div>

            <ul className="nav-links">
                {/* Usamos 'to' en lugar de 'href' */}
                <li><Link to="/">Inicio</Link></li>
                <li><Link to="/nosotros">Nosotros</Link></li>
                
                {/* Botón Destacado: Sumate */}
                <li>
                    <Link to="/sumate" className="btn-nav">Sumate</Link>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;