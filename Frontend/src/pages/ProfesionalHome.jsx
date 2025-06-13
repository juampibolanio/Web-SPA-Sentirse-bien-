/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getToken } from '../auth/auth';
import styles from '../styles/ProfesionalHome.module.css';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FaPrint, FaFilePdf, FaUndo, FaCalendarDay, FaPlus, FaTimes } from 'react-icons/fa';

export default function ProfesionalHome({ usuario }) {
    const [turnos, setTurnos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [fechaFiltro, setFechaFiltro] = useState('');
    const [servicioFiltro, setServicioFiltro] = useState('');
    const [detalleEditado, setDetalleEditado] = useState({});
    const [turnoGuardando, setTurnoGuardando] = useState(null);
    const [turnoCargandoHistorial, setTurnoCargandoHistorial] = useState(null);
    const [turnoSeleccionado, setTurnoSeleccionado] = useState(null);
    const [clienteHistorial, setClienteHistorial] = useState(null);
    const [mostrarHistorial, setMostrarHistorial] = useState(false);

    useEffect(() => {
        const fetchTurnos = async () => {
            try {
                const token = getToken();
                const response = await axios.get(`http://localhost:8080/api/turnos/profesional/${usuario.id}`, {
                    headers: { Authorization: `Bearer ${token}` },
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

    const guardarDetalleAtencion = async (idTurno) => {
        setTurnoGuardando(idTurno);
        try {
            const token = getToken();
            const detalle = detalleEditado[idTurno] || '';
            await axios.put(`http://localhost:8080/api/turnos/${idTurno}/detalle`, detalle, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'text/plain'
                },
            });

            const nuevosTurnos = turnos.map((t) =>
                t.id === idTurno ? { ...t, detalle: detalle } : t
            );
            setTurnos(nuevosTurnos);
            alert('Detalle guardado correctamente.');
        } catch (err) {
            alert('Error al guardar el detalle');
        } finally {
            setTurnoGuardando(null);
        }
    };

    const verHistorialCliente = async (clienteId, turnoId) => {
        setTurnoCargandoHistorial(turnoId);
        try {
            const token = getToken();
            const response = await axios.get(`http://localhost:8080/api/turnos/cliente/${clienteId}/historial`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setClienteHistorial(response.data);
            setMostrarHistorial(true);
        } catch (err) {
            alert('Error al obtener el historial del cliente.');
        } finally {
            setTurnoCargandoHistorial(null);
        }
    };

    const cerrarHistorial = () => {
        setClienteHistorial(null);
        setMostrarHistorial(false);
    };

    const imprimirTurnos = () => {
        const printWindow = window.open('', '_blank');
        const contenido = `
            <html>
                <head><title>Turnos</title></head>
                <body>
                    <h2>Turnos del profesional ${usuario.nombre} ${usuario.apellido}</h2>
                    <table border="1">
                        <tr>
                            <th>Cliente</th>
                            <th>Servicio</th>
                            <th>Fecha</th>
                            <th>Hora Inicio</th>
                            <th>Hora Fin</th>
                            <th>Método Pago</th>
                        </tr>
                        ${turnos.map(t => `
                            <tr>
                                <td>${t.clienteNombre} ${t.clienteApellido}</td>
                                <td>${t.servicioNombre}</td>
                                <td>${t.fecha}</td>
                                <td>${t.horaInicio}</td>
                                <td>${t.horaFin}</td>
                                <td>${t.metodoPago}</td>
                            </tr>`).join('')}
                    </table>
                </body>
            </html>`;
        printWindow.document.open();
        printWindow.document.write(contenido);
        printWindow.document.close();
        printWindow.print();
    };

    const exportarPDF = () => {
        const doc = new jsPDF();
        doc.text(`Turnos del profesional ${usuario.nombre}`, 14, 10);
        const columnas = ['Cliente', 'Servicio', 'Fecha', 'Hora Inicio', 'Hora Fin', 'Método Pago'];
        const filas = turnosFiltrados.map(t => [
            `${t.clienteNombre} ${t.clienteApellido}`,
            t.servicioNombre,
            t.fecha,
            t.horaInicio,
            t.horaFin,
            t.metodoPago,
        ]);
        autoTable(doc, { head: [columnas], body: filas, startY: 20 });
        doc.save('turnos.pdf');
    };

    const verTurnosDiaSiguiente = () => {
        const mañana = new Date();
        mañana.setDate(mañana.getDate() + 1);
        setFechaFiltro(mañana.toISOString().split('T')[0]);
    };

    const verTurnosDeHoy = () => {
        const hoy = new Date();
        setFechaFiltro(hoy.toISOString().split('T')[0]);
    };

    const limpiarFiltros = () => {
        setFechaFiltro('');
        setServicioFiltro('');
    };

    const serviciosDisponibles = Array.from(new Set(turnos.map(t => t.servicioNombre)));

    const turnosFiltrados = turnos.filter(t =>
        (!fechaFiltro || t.fecha === fechaFiltro) &&
        (!servicioFiltro || t.servicioNombre === servicioFiltro)
    );

    return (
        <div className={styles.ProfesionalContainer}>
            <h2 className={styles.tituloProf}>Hola, {usuario.nombre} {usuario.apellido}</h2>
            <div className={styles.botonesProf}>
                <button onClick={imprimirTurnos}><FaPrint /> Imprimir</button>
                <button onClick={verTurnosDiaSiguiente}><FaCalendarDay /> Turnos Mañana</button>
                <button onClick={verTurnosDeHoy}><FaCalendarDay /> Turnos Hoy</button>
                <button onClick={exportarPDF}><FaFilePdf /> Exportar PDF</button>
                <button onClick={limpiarFiltros}><FaUndo /> Limpiar Filtros</button>
            </div>

            <div className={styles.filtrosProf}>
                <label>Fecha:</label>
                <input type="date" value={fechaFiltro} onChange={(e) => setFechaFiltro(e.target.value)} />
                <label>Servicio:</label>
                <select value={servicioFiltro} onChange={(e) => setServicioFiltro(e.target.value)}>
                    <option value="">Todos</option>
                    {serviciosDisponibles.map((s, i) => <option key={i} value={s}>{s}</option>)}
                </select>
            </div>

            {loading ? (
                <p>Cargando turnos...</p>
            ) : error ? (
                <p>{error}</p>
            ) : turnosFiltrados.length === 0 ? (
                <p>No hay turnos para los filtros seleccionados.</p>
            ) : (
                <table className={styles.tablaProf}>
                    <thead>
                        <tr>
                            <th>Cliente</th>
                            <th>Servicio</th>
                            <th>Fecha</th>
                            <th>Hora Inicio</th>
                            <th>Hora Fin</th>
                            <th>Detalle</th>
                            <th>Editar detalle</th>
                            <th>Guardar Detalle</th>
                            <th>Historial</th>
                        </tr>
                    </thead>
                    <tbody>
                        {turnosFiltrados.map(t => (
                            <tr key={t.id}>
                                <td>{t.clienteNombre} {t.clienteApellido}</td>
                                <td>{t.servicioNombre}</td>
                                <td>{t.fecha}</td>
                                <td>{t.horaInicio}</td>
                                <td>{t.horaFin}</td>
                                <td>{t.detalle || '-'}</td>
                                <td>
                                    <textarea
                                        rows="2"
                                        defaultValue={t.detalleAtencion}
                                        onChange={(e) => {
                                            setDetalleEditado(prev => ({ ...prev, [t.id]: e.target.value }));
                                        }}
                                    />
                                </td>
                                <td>
                                    <button
                                        onClick={() => guardarDetalleAtencion(t.id)}
                                        disabled={turnoGuardando === t.id}
                                    >
                                        {turnoGuardando === t.id ? 'Guardando...' : 'Guardar'}
                                    </button>
                                </td>
                                <td>
                                    <button
                                        onClick={() => verHistorialCliente(t.clienteId, t.id)}
                                        disabled={turnoCargandoHistorial === t.id}
                                    >
                                        {turnoCargandoHistorial === t.id ? 'Cargando...' : 'Ver'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {mostrarHistorial && clienteHistorial && (
                <div className={styles.modalProf}>
                    <div className={styles.modalContenidoProf}>
                        <FaTimes className={styles.cerrar} onClick={cerrarHistorial} />
                        <h3>Historial del Cliente</h3>
                        <table className={styles.tablaHistorialProf}>
                            <thead>
                                <tr>
                                    <th>Fecha</th>
                                    <th>Servicio</th>
                                    <th>Detalle</th>
                                </tr>
                            </thead>
                            <tbody>
                                {clienteHistorial.map(t => (
                                    <tr key={t.id}>
                                        <td>{t.fecha}</td>
                                        <td>{t.servicioNombre}</td>
                                        <td>{t.detalle || '-'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
