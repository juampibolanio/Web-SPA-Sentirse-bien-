import React from 'react';
import { Link } from 'react-router-dom'; 
import styles from '../styles/Header.module.css';
import logo from '../assets/img/logo_spa.png';

export const Header = () => {
    
    return (
        <header className={styles.header}>
            <div className={styles.header_logo_container}>
                <img src={logo} alt="Logo Sentirse Bien" className={styles.logo} />
                <p className={styles.slogan}>Sentirse <br /> bien</p>
            </div>

            <nav className={styles.header_navbar}>
                <ul>
                    <li>
                        <Link to="/">HOME</Link>
                    </li>
                    <li>
                        <Link to="/servicios">SERVICIOS</Link>
                    </li>
                    <li>
                        <Link to="/turnos">TURNOS</Link>
                    </li>
                    <li>
                        <Link to="/login">LOGIN</Link>
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;
