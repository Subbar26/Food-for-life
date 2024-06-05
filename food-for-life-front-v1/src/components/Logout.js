import React from 'react';
import { useHistory } from 'react-router-dom';

const Logout = () => {
    const history = useHistory();

    const handleLogout = () => {
        // Eliminar el token de autenticación del localStorage
        localStorage.removeItem('token');
        // Redirigir al usuario a la página de inicio de sesión o a otra página de tu elección
        history.push('/login');
    };

    return (
        <button onClick={handleLogout}>Cerrar sesión</button>
    );
};

export default Logout;
