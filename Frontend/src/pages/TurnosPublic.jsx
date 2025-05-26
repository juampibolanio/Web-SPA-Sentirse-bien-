import React from 'react';
import styles from '../styles/TurnosPublic.module.css';
import img1 from '../assets/turnosHome/img1.jpg';
import img2 from '../assets/turnosHome/img2.jpg';
import img3 from '../assets/turnosHome/img3.jpg';
import img4 from '../assets/turnosHome/img4.jpg';

function TurnosPublic() {
    return (
        <div className={styles.container}>
            <div className={styles.hero}>
                <div className={styles.heroContent}>
                    <h1>Relajate, Reservá y Disfrutá</h1>
                    <p>Tu experiencia de bienestar comienza con un clic</p>
                    <a href="/solicitud-turno" className={styles.botonHero}>Reservá ahora</a>
                </div>
            </div>

            <h2 className={styles.tituloSeccion}>Solicitá tu Turno</h2>
            <p className={styles.intro}>
                En nuestro spa podés reservar tu experiencia de forma rápida y simple. Te contamos cómo hacerlo:
            </p>

            <div className={styles.pasos}>
                <div className={styles.paso}>
                    <h3>Paso 1</h3>
                    <p>Registrate o iniciá sesión con tu cuenta para acceder a los turnos disponibles.</p>
                    <img src={img1} alt="Login" />
                </div>
                <div className={styles.paso}>
                    <h3>Paso 2</h3>
                    <p>Elegí el servicio que deseas, la fecha, hora, forma de pago y confirmá tu turno.</p>
                    <img src={img2} alt="Seleccionar servicio" />
                </div>
                <div className={styles.paso}>
                    <h3>Paso 3</h3>
                    <p>Si solicitás un turno y pagás con tarjeta de débito podés obtener un 15% de descuento.</p>
                    <img src={img3} alt="Pago online" />
                </div>
                <div className={styles.paso}>
                    <h3>Importante</h3>
                    <p>Los turnos deben ser solicitados con al menos <strong>48 horas de anticipación</strong>.</p>
                    <img src={img4} alt="Anticipación" />
                </div>
            </div>

            <div className={styles.infoExtra}>
                <p>¿Todo listo?</p>
                <a href="/solicitud-turno" className={styles.botonLogin}>Reservá tu turno</a>
            </div>
        </div>
    );
}

export default TurnosPublic;
