import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from '../styles/SolicitudTurno.module.css';
import { FaCalendarAlt, FaClock, FaMoneyBillWave } from 'react-icons/fa';
import { getUserEmailFromToken } from '../auth/auth';
import { getUsuarioPorEmail } from '../services/userService';

// Librerías para PDF
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const validarFecha = (fecha) => {
    const fechaTurno = new Date(fecha);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    return fechaTurno >= hoy;
};

const esDomingo = (fechaStr) => {
    if (!fechaStr) return false;
    const [yyyy, mm, dd] = fechaStr.split('-').map(Number);
    const fecha = new Date(yyyy, mm - 1, dd);
    return fecha.getDay() === 0;
};

const obtenerHorasValidas = (fechaStr) => {
    if (!fechaStr) return [];

    // Para evitar problemas con zona horaria, parseamos manualmente
    const [yyyy, mm, dd] = fechaStr.split('-').map(Number);
    const fecha = new Date(yyyy, mm - 1, dd);
    const diaSemana = fecha.getDay();

    if (diaSemana === 0) return []; // domingo no hay horarios

    let inicio, fin;
    if (diaSemana >= 1 && diaSemana <= 5) {
        inicio = 9;
        fin = 20;
    } else if (diaSemana === 6) {
        inicio = 9;
        fin = 14;
    } else {
        return [];
    }

    const horasValidas = [];
    for (let h = inicio; h <= fin; h++) {
        horasValidas.push(String(h).padStart(2, '0') + ':00');
    }

    return horasValidas;
};


function Modal({ mensaje, tipo, onCerrar }) {
    return (
        <div className={styles.modalFondo}>
            <div className={`${styles.modalContenido} ${styles[tipo]}`}>
                <p>{mensaje}</p>
                <div className="modalBotonContainer">
                    <button onClick={onCerrar} className={styles.modalCerrarBtn}>Cerrar</button>
                </div>
            </div>
        </div>
    );
}

