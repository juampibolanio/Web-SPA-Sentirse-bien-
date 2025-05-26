// src/pages/Home.jsx
import { useEffect, useState } from 'react';
import { getUserEmailFromToken } from '../auth/auth';
import { getUsuarioPorEmail } from '../services/userService';
import ClienteHome from './ClienteHome';
import ProfesionalHome from './ProfesionalHome';
import DraHome from './DraHome';
import LogoutButton from '../components/LogoutButton';
import styles from '../styles/Home.module.css';

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
    if (!usuario) return <p className={styles.loading}>Cargando usuario...</p>;

    let HomeComponent;
    if (usuario.rol === 'CLIENTE') HomeComponent = ClienteHome;
    else if (usuario.rol === 'PROFESIONAL') HomeComponent = ProfesionalHome;
    else if (usuario.rol === 'DRA_FELICIDAD') HomeComponent = DraHome;
    else return <p className={styles.error}>Rol desconocido: {usuario.rol}</p>;

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <HomeComponent usuario={usuario} />
                <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                    <LogoutButton />
                </div>
            </div>
        </div>
    );
}
