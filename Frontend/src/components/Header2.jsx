// src/components/Header.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/Header2.module.css';
import logo from '../assets/img/LOGO.png';


export const Header2 = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const toggleMenu = () => setMenuOpen(!menuOpen);

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
                </ul>
            </nav>
        </header>
    );
};

export default Header2;
