import { useState } from 'react';
import axios from 'axios';
import styles from '../styles/AppointmentForm.module.css';
import Header2 from '../components/Header2';

const AppointmentForm = () => {
    const [formData, setFormData] = useState({
        dni: '',
        localidad: '',
        direccion: '',
        fecha: '',
        horaInicio: '',
        horaFin: '',
        servicios: [''] 
    });

    const handleChange = (e, index) => {
        const updatedServicios = [...formData.servicios];
        updatedServicios[index] = e.target.value;
        setFormData({ ...formData, servicios: updatedServicios });
    };

    const handleAddService = () => {
        setFormData({
            ...formData,
            servicios: [...formData.servicios, ''] // Añadir un nuevo servicio vacío al array
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/turnos/crear`, {
                dni: formData.dni,
                localidad: formData.localidad,
                direccion: formData.direccion,
                fecha: formData.fecha,
                horaInicio: formData.horaInicio,
                horaFin: formData.horaFin,
                servicios: formData.servicios
            });

            if (response.status === 201) {
                console.log("Turno creado correctamente:", response.data);
                // Aquí podrías redirigir o mostrar un mensaje de éxito
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
                        name="dni"
                        placeholder="DNI"
                        value={formData.dni}
                        onChange={(e) => setFormData({ ...formData, dni: e.target.value })}
                        required
                    />
                    <input
                        type="text"
                        name="localidad"
                        placeholder="Localidad"
                        value={formData.localidad}
                        onChange={(e) => setFormData({ ...formData, localidad: e.target.value })}
                        required
                    />
                    <input
                        type="text"
                        name="direccion"
                        placeholder="Dirección"
                        value={formData.direccion}
                        onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                        required
                    />

                    {formData.servicios.map((servicio, index) => (
                        <div key={index}>
                            {index === 0 && <label>Seleccioná uno o más servicios:</label>} {/* Solo mostrar el label en el primer servicio */}
                            <select
                                name={`servicio-${index}`}
                                value={servicio}
                                onChange={(e) => handleChange(e, index)}
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
                        </div>
                    ))}

                    <button type="button" className={styles.addServiceBtn} onClick={handleAddService}>
                        Añadir otro servicio
                    </button>

                    <label>Fecha del turno:</label>
                    <input
                        type="date"
                        name="fecha"
                        value={formData.fecha}
                        onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                        required
                    />

                    <div className={styles.timeInputs}>
                        <div>
                            <label>Hora de inicio:</label>
                            <input
                                type="time"
                                name="horaInicio"
                                value={formData.horaInicio}
                                onChange={(e) => setFormData({ ...formData, horaInicio: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label>Hora de fin:</label>
                            <input
                                type="time"
                                name="horaFin"
                                value={formData.horaFin}
                                onChange={(e) => setFormData({ ...formData, horaFin: e.target.value })}
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
