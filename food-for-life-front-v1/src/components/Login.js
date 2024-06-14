import axios from 'axios';
import 'bootstrap-icons/font/bootstrap-icons.css'; // Importar los íconos de Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../images/logo.png';
import './Login.css'; // Importar el CSS actualizado

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [loginError, setLoginError] = useState('');
    const navigate = useNavigate();

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
                navigate('/pagina_principal'); // Redirige al usuario a /pagina_principal
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

    return (
        <div className="container fluid contenedor1_login">
            <div className="container contenedor2_login">
                <div className="card shadow custom-card login-card">
                    <div className="mb-3 text-center header-card">
                        <h5 className="card-title">Iniciar sesión</h5>
                        <img src={logo} alt="Logo" className="tamaño-imagen" />
                    </div>
                    <form onSubmit={handleLogin} className="mt-2 formulario">
                        {loginError && (
                            <div className="alert alert-danger d-flex align-items-center" role="alert">
                                <svg className="bi flex-shrink-0 me-2" width="20" height="20" role="img" aria-label="Danger:">
                                    <use xlinkHref="#exclamation-triangle-fill" />
                                </svg>
                                <div style={{ fontSize: '0.9rem' }}>{loginError}</div>
                            </div>
                        )}
                        <div className="form-group mb-3 contenedor-formulario">
                            <div className="input-group">
                                <input
                                    type="emailPlease"
                                    className={`form-control pastel-input`}
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
                            </div>
                            {emailError && <div className="invalid-feedback">{emailError}</div>}
                        </div>
                        <div className="form-group mb-3">
                            <div className="input-group">
                                <input
                                    type="password"
                                    className={`form-control pastel-input`}
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
                            </div>
                            {passwordError && <div className="invalid-feedback">{passwordError}</div>}
                        </div>
                        <button className="btn btn-success w-100">Iniciar sesión</button>
                        <p></p>
                        <p>¿No tienes una cuenta? <a href="/registro" className="icon-link link-button">Regístrate aquí</a></p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;