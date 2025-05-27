// src/pages/DraHome.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/DraHome.module.css';
import { FaStethoscope, FaUserClock, FaChartBar } from 'react-icons/fa';

export default function DraHome() {
    const navigate = useNavigate();

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Bienvenida Dra. Ana</h2>
            <p className={styles.subtitle}>
                Desde aquí podrá gestionar los servicios y turnos del centro.
            </p>

            <div className={styles.buttons}>
                <button
                    className={styles.button}
                    onClick={() => navigate('/dra/crear-servicio')}
                >
                    <FaStethoscope className={styles.icon} />
                    Crear nuevo servicio
                </button>

                <button
                    className={styles.button}
                    onClick={() => navigate('/dra/crear-turno-manual')}
                >
                    <FaUserClock className={styles.icon} />
                    Crear turno
                </button>

                <button
                    className={styles.button}
                    onClick={() => navigate('/dra/reportes')}
                >
                    <FaChartBar className={styles.icon} />
                    Reportes
                </button>
            </div>
        </div>
    );
}
