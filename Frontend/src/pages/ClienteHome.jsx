import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/ClienteHome.module.css'; // si usás CSS Modules

function ClienteHome({ usuario }) {
    const navigate = useNavigate();

    return (
        <div className={styles.container}>
            <h2>Bienvenido, {usuario?.nombre}!</h2>

            <div className={styles.botones}>
                <button onClick={() => navigate('/servicios')}>
                    Ver Servicios
                </button>
                <button onClick={() => navigate('/solicitud-turno')}>
                    Pedir Turno
                </button>
            </div>
        </div>
    );
}

export default ClienteHome;
