import React, { useState } from 'react';
import styles from '../styles/Register.module.css';
import logo from '../assets/img/logo_spa.png';
import { registerUser } from '../services/auth'; // Asegúrate de que la ruta sea correcta

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });

    const [error, setError] = useState('');

    // Función para manejar los cambios en los inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Función para manejar el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Llamada al backend para registrar el usuario
            const data = await registerUser(formData);
            console.log(data);
            window.location.href = '/login'; // Redirigir al login después de registrarse
        } catch (err) {
            setError('Ocurrió un error durante el registro. Intenta de nuevo.');
        }
    };

    return (
        <div className={styles.registerContainer}>
            <div className={styles.header}>
                <h1 className={styles.titleLogo}>
                    <span className={styles.left}>Sentirse</span>
                    <img src={logo} alt="Logo" className={styles.logo} />
                    <span className={styles.right}>Bien</span>
                </h1>
                <p className={styles.subtext}>Dra. Ana Felicidad</p>
            </div>

            <div className={styles.registerCard}>
                <h2 className={styles.title}>Crear cuenta</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="username"
                        placeholder="Nombre de usuario"
                        required
                        value={formData.username}
                        onChange={handleChange}
                        className={styles.input}
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className={styles.input}
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Contraseña"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className={styles.input}
                    />

                    {error && <div className={styles.error}>{error}</div>} {/* Mostrar el error si es necesario */}

                    <div className={styles.linksRow}>
                        <p className={styles.linkRight}>
                            <a href="/login">¿Ya tienes una cuenta? Iniciar sesión</a>
                        </p>
                    </div>

                    <button type="submit" className={styles.submitBtn}>
                        Registrarse
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

export default Register;
