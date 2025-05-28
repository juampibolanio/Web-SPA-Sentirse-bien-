import React, { useEffect, useState } from 'react';
import styles from '../styles/Servicios.module.css';
import axios from 'axios';
import { getToken } from '../auth/auth';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaMoneyBillWave, FaClipboardList } from 'react-icons/fa';

function Servicios() {
    const [servicios, setServicios] = useState([]);
    const [servicioSeleccionado, setServicioSeleccionado] = useState(null);
    const [cargando, setCargando] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = getToken();
        if (!token) {
            console.error('No hay token de autenticación.');
            return;
        }

        axios.get('http://localhost:8080/api/servicios/todos', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => {
            setServicios(response.data);
            setCargando(false);
        })
        .catch(error => {
            console.error('Error al obtener los servicios:', error);
            setCargando(false);
        });
    }, []);

    const toggleSeleccion = (servicio) => {
        setServicioSeleccionado(
            servicioSeleccionado?.id === servicio.id ? null : servicio
        );
    };

    const continuar = () => {
        if (servicioSeleccionado) {
            navigate('/solicitud-turno', { state: { servicio: servicioSeleccionado } });
        }
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.titulo}>
                <FaClipboardList className={styles.iconoTitulo} /> Seleccioná un servicio
            </h2>

            {cargando ? (
                <div className={styles.loaderContainer}>
                    <div className={styles.loader}></div>
                    <p className={styles.cargandoTexto}>Cargando servicios...</p>
                </div>
            ) : (
                <>
                    <div className={styles.grid}>
                        {servicios.map(servicio => (
                            <div
                                key={servicio.id}
                                className={`${styles.card} ${servicioSeleccionado?.id === servicio.id ? styles.seleccionado : ''}`}
                                onClick={() => toggleSeleccion(servicio)}
                            >
                                <h3 className={styles.nombre}>
                                    {servicioSeleccionado?.id === servicio.id && (
                                        <FaCheckCircle className={styles.iconoCheck} />
                                    )}
                                    {servicio.nombre}
                                </h3>
                                <p className={styles.descripcion}>{servicio.descripcion}</p>
                                <p className={styles.precio}><FaMoneyBillWave className={styles.iconoPrecio} /> ${servicio.precio}</p>
                            </div>
                        ))}
                    </div>

                    {servicioSeleccionado && (
                        <button className={styles.boton} onClick={continuar}>
                            Continuar
                        </button>
                    )}
                </>
            )}
        </div>
    );
}

export default Servicios;
