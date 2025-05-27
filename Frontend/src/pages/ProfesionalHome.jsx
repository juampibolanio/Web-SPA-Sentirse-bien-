import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getToken } from '../auth/auth';
import styles from '../styles/ProfesionalHome.module.css';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FaPrint, FaFilePdf, FaUndo, FaCalendarDay } from 'react-icons/fa';

export default function ProfesionalHome({ usuario }) {
    const [turnos, setTurnos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [fechaFiltro, setFechaFiltro] = useState('');
    const [servicioFiltro, setServicioFiltro] = useState('');

    useEffect(() => {
        const fetchTurnos = async () => {
            try {
                const token = getToken();
                const response = await axios.get(`http://localhost:8080/api/turnos/profesional/${usuario.id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setTurnos(response.data);
            } catch (err) {
                setError('No se pudieron cargar los turnos');
            } finally {
                setLoading(false);
            }
        };

        if (usuario?.id) {
            fetchTurnos();
        }
    }, [usuario]);

    const imprimirTurnos = () => window.print();

    const serviciosDisponibles = [...new Set(turnos.map(t => t.servicioNombre))];

    const turnosFiltrados = turnos.filter(t => {
        return (
            (!fechaFiltro || t.fecha === fechaFiltro) &&
            (!servicioFiltro || t.servicioNombre === servicioFiltro)
        );
    });

    const exportarPDF = () => {
        const doc = new jsPDF();
        doc.text(`Turnos del profesional ${usuario.nombre}`, 14, 10);

        const columnas = ['Cliente', 'Servicio', 'Fecha', 'Hora Inicio', 'Hora Fin', 'Método Pago', 'Pagado'];
        const filas = turnosFiltrados.map((t) => [
            `${t.clienteNombre} ${t.clienteApellido}`,
            t.servicioNombre,
            t.fecha,
            t.horaInicio,
            t.horaFin,
            t.metodoPago,
            t.pagado ? 'Sí' : 'No',
        ]);

        autoTable(doc, {
            head: [columnas],
            body: filas,
            startY: 20,
        });

        doc.text(`Total de turnos: ${turnosFiltrados.length}`, 14, doc.lastAutoTable.finalY + 10);
        doc.save('turnos_filtrados.pdf');
    };

    const verTurnosDiaSiguiente = () => {
        const mañana = new Date();
        mañana.setDate(mañana.getDate() + 1);
        const iso = mañana.toISOString().split('T')[0];
        setFechaFiltro(iso);
    };

    const limpiarFiltros = () => {
        setFechaFiltro('');
        setServicioFiltro('');
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.titulo}>Hola, {usuario.nombre}</h2>
            <p>Este es tu panel como profesional.</p>

            <div className={styles.botones}>
                <button className={styles.botonImprimir} onClick={imprimirTurnos}>
                    <FaPrint style={{ marginRight: '6px' }} /> Imprimir
                </button>
                <button onClick={verTurnosDiaSiguiente}>
                    <FaCalendarDay style={{ marginRight: '6px' }} /> Día siguiente
                </button>
                <button onClick={exportarPDF}>
                    <FaFilePdf style={{ marginRight: '6px' }} /> Exportar PDF
                </button>
                <button onClick={limpiarFiltros}>
                    <FaUndo style={{ marginRight: '6px' }} /> Limpiar filtros
                </button>
            </div>

            <div className={styles.filtros}>
                <label htmlFor="fechaFiltro">Fecha:</label>
                <input
                    type="date"
                    id="fechaFiltro"
                    value={fechaFiltro}
                    onChange={(e) => setFechaFiltro(e.target.value)}
                />
            </div>

            <div className={styles.filtros}>
                <label htmlFor="servicioFiltro">Servicio:</label>
                <select
                    id="servicioFiltro"
                    value={servicioFiltro}
                    onChange={(e) => setServicioFiltro(e.target.value)}
                >
                    <option value="">Todos</option>
                    {serviciosDisponibles.map((servicio, index) => (
                        <option key={index} value={servicio}>
                            {servicio}
                        </option>
                    ))}
                </select>
            </div>

            {loading ? (
                <p className={styles.estado}>Cargando turnos...</p>
            ) : error ? (
                <p className={styles.estado} style={{ color: 'var(--color-error)' }}>{error}</p>
            ) : turnosFiltrados.length === 0 ? (
                <p className={styles.estado}>No tenés turnos asignados con los filtros actuales.</p>
            ) : (
                <>
                    <table className={styles.tabla}>
                        <thead>
                            <tr>
                                <th>Cliente</th>
                                <th>Servicio</th>
                                <th>Fecha</th>
                                <th>Hora inicio</th>
                                <th>Hora fin</th>
                                <th>Método de pago</th>
                            </tr>
                        </thead>
                        <tbody>
                            {turnosFiltrados.map((t) => (
                                <tr key={t.id}>
                                    <td data-label="Cliente">{t.clienteNombre} {t.clienteApellido}</td>
                                    <td data-label="Servicio">{t.servicioNombre}</td>
                                    <td data-label="Fecha">{t.fecha}</td>
                                    <td data-label="Hora inicio">{t.horaInicio}</td>
                                    <td data-label="Hora fin">{t.horaFin}</td>
                                    <td data-label="Método de pago">{t.metodoPago}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <p style={{ marginTop: '1rem' }}>
                        Total de turnos: <strong>{turnosFiltrados.length}</strong>
                    </p>
                </>
            )}
        </div>
    );
}
