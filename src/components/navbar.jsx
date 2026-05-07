import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../Assets/logo.jpg';

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="logo-container">
                <Link to="/">
                    <img src={logo} alt="Logo Fundación" className="logo-img" />
                </Link>
            </div>

            <ul className="nav-links">
                <li><Link to="/">Inicio</Link></li>
                <li><Link to="/nosotros">Nosotros</Link></li>
                <li><Link to="/sumate">Sumate</Link></li>
                <li><Link to="/admin" className="btn-nav">Admin</Link></li>
            </ul>
        </nav>
    );
};

export default Navbar;