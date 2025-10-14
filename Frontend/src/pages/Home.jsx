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

    const fetchUsuario = async () => {
        if (email) {
            try {
                const data = await getUsuarioPorEmail(email);
                setUsuario(data);
                setError('');
            } catch (err) {
                setError('No se pudo obtener la información del usuario.');
                console.log(err);
            }
        }
    };

    useEffect(() => {
        fetchUsuario();
    }, [email]);

    if (error) return (
        <div className={styles.errorContainer}>
            <p className={styles.error}>{error}</p>
            <button className={styles.retryButton} onClick={fetchUsuario}>Reintentar</button>
        </div>
    );

    if (!usuario) return <p className={styles.loading}>Cargando información...</p>;

    const rol = usuario?.rol || '';

    let HomeComponent;
    let icono;
    if (rol === 'CLIENTE') {
        HomeComponent = ClienteHome;
        icono = <FaUserCircle className={styles.iconoRol} />;
    } else if (rol === 'PROFESIONAL') {
        HomeComponent = ProfesionalHome;
        icono = <FaUserTie className={styles.iconoRol} />;
    } else if (rol === 'DRA_FELICIDAD') {
        HomeComponent = DraHome;
        icono = <FaUserMd className={styles.iconoRol} />;
    } else {
        return <p className={styles.error}>Rol desconocido: {rol}</p>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.header}>
                    {icono}
                    <h2 className={styles.titulo}>Bienvenido/a, {usuario.nombre}</h2>
                    <p className={styles.rol}>Rol: {rol.replace(/_/g, ' ')}</p>
                    
                    {/* SOLUCIÓN SIMPLIFICADA */}
                    <div className={styles.logoutContainer}>
                        <LogoutButton />
                    </div>
                </div>
                <HomeComponent usuario={usuario} />
            </div>
        </div>
    );
}