import { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import styles from '../styles/AppointmentForm.module.css';
import Header2 from '../components/Header2';

const AppointmentForm = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        dni: '',
        direccion: '',
        telefono: '',
        fecha: '',
        horaInicio: '',
        horaFin: '',
        servicioId: ''
    });

    const [precio, setPrecio] = useState(null);
    const [servicioNombre, setServicioNombre] = useState('');
    const [showModal, setShowModal] = useState(false);

    // Objeto con los precios y nombres de los servicios
    const preciosServicios = {
        1: { nombre: 'Anti stress', precio: 3000 },
        2: { nombre: 'Descontracturante', precio: 3500 },
        3: { nombre: 'Masajes con piedras', precio: 4000 },
        4: { nombre: 'Circulatorios', precio: 3200 },
        5: { nombre: 'Lifting de pestañas', precio: 2800 },
        6: { nombre: 'Depilación facial', precio: 2500 },
        7: { nombre: 'Belleza de manos y pies', precio: 3000 },
        8: { nombre: 'Yoga', precio: 2000 },
        9: { nombre: 'Hidromasajes', precio: 4500 },
        10: { nombre: 'Punta de diamante microexfoliación', precio: 3700 },
        11: { nombre: 'Limpieza profunda e hidratación', precio: 3900 },
        12: { nombre: 'Crio frecuencia facial', precio: 4100 },
        13: { nombre: 'Dermohealth', precio: 4200 },
        14: { nombre: 'Crio frecuencia', precio: 4400 },
        15: { nombre: 'Ultracavitación', precio: 4600 },
        16: { nombre: 'VelaSlim', precio: 4800 }
    };

    // Buscar precio y nombre cada vez que cambia el servicio
    useEffect(() => {
        if (formData.servicioId) {
            const servicio = preciosServicios[parseInt(formData.servicioId)];
            if (servicio) {
                setPrecio(servicio.precio);
                setServicioNombre(servicio.nombre);
            }
        } else {
            setPrecio(null);
            setServicioNombre('');
        }
    }, [formData.servicioId]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const generarPDF = (turno) => {
        const doc = new jsPDF();
        doc.setFontSize(14);
        doc.text("Confirmación de Turno - Sentirse Bien", 20, 20);
        doc.text(`Nombre: ${turno.nombre}`, 20, 40);
        doc.text(`DNI: ${turno.dni}`, 20, 50);
        doc.text(`Dirección: ${turno.direccion}`, 20, 60);
        doc.text(`Teléfono: ${turno.telefono}`, 20, 70);
        doc.text(`Servicio: ${turno.servicioNombre}`, 20, 80);
        doc.text(`Fecha: ${formData.fecha}`, 20, 90);
        doc.text(`Hora inicio: ${formData.horaInicio}`, 20, 100);
        doc.text(`Hora fin: ${formData.horaFin}`, 20, 110);
        doc.text(`Precio: $${precio}`, 20, 120);
        doc.save(`turno_${turno.nombre}_${formData.fecha}.pdf`);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const fecha = formData.fecha + 'T' + formData.horaInicio;
        const horaFin = formData.fecha + 'T' + formData.horaFin;

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/turnos`, {
                nombre: formData.nombre,
                dni: formData.dni,
                direccion: formData.direccion,
                telefono: formData.telefono,
                fecha: fecha,
                horaInicio: fecha,
                horaFin: horaFin,
                servicioId: parseInt(formData.servicioId)
            });

            if (response.status === 201) {
                setShowModal(true);
                generarPDF({ ...formData, servicioNombre });
                setFormData({
                    nombre: '',
                    dni: '',
                    direccion: '',
                    telefono: '',
                    fecha: '',
                    horaInicio: '',
                    horaFin: '',
                    servicioId: ''
                });
                setPrecio(null);
                setServicioNombre('');
            } else {
                console.error("Error al crear el turno", response.data);
            }
        } catch (error) {
            console.error("Error de conexión:", error);
        }
    };

    return (
        <>
            <Header2 />
            <div className={styles.appointmentContainer}>
                <form className={styles.appointmentForm} onSubmit={handleSubmit}>
                    <h2>Solicitar Turno</h2>

                    <input type="text" name="nombre" placeholder="Nombre" value={formData.nombre} onChange={handleChange} required />
                    <input type="text" name="dni" placeholder="DNI" value={formData.dni} onChange={handleChange} required />
                    <input type="text" name="direccion" placeholder="Dirección" value={formData.direccion} onChange={handleChange} required />
                    <input type="text" name="telefono" placeholder="Teléfono" value={formData.telefono} onChange={handleChange} required />

                    <label>Seleccioná un servicio:</label>
                    <select name="servicioId" value={formData.servicioId} onChange={handleChange} required>
                        <option value="">-- Seleccioná un servicio --</option>
                        <optgroup label="Masajes">
                            <option value="1">Anti stress</option>
                            <option value="2">Descontracturante</option>
                            <option value="3">Masajes con piedras</option>
                            <option value="4">Circulatorios</option>
                        </optgroup>
                        <optgroup label="Belleza">
                            <option value="5">Lifting de pestañas</option>
                            <option value="6">Depilación facial</option>
                            <option value="7">Belleza de manos y pies</option>
                        </optgroup>
                        <optgroup label="Grupales">
                            <option value="8">Yoga</option>
                            <option value="9">Hidromasajes</option>
                        </optgroup>
                        <optgroup label="Tratamientos Faciales">
                            <option value="10">Punta de diamante microexfoliación</option>
                            <option value="11">Limpieza profunda e hidratación</option>
                            <option value="12">Crio frecuencia facial</option>
                        </optgroup>
                        <optgroup label="Tratamientos Corporales">
                            <option value="13">Dermohealth</option>
                            <option value="14">Crio frecuencia</option>
                            <option value="15">Ultracavitación</option>
                            <option value="16">VelaSlim</option>
                        </optgroup>
                    </select>

                    {precio !== null && (
                        <p className={styles.precio}>Precio: ${precio}</p>
                    )}

                    <label>Fecha del turno:</label>
                    <input type="date" name="fecha" value={formData.fecha} onChange={handleChange} required />

                    <div className={styles.timeInputs}>
                        <div>
                            <label>Hora de inicio:</label>
                            <input type="time" name="horaInicio" value={formData.horaInicio} onChange={handleChange} required />
                        </div>
                        <div>
                            <label>Hora de fin:</label>
                            <input type="time" name="horaFin" value={formData.horaFin} onChange={handleChange} required />
                        </div>
                    </div>

                    <button type="submit" className={styles.submitBtn}>Confirmar turno</button>
                </form>
            </div>

            {showModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h3>¡Turno confirmado!</h3>
                        <p>Se generó un PDF con los datos del turno.</p>
                        <button onClick={() => setShowModal(false)}>Cerrar</button>
                    </div>
                </div>
            )}
        </>
    );
};

export default AppointmentForm;
