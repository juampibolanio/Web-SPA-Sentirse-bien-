// src/pages/Home.jsx
import { useEffect, useState } from 'react';
import { getUserEmailFromToken } from '../auth/auth';
import { getUsuarioPorEmail } from '../services/userService';
import ClienteHome from './ClienteHome';
import ProfesionalHome from './ProfesionalHome';
import DraHome from './DraHome';
import LogoutButton from '../components/LogoutButton';
import styles from '../styles/Home.module.css';
import { FaUserCircle, FaUserMd, FaUserTie } from 'react-icons/fa';

export default function Home() {
    const [usuario, setUsuario] = useState(null);
    const [error, setError] = useState('');
    const email = getUserEmailFromToken();

    useEffect(() => {
        async function fetchUsuario() {
            if (email) {
                try {
                    const data = await getUsuarioPorEmail(email);
                    setUsuario(data);
                } catch (err) {
                    setError('No se pudo obtener la información del usuario.');
                    console.log(err);
                }
            }
        }
        fetchUsuario();
    }, [email]);

    if (error) return <p className={styles.error}>{error}</p>;
    if (!usuario) return <p className={styles.loading}></p>;

    let HomeComponent;
    let icono;
    if (usuario.rol === 'CLIENTE') {
        HomeComponent = ClienteHome;
        icono = <FaUserCircle className={styles.iconoRol} />;
    } else if (usuario.rol === 'PROFESIONAL') {
        HomeComponent = ProfesionalHome;
        icono = <FaUserTie className={styles.iconoRol} />;
    } else if (usuario.rol === 'DRA_FELICIDAD') {
        HomeComponent = DraHome;
        icono = <FaUserMd className={styles.iconoRol} />;
    } else {
        return <p className={styles.error}>Rol desconocido: {usuario.rol}</p>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.header}>
                    {icono}
                    <h2 className={styles.titulo}>Bienvenido/a, {usuario.nombre}</h2>
                    <p className={styles.rol}>Rol: {usuario.rol.replace('_', ' ')}</p>
                </div>
                <HomeComponent usuario={usuario} />
            </div>
        </div>
    );
}
