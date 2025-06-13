import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/DraHome.module.css';
import { FaStethoscope, FaUserClock, FaChartBar, FaUserCog } from 'react-icons/fa';
import axios from 'axios';

export default function DraHome() {
    const navigate = useNavigate();

    // Estado para mostrar/ocultar el panel de administración de usuarios
    const [mostrarPanelUsuarios, setMostrarPanelUsuarios] = useState(false);

    // Estado para el rol seleccionado (PROFESIONAL o CLIENTE)
    const [rolSeleccionado, setRolSeleccionado] = useState('PROFESIONAL');

    // Lista de usuarios cargados desde el backend según el rol
    const [usuarios, setUsuarios] = useState([]);

    // Indicador de carga para mostrar mensaje mientras se traen los usuarios
    const [cargandoUsuarios, setCargandoUsuarios] = useState(false);

    // ID del usuario cuyo estado (activo/inactivo) se está cambiando para deshabilitar botón
    const [cambiandoEstadoId, setCambiandoEstadoId] = useState(null);

    // Efecto que carga usuarios cuando se abre el panel o cambia el rol seleccionado
    useEffect(() => {
        if (mostrarPanelUsuarios) {
            cargarUsuarios(rolSeleccionado);
        }
    }, [rolSeleccionado, mostrarPanelUsuarios]);

    // Función para cargar usuarios desde backend según rol
    const cargarUsuarios = async (rol) => {
        try {
            setCargandoUsuarios(true);
            const token = localStorage.getItem('token');

            const response = await axios.get(
                `http://localhost:8080/api/usuarios/rol/${rol}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            // Por seguridad, validar que response.data sea un array antes de setear
            setUsuarios(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
            setUsuarios([]);
        } finally {
            setCargandoUsuarios(false);
        }
    };

    // Función para cambiar el estado activo/inactivo del usuario
    const cambiarEstado = async (id, activo) => {
        try {
            setCambiandoEstadoId(id);
            const token = localStorage.getItem('token');

            // Elegir el endpoint según el estado actual (activar o desactivar)
            const endpoint = activo
                ? `http://localhost:8080/api/usuarios/${id}/desactivar`
                : `http://localhost:8080/api/usuarios/${id}/activar`;

            // Petición PUT para cambiar estado sin body
            await axios.put(endpoint, null, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            // Recargar la lista de usuarios para reflejar el cambio
            await cargarUsuarios(rolSeleccionado);
        } catch (error) {
            console.error('Error al cambiar estado del usuario:', error);
        } finally {
            setCambiandoEstadoId(null);
        }
    };

    // Función para mostrar u ocultar el panel de usuarios
    const togglePanelUsuarios = () => {
        setMostrarPanelUsuarios(!mostrarPanelUsuarios);
    };

    return (
        <div className={styles.container}>
            {/* Título y subtítulo */}
            <h2 className={styles.title}>Bienvenida Dra. Ana</h2>
            <p className={styles.subtitle}>
                Desde aquí podrá gestionar los servicios y turnos del centro.
            </p>

            {/* Botones principales de navegación */}
            <div className={styles.buttons}>
                <button className={styles.button} onClick={() => navigate('/dra/crear-servicio')}>
                    <FaStethoscope className={styles.icon} />
                    Crear nuevo servicio
                </button>

                <button className={styles.button} onClick={() => navigate('/dra/crear-turno-manual')}>
                    <FaUserClock className={styles.icon} />
                    Crear turno
                </button>

                <button className={styles.button} onClick={() => navigate('/dra/reportes')}>
                    <FaChartBar className={styles.icon} />
                    Reportes
                </button>

                {/* Botón que alterna la visibilidad del panel de administración */}
                <button className={styles.button} onClick={togglePanelUsuarios}>
                    <FaUserCog className={styles.icon} />
                    Administrar usuarios
                </button>
            </div>

            {/* Panel de administración de usuarios (solo si está activo) */}
            {mostrarPanelUsuarios && (
                <div className={styles.userPanel}>
                    <h3 className={styles.subtitle}>Administrar usuarios por rol</h3>

                    {/* Selector de rol para filtrar usuarios */}
                    <div className={styles.selector}>
                        <label htmlFor="rol">Seleccionar rol:</label>
                        <select
                            id="rol"
                            value={rolSeleccionado}
                            onChange={(e) => setRolSeleccionado(e.target.value)}
                        >
                            <option value="PROFESIONAL">Profesionales</option>
                            <option value="CLIENTE">Clientes</option>
                        </select>
                    </div>

                    {/* Mostrar mensaje de carga o tabla con usuarios */}
                    {cargandoUsuarios ? (
                        <p className={styles.loading}>Cargando usuarios...</p>
                    ) : (
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Email</th>
                                    <th>Activo</th>
                                    <th>Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* Listar usuarios */}
                                {usuarios.map((usuario) => (
                                    <tr key={usuario.id}>
                                        <td>{usuario.nombre} {usuario.apellido}</td>
                                        <td>{usuario.email}</td>
                                        <td>{usuario.activo ? 'Sí' : 'No'}</td>
                                        <td>
                                            {/* Botón para activar o desactivar usuario, bloqueado si está procesando */}
                                            <button
                                                className={
                                                    usuario.activo
                                                        ? styles.desactivar
                                                        : styles.activar
                                                }
                                                onClick={() => cambiarEstado(usuario.id, usuario.activo)}
                                                disabled={cambiandoEstadoId === usuario.id}
                                            >
                                                {cambiandoEstadoId === usuario.id
                                                    ? 'Procesando...'
                                                    : usuario.activo
                                                        ? 'Desactivar'
                                                        : 'Activar'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </div>
    );
}
