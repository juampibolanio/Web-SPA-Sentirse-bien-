// src/components/Header.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/Header2.module.css';
import logo from '../assets/img/LOGO.png';
import { jwtDecode } from 'jwt-decode';


export const Header2 = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const toggleMenu = () => setMenuOpen(!menuOpen);

    const [rol, setRol] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                console.log("🔐 Token decodificado:", decoded); // ⬅️ Esto mostrará el contenido
                setRol(decoded.role || (decoded.roles && decoded.roles[0])); // intentamos capturar el rol
            } catch (error) {
                console.error('Token inválido o expirado', error);
            }
        }
    }, []);

    return (
        <header className={styles.header}>
            <div className={styles.header_logo_container}>
                <img src={logo} alt="Logo Sentirse Bien" className={styles.logo} />
                <p className={styles.slogan}>Sentirse <br /> bien</p>
            </div>

            <div className={styles.menu_toggle} onClick={toggleMenu}>
                <span></span>
                <span></span>
                <span></span>
            </div>

            <nav className={`${styles.header_navbar} ${menuOpen ? styles.active : ''}`}>
                <ul>
                    <li><Link to="/">HOME</Link></li>
                    <li><Link to="/masajes">SERVICIOS</Link></li>
                    <li><Link to="/turnos">TURNOS</Link></li>
                    <li><Link to="/login">LOGIN</Link></li>
                    {rol === 'ROLE_PROFESIONAL' && (
                        <li>
                            <Link to="/admin-panel">PANEL-ADMIN</Link>
                        </li>
                    )}
                </ul>
            </nav>
        </header>
    );
};

export default Header2;
