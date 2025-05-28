// src/pages/ClienteHome.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/ClienteHome.module.css';
import { FaConciergeBell, FaCalendarPlus } from 'react-icons/fa';

function ClienteHome({ usuario }) {
    const navigate = useNavigate();

    return (
        <div className={styles.container}>
            <h2 className={styles.titulo}>Bienvenido, {usuario?.nombre}!</h2>
            <p className={styles.subtitulo}>¿Qué deseas hacer hoy?</p>

            <div className={styles.botones}>
                <button onClick={() => navigate('/servicios-public')} className={styles.boton}>
                    <FaConciergeBell className={styles.icono} />
                    Ver Servicios
                </button>
                <button onClick={() => navigate('/solicitud-turno')} className={styles.boton}>
                    <FaCalendarPlus className={styles.icono} />
                    Pedir Turno
                </button>
            </div>
        </div>
    );
}

export default ClienteHome;
