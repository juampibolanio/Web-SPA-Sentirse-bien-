import React, { useEffect, useState } from 'react';
import styles from '../styles/CrearTurnoManual.module.css';
import { useNavigate } from 'react-router-dom';
import { FaSpinner, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

export default function CrearTurnoManual() {
    const navigate = useNavigate(); // Hook para navegación entre rutas
    const token = localStorage.getItem('token'); // Token para autenticación

    // Estados para almacenar listas obtenidas desde el backend
    const [clientes, setClientes] = useState([]);
    const [profesionales, setProfesionales] = useState([]);
    const [servicios, setServicios] = useState([]);

    // Estados para los campos del formulario de turno
    const [clienteId, setClienteId] = useState('');
    const [profesionalId, setProfesionalId] = useState('');
    const [servicioId, setServicioId] = useState('');
    const [fecha, setFecha] = useState('');
    const [horaInicio, setHoraInicio] = useState('');
    const [horaFin, setHoraFin] = useState('');
    const [pagado, setPagado] = useState(false);
    const [pagoWeb, setPagoWeb] = useState(false);
    const [metodoPago, setMetodoPago] = useState('');

    // Estado para mostrar mensajes y controlar su tipo (éxito o error)
    const [mensaje, setMensaje] = useState('');
    const [mensajeExito, setMensajeExito] = useState(false);

    // Estado para mostrar loading/spinner mientras se procesa algo
    const [loading, setLoading] = useState(false);

    // useEffect para cargar clientes, profesionales y servicios al montar el componente
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Hace tres fetch en paralelo para obtener datos necesarios
                const [clientesRes, profesionalesRes, serviciosRes] = await Promise.all([
                    fetch('http://localhost:8080/api/usuarios/clientes', { headers: { Authorization: `Bearer ${token}` } }),
                    fetch('http://localhost:8080/api/usuarios/profesionales', { headers: { Authorization: `Bearer ${token}` } }),
                    fetch('http://localhost:8080/api/servicios/todos', { headers: { Authorization: `Bearer ${token}` } })
                ]);

                // Convierte las respuestas a JSON
                const clientesData = await clientesRes.json();
                const profesionalesData = await profesionalesRes.json();
                const serviciosData = await serviciosRes.json();

                // Guarda los datos en los estados correspondientes
                setClientes(clientesData);
                setProfesionales(profesionalesData);
                setServicios(serviciosData);
            } catch (error) {
                console.error('Error al cargar datos:', error);
                // Podrías agregar un estado para mostrar error si quieres
            }
        };

        fetchData();
    }, [token]);

    // Función que se ejecuta al hacer clic en "Crear turno"
    const crearTurno = async () => {
        // Valida que todos los campos obligatorios estén completos
        if (!clienteId || !profesionalId || !servicioId || !fecha || !horaInicio || !horaFin || !metodoPago) {
            setMensaje('Completá todos los campos obligatorios.');
            setMensajeExito(false);
            return;
        }

        // Crea objeto turno con los datos del formulario, convirtiendo IDs a números
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

        setLoading(true);  // Activa el spinner
        setMensaje('');    // Limpia mensajes previos
        setMensajeExito(false);

        try {
            // Envia petición POST al backend para crear el turno
            const res = await fetch('http://localhost:8080/api/turnos/crear', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(turno),
            });

            setLoading(false); // Desactiva spinner

            if (!res.ok) {
                // Si hubo error, lee el texto para debugging
                const errorTexto = await res.text();
                console.error('Respuesta del backend:', errorTexto);
                throw new Error('Error al crear el turno');
            }

            // Mensaje de éxito
            setMensaje('Turno creado correctamente.');
            setMensajeExito(true);
        } catch (error) {
            // Mensaje de error
            setMensaje('No se pudo crear el turno.');
            setMensajeExito(false);
            console.error(error);
        } finally {
            setLoading(false); // Asegura que spinner se apaga si hubo error
        }
    };

    return (
        <div className={styles.container}>
            <h2>Crear Turno Manual</h2>

            {/* Selector de cliente */}
            <div className={styles.formGroup}>
                <label>Cliente:</label>
                <select value={clienteId} onChange={(e) => setClienteId(e.target.value)}>
                    <option value="">Seleccionar cliente</option>
                    {clientes.map((c) => (
                        <option key={c.id} value={c.id}>{c.nombre} {c.apellido}</option>
                    ))}
                </select>
            </div>

            {/* Selector de profesional */}
            <div className={styles.formGroup}>
                <label>Profesional:</label>
                <select value={profesionalId} onChange={(e) => setProfesionalId(e.target.value)}>
                    <option value="">Seleccionar profesional</option>
                    {profesionales.map((p) => (
                        <option key={p.id} value={p.id}>{p.nombre} {p.apellido}</option>
                    ))}
                </select>
            </div>

            {/* Selector de servicio */}
            <div className={styles.formGroup}>
                <label>Servicio:</label>
                <select value={servicioId} onChange={(e) => setServicioId(e.target.value)}>
                    <option value="">Seleccionar servicio</option>
                    {servicios.map((s) => (
                        <option key={s.id} value={s.id}>{s.nombre}</option>
                    ))}
                </select>
            </div>

            {/* Campo de fecha */}
            <div className={styles.formGroup}>
                <label>Fecha:</label>
                <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
            </div>

            {/* Campo hora de inicio */}
            <div className={styles.formGroup}>
                <label>Hora de inicio:</label>
                <input type="time" value={horaInicio} onChange={(e) => setHoraInicio(e.target.value)} />
            </div>

            {/* Campo hora de fin */}
            <div className={styles.formGroup}>
                <label>Hora de fin:</label>
                <input type="time" value={horaFin} onChange={(e) => setHoraFin(e.target.value)} />
            </div>

            {/* Selector método de pago */}
            <div className={styles.formGroup}>
                <label>Método de pago:</label>
                <select value={metodoPago} onChange={(e) => setMetodoPago(e.target.value)}>
                    <option value="">Seleccionar método</option>
                    <option value="EFECTIVO">Efectivo</option>
                    <option value="TARJETA_DEBITO">Tarjeta de Débito</option>
                </select>
            </div>

            {/* Checkboxes para indicar estado de pago */}
            <div className={styles.checkboxGroup}>
                <label>
                    <input
                        type="checkbox"
                        checked={pagado}
                        onChange={() => setPagado(!pagado)}
                    /> Pagado
                </label>
                <label>
                    <input
                        type="checkbox"
                        checked={pagoWeb}
                        onChange={() => setPagoWeb(!pagoWeb)}
                    /> Pago Web
                </label>
            </div>

            {/* Botones Crear y Volver */}
            <div className={styles.botones}>
                <button onClick={crearTurno} className={styles.boton} disabled={loading}>
                    {loading ? <FaSpinner className={styles.spinner} /> : 'Crear turno'}
                </button>
                <button onClick={() => navigate('/home')} className={styles.volver}>
                    Volver
                </button>
            </div>

            {/* Mensajes de éxito o error con íconos */}
            {mensaje && (
                <p className={mensajeExito ? styles.success : styles.error}>
                    {mensajeExito ? <FaCheckCircle /> : <FaExclamationTriangle />} {mensaje}
                </p>
            )}
        </div>
    );
}
