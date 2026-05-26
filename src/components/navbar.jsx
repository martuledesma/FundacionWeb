import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../Assets/logo.jpg';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const closeMenu = () => setIsMenuOpen(false);

    return (
        <nav className="navbar">
            <div className="logo-container">
                <Link to="/" onClick={closeMenu}>
                    <img src={logo} alt="Logo Fundación" className="logo-img" />
                </Link>
            </div>

            <button
                type="button"
                className={`menu-toggle ${isMenuOpen ? 'active' : ''}`}
                aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
                aria-expanded={isMenuOpen}
                aria-controls="main-navigation"
                onClick={() => setIsMenuOpen((open) => !open)}
            >
                <span></span>
                <span></span>
                <span></span>
            </button>

            <ul id="main-navigation" className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
                <li><Link to="/nosotros" onClick={closeMenu}>Nosotros</Link></li>
                <li><Link to="/proyectos" onClick={closeMenu}>Proyectos</Link></li>
                <li><Link to="/cursos" onClick={closeMenu}>Cursos</Link></li>
                <li><Link to="/sumate" onClick={closeMenu}>Sumate</Link></li>
                <li><Link to="/admin" className="btn-nav" onClick={closeMenu}>Admin</Link></li>
            </ul>
        </nav>
    );
};

export default Navbar;
