import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Registro.css';

const Register = () => {
    const [formData, setFormData] = useState({
        sexo: '',
        peso_actual: '',
        altura: '',
        fecha_nacimiento: '',
        nivel_actividad: '',
        dieta_objetivo: '',
        peso_meta: '',
        nombre_usuario: '',
        email: '',
        password: ''
    });

    const [formErrors, setFormErrors] = useState({});
    const [registerError, setRegisterError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));

        const errors = { ...formErrors };
        if (!value) {
            errors[name] = `El campo ${name.replace('_', ' ')} es obligatorio`;
        } else {
            switch (name) {
                case 'peso_actual':
                    if (value < 0 || value > 999) {
                        errors[name] = 'El peso actual debe estar entre 0 y 999';
                    } else {
                        delete errors[name];
                    }
                    break;
                case 'altura':
                    if (value < 0 || value > 999) {
                        errors[name] = 'La altura debe estar entre 0 y 999';
                    } else {
                        delete errors[name];
                    }
                    break;
                case 'fecha_nacimiento':
                    const currentDate = new Date();
                    const selectedDate = new Date(value);
                    if (selectedDate > currentDate) {
                        errors[name] = 'La fecha de nacimiento no puede ser en el futuro';
                    } else {
                        delete errors[name];
                    }
                    break;
                case 'dieta_objetivo':
                    if (value.length === 0) {
                        errors[name] = 'La dieta objetivo es obligatoria';
                    } else {
                        delete errors[name];
                    }
                    break;
                case 'peso_meta':
                    if (value < 0 || value > 999) {
                        errors[name] = 'El peso meta debe ser un número entero entre 0 y 999';
                    } else {
                        delete errors[name];
                    }
                    break;
                case 'nombre_usuario':
                    if (value.trim().length === 0) {
                        errors[name] = 'El nombre de usuario es obligatorio';
                    } else {
                        delete errors[name];
                    }
                    break;
                case 'email':
                    const emailRegex = /^\S+@\S+\.\S+$/;
                    if (!emailRegex.test(value)) {
                        errors[name] = 'El correo electrónico no es válido';
                    } else {
                        delete errors[name];
                    }
                    break;
                case 'password':
                    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
                    if (!passwordRegex.test(value)) {
                        errors[name] = 'La contraseña debe tener al menos 8 caracteres, incluyendo una letra mayúscula, una minúscula, un número y un carácter especial';
                    } else {
                        delete errors[name];
                    }
                    break;
                default:
                    delete errors[name];
                    break;
            }
        }
        setFormErrors(errors);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const errors = {};
        if (!formData.sexo) {
            errors.sexo = 'Seleccione su sexo';
        }
        if (!formData.peso_actual) {
            errors.peso_actual = 'Ingrese su peso actual';
        }
        if (!formData.altura) {
            errors.altura = 'Ingrese su altura';
        }
        if (!formData.fecha_nacimiento) {
            errors.fecha_nacimiento = 'Seleccione su fecha de nacimiento';
        }
        if (!formData.nivel_actividad) {
            errors.nivel_actividad = 'Seleccione su nivel de actividad';
        }
        if (!formData.dieta_objetivo) {
            errors.dieta_objetivo = 'Ingrese su objetivo de dieta';
        }
        if (!formData.peso_meta) {
            errors.peso_meta = 'Ingrese su peso meta';
        }
        if (!formData.nombre_usuario) {
            errors.nombre_usuario = 'Ingrese su nombre de usuario';
        }
        if (!formData.email) {
            errors.email = 'Ingrese su correo electrónico';
        }
        if (!formData.password) {
            errors.password = 'Ingrese su contraseña';
        }

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        try {
            formData.fecha_nacimiento = new Date(formData.fecha_nacimiento); // Convertir fecha_nacimiento a Date
            const submitData = { ...formData };
            const response = await axios.post('http://localhost:8080/auth/register', submitData);
            alert(response.data.message);
            navigate('/login'); // Redirigir al usuario a la página de inicio de sesión después de un registro exitoso
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setRegisterError(error.response.data); // Debería ser solo error.response.data para obtener el mensaje
            } else {
                console.error('Error:', error);
            }
        }
    };

    return (
        <div className="register-container">
            {registerError && <div className="alert alert-danger" role="alert">{registerError}</div>}
            <form onSubmit={handleSubmit}>
                <div className="section">
                    <h3>Datos personales</h3>
                    <h4>Sexo</h4>
                    <div className="radio-group">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="sexo" value="Femenino" onChange={handleChange} />
                                <label className="form-check-label">Femenino</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="sexo" value="Masculino" onChange={handleChange} />
                                <label className="form-check-label">Masculino</label>
                            </div>
                    </div>
                    <div className="form-group">
                        <label>Peso Actual (kg):</label>
                        <input type="number" name="peso_actual" value={formData.peso_actual} onChange={handleChange} />
                        {formErrors.peso_actual && <div className="error">{formErrors.peso_actual}</div>}
                    </div>
                    <div className="form-group">
                        <label>Altura (cm):</label>
                        <input type="number" name="altura" value={formData.altura} onChange={handleChange} />
                        {formErrors.altura && <div className="error">{formErrors.altura}</div>}
                    </div>
                    <div className="form-group">
                        <label>Fecha de nacimiento:</label>
                        <input type="date" name="fecha_nacimiento" value={formData.fecha_nacimiento} onChange={handleChange} />
                        {formErrors.fecha_nacimiento && <div className="error">{formErrors.fecha_nacimiento}</div>}
                    </div>
                    <div className="form-group">
                        <label>Nivel de Actividad:</label>
                        <select name="nivel_actividad" value={formData.nivel_actividad} onChange={handleChange}>
                            <option value="">Seleccione...</option>
                            <option value="Sedentario">Sedentario</option>
                            <option value="Baja Actividad">Baja Actividad</option>
                            <option value="Activo">Activo</option>
                            <option value="Muy Activo">Muy Activo</option>
                        </select>
                        {formErrors.nivel_actividad && <div className="error">{formErrors.nivel_actividad}</div>}
                    </div>
                </div>

                <div className="section">
                    <h3>Mis Metas</h3>
                    <div className="form-group">
                        <label>Dieta Objetivo:</label>
                        <select name="dieta_objetivo" value={formData.dieta_objetivo} onChange={handleChange}>
                            <option value="Mantener mi peso actual">Mantener mi peso actual</option>
                            <option value="Perder peso">Perder peso</option>
                            <option value="Ganar peso">Ganar peso</option>
                        </select>
                        {formErrors.dieta_objetivo && <div className="error">{formErrors.dieta_objetivo}</div>}
                    </div>
                    <div className="form-group">
                        <label>Peso meta (kg):</label>
                        <input type="number" name="peso_meta" value={formData.peso_meta} onChange={handleChange} />
                        {formErrors.peso_meta && <div className="error">{formErrors.peso_meta}</div>}
                    </div>
                </div>

                <div className="section">
                    <h3>Detalles de la cuenta</h3>
                    <div className="form-group">
                        <label>Nombre del Miembro:</label>
                        <input type="text" name="nombre_usuario" value={formData.nombre_usuario} onChange={handleChange} />
                        {formErrors.nombre_usuario && <div className="error">{formErrors.nombre_usuario}</div>}
                    </div>
                    <div className="form-group">
                        <label>Correo Electrónico:</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} />
                        {formErrors.email && <div className="error">{formErrors.email}</div>}
                    </div>
                    <div className="form-group">
                        <label>Contraseña:</label>
                        <input type="password" name="password" value={formData.password} onChange={handleChange} />
                        {formErrors.password && <div className="error">{formErrors.password}</div>}
                    </div>
                </div>

                <button type="submit" className="btn btn-primary">Siguiente</button>
                <a href='/login'><button type="button" className="btn btn-secondary">Cancelar</button></a>
                <p></p>
                <p>¿Ya tienes una cuenta? <a href="/login" className="icon-link link-button">Inicia sesión aquí</a></p>
            </form>
        </div>
    );
};

export default Register;
