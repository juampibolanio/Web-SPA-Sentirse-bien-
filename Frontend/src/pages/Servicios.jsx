// src/pages/Servicios.jsx
import React, { useEffect, useState } from 'react';
import styles from '../styles/Servicios.module.css'; // Usamos CSS Modules básicos
import axios from 'axios';
import { getToken } from '../auth/auth'; // Importá esto al principio
import { useNavigate } from 'react-router-dom';


function Servicios() {
    const [servicios, setServicios] = useState([]);
    const [seleccionados, setSeleccionados] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const token = getToken();
        if (!token) {
            console.error('No hay token de autenticación. Redirigiendo o mostrando mensaje...');
            return;
        }

        axios.get('http://localhost:8080/api/servicios/todos', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                setServicios(response.data);
            })
            .catch(error => {
                console.error('Error al obtener los servicios:', error);
            });
    }, []);


    const toggleSeleccion = (servicio) => {
        const yaSeleccionado = seleccionados.find(s => s.id === servicio.id);
        if (yaSeleccionado) {
            setSeleccionados(seleccionados.filter(s => s.id !== servicio.id));
        } else {
            setSeleccionados([...seleccionados, servicio]);
        }
    };

    const continuar = () => {
        navigate('/solicitud-turno', { state: { servicios: seleccionados } });
    };

    return (
        <div className={styles.container}>
            <h2>Seleccioná uno o más servicios</h2>
            <div className={styles.grid}>
                {servicios.map(servicio => (
                    <div
                        key={servicio.id}
                        className={`${styles.card} ${seleccionados.some(s => s.id === servicio.id) ? styles.seleccionado : ''}`}
                        onClick={() => toggleSeleccion(servicio)}
                    >
                        <h3>{servicio.nombre}</h3>
                        <p>{servicio.descripcion}</p>
                        <p><strong>${servicio.precio}</strong></p>
                    </div>
                ))}
            </div>
            {seleccionados.length > 0 && (
                <button className={styles.boton} onClick={continuar}>
                    Continuar
                </button>
            )}
        </div>
    );
}

export default Servicios;
