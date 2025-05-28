import React, { useEffect, useState } from 'react';
import styles from '../styles/SolicitudTurno.module.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { getUserEmailFromToken, fetchUsuarioPorEmail } from '../auth/auth';
import { FaCalendarAlt, FaClock, FaMoneyBillWave } from 'react-icons/fa';

function SolicitudTurno() {
    const location = useLocation();
    const navigate = useNavigate();
    const [fecha, setFecha] = useState('');
    const [horaInicio, setHoraInicio] = useState('');
    const [horaFin, setHoraFin] = useState('');
    const [pago, setPago] = useState('');
    const [error, setError] = useState('');
    const [exito, setExito] = useState('');
    const [loading, setLoading] = useState(false);
    const servicio = location.state?.servicio;

    useEffect(() => {
        if (!servicio) {
            navigate('/servicios');
        }
    }, [servicio, navigate]);

    const validarFecha = (f) => {
        const fechaElegida = new Date(f);
        const ahora = new Date();
        ahora.setHours(0, 0, 0, 0);
        const dosDiasDespues = new Date(ahora);
        dosDiasDespues.setDate(dosDiasDespues.getDate() + 2);
        return fechaElegida >= dosDiasDespues;
    };

    const continuar = async () => {
        setError('');
        setExito('');
        setLoading(true);

        if (!fecha || !horaInicio || !horaFin || !pago) {
            setLoading(false);
            setError('Por favor completá todos los campos');
            return;
        }

        if (!validarFecha(fecha)) {
            setLoading(false);
            setError('La fecha debe tener al menos 48 hs de anticipación');
            return;
        }

        if (!servicio) {
            setLoading(false);
            setError('No hay servicio seleccionado');
            return;
        }

        try {
            const email = getUserEmailFromToken();
            const usuario = await fetchUsuarioPorEmail(email);

            const turno = {
                clienteId: usuario.id,
                profesionalId: servicio.profesionalId,
                servicioId: servicio.id,
                fecha,
                horaInicio,
                horaFin,
                metodoPago: pago === 'debito' ? 'TARJETA_DEBITO' : 'EFECTIVO',
                pagoWeb: pago === 'debito',
                pagado: false,
                estado: 'PENDIENTE'
            };

            const res = await fetch('http://localhost:8080/api/turnos/crear', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(turno)
            });

            if (!res.ok) {
                const msg = await res.text();
                throw new Error(msg || 'Error al enviar turno');
            }

            setExito('Turno solicitado con éxito');
            setTimeout(() => navigate('/'), 2000);

        } catch (err) {
            setError('Hubo un error al enviar el turno: ' + err.message);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.titulo}>Solicitar Turno</h2>

            <div className={styles.seccion}>
                <h3>Servicio seleccionado:</h3>
                {servicio ? (
                    <p className={styles.servicio}>{servicio.nombre} - ${servicio.precio}</p>
                ) : (
                    <p>No hay servicio seleccionado</p>
                )}
            </div>

            <div className={styles.seccion}>
                <label><FaCalendarAlt className={styles.icono}/> Fecha del turno:</label>
                <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
            </div>

            <div className={styles.seccion}>
                <label><FaClock className={styles.icono}/> Hora inicio:</label>
                <input type="time" value={horaInicio} onChange={(e) => setHoraInicio(e.target.value)} />
            </div>

            <div className={styles.seccion}>
                <label><FaClock className={styles.icono}/> Hora fin:</label>
                <input type="time" value={horaFin} onChange={(e) => setHoraFin(e.target.value)} />
            </div>

            <div className={styles.seccion}>
                <label><FaMoneyBillWave className={styles.icono}/> Forma de pago:</label>
                <select value={pago} onChange={(e) => setPago(e.target.value)}>
                    <option value="">Seleccionar</option>
                    <option value="debito">Débito (15% de descuento)</option>
                    <option value="efectivo">Efectivo (precio completo y presencial)</option>
                </select>
            </div>

            {error && <p className={styles.error}>{error}</p>}
            {exito && <p className={styles.exito}>{exito}</p>}
            {loading && <div className={styles.loader}></div>}

            <button className={styles.boton} onClick={continuar} disabled={loading}>
                {loading ? 'Procesando...' : 'Confirmar'}
            </button>
        </div>
    );
}

export default SolicitudTurno;
