import axios from 'axios';
import 'bootstrap-icons/font/bootstrap-icons.css'; // Importar los íconos de Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import logo from '../images/logo.png';
import './Login.css'; // Importar el CSS actualizado

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [loginError, setLoginError] = useState('');
    const [loggedIn, setLoggedIn] = useState(false); // Estado para controlar la redirección

    const validate = () => {
        let valid = true;
        if (!email) {
            setEmailError('El correo electrónico es obligatorio');
            valid = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            setEmailError('El correo electrónico no es válido');
            valid = false;
        } else {
            setEmailError('');
        }

        if (!password) {
            setPasswordError('La contraseña es obligatoria');
            valid = false;
        } else if (password.length < 6) {
            setPasswordError('La contraseña debe tener al menos 6 caracteres');
            valid = false;
        } else {
            setPasswordError('');
        }

        return valid;
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        if (validate()) {
            try {
                const response = await axios.post('http://localhost:8080/auth/login', { email, password });
                const token = response.data.token;
                localStorage.setItem('token', token);
                console.log('Inicio de sesión exitoso');
                setLoggedIn(true);
            } catch (error) {
                if (error.response.status === 400) {
                    if (error.response.data.includes("correo electrónico")) {
                        setLoginError("El correo electrónico no está registrado");
                    } else {
                        setLoginError("La contraseña es incorrecta");
                    }
                } else {
                    console.error('Error:', error);
                }
            }
        }
    };

    // Si loggedIn es true, redirige al componente de Pagina_Principal
    if (loggedIn) {
        return <Navigate to="/pagina_principal" />;
    }

    return (
        <div>
            {/* Cabecera */}
            <header className="d-flex justify-content-between align-items-center mb-4">
                <a className="navbar-brand" href="/">FoodForLife</a>
                <div>
                    <Link to="/" className="btn btn-link">Home</Link>
                </div>
            </header>

            <div className='container mt-5'>
                <div className="row justify-content-center">
                    <div className="col-md-8"> {/* Cambiado a col-md-8 para hacer el formulario un poco más grande */}
                        <div className="card card-body shadow custom-card">
                            <div className="text-center mb-4">
                                <img src={logo} alt="Logo" className='tamaño-imagen' />
                            </div>
                            <form onSubmit={handleLogin} className="mt-5">
                                {loginError && <div className="alert alert-danger" role="alert">{loginError}</div>}
                                <div className="form-group mb-3">
                                    <div className="input-group">
                                        <input
                                            type="email"
                                            className={`form-control pastel-input ${emailError ? 'is-invalid' : (email && !emailError ? 'is-valid' : '')}`}
                                            placeholder='Email'
                                            name="email"
                                            value={email}
                                            onChange={(e) => {
                                                setEmail(e.target.value);
                                                if (!/\S+@\S+\.\S+/.test(e.target.value)) {
                                                    setEmailError('El correo electrónico no es válido');
                                                } else {
                                                    setEmailError('');
                                                }
                                            }}
                                        />
                                        <div className="input-group-append">
                                            <span className="input-group-text">
                                                {email && !emailError ? <i className="bi bi-check-circle text-success"></i> : ''}
                                                {emailError ? <i className="bi bi-x-circle text-danger"></i> : ''}
                                            </span>
                                        </div>
                                        <div className="invalid-feedback">{emailError}</div>
                                        <div className="valid-feedback">Correo válido</div>
                                    </div>
                                </div>
                                <div className="form-group mb-3">
                                    <div className="input-group">
                                        <input
                                            type="password"
                                            className={`form-control pastel-input ${passwordError ? 'is-invalid' : (password && !passwordError ? 'is-valid' : '')}`}
                                            placeholder='Password'
                                            name="password"
                                            value={password}
                                            onChange={(e) => {
                                                setPassword(e.target.value);
                                                if (e.target.value.length < 6) {
                                                    setPasswordError('La contraseña debe tener al menos 6 caracteres');
                                                } else {
                                                    setPasswordError('');
                                                }
                                            }}
                                        />
                                        <div className="input-group-append">
                                            <span className="input-group-text">
                                                {password && !passwordError ? <i className="bi bi-check-circle text-success"></i> : ''}
                                                {passwordError ? <i className="bi bi-x-circle text-danger"></i> : ''}
                                            </span>
                                        </div>
                                        <div className="invalid-feedback">{passwordError}</div>
                                        <div className="valid-feedback">Contraseña válida</div>
                                    </div>
                                </div>
                                <button className='btn pastel-button w-100'>Iniciar sesión</button>
                                <p>¿No tienes una cuenta? <Link to="/registro" className="link-button">Regístrate aquí</Link></p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
