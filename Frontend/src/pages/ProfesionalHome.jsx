/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getToken } from '../auth/auth'; // Función para obtener token de auth
import styles from '../styles/ProfesionalHome.module.css';
import jsPDF from 'jspdf'; // Librería para crear PDFs
import autoTable from 'jspdf-autotable'; // Para tablas en PDFs
import { FaPrint, FaFilePdf, FaUndo, FaCalendarDay, FaPlus, FaTimes } from 'react-icons/fa';

export default function ProfesionalHome({ usuario }) {
    // Estados
    const [turnos, setTurnos] = useState([]); // Lista de turnos
    const [loading, setLoading] = useState(true); // Estado carga inicial
    const [error, setError] = useState(''); // Mensajes de error
    const [fechaFiltro, setFechaFiltro] = useState(''); // Filtro por fecha
    const [servicioFiltro, setServicioFiltro] = useState(''); // Filtro por servicio
    const [detalleEditado, setDetalleEditado] = useState({}); // Guarda detalles editados por turno
    const [turnoGuardando, setTurnoGuardando] = useState(null); // Indica cuál turno se está guardando (loading botón)
    const [turnoCargandoHistorial, setTurnoCargandoHistorial] = useState(null); // Indica cuál turno carga historial (loading botón)
    const [turnoSeleccionado, setTurnoSeleccionado] = useState(null); // (No usado en el código actual)
    const [clienteHistorial, setClienteHistorial] = useState(null); // Datos del historial del cliente
    const [mostrarHistorial, setMostrarHistorial] = useState(false); // Muestra modal con historial

    // Efecto para cargar turnos cuando cambia el usuario
    useEffect(() => {
        const fetchTurnos = async () => {
            try {
                const token = getToken(); // Obtiene token para autorización
                // Solicita turnos del profesional por id
                const response = await axios.get(`http://localhost:8080/api/turnos/profesional/${usuario.id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setTurnos(response.data); // Guarda los turnos recibidos
            } catch (err) {
                setError('No se pudieron cargar los turnos'); // Mensaje de error
            } finally {
                setLoading(false); // Termina carga
            }
        };

        // Solo hace fetch si usuario tiene id válido
        if (usuario?.id) {
            fetchTurnos();
        }
    }, [usuario]);

    // Guarda el detalle de atención editado para un turno específico
    const guardarDetalleAtencion = async (idTurno) => {
        setTurnoGuardando(idTurno); // Muestra estado "guardando" para ese turno
        try {
            const token = getToken();
            const detalle = detalleEditado[idTurno] || ''; // Obtiene detalle editado o cadena vacía
            // Petición PUT para actualizar detalle del turno, envía texto plano
            await axios.put(`http://localhost:8080/api/turnos/${idTurno}/detalle`, detalle, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'text/plain'
                },
            });

            // Actualiza localmente el detalle en la lista de turnos
            const nuevosTurnos = turnos.map((t) =>
                t.id === idTurno ? { ...t, detalle: detalle } : t
            );
            setTurnos(nuevosTurnos);
            alert('Detalle guardado correctamente.');
        } catch (err) {
            alert('Error al guardar el detalle');
        } finally {
            setTurnoGuardando(null); // Quita estado "guardando"
        }
    };

    // Obtiene historial de un cliente para mostrar en modal
    const verHistorialCliente = async (clienteId, turnoId) => {
        setTurnoCargandoHistorial(turnoId); // Indica qué turno está cargando historial
        try {
            const token = getToken();
            const response = await axios.get(`http://localhost:8080/api/turnos/cliente/${clienteId}/historial`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setClienteHistorial(response.data); // Guarda historial recibido
            setMostrarHistorial(true); // Muestra modal con historial
        } catch (err) {
            alert('Error al obtener el historial del cliente.');
        } finally {
            setTurnoCargandoHistorial(null); // Quita loading historial
        }
    };

    // Cierra modal de historial
    const cerrarHistorial = () => {
        setClienteHistorial(null);
        setMostrarHistorial(false);
    };

    // Función para imprimir turnos abriendo una ventana nueva con tabla HTML
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

    // Exporta a PDF la tabla de turnos filtrados usando jsPDF y autotable
    const exportarPDF = () => {
        const doc = new jsPDF();
        doc.text(`Turnos del profesional ${usuario.nombre}`, 14, 10);
        const columnas = ['Cliente', 'Servicio', 'Fecha', 'Hora Inicio', 'Hora Fin', 'Método Pago'];

        // Aplica filtros y arma filas para tabla PDF
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

    // Función para filtrar turnos con fecha del día siguiente
    const verTurnosDiaSiguiente = () => {
        const mañana = new Date();
        mañana.setDate(mañana.getDate() + 1);
        setFechaFiltro(mañana.toISOString().split('T')[0]);
    };

    // Función para filtrar turnos con fecha del día actual
    const verTurnosDeHoy = () => {
        const hoy = new Date();
        setFechaFiltro(hoy.toISOString().split('T')[0]);
    };

    // Limpia filtros de fecha y servicio
    const limpiarFiltros = () => {
        setFechaFiltro('');
        setServicioFiltro('');
    };

    // Obtiene los servicios únicos disponibles para mostrar en el filtro select
    const serviciosDisponibles = Array.from(new Set(turnos.map(t => t.servicioNombre)));

    // Filtra turnos según fecha y servicio seleccionados
    const turnosFiltrados = turnos.filter(t =>
        (!fechaFiltro || t.fecha === fechaFiltro) &&
        (!servicioFiltro || t.servicioNombre === servicioFiltro)
    );

    return (
        <div className={styles.ProfesionalContainer}>
            <h2 className={styles.tituloProf}>Hola, {usuario.nombre} {usuario.apellido}</h2>

            {/* Botones principales: imprimir, filtros rápidos, exportar PDF y limpiar filtros */}
            <div className={styles.botonesProf}>
                <button onClick={imprimirTurnos}><FaPrint /> Imprimir</button>
                <button onClick={verTurnosDiaSiguiente}><FaCalendarDay /> Turnos Mañana</button>
                <button onClick={verTurnosDeHoy}><FaCalendarDay /> Turnos Hoy</button>
                <button onClick={exportarPDF}><FaFilePdf /> Exportar PDF</button>
                <button onClick={limpiarFiltros}><FaUndo /> Limpiar Filtros</button>
            </div>

            {/* Filtros: por fecha y por servicio */}
            <div className={styles.filtrosProf}>
                <label>Fecha:</label>
                <input type="date" value={fechaFiltro} onChange={(e) => setFechaFiltro(e.target.value)} />
                <label>Servicio:</label>
                <select value={servicioFiltro} onChange={(e) => setServicioFiltro(e.target.value)}>
                    <option value="">Todos</option>
                    {serviciosDisponibles.map((s, i) => <option key={i} value={s}>{s}</option>)}
                </select>
            </div>

            {/* Renderizado condicional de turnos */}
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

                                {/* Textarea para editar detalle */}
                                <td>
                                    <textarea
                                        rows="2"
                                        defaultValue={t.detalleAtencion} // Ojo: este campo no está definido en los datos recibidos. Debería ser `t.detalle`
                                        onChange={(e) => {
                                            setDetalleEditado(prev => ({ ...prev, [t.id]: e.target.value }));
                                        }}
                                    />
                                </td>

                                {/* Botón para guardar detalle editado */}
                                <td>
                                    <button
                                        onClick={() => guardarDetalleAtencion(t.id)}
                                        disabled={turnoGuardando === t.id}
                                    >
                                        {turnoGuardando === t.id ? 'Guardando...' : 'Guardar'}
                                    </button>
                                </td>

                                {/* Botón para ver historial del cliente */}
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

            {/* Modal para mostrar historial del cliente */}
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
