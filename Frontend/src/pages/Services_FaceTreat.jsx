import React from 'react'
import styles from '../styles/Services.module.css'
import Header2 from '../components/Header2';
import micro from '../assets/spa_sb/microexfoliación.jpg'
import limpieza from '../assets/spa_sb/limpieza_profunda_hidratacion.jpg'
import criofrecuencia from '../assets/spa_sb/criofrecuencia.jpg'
import CategoryNav from '../components/CategoryNav';
import { Link } from 'react-router-dom';

export const Services = () => {
    return (
        <>
            <Header2 customClass="bgServicios" />
            {/* BARRA*/}
            <section className={styles.bar_content}>
                <div className={styles.bar_content_title}>
                    <h1>Tratamientos faciales</h1>
                </div>
            </section>
            <CategoryNav />
            {/* CARTAS DE SERVICIOS*/}

            {/*1ERO*/}
            <section className={styles.services_card_container}>
                <div className={styles.card}>
                    <div className={styles.card_img}>
                        <img src={micro} alt="Punta de diamante microexfoliación" />
                    </div>
                    <div className={styles.card_description}>
                        <h4 className={styles.card_title}>Punta de diamante microexfoliación</h4>
                        <p className={styles.card_text}>
                        Tratamiento no invasivo que <br />
                        remueve células muertas y <br />
                        renueva la piel en profundidad, <br />
                        dejándola más suave, luminosa y uniforme.
                        </p>
                    </div>
                    <div className={styles.card_cost}>$50.000</div>
                </div>

                <Link to="/turnos" className={styles.card_button}>SOLICITAR</Link>
            </section>

            {/* 2DO*/}
            <section className={styles.services_card_container}>
                <div className={styles.card}>
                    <div className={styles.card_img}>
                        <img src={limpieza} alt="Limpieza profunda e hidratación" />
                    </div>
                    <div className={styles.card_description}>
                        <h4 className={styles.card_title}>Limpieza profunda e hidratación</h4>
                        <p className={styles.card_text}>
                        Eliminamos impurezas, <br />
                        puntos negros y células muertas, <br />
                        seguido de una <br />
                        hidratación intensiva que <br />
                        devuelve frescura <br />
                        y vitalidad al rostro.
                        </p>
                    </div>
                    <div className={styles.card_cost}>$18.000</div>
                </div>

                <Link to="/turnos" className={styles.card_button}>SOLICITAR</Link>
            </section>
            
                {/* 3ERO*/}
            <section className={styles.services_card_container}>
                <div className={styles.card}>
                    <div className={styles.card_img}>
                        <img src={criofrecuencia} alt="Crio frecuencia facial"/>
                    </div>
                    <div className={styles.card_description}>
                        <h4 className={styles.card_title}>Crio frecuencia facial</h4>
                        <p className={styles.card_text}>
                        Genera un shock térmico <br />
                        que activa el colágeno, <br />
                        mejora la elasticidad y <br />
                        produce un efecto lifting <br />
                        visible desde la <br />
                        primera sesión.
                        </p>
                    </div>
                    <div className={styles.card_cost}>$20.000</div>
                </div>

                <Link to="/turnos" className={styles.card_button}>SOLICITAR</Link>
            </section>


        </>
    )
}

export default Services;