import React from 'react';
import { FaFacebook, FaInstagram, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { TiSocialTwitter } from "react-icons/ti";
import { Link } from 'react-router-dom';
import styles from '../styles/Footer.module.css';
import logo from '../assets/header/logo_spa.png';

const Footer = () => {
  const year = new Date().getFullYear();

  const contacto = [
    { icon: <FaMapMarkerAlt />, text: "Don Bosco 311, Resistencia" },
    { icon: <FaPhone />, text: "3624-978693" },
    { icon: <FaMapMarkerAlt />, text: "San Martín 1430, Corrientes" },
    { icon: <FaPhone />, text: "3794-869473" },
    { icon: <FaEnvelope />, text: "sentirsebienaf@gmail.com" }
  ];

  const enlaces = [
    { name: "Inicio", path: "/" },
    { name: "Servicios", path: "/servicios" },
    { name: "Turnos", path: "/turnos" },
    { name: "Login", path: "/login" }
  ];

  const redes = [
    { icon: <FaFacebook />, url: "https://facebook.com" },
    { icon: <FaInstagram />, url: "https://instagram.com" },
    { icon: <TiSocialTwitter />, url: "https://x.com" }
  ];

  return (
    <footer className={styles.footer}>
      <div className={styles.topSection}>
        <div className={styles.logoWrapper}>
          <img src={logo} alt="Spa Felicidad Logo" className={styles.logo} />
        </div>

        <div className={styles.grid}>
          <div className={styles.column}>
            <h4 className={styles.title}>Contacto</h4>
            {contacto.map((item, idx) => (
              <p key={idx} className={styles.text}>
                <span className={styles.icon}>{item.icon}</span>
                {item.text}
              </p>
            ))}
          </div>

          <div className={styles.column}>
            <h4 className={styles.title}>Enlaces</h4>
            <ul className={styles.links}>
              {enlaces.map((link, idx) => (
                <li key={idx}>
                  <Link to={link.path} className={styles.link}>{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.column}>
            <h4 className={styles.title}>Redes Sociales</h4>
            <div className={styles.socials}>
              {redes.map((r, idx) => (
                <a key={idx} href={r.url} target="_blank" rel="noreferrer">
                  {r.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.bottomSection}>
        <p>© {year} Spa Sentirse Bien. Todos los derechos reservados.</p>
        <p>Desarrollado por: Bolanio Juan Pablo | Manuel Visñuk</p>
      </div>
    </footer>
  );
};

export default Footer;
