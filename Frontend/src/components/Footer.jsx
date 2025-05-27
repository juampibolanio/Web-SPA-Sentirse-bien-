import React from 'react';
import { FaFacebook, FaInstagram, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { TiSocialTwitter } from "react-icons/ti";
import { Link } from 'react-router-dom';
import styles from '../styles/Footer.module.css';
import logo from '../assets/header/logo_spa.png'; // Asegurate de tener el logo en esta ruta o ajustala

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.footerImage}>
                <img src={logo} alt="Spa Felicidad Logo" />
            </div>

            <div className={styles.footerColumns}>
                <div className={styles.column}>
                    <h4 className={styles.columnTitle}>Contacto</h4>
                    <p><FaMapMarkerAlt className={styles.icon} /> Calle Ficticia 123, Ciudad</p>
                    <p><FaPhone className={styles.icon} /> +54 11 1234-5678</p>
                    <p><FaEnvelope className={styles.icon} />contacto@spafelicidad.com</p>
                </div>

                <div className={styles.column}>
                    <h4 className={styles.columnTitle}>Enlaces</h4>
                    <ul className={styles.linkList}>
                        <li><Link to="/" className={styles.link}>Inicio</Link></li>
                        <li><Link to="/servicios" className={styles.link}>Servicios</Link></li>
                        <li><Link to="/turnos" className={styles.link}>Turnos</Link></li>
                        <li><Link to="/login" className={styles.link}>Login</Link></li>
                    </ul>
                </div>

                <div className={styles.column}>
                    <h4 className={styles.columnTitle}>Redes Sociales</h4>
                    <div className={styles.socials}>
                        <a href="https://facebook.com" target="_blank" rel="noreferrer"><FaFacebook /></a>
                        <a href="https://instagram.com" target="_blank" rel="noreferrer"><FaInstagram /></a>
                        <a href="https://x.com" target="_blank" rel="noreferrer"><TiSocialTwitter /></a>
                    </div>
                </div>
            </div>

            <div className={styles.credits}>
                © {new Date().getFullYear()} Spa Felicidad. Todos los derechos reservados.
                <p>Desarrollado por: Bolanio Juan Pablo | Manuel Visñuk</p>
            </div>
        </footer>
    );
};

export default Footer;
