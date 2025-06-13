import React, { useEffect, useState } from 'react';
import styles from '../styles/Servicios.module.css';
import axios from 'axios';
import { getToken } from '../auth/auth';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaMoneyBillWave, FaClipboardList } from 'react-icons/fa';

function Servicios() {
    const [servicios, setServicios] = useState([]);
    const [serviciosSeleccionados, setServiciosSeleccionados] = useState([]);
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
        const yaSeleccionado = serviciosSeleccionados.some(s => s.id === servicio.id);
        if (yaSeleccionado) {
            setServiciosSeleccionados(serviciosSeleccionados.filter(s => s.id !== servicio.id));
        } else {
            setServiciosSeleccionados([...serviciosSeleccionados, servicio]);
        }
    };

    const continuar = () => {
        if (serviciosSeleccionados.length > 0) {
            navigate('/solicitud-turno', { state: { servicios: serviciosSeleccionados } });
        }
    };

    const estaSeleccionado = (id) => {
        return serviciosSeleccionados.some(serv => serv.id === id);
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.titulo}>
                <FaClipboardList className={styles.iconoTitulo} /> Seleccioná uno o más servicios
            </h2>

            {cargando ? (
                <div className={styles.loaderContainer}>
                    <div className={styles.loader}></div>
                    <p className={styles.cargandoTexto}>Cargando servicios...</p>
                </div>
            ) : (
                <>
                    <div className={styles.grid}>
                        {servicios.map(servicio => {
                            const seleccionado = estaSeleccionado(servicio.id);
                            return (
                                <div
                                    key={servicio.id}
                                    className={`${styles.card} ${seleccionado ? styles.seleccionado : ''}`}
                                    onClick={() => toggleSeleccion(servicio)}
                                    role="button"
                                    tabIndex={0}
                                    aria-pressed={seleccionado}
                                >
                                    <h3 className={styles.nombre}>
                                        {seleccionado && (
                                            <FaCheckCircle className={styles.iconoCheck} />
                                        )}
                                        {servicio.nombre}
                                    </h3>
                                    <p className={styles.descripcion}>{servicio.descripcion}</p>
                                    <p className={styles.precio}>
                                        <FaMoneyBillWave className={styles.iconoPrecio} /> ${servicio.precio}
                                    </p>
                                </div>
                            );
                        })}
                    </div>

                    {serviciosSeleccionados.length > 0 && (
                        <div className={styles.botonContainer}>
                            <button className={styles.boton} onClick={continuar}>
                                Continuar ({serviciosSeleccionados.length})
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default Servicios;
