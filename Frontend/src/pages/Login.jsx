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

    // Función para manejar el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Llamada a la API para hacer login
            const data = await loginUser(credentials); // Se manda 'username' y 'password'
            localStorage.setItem('token', data.token); // Guarda el token JWT
            window.location.href = '/'; // Redirige al dashboard (o donde desees)
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
                    {/* Campo para username en lugar de email */}
                    <input
                        type="text"  // Cambié de 'email' a 'text' para 'username'
                        name="username"  // Ahora se usa 'username'
                        placeholder="Nombre de usuario"
                        required
                        value={credentials.username}  // Usamos 'username' aquí
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
