import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../styles/HistorialCliente.module.css";

const HistorialCliente = ({ clienteId, onVolver }) => {
    const [historial, setHistorial] = useState([]);

    useEffect(() => {
        axios
            .get(`/api/turnos/cliente/${clienteId}/historial`)
            .then((res) => setHistorial(res.data))
            .catch((err) => console.error("Error al obtener historial", err));
    }, [clienteId]);

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Historial de atención</h2>
            <button onClick={onVolver} className={styles.btnVolver}>
                ← Volver
            </button>
            {historial.length === 0 ? (
                <p className={styles.noHistorial}>No hay historial para este cliente.</p>
            ) : (
                <ul className={styles.lista}>
                    {historial.map((turno) => (
                        <li key={turno.id} className={styles.item}>
                            <div className={styles.fechaHora}>
                                <span role="img" aria-label="calendario" className={styles.icono}>
                                    📅
                                </span>
                                <span>{turno.fecha}</span>
                                <span role="img" aria-label="reloj" className={styles.icono}>
                                    ⏰
                                </span>
                                <span>{turno.horaInicio}</span>
                            </div>
                            <div className={styles.servicio}>
                                <strong>Servicio:</strong>
                                <p>{turno.servicioNombre}</p>
                            </div>
                            <div className={styles.detalle}>
                                <strong>Detalle:</strong>
                                <p>{turno.detalle || "Sin detalle aún"}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default HistorialCliente;
