import React from 'react';
import { useLocation } from 'react-router-dom';

const Header = () => {

const location = useLocation();
    // Ocultar el Header en la página de Login
if (location.pathname === '/login') {
    return null;
}

return (
<div className="container-fluid bg-light p-3 shadow-sm">
    <div className="d-flex justify-content-between align-items-center">
    <a className="navbar-brand" href="/">FoodForLife</a>
    <div>
        <button className="btn btn-link" onClick={() => window.location.href = '/'}>Home</button>
        <button className="btn btn-link" onClick={() => window.location.href = '/login'}>Login</button>
        </div>
    </div>
    </div>
);
};

export default Header;
