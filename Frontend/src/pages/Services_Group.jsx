import React from 'react'
import styles from '../styles/Services.module.css'
import Header2 from '../components/Header2';
import hidro from '../assets/spa_sb/hidromasajes.jpg'
import yoga from '../assets/spa_sb/yoga_grupal.jpg'
import CategoryNav from '../components/CategoryNav';
import { Link } from 'react-router-dom';

export const Services = () => {
    return (
        <>
            <Header2 customClass="bgServicios" />
            {/* BARRA*/}
            <section className={styles.bar_content}>
                <div className={styles.bar_content_title}>
                    <h1>Sesiones grupales</h1>
                </div>
            </section>
            <CategoryNav />
            {/* CARTAS DE SERVICIOS*/}

            {/*1ERO*/}
            <section className={styles.services_card_container}>
                <div className={styles.card}>
                    <div className={styles.card_img}>
                        <img src={hidro} alt="Hidromasajes" />
                    </div>
                    <div className={styles.card_description}>
                        <h4 className={styles.card_title}>Hidromasajes</h4>
                        <p className={styles.card_text}>
                        Relajación profunda en un ambiente <br />
                        cálido. El hidromasaje estimula la <br />
                        circulación y alivia tensiones, <br />
                        brindando bienestar.
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
                        <img src={yoga} alt="Yoga" />
                    </div>
                    <div className={styles.card_description}>
                        <h4 className={styles.card_title}>Yoga</h4>
                        <p className={styles.card_text}>
                        Una práctica guiada que conecta <br />
                        cuerpo, mente y respiración, <br />
                        promoviendo equilibrio y bienestar <br />
                        en grupo.
                        </p>
                    </div>
                    <div className={styles.card_cost}>$50.000</div>
                </div>

                <Link to="/turnos" className={styles.card_button}>SOLICITAR</Link>
            </section>

        </>
    )
}

export default Services;