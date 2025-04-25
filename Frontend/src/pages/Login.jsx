import React, { useState } from 'react';
import styles from '../styles/Login.module.css';
import logo from '../assets/img/logo_spa.png';
import { loginUser } from '../services/auth'; // Asegúrate de que la ruta sea correcta

const Login = () => {
    const [credentials, setCredentials] = useState({
        username: '',  // Cambié 'email' por 'username'
        password: ''
    });

    const [error, setError] = useState('');

    // Función para manejar cambios en los inputs
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
            window.location.href = '/'; 
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
                <h2 className={styles.title}>Iniciar sesión</h2>
                <form onSubmit={handleSubmit}>
                
                    <input
                        type="text"  
                        name="username"  
                        placeholder="Nombre de usuario"
                        required
                        value={credentials.username}  
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
                    />

                    {error && <div className={styles.error}>{error}</div>} {/* Mostrar error si es necesario */}

                    <div className={styles.linksRow}>
                        <p className={styles.linkLeft}>
                            <a href="/reset-password">¿Olvidaste tu contraseña?</a>
                        </p>
                        <p className={styles.linkRight}>
                            <a href="/register">¿No tienes una cuenta? Registrarse</a>
                        </p>
                    </div>

                    <button type="submit" className={styles.submitBtn}>
                        Iniciar sesión
                    </button>

                    <div className={styles.googleBtn}>
                        <img
                            src="https://img.icons8.com/color/48/google-logo.png"
                            alt="Google"
                        />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
