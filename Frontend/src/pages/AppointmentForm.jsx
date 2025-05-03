import { useState } from 'react';
import axios from 'axios';
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

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Combinar fecha y hora en el formato adecuado (yyyy-MM-dd'T'HH:mm)
        const fecha = formData.fecha + 'T' + formData.horaInicio; // Combina fecha y hora de inicio
        const horaFin = formData.fecha + 'T' + formData.horaFin; // Combina fecha y hora de fin

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/turnos`, {
                nombre: formData.nombre,
                dni: formData.dni,
                direccion: formData.direccion,
                telefono: formData.telefono,
                fecha: fecha, // Envía la fecha combinada
                horaInicio: fecha, // Envía la hora de inicio combinada
                horaFin: horaFin, // Envía la hora de fin combinada
                servicioId: parseInt(formData.servicioId)
            });

            if (response.status === 201) {
                console.log("Turno creado correctamente:", response.data);
                // Limpiar formulario
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

                    <input
                        type="text"
                        name="nombre"
                        placeholder="Nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="dni"
                        placeholder="DNI"
                        value={formData.dni}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="direccion"
                        placeholder="Dirección"
                        value={formData.direccion}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="telefono"
                        placeholder="Teléfono"
                        value={formData.telefono}
                        onChange={handleChange}
                        required
                    />

                    <label>Seleccioná un servicio:</label>
                    <select
                        name="servicioId"
                        value={formData.servicioId}
                        onChange={handleChange}
                        required
                    >
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

                    <label>Fecha del turno:</label>
                    <input
                        type="date"
                        name="fecha"
                        value={formData.fecha}
                        onChange={handleChange}
                        required
                    />

                    <div className={styles.timeInputs}>
                        <div>
                            <label>Hora de inicio:</label>
                            <input
                                type="time"
                                name="horaInicio"
                                value={formData.horaInicio}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <label>Hora de fin:</label>
                            <input
                                type="time"
                                name="horaFin"
                                value={formData.horaFin}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className={styles.submitBtn}>Confirmar turno</button>
                </form>
            </div>
        </>
    );
};

export default AppointmentForm;
