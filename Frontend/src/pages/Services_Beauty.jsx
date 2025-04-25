import React from 'react'
import styles from '../styles/Services.module.css'
import Header2 from '../components/Header2';
import lifting from '../assets/spa_sb/Lifting de pestañas.jpg'
import depilacion from '../assets/spa_sb/Depilación facial.jpg'
import belleza from '../assets/spa_sb/manos_pies.jpg'
import CategoryNav from '../components/CategoryNav';
import { Link } from 'react-router-dom';

export const Services = () => {
    return (
        <>
            <Header2 customClass="bgServicios" />
            {/* BARRA*/}
            <section className={styles.bar_content}>
                <div className={styles.bar_content_title}>
                    <h1>Belleza</h1>
                </div>
            </section>
            <CategoryNav />
            {/* CARTAS DE SERVICIOS*/}

            {/*1ERO*/}
            <section className={styles.services_card_container}>
                <div className={styles.card}>
                    <div className={styles.card_img}>
                        <img src={lifting} alt="Lifting de pestañas" />
                    </div>
                    <div className={styles.card_description}>
                        <h4 className={styles.card_title}>Lifting de pestañas</h4>
                        <p className={styles.card_text}>
                        Realizá tu mirada con un <br />
                        efecto natural, curvado <br />
                        y duradero. Sin extensiones, <br />
                        sin mantenimiento diario.
                        </p>
                    </div>
                    <div className={styles.card_cost}>$10.000</div>
                </div>

                <Link to="/turnos" className={styles.card_button}>SOLICITAR</Link>
            </section>

            {/* 2DO*/}
            <section className={styles.services_card_container}>
                <div className={styles.card}>
                    <div className={styles.card_img}>
                        <img src={depilacion} alt="Depilación facial" />
                    </div>
                    <div className={styles.card_description}>
                        <h4 className={styles.card_title}>Depilación facial</h4>
                        <p className={styles.card_text}>
                        Eliminamos el vello no <br />
                        deseado con precisión y <br />
                        cuidado, dejando tu piel <br />
                        suave y luminosa.
                        </p>
                    </div>
                    <div className={styles.card_cost}>$8.000</div>
                </div>

                <Link to="/turnos" className={styles.card_button}>SOLICITAR</Link>
            </section>
            
                {/* 3ERO*/}
            <section className={styles.services_card_container}>
                <div className={styles.card}>
                    <div className={styles.card_img}>
                        <img src={belleza} alt="Belleza de manos y pies"/>
                    </div>
                    <div className={styles.card_description}>
                        <h4 className={styles.card_title}>Belleza de manos y pies</h4>
                        <p className={styles.card_text}>
                        Tus manos y pies renovados, <br />
                        suaves y prolijos, con un <br />
                        acabado estético que resalta <br />
                        tu estilo personal.
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