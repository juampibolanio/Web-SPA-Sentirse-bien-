import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../auth/auth';
import styles from '../styles/TurnosPublic.module.css';
import { FaSignInAlt, FaCalendarAlt, FaCreditCard, FaClock } from 'react-icons/fa';
import { MdArrowForward } from 'react-icons/md';

import img1 from '../assets/turnosHome/img1.jpg';
import img2 from '../assets/turnosHome/img2.jpg';
import img3 from '../assets/turnosHome/img3.jpg';
import img4 from '../assets/turnosHome/img4.jpg';
import banner from '../assets/servicesHome/TOP_SERVICES.jpg'; 

function TurnosPublic() {
    const navigate = useNavigate();

    const handleReservaClick = () => {
        const token = getToken();
        navigate(token ? '/solicitud-turno' : '/login');
    };

    return (
        <div className={styles.container}>
            <div className={styles.banner}>
                <img src={banner} alt="Bienestar" className={styles.bannerImage} />
                <div className={styles.bannerText}>
                    <h1>Relajate, Reservá y Disfrutá</h1>
                    <p>Tu experiencia de bienestar comienza con un clic</p>
                    <button onClick={handleReservaClick} className={styles.botonHero}>
                        Reservá ahora <MdArrowForward />
                    </button>
                </div>
            </div>

            <h2 className={styles.tituloSeccion}>¿Cómo solicitar un turno?</h2>
            <p className={styles.intro}>
                Reservar tu turno es muy fácil. Solo seguí estos pasos:
            </p>

            <div className={styles.pasos}>
                <div className={styles.paso}>
                    <FaSignInAlt className={styles.iconoPaso} />
                    <h3>Paso 1 - Iniciá sesión</h3>
                    <p>Registrate o iniciá sesión para acceder a los turnos disponibles.</p>
                    <img src={img1} alt="Login" />
                </div>
                <div className={styles.paso}>
                    <FaCalendarAlt className={styles.iconoPaso} />
                    <h3>Paso 2 - Elegí tu turno</h3>
                    <p>Seleccioná el servicio, fecha, hora y forma de pago.</p>
                    <img src={img2} alt="Seleccionar servicio" />
                </div>
                <div className={styles.paso}>
                    <FaCreditCard className={styles.iconoPaso} />
                    <h3>Paso 3 - Pagá online</h3>
                    <p>Si pagás con tarjeta de débito accedés a un 15% de descuento.</p>
                    <img src={img3} alt="Pago online" />
                </div>
                <div className={styles.paso}>
                    <FaClock className={styles.iconoPaso} />
                    <h3>Importante</h3>
                    <p>Los turnos deben solicitarse con al menos <strong>48 horas de anticipación</strong>.</p>
                    <img src={img4} alt="Anticipación" />
                </div>
            </div>

            <div className={styles.infoExtra}>
                <p>¿Todo listo para tu momento de relax?</p>
                <button onClick={handleReservaClick} className={styles.botonLogin}>
                    Reservá tu turno
                </button>
            </div>
        </div>
    );
}

export default TurnosPublic;
