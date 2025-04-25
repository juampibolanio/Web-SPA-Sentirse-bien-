import React, { useState, useEffect } from 'react';
import styles from '../styles/AdminPanel.module.css';
import spaLogo from '../assets/img/logo_spa.png';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const AdminPanel = () => {
    const [seccionActiva, setSeccionActiva] = useState('turnos');
    const [filtroServicio, setFiltroServicio] = useState('');
    const [filtroProfesional, setFiltroProfesional] = useState('');
    const [user, setUser] = useState('');  

    const turnos = [
        {
            dni: '12345678',
            nombre: 'Carla Pérez',
            localidad: 'Rosario',
            direccion: 'Calle Falsa 123',
            servicio: 'Masaje Descontracturante',
            profesional: 'Lucía',
            fecha: '2025-04-25',
            hora: '15:30',
            horaFin: '16:30'
        },
        {
            dni: '87654321',
            nombre: 'Luis Gómez',
            localidad: 'Santa Fe',
            direccion: 'Av. Siempre Viva 742',
            servicio: 'Limpieza Facial',
            profesional: 'Martín',
            fecha: '2025-04-26',
            hora: '11:00',
            horaFin: '11:45'
        }
    ];

    const clientes = [
        {
            dni: '12345678',
            nombre: 'Carla Pérez',
            telefono: '3411234567',
            email: 'carla@gmail.com',
            direccion: 'Calle Falsa 123',
            localidad: 'Corrientes'
        },
        {
            dni: '87654321',
            nombre: 'Luis Gómez',
            telefono: '3429876543',
            email: 'luis@gmail.com',
            direccion: 'Av. Siempre Viva 742',
            localidad: 'Resistencia'
        }
    ];

    const turnosFiltrados = turnos.filter(turno =>
        (filtroServicio === '' || turno.servicio === filtroServicio) &&
        (filtroProfesional === '' || turno.profesional === filtroProfesional)
    );

    const serviciosUnicos = [...new Set(turnos.map(t => t.servicio))];
    const profesionalesUnicos = [...new Set(turnos.map(t => t.profesional))];

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            const decoded = jwtDecode(token);
            if (decoded.role !== 'ROLE_PROFESIONAL') {
                navigate('/');
            } else {
                setUser(decoded.sub); 
            }
        } catch (error) {
            console.error('Error al decodificar el token');
            navigate('/login');
        }
    }, [navigate]);

    
    const handleBackToHome = () => {
        navigate('/');
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
                        <div className={styles.filtros}>
                            <select value={filtroServicio} onChange={(e) => setFiltroServicio(e.target.value)}>
                                <option value="">Todos los servicios</option>
                                {serviciosUnicos.map((s, i) => (
                                    <option key={i} value={s}>{s}</option>
                                ))}
                            </select>

                            <select value={filtroProfesional} onChange={(e) => setFiltroProfesional(e.target.value)}>
                                <option value="">Todos los profesionales</option>
                                {profesionalesUnicos.map((p, i) => (
                                    <option key={i} value={p}>{p}</option>
                                ))}
                            </select>
                        </div>

                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>DNI</th>
                                    <th>Cliente</th>
                                    <th>Localidad</th>
                                    <th>Dirección</th>
                                    <th>Servicio</th>
                                    <th>Profesional</th>
                                    <th>Fecha</th>
                                    <th>Hora Inicio</th>
                                    <th>Hora Fin</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {turnosFiltrados.map((turno, index) => (
                                    <tr key={index}>
                                        <td>{turno.dni}</td>
                                        <td>{turno.nombre}</td>
                                        <td>{turno.localidad}</td>
                                        <td>{turno.direccion}</td>
                                        <td>{turno.servicio}</td>
                                        <td>{turno.profesional}</td>
                                        <td>{turno.fecha}</td>
                                        <td>{turno.hora}</td>
                                        <td>{turno.horaFin}</td>
                                        <td>
                                            <button className={styles.deleteBtn}>Eliminar</button>
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
                                    <th>DNI</th>
                                    <th>Nombre</th>
                                    <th>Teléfono</th>
                                    <th>Email</th>
                                    <th>Dirección</th>
                                    <th>Localidad</th>
                                </tr>
                            </thead>
                            <tbody>
                                {clientes.map((cliente, index) => (
                                    <tr key={index}>
                                        <td>{cliente.dni}</td>
                                        <td>{cliente.nombre}</td>
                                        <td>{cliente.telefono}</td>
                                        <td>{cliente.email}</td>
                                        <td>{cliente.direccion}</td>
                                        <td>{cliente.localidad}</td>
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
