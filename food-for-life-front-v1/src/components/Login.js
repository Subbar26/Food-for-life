import axios from 'axios';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../images/logo.png';
import './Login.css';


const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [loginError, setLoginError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showVerificationInput, setShowVerificationInput] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/pagina_principal');
        }
    }, [navigate]);

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
            setLoading(true);
            try {
                const response = await axios.post('http://localhost:8080/auth/login', { email, password });
                localStorage.setItem('token', response.data.token);
                setLoginError('');
                setShowVerificationInput(true);
                setLoading(false);
            } catch (error) {
                setLoading(false);
                setLoginError('Correo electrónico o contraseña incorrectos');
                console.error('Error:', error);
            }
        }
    };

    const handleVerifyCode = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8080/auth/verify-code', { email, code: verificationCode });
            setLoginError('');
            navigate('/pagina_principal');
        } catch (error) {
            setLoginError('Código de verificación incorrecto');
            console.error('Error:', error);
        }
    };

    return (
        <div className="container fluid contenedor1_login">
            <div className="container contenedor2_login">
                <div className="card shadow custom-card login-card">
                    <div className="mb-3 text-center header-card">
                        <h1 className="card-title">Iniciar sesión</h1>
                        <img src={logo} alt="Logo" className="tamaño-imagen" />
                    </div>
                    <form onSubmit={showVerificationInput ? handleVerifyCode : handleLogin} className="mt-2 formulario">
                        {loginError && (
                            <div className="alert alert-danger" role="alert">
                                <i className="bi bi-exclamation-triangle-fill me-2"></i>{loginError}
                            </div>
                        )}
                        <div className="form-group mb-3 contenedor-formulario">
                            <div className="input-group">
                                <input
                                    type="email"
                                    className={`form-control pastel-input ${emailError ? 'is-invalid' : ''}`}
                                    placeholder='Correo electrónico'
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        if (!/\S+@\S+\.\S+/.test(e.target.value)) {
                                            setEmailError('El correo electrónico no es válido');
                                        } else {
                                            setEmailError('');
                                        }
                                    }}
                                    disabled={showVerificationInput}
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
                                    type={showPassword ? 'text' : 'password'}
                                    className={`form-control pastel-input ${passwordError ? 'is-invalid' : ''}`}
                                    placeholder='Contraseña'
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        if (e.target.value.length < 6) {
                                            setPasswordError('La contraseña debe tener al menos 6 caracteres');
                                        } else {
                                            setPasswordError('');
                                        }
                                    }}
                                    disabled={showVerificationInput}
                                />
                                <div className="input-group-append">
                                    <span className="input-group-text" onClick={() => setShowPassword(!showPassword)} style={{ cursor: 'pointer' }}>
                                        {showPassword ? <i className="bi bi-eye-slash"></i> : <i className="bi bi-eye"></i>}
                                    </span>
                                    <span className="input-group-text">
                                        {password && !passwordError ? <i className="bi bi-check-circle text-success"></i> : ''}
                                        {passwordError ? <i className="bi bi-x-circle text-danger"></i> : ''}
                                    </span>
                                </div>
                            </div>
                            {passwordError && <div className="invalid-feedback">{passwordError}</div>}
                        </div>
                        {showVerificationInput && (
                            <div className="form-group mb-3 verification-input">
                                <div className="input-group">
                                    <input
                                        type="text"
                                        className="form-control pastel-input"
                                        placeholder="Código de verificación"
                                        value={verificationCode}
                                        onChange={(e) => setVerificationCode(e.target.value)}
                                    />
                                </div>
                            </div>
                        )}
                        <button className="btn btn-success w-100" disabled={loading}>
                            {loading ? 'Iniciando sesión...' : showVerificationInput ? 'Verificar código' : 'Iniciar sesión'}
                        </button>
                        <p className="mt-3">
                            <Link to="/recuperar" className="link-button">¿Olvidaste tu contraseña?</Link>
                        </p>
                        <p>¿No tienes una cuenta? <Link to="/registro" className="link-button">Regístrate aquí</Link></p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
