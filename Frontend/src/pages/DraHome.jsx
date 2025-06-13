import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/DraHome.module.css';
import { FaStethoscope, FaUserClock, FaChartBar, FaUserCog } from 'react-icons/fa';
import axios from 'axios';

export default function DraHome() {
    const navigate = useNavigate();
    const [mostrarPanelUsuarios, setMostrarPanelUsuarios] = useState(false);
    const [rolSeleccionado, setRolSeleccionado] = useState('PROFESIONAL');
    const [usuarios, setUsuarios] = useState([]);
    const [cargandoUsuarios, setCargandoUsuarios] = useState(false);
    const [cambiandoEstadoId, setCambiandoEstadoId] = useState(null);

    useEffect(() => {
        if (mostrarPanelUsuarios) {
            cargarUsuarios(rolSeleccionado);
        }
    }, [rolSeleccionado, mostrarPanelUsuarios]);

    const cargarUsuarios = async (rolSeleccionado) => {
        try {
            setCargandoUsuarios(true);
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `http://localhost:8080/api/usuarios/rol/${rolSeleccionado}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            setUsuarios(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
            setUsuarios([]);
        } finally {
            setCargandoUsuarios(false);
        }
    };

    const cambiarEstado = async (id, activo) => {
        try {
            setCambiandoEstadoId(id);
            const token = localStorage.getItem('token');
            const endpoint = activo
                ? `http://localhost:8080/api/usuarios/${id}/desactivar`
                : `http://localhost:8080/api/usuarios/${id}/activar`;

            await axios.put(endpoint, null, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            await cargarUsuarios(rolSeleccionado);
        } catch (error) {
            console.error('Error al cambiar estado del usuario:', error);
        } finally {
            setCambiandoEstadoId(null);
        }
    };

    const togglePanelUsuarios = () => {
        setMostrarPanelUsuarios(!mostrarPanelUsuarios);
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Bienvenida Dra. Ana</h2>
            <p className={styles.subtitle}>
                Desde aquí podrá gestionar los servicios y turnos del centro.
            </p>

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

                <button className={styles.button} onClick={togglePanelUsuarios}>
                    <FaUserCog className={styles.icon} />
                    Administrar usuarios
                </button>
            </div>

            {mostrarPanelUsuarios && (
                <div className={styles.userPanel}>
                    <h3 className={styles.subtitle}>Administrar usuarios por rol</h3>

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
                                {usuarios.map((usuario) => (
                                    <tr key={usuario.id}>
                                        <td>{usuario.nombre} {usuario.apellido}</td>
                                        <td>{usuario.email}</td>
                                        <td>{usuario.activo ? 'Sí' : 'No'}</td>
                                        <td>
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