function SolicitudTurno() {
    const location = useLocation();
    const navigate = useNavigate();

    const [serviciosConDatos, setServiciosConDatos] = useState([]);
    const [pago, setPago] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [modalInfo, setModalInfo] = useState({ abierto: false, mensaje: '', tipo: '' });

    useEffect(() => {
        if (!location.state?.servicios || location.state.servicios.length === 0) {
            navigate('/servicios');
        } else {
            const iniciales = location.state.servicios.map(servicio => ({
                ...servicio,
                fecha: '',
                horaInicio: '',
                horaFin: ''
            }));
            setServiciosConDatos(iniciales);
        }
    }, [location.state, navigate]);

    const handleServicioChange = (index, campo, valor) => {
        const actualizados = [...serviciosConDatos];
        if (campo === 'fecha') {
            if (esDomingo(valor)) {
                setError('No se pueden seleccionar turnos los días domingo.');
                actualizados[index].fecha = '';
                actualizados[index].horaInicio = '';
                actualizados[index].horaFin = '';
                setServiciosConDatos(actualizados);
                return;
            } else {
                if (error === 'No se pueden seleccionar turnos los días domingo.') {
                    setError('');
                }
            }
            actualizados[index][campo] = valor;
            actualizados[index].horaInicio = '';
            actualizados[index].horaFin = '';
        } else {
            actualizados[index][campo] = valor;
        }
        setServiciosConDatos(actualizados);
    };

    const cerrarModal = () => {
        setModalInfo({ abierto: false, mensaje: '', tipo: '' });
    };

    const hoyFormatoInput = () => {
        const hoy = new Date();
        const yyyy = hoy.getFullYear();
        const mm = String(hoy.getMonth() + 1).padStart(2, '0');
        const dd = String(hoy.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    };

    // Función para generar PDF estilado con jsPDF y autotable
    const generarPDF = (usuario, turnosPorDia, pagoMetodo, servicios) => {

        const doc = new jsPDF();

        // Título
        doc.setFontSize(18);
        doc.setTextColor('#003366');
        doc.text('Comprobante de Turno - Spa - Sentirse Bien', 105, 20, null, null, 'center');

        // Datos del cliente
        doc.setFontSize(12);
        doc.setTextColor('#222');
        doc.text(`Cliente: ${usuario.nombre} ${usuario.apellido}`, 20, 35);
        doc.text(`Email: ${usuario.email}`, 20, 43);
        doc.text(`Fecha emisión: ${new Date().toLocaleDateString()}`, 20, 51);
        doc.text(`Método de pago: ${pagoMetodo === 'TARJETA_DEBITO' ? 'Débito (15% descuento)' : 'Efectivo (presencial)'}`, 20, 59);

        // Espacio antes tabla
        let startY = 70;

        // Preparar filas para tabla
        const rows = [];
        turnosPorDia.forEach((turno, i) => {
            const nombresServicios = turno.servicioIds
                .map(id => {
                    const serv = servicios.find(s => s.id === id);
                    return serv ? serv.nombre : id;
                })
                .join(', ');
            rows.push([
                i + 1,
                turno.fecha,
                turno.horaInicio,
                turno.horaFin,
                nombresServicios
            ]);
        });


        // Encabezados
        const head = [['N°', 'Fecha', 'Hora inicio', 'Hora fin', 'Servicios']];

        // Generar tabla con autoTable
        autoTable(doc, {
            startY,
            head,
            body: rows,
            styles: { fontSize: 10 },
            headStyles: { fillColor: '#003366', textColor: '#fff' },
            theme: 'striped',
        });

        // Pie de página
        const paginaCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= paginaCount; i++) {
            doc.setPage(i);
            doc.setFontSize(10);
            doc.setTextColor('#666');
            doc.text(`Página ${i} de ${paginaCount}`, 105, 290, null, null, 'center');
        }

        // Descargar PDF
        doc.save('comprobante_turnos.pdf');
    };


    const continuar = async () => {
        setError('');
        setLoading(true);

        try {
            const email = getUserEmailFromToken();
            const usuario = await getUsuarioPorEmail(email);

            for (const s of serviciosConDatos) {
                if (!s.fecha || !s.horaInicio || !s.horaFin) {
                    setError('Completá todos los campos para cada servicio');
                    setLoading(false);
                    return;
                }
                if (esDomingo(s.fecha)) {
                    setError('No se pueden seleccionar turnos los días domingo.');
                    setLoading(false);
                    return;
                }
                if (!validarFecha(s.fecha)) {
                    setError('La fecha debe ser hoy o posterior');
                    setLoading(false);
                    return;
                }
                const horasValidas = obtenerHorasValidas(s.fecha);
                if (!horasValidas.includes(s.horaInicio) || !horasValidas.includes(s.horaFin)) {
                    setError(`Los horarios para el servicio "${s.nombre}" no están dentro del horario permitido.`);
                    setLoading(false);
                    return;
                }
                if (s.horaFin <= s.horaInicio) {
                    setError(`En el servicio "${s.nombre}", la hora fin debe ser posterior a la hora inicio.`);
                    setLoading(false);
                    return;
                }
            }

            if (!pago) {
                setError('Seleccioná un método de pago');
                setLoading(false);
                return;
            }

            // Agrupar servicios por fecha para el DTO
            const turnosPorFechaMap = {};
            serviciosConDatos.forEach(servicio => {
                if (!turnosPorFechaMap[servicio.fecha]) {
                    turnosPorFechaMap[servicio.fecha] = {
                        fecha: servicio.fecha,
                        horaInicio: servicio.horaInicio,
                        horaFin: servicio.horaFin,
                        servicioIds: []
                    };
                }
                turnosPorFechaMap[servicio.fecha].servicioIds.push(servicio.id);
            });

            const turnosPorDia = Object.values(turnosPorFechaMap);

            const solicitudDTO = {
                clienteId: usuario.id,
                profesionalId: serviciosConDatos[0].profesionalId,
                pagoWeb: pago === 'debito',
                metodoPago: pago === 'debito' ? 'TARJETA_DEBITO' : 'EFECTIVO',
                turnosPorDia
            };

            const res = await fetch('http://localhost:8080/api/turnos/multiples', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify([solicitudDTO])
            });

            if (!res.ok) {
                const msg = await res.text();
                throw new Error(msg || 'Error al enviar los turnos');
            }

            // Generar PDF con info de turnos y usuario
            generarPDF(usuario, turnosPorDia, solicitudDTO.metodoPago, serviciosConDatos);

            setModalInfo({ abierto: true, mensaje: 'Turnos solicitados con éxito', tipo: 'exito' });
            setTimeout(() => {
                cerrarModal();
                navigate('/');
            }, 2500);

        } catch (err) {
            setModalInfo({ abierto: true, mensaje: 'Error al enviar los turnos: ' + err.message, tipo: 'error' });
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const cancelar = () => {
        setModalInfo({ abierto: true, mensaje: 'La solicitud fue cancelada', tipo: 'info' });
        setTimeout(() => {
            setModalInfo({ abierto: false, mensaje: '', tipo: '' });
            navigate('/servicios-public');
        }, 1500);
    };

    return (
        <div className={styles.contenedor}>
            <h2 className={styles.titulo}>Solicitud de Turno</h2>

            {serviciosConDatos.map((servicio, index) => {
                const horasValidas = obtenerHorasValidas(servicio.fecha);

                return (
                    <div key={servicio.id} className={styles.servicioCard}>
                        <h3>{servicio.nombre} - ${servicio.precio}</h3>

                        <div className={styles.seccion}>
                            <label><FaCalendarAlt /> Fecha:</label>
                            <input
                                type="date"
                                value={servicio.fecha}
                                min={hoyFormatoInput()}
                                onChange={(e) => handleServicioChange(index, 'fecha', e.target.value)}
                            />
                        </div>

                        <div className={styles.seccion}>
                            <label><FaClock /> Hora inicio:</label>
                            <select
                                value={servicio.horaInicio}
                                onChange={(e) => handleServicioChange(index, 'horaInicio', e.target.value)}
                            >
                                <option value="">Seleccionar</option>
                                {horasValidas.map(h => <option key={h} value={h}>{h}</option>)}
                            </select>
                        </div>

                        <div className={styles.seccion}>
                            <label><FaClock /> Hora fin:</label>
                            <select
                                value={servicio.horaFin}
                                onChange={(e) => handleServicioChange(index, 'horaFin', e.target.value)}
                            >
                                <option value="">Seleccionar</option>
                                {horasValidas.map(h => <option key={h} value={h}>{h}</option>)}
                            </select>
                        </div>
                    </div>
                );
            })}

            <div className={styles.pagoContainer}>
                <label><FaMoneyBillWave /> Método de pago:</label>
                <select value={pago} onChange={e => setPago(e.target.value)}>
                    <option value="">Seleccionar</option>
                    <option value="debito">Débito (15% descuento)</option>
                    <option value="efectivo">Efectivo (presencial)</option>
                </select>
            </div>

            {error && <p className={styles.error}>{error}</p>}

            <div className={styles.botonesContenedor}>
                <button onClick={cancelar} disabled={loading} className={styles.botonCancelar}>Cancelar</button>
                <button onClick={continuar} disabled={loading} className={styles.boton}>
                    {loading ? 'Enviando...' : 'Confirmar'}
                </button>
            </div>

            {modalInfo.abierto && (
                <Modal mensaje={modalInfo.mensaje} tipo={modalInfo.tipo} onCerrar={cerrarModal} />
            )}
        </div>
    );
}

export default SolicitudTurno;
