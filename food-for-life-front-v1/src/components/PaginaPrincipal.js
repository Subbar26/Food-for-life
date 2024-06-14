import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const PaginaPrincipal = () => {
    const [userName, setUserName] = useState('');
    const [idr, setIdr] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        // Llamada al backend para obtener los detalles del usuario
        axios.get('http://localhost:8080/auth/idr', {
            headers: {
                Authorization: `Bearer ${token}` // Pasar el token en el encabezado de autorización
            }
        })
            .then(response => {
                setUserName(response.data.name);
                setIdr(response.data.idr);
            })
            .catch(error => {
                console.error('Error al obtener los detalles del usuario:', error);
            });
    }, []);

    return (
        <div className='container mt-5'>
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card card-body shadow custom-card">
                        <h2 className='text-center'>Bienvenido a FoodForLife</h2>
                        <p className='text-center'>Esta es la página principal</p>
                        <p className='text-center'>Hola, {userName}</p>
                        {idr !== null && (
                            <div className="text-center">
                                <p>IDR: {idr}</p>
                            </div>
                        )}
                        {/* Agregar el encabezado con el enlace de cerrar sesión */}
                        <header className="d-flex justify-content-end">
                            <Link to="#" onClick={() => {
                                localStorage.removeItem('token');
                                window.location.href = '/login';
                            }} className="btn btn-link text-decoration-none">Cerrar sesión</Link>
                        </header>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaginaPrincipal;