import React, { useState, useEffect } from 'react';
import styles from '../styles/ReportesPagos.module.css';

function ReportesPagos() {
    const token = localStorage.getItem('token');

    const [desde, setDesde] = useState('');
    const [hasta, setHasta] = useState('');
    const [profesionalId, setProfesionalId] = useState('');
    const [servicioId, setServicioId] = useState('');

    const [profesionales, setProfesionales] = useState([]);
    const [servicios, setServicios] = useState([]);

    const [resultados, setResultados] = useState(null);
    const [resultadosPorProfesional, setResultadosPorProfesional] = useState([]);
    const [resultadosPorServicio, setResultadosPorServicio] = useState([]);

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!token) {
            setError('No hay token. Iniciá sesión nuevamente.');
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            try {
                const [profesionalesRes, serviciosRes] = await Promise.all([
                    fetch('http://localhost:8080/api/usuarios/profesionales', {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    fetch('http://localhost:8080/api/servicios/todos', {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                ]);

                if (!profesionalesRes.ok || !serviciosRes.ok) {
                    throw new Error('Error al cargar profesionales o servicios');
                }

                const profesionalesData = await profesionalesRes.json();
                const serviciosData = await serviciosRes.json();

                setProfesionales(profesionalesData);
                setServicios(serviciosData);
                setError('');
            } catch (err) {
                console.error(err);
                setError('Error al cargar profesionales o servicios');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [token]);

    const validarFechas = () => {
        if (!desde || !hasta) {
            setError('Seleccioná un rango de fechas válido');
            return false;
        }
        if (desde > hasta) {
            setError('La fecha "Desde" no puede ser mayor que la "Hasta"');
            return false;
        }
        setError('');
        return true;
    };

    const buscarPagos = async () => {
        if (!validarFechas()) {
            setResultados(null);
            return;
        }

        setLoading(true);
        setResultadosPorProfesional([]);
        setResultadosPorServicio([]);

        try {
            const params = new URLSearchParams();
            params.append('desde', desde);
            params.append('hasta', hasta);
            if (profesionalId) params.append('profesionalId', profesionalId);
            if (servicioId) params.append('servicioId', servicioId);

            const url = `http://localhost:8080/api/reportes/pagos?${params.toString()}`;

            const res = await fetch(url, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);

            const data = await res.json();

            if (!data.detalle || data.detalle.length === 0) {
                setError('No se encontraron resultados');
                setResultados(null);
            } else {
                setError('');
                setResultados(data);
            }
        } catch (err) {
            console.error(err);
            setError('Error al obtener los datos');
            setResultados(null);
        } finally {
            setLoading(false);
        }
    };

    const buscarPorProfesional = async () => {
        if (!validarFechas()) {
            setResultadosPorProfesional([]);
            return;
        }

        setLoading(true);
        setResultados(null);
        setResultadosPorServicio([]);

        try {
            const url = `http://localhost:8080/api/reportes/pagos/profesional?desde=${desde}&hasta=${hasta}`;

            const res = await fetch(url, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) throw new Error('Error al consultar reporte por profesional');

            const data = await res.json();

            if (!Array.isArray(data) || data.length === 0) {
                setError('No se encontraron resultados por profesional');
                setResultadosPorProfesional([]);
            } else {
                setError('');
                setResultadosPorProfesional(data);
            }
        } catch (err) {
            console.error(err);
            setError('Error al obtener el reporte por profesional');
            setResultadosPorProfesional([]);
        } finally {
            setLoading(false);
        }
    };

    const buscarPorServicio = async () => {
        if (!validarFechas()) {
            setResultadosPorServicio([]);
            return;
        }

        setLoading(true);
        setResultados(null);
        setResultadosPorProfesional([]);

        try {
            const url = `http://localhost:8080/api/reportes/pagos/servicio?desde=${desde}&hasta=${hasta}`;

            const res = await fetch(url, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) throw new Error('Error al consultar reporte por servicio');

            const data = await res.json();

            if (!Array.isArray(data) || data.length === 0) {
                setError('No se encontraron resultados por servicio');
                setResultadosPorServicio([]);
            } else {
                setError('');
                setResultadosPorServicio(data);
            }
        } catch (err) {
            console.error(err);
            setError('Error al obtener el reporte por servicio');
            setResultadosPorServicio([]);
        } finally {
            setLoading(false);
        }
    };

    const getNombreProfesional = (id) => {
        const prof = profesionales.find((p) => p.id === id);
        return prof ? `${prof.nombre} ${prof.apellido}` : `ID ${id}`;
    };

    const getNombreServicio = (id) => {
        const serv = servicios.find((s) => s.id === id);
        return serv ? serv.nombre : `ID ${id}`;
    };

    const formatFecha = (fecha) => {
        const dateObj = new Date(fecha);
        if (isNaN(dateObj)) return fecha;
        return dateObj.toLocaleDateString();
    };

    const formatMonto = (monto) => {
        const num = typeof monto === 'string' ? parseFloat(monto) : monto;
        if (isNaN(num)) return monto;
        return `$${num.toFixed(2)}`;
    };

    const pagosOrdenados = resultados?.detalle
        ? [...resultados.detalle].sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
        : [];

    return (
        <div className={styles.container}>
            <h2>Reporte de Pagos</h2>

            <div className={styles.filtros}>
                <label>Desde:</label>
                <input type="date" value={desde} onChange={(e) => setDesde(e.target.value)} />
                <label>Hasta:</label>
                <input type="date" value={hasta} onChange={(e) => setHasta(e.target.value)} />
                <label>Profesional:</label>
                <select value={profesionalId} onChange={(e) => setProfesionalId(e.target.value)}>
                    <option value="">Todos</option>
                    {profesionales.map((p) => (
                        <option key={p.id} value={p.id}>
                            {p.nombre} {p.apellido}
                        </option>
                    ))}
                </select>
                <label>Servicio:</label>
                <select value={servicioId} onChange={(e) => setServicioId(e.target.value)}>
                    <option value="">Todos</option>
                    {servicios.map((s) => (
                        <option key={s.id} value={s.id}>
                            {s.nombre}
                        </option>
                    ))}
                </select>
            </div>

            <div className={styles.botones}>
                <button onClick={buscarPagos} disabled={loading}>Buscar</button>
                <button onClick={buscarPorProfesional} disabled={loading}>Totales por Profesional</button>
                <button onClick={buscarPorServicio} disabled={loading}>Totales por Servicio</button>
            </div>

            {loading && (
                <div className={styles.loader}>
                    <div></div><div></div><div></div>
                </div>
            )}

            {error && <p className={styles.error}>{error}</p>}

            {pagosOrdenados.length > 0 && (
                <div className={styles.resultados}>
                    <h3>Resultados detallados:</h3>
                    <ul>
                        {pagosOrdenados.map((pago, index) => (
                            <li key={index}>
                                <strong>Fecha:</strong> {formatFecha(pago.fecha)} |{' '}
                                <strong>Profesional:</strong> {getNombreProfesional(pago.profesionalId)} |{' '}
                                <strong>Servicio:</strong> {getNombreServicio(pago.servicioId)} |{' '}
                                <strong>Monto:</strong> {formatMonto(pago.monto)}
                            </li>
                        ))}
                        <li><strong>Total Recaudado:</strong> {formatMonto(resultados?.totalRecaudado || 0)}</li>
                    </ul>
                </div>
            )}

            {resultadosPorProfesional.length > 0 && (
                <div className={styles.resultados}>
                    <h3>Totales por Profesional:</h3>
                    <ul>
                        {resultadosPorProfesional.map((p, index) => (
                            <li key={index}>
                                <strong>{p.profesionalNombre}</strong> - Turnos: {p.cantidadTurnos} |{' '}
                                Total: {formatMonto(p.totalRecaudado)}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {resultadosPorServicio.length > 0 && (
                <div className={styles.resultados}>
                    <h3>Totales por Servicio:</h3>
                    <ul>
                        {resultadosPorServicio.map((s, index) => (
                            <li key={index}>
                                <strong>{s.servicioNombre}</strong> - Turnos: {s.cantidadTurnos} |{' '}
                                Total: {formatMonto(s.totalRecaudado)}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default ReportesPagos;
