import React from 'react';
import { Link } from 'react-router-dom';

const PaginaPrincipal = () => {
    return (
        <div className='container mt-5'>
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card card-body shadow custom-card">
                        <h2 className='text-center'>Bienvenido a FoodForLife</h2>
                        <p className='text-center'>Esta es la página principal</p>
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
