import React, { useState } from 'react';
import styles from '../styles/Login.module.css';
import logo from '../assets/img/logo_spa.png';
import { loginUser } from '../services/authService';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [credentials, setCredentials] = useState({
        usuario: '',  
        password: ''
    });

    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials({
            ...credentials,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await loginUser(credentials);
            localStorage.setItem('token', data.token);
            navigate('/admin-panel');
        } catch (err) {
            setError('Credenciales incorrectas. Intenta de nuevo.');
        }
    };

    return (
        <div className={styles.loginContainer}>
            <div className={styles.header}>
                <h1 className={styles.titleLogo}>
                    <span className={styles.left}>Sentirse</span>
                    <img src={logo} alt="Logo" className={styles.logo} />
                    <span className={styles.right}>Bien</span>
                </h1>
                <p className={styles.subtext}>Dra. Ana Felicidad</p>
            </div>

            <div className={styles.loginCard}>
                <h2 className={styles.title}>Iniciar sesión - Solo profesionales</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="usuario"  
                        placeholder="Nombre de usuario"
                        required
                        value={credentials.usuario}  
                        onChange={handleChange}
                        className={styles.input}
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Contraseña"
                        required
                        value={credentials.password}
                        onChange={handleChange}
                        className={styles.input}
                        autoComplete="current-password" // opcional para evitar warning
                    />

                    {error && <div className={styles.error}>{error}</div>}

                    <div className={styles.linksRow}>
                        <p className={styles.linkLeft}>
                            <a>Si olvidaste tu contraseña, contáctate con el administrador del SPA</a>
                        </p>
                    </div>

                    <button type="submit" className={styles.submitBtn}>
                        Iniciar sesión
                    </button>

                </form>
            </div>
        </div>
    );
};

export default Login;
