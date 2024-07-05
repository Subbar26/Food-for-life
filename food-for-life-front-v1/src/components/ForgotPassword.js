import axios from 'axios';
import React, { useState } from 'react';
import './ForgotPassword.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/auth/forgot-password', { email });
            setMessage(response.data.message);
            setError('');
        } catch (error) {
            setMessage('');
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError('Error al enviar el correo de restablecimiento');
            }
        }
    };

    return (
        <div className="forgot-password-container">
            <h2>Olvidaste tu contraseña</h2>
            <form onSubmit={handleForgotPassword}>
                <div className="form-group forgot-password-input-group">
                    <label htmlFor="email">Correo electrónico</label>
                    <input
                        type="email"
                        className="form-control forgot-password-input"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary forgot-password-button">Enviar</button>
            </form>
            {message && <p className="forgot-password-message-success">{message}</p>}
            {error && <p className="forgot-password-message-error">{error}</p>}
        </div>
    );
};

export default ForgotPassword;
