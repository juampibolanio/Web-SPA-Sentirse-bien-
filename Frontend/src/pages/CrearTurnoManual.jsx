import React, { useEffect, useState } from 'react';
import styles from '../styles/CrearTurnoManual.module.css';
import { useNavigate } from 'react-router-dom';

export default function CrearTurnoManual() {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const [clientes, setClientes] = useState([]);
    const [profesionales, setProfesionales] = useState([]);
    const [servicios, setServicios] = useState([]);

    const [clienteId, setClienteId] = useState('');
    const [profesionalId, setProfesionalId] = useState('');
    const [servicioId, setServicioId] = useState('');
    const [fecha, setFecha] = useState('');
    const [horaInicio, setHoraInicio] = useState('');
    const [horaFin, setHoraFin] = useState('');
    const [pagado, setPagado] = useState(false);
    const [pagoWeb, setPagoWeb] = useState(false);
    const [metodoPago, setMetodoPago] = useState('');

    const [mensaje, setMensaje] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [clientesRes, profesionalesRes, serviciosRes] = await Promise.all([
                    fetch('http://localhost:8080/api/usuarios/clientes', { headers: { Authorization: `Bearer ${token}` } }),
                    fetch('http://localhost:8080/api/usuarios/profesionales', { headers: { Authorization: `Bearer ${token}` } }),
                    fetch('http://localhost:8080/api/servicios/todos', { headers: { Authorization: `Bearer ${token}` } })
                ]);

                const clientesData = await clientesRes.json();
                const profesionalesData = await profesionalesRes.json();
                const serviciosData = await serviciosRes.json();

                setClientes(clientesData);
                setProfesionales(profesionalesData);
                setServicios(serviciosData);
            } catch (error) {
                console.error('Error al cargar datos:', error);
            }
        };

        fetchData();
    }, [token]);

    const crearTurno = async () => {
        if (!clienteId || !profesionalId || !servicioId || !fecha || !horaInicio || !horaFin) {
            setMensaje('Completá todos los campos obligatorios.');
            return;
        }

        const turno = {
            clienteId: parseInt(clienteId),
            profesionalId: parseInt(profesionalId),
            servicioId: parseInt(servicioId),
            fecha,
            horaInicio,
            horaFin,
            pagado,
            pagoWeb,
            metodoPago,
        };

        try {
            const res = await fetch('http://localhost:8080/api/turnos/crear', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(turno),
            });

            if (!res.ok) {
                const errorTexto = await res.text(); // esto muestra el error devuelto por el backend
                console.error('Respuesta del backend:', errorTexto);
                throw new Error('Error al crear el turno');
            }
            setMensaje('Turno creado correctamente.');
            // limpiar formulario si querés
        } catch (error) {
            console.error(error);
            setMensaje('No se pudo crear el turno.');
        }
    };

    return (
        <div className={styles.container}>
            <h2>Crear Turno Manual</h2>

            <div className={styles.formGroup}>
                <label>Cliente:</label>
                <select value={clienteId} onChange={(e) => setClienteId(e.target.value)}>
                    <option value="">Seleccionar cliente</option>
                    {clientes.map((c) => (
                        <option key={c.id} value={c.id}>{c.nombre} {c.apellido}</option>
                    ))}
                </select>
            </div>

            <div className={styles.formGroup}>
                <label>Profesional:</label>
                <select value={profesionalId} onChange={(e) => setProfesionalId(e.target.value)}>
                    <option value="">Seleccionar profesional</option>
                    {profesionales.map((p) => (
                        <option key={p.id} value={p.id}>{p.nombre} {p.apellido}</option>
                    ))}
                </select>
            </div>

            <div className={styles.formGroup}>
                <label>Servicio:</label>
                <select value={servicioId} onChange={(e) => setServicioId(e.target.value)}>
                    <option value="">Seleccionar servicio</option>
                    {servicios.map((s) => (
                        <option key={s.id} value={s.id}>{s.nombre}</option>
                    ))}
                </select>
            </div>

            <div className={styles.formGroup}>
                <label>Fecha:</label>
                <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
            </div>

            <div className={styles.formGroup}>
                <label>Hora de inicio:</label>
                <input type="time" value={horaInicio} onChange={(e) => setHoraInicio(e.target.value)} />
            </div>

            <div className={styles.formGroup}>
                <label>Hora de fin:</label>
                <input type="time" value={horaFin} onChange={(e) => setHoraFin(e.target.value)} />
            </div>

            <div className={styles.formGroup}>
                <label>Método de pago:</label>
                <select value={metodoPago} onChange={(e) => setMetodoPago(e.target.value)}>
                    <option value="">Seleccionar método</option>
                    <option value="EFECTIVO">Efectivo</option>
                    <option value="TARJETA_DEBITO">Tarjeta de Débito</option>
                </select>
            </div>

            <div className={styles.formGroup}>
                <label>¿Pagado?</label>
                <input type="checkbox" checked={pagado} onChange={() => setPagado(!pagado)} />
            </div>

            <div className={styles.formGroup}>
                <label>¿Pago Web?</label>
                <input type="checkbox" checked={pagoWeb} onChange={() => setPagoWeb(!pagoWeb)} />
            </div>

            <button onClick={crearTurno} className={styles.boton}>Crear turno</button>
            <button onClick={() => navigate('/home')} className={styles.volver}>Volver</button>

            {mensaje && <p>{mensaje}</p>}
        </div>
    );
}
