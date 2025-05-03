import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../styles/AdminPanel.module.css';
import spaLogo from '../assets/img/logo_spa.png';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const AdminPanel = () => {
    const [clientes, setClientes] = useState([]);
    const [turnos, setTurnos] = useState([]);
    const [filtroServicio, setFiltroServicio] = useState('');
    const [user, setUser] = useState('');
    const [seccionActiva, setSeccionActiva] = useState('turnos');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            const decoded = jwtDecode(token);
            setUser(decoded.sub);
        } catch (error) {
            console.error('Error al decodificar el token');
            navigate('/login');
        }
    }, [navigate]);

    useEffect(() => {
        const fetchTurnos = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get('http://localhost:8080/api/turnos', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setTurnos(response.data);
                console.log('Turnos:', response.data);
            } catch (error) {
                console.error('Error al obtener los turnos:', error);
            }
        };

        fetchTurnos();
    }, []);

    useEffect(() => {
        const fetchClientes = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get('http://localhost:8080/api/clientes', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setClientes(response.data);
            } catch (error) {
                console.error('Error al obtener los clientes:', error);
            }
        };

        fetchClientes();
    }, []);

    const handleBackToHome = () => {
        navigate('/');
    };

    const turnosFiltrados = turnos.filter(turno =>
        (filtroServicio === '' || turno.servicioId === filtroServicio)
    );

    const eliminarTurno = async (turnoId) => {
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`http://localhost:8080/api/turnos/${turnoId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setTurnos(turnos.filter(turno => turno.id !== turnoId));
        } catch (error) {
            console.error('Error al eliminar el turno:', error);
        }
    };

    const eliminarCliente = async (clienteId) => {
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`http://localhost:8080/api/clientes/${clienteId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setClientes(clientes.filter(cliente => cliente.id !== clienteId));
        } catch (error) {
            console.error('Error al eliminar el cliente:', error);
        }
    };

    return (
        <div className={styles.panelContainer}>
            <aside className={styles.sidebar}>
                <div className={styles.logoContainer}>
                    <img src={spaLogo} alt="Spa Logo" className={styles.logo} />
                    <span className={styles.spaName}>Sentirse Bien</span>
                </div>
                <nav className={styles.sidebarNav}>
                    <button
                        className={`${styles.navButton} ${seccionActiva === 'turnos' ? styles.active : ''}`}
                        onClick={() => setSeccionActiva('turnos')}
                    >
                        Turnos
                    </button>
                    <button
                        className={`${styles.navButton} ${seccionActiva === 'clientes' ? styles.active : ''}`}
                        onClick={() => setSeccionActiva('clientes')}
                    >
                        Clientes
                    </button>
                </nav>
            </aside>

            <main className={styles.content}>
                <div className={styles.header}>
                    <div className={styles.backButtonContainer}>
                        <span className={styles.backButton} onClick={handleBackToHome}>
                            &#8592;
                        </span>
                    </div>
                    <p className={styles.loggedUser}>Hola, {user}</p>
                </div>

                {seccionActiva === 'turnos' ? (
                    <>
                        <h2>Turnos Asignados</h2>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>DNI</th>
                                    <th>Dirección</th>
                                    <th>Teléfono</th>
                                    <th>Servicio</th>
                                    <th>Fecha</th>
                                    <th>Hora Inicio</th>
                                    <th>Hora Fin</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {turnosFiltrados.map((turno, index) => (
                                    <tr key={index}>
                                        <td>{turno.cliente?.nombre || 'Sin nombre'}</td>
                                        <td>{turno.cliente?.dni || 'Sin DNI'}</td>
                                        <td>{turno.cliente?.direccion || 'Sin dirección'}</td>
                                        <td>{turno.cliente?.telefono || 'Sin teléfono'}</td>
                                        <td>{turno.servicio?.nombre || 'Sin servicio'}</td>
                                        <td>{new Date(turno.fecha).toLocaleDateString()}</td>
                                        <td>{new Date(turno.horaInicio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                                        <td>{new Date(turno.horaFin).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                                        <td>
                                            <button className={styles.deleteBtn} onClick={() => eliminarTurno(turno.id)}>Eliminar</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                ) : (
                    <>
                        <h2>Clientes Registrados</h2>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>DNI</th>
                                    <th>Dirección</th>
                                    <th>Teléfono</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {clientes.map((cliente, index) => (
                                    <tr key={index}>
                                        <td>{cliente.nombre}</td>
                                        <td>{cliente.dni}</td>
                                        <td>{cliente.direccion}</td>
                                        <td>{cliente.telefono}</td>
                                        <td>
                                            <button className={styles.deleteBtn} onClick={() => eliminarCliente(cliente.id)}>Eliminar</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                )}
            </main>
        </div>
    );
};

export default AdminPanel;
