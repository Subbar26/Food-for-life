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

    // Ocultar el Header en la página de Login
    if (location.pathname === '/login') {
        return (
            <header className="d-flex justify-content-between align-items-center contenedor_header">
                <div className="d-flex align-items-center contenedor2">
                    <img src={logo} alt="Logo" className="app-icon" />
                    <a className="breadcrumb-item active title-page" aria-current="page" href="/">FoodForLife</a>
                </div>
                <div className="btn-group access-buttons">
                    <a href="/registro" className="breadcrumb-item active">Registrarse</a>
                    <a href="/recipes" className="breadcrumb-item active">Recetas</a>
                </div>
            </header>
        );
    }

    if (location.pathname === '/registro') {
        return (
            <header className="d-flex justify-content-between align-items-center contenedor_header">
                <div className="d-flex align-items-center contenedor2">
                    <img src={logo} alt="Logo" className="app-icon" />
                    <a className="breadcrumb-item active title-page" aria-current="page" href="/">FoodForLife</a>
                </div>
                <div className="btn-group access-buttons">
                    <a href="/recipes" className="breadcrumb-item active">Recetas</a>
                </div>
            </header>
        );
    }

    if (location.pathname === '/pagina_principal') {
        return (
            <header className="d-flex justify-content-between align-items-center contenedor_header">
                <div className="d-flex align-items-center contenedor2">
                    <img src={logo} alt="Logo" className="app-icon" />
                    <a className="breadcrumb-item active title-page" aria-current="page" href="/">FoodForLife</a>
                </div>
                <div className="btn-group access-buttons">
                    <a href="/recipes" className="breadcrumb-item active">Recetas</a>
                </div>
            </header>
        );
    }

    return (
        <header className="d-flex justify-content-between align-items-center contenedor_header">
            <div className="d-flex align-items-center contenedor2">
                <img src={logo} alt="Logo" className="app-icon" />
                <a className="breadcrumb-item active title-page" aria-current="page" href="/">FoodForLife</a>
            </div>
            <div className="btn-group access-buttons">
                <a href="/login" className="breadcrumb-item active" aria-current="page">Ingresar</a>
                <a href="/registro" className="breadcrumb-item active">Registrarse</a>
                <a href="/recipes" className="breadcrumb-item active">Recetas</a>
            </div>
        </header>
    );
};

export default Header;
