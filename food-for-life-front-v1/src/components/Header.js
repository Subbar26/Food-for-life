import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { useLocation } from 'react-router-dom';
import logo from '../images/logo.png';
import './Header.css';

const Header = () => {
    const location = useLocation();
    
    if (location.pathname === '/recipes') {
        return null;
    }

    const commonLinks = (
        <div className="btn-group access-buttons">
            {location.pathname !== '/login' && <a href="/login" className="breadcrumb-item active">Ingresar</a>}
            {location.pathname !== '/registro' && <a href="/registro" className="breadcrumb-item active">Registrarse</a>}
            <a href="/recipes" className="breadcrumb-item active">Recetas</a>
        </div>
    );

    return (
        <header className="d-flex justify-content-between align-items-center contenedor_header">
            <div className="d-flex align-items-center contenedor2">
                <img src={logo} alt="Logo" className="app-icon" />
                <a className="breadcrumb-item active title-page" aria-current="page" href="/">FoodForLife</a>
            </div>
            {commonLinks}
        </header>
    );
};

export default Header;
