import React from 'react';
import styles from '../styles/Footer.module.css';
import logo from '../assets/img/logo_spa.png'
import google from '../assets/img/GOOGLE.png'
import facebook from '../assets/img/FACEBOOK.png'
import ig from '../assets/img/INSTAGRAM.png'
import twitter from '../assets/img/TWITTER.png'

export const Footer = () => {
    return (
        <footer className={styles.footer}>
            {/* Imagen encima de la columna central */}
            <div className={styles.footerImage}>
                <img src={logo} alt="Imagen decorativa" />
            </div>

            {/* Las tres columnas */}
            <div className={styles.footerColumns}>
                {/* Columna 1: Links */}
                <div className={styles.column}>
                    <h4 className={styles.columnTitle}>Links</h4>
                    <div className={styles.logoRow}>
                        <img src={google} alt="Google" className={styles.logo} />
                        <img src={ig} alt="Instagram" className={styles.logo} />
                        <img src={facebook} alt="Facebook" className={styles.logo} />
                        <img src={twitter} alt="X" className={styles.logo} />
                    </div>
                </div>

                {/* Columna 2: Legales */}
                <div className={styles.column}>
                    <h4 className={styles.columnTitle}>Legales</h4>
                    <ul className={styles.legalList}>
                        <li><a href="/terminos" className={styles.link}>Términos y Condiciones</a></li>
                        <li><a href="/politica-privacidad" className={styles.link}>Política de Privacidad</a></li>
                    </ul>
                </div>

                {/* Columna 3: Contacto */}
                <div className={styles.column}>
                    <h4 className={styles.columnTitle}>Contacto</h4>
                    <ul className={styles.contactList}>
                        <li>Tel: 3624978693</li>
                        <li>Tel: 3794869473</li>
                        <li>SentirseBien@Gmail.com</li>
                    </ul>
                </div>
            </div>
        </footer>
    );
};
