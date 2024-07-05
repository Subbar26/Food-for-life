import axios from 'axios';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './ResetPassword.css';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const query = new URLSearchParams(location.search);
    const token = query.get('token');

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }
        try {
            const response = await axios.post('http://localhost:8080/auth/reset-password', { token, password });
            setMessage(response.data.message);
            setError('');
            setTimeout(() => navigate('/login'), 3000); // Redirige al usuario al login después de 3 segundos
        } catch (error) {
            setMessage('');
            setError('Error al restablecer la contraseña');
        }
    };

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="reset-password-container">
            <h2>Restablecer contraseña</h2>
            <form onSubmit={handleResetPassword}>
                <div className="reset-password-form-group">
                    <label htmlFor="password">Nueva contraseña</label>
                    <input
                        type={showPassword ? "text" : "password"}
                        className="reset-password-form-control"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="reset-password-form-group">
                    <label htmlFor="confirmPassword">Confirmar nueva contraseña</label>
                    <input
                        type={showPassword ? "text" : "password"}
                        className="reset-password-form-control"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="button" onClick={toggleShowPassword} className="reset-password-btn-secondary">
                    {showPassword ? "Ocultar contraseñas" : "Mostrar contraseñas"}
                </button>
                <button type="submit" className="reset-password-btn-primary">Restablecer</button>
            </form>
            {message && <p className="reset-password-text-success">{message}</p>}
            {error && <p className="reset-password-text-danger">{error}</p>}
        </div>
    );
};

export default ResetPassword;
