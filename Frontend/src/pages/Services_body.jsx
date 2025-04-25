import React from 'react'
import styles from '../styles/Services.module.css'
import Header2 from '../components/Header2';
import vela from '../assets/spa_sb/velaSlim.jpg'
import dermo from '../assets/spa_sb/dermoheatlh.jpg'
import criofrecuencia from '../assets/spa_sb/criofrecuencia_corporal.jpg'
import ultracati from '../assets/spa_sb/ultracavitación.jpg'
import CategoryNav from '../components/CategoryNav';
import { Link } from 'react-router-dom';

export const Services = () => {
    return (
        <>
            <Header2 customClass="bgServicios" />
            {/* BARRA*/}
            <section className={styles.bar_content}>
                <div className={styles.bar_content_title}>
                    <h1>Tratamientos corporales</h1>
                </div>
            </section>
            <CategoryNav />
            {/* CARTAS DE SERVICIOS*/}

            {/*1ERO*/}
            <section className={styles.services_card_container}>
                <div className={styles.card}>
                    <div className={styles.card_img}>
                        <img src={vela} alt="VelaSlim" />
                    </div>
                    <div className={styles.card_description}>
                        <h4 className={styles.card_title}>VelaSlim</h4>
                        <p className={styles.card_text}>
                        Tratamiento no invasivo que reduce <br />
                        la circunferencia 
                        corporal y mejora <br />
                        visiblemente la celulitis, <br />
                        moldeando la silueta.
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
                        <img src={dermo} alt="Dermohealth" />
                    </div>
                    <div className={styles.card_description}>
                        <h4 className={styles.card_title}>Dermohealth</h4>
                        <p className={styles.card_text}>
                        Técnica de succión controlada que <br />
                        estimula la 
                        microcirculación, moviliza <br />
                        los tejidos y promueve un <br />
                        drenaje linfático eficaz.
                        </p>
                    </div>
                    <div className={styles.card_cost}>$50.000</div>
                </div>

                <Link to="/turnos" className={styles.card_button}>SOLICITAR</Link>
            </section>
            
                {/* 3ERO*/}
            <section className={styles.services_card_container}>
                <div className={styles.card}>
                    <div className={styles.card_img}>
                        <img src={criofrecuencia} alt="Crio frecuencia"/>
                    </div>
                    <div className={styles.card_description}>
                        <h4 className={styles.card_title}>Crio frecuencia</h4>
                        <p className={styles.card_text}>
                        El shock térmico reactiva la piel y <br />
                        los tejidos, logrando 
                        un efecto lifting <br />
                        inmediato y 
                        mejorando la firmeza <br />
                        en zonas específicas.
                        </p>
                    </div>
                    <div className={styles.card_cost}>$50.000</div>
                </div>

                <Link to="/turnos" className={styles.card_button}>SOLICITAR</Link>
            </section>


            {/*4TO*/}
            <section className={styles.services_card_container}>
                <div className={styles.card}>
                    <div className={styles.card_img}>
                        <img src={ultracati} alt="Ultracavitación"/>
                    </div>
                    <div className={styles.card_description}>
                        <h4 className={styles.card_title}>Ultracavitación</h4>
                        <p className={styles.card_text}>
                        Técnica reductora que actúa <br />
                        sobre la grasa localizada <br />
                        mediante ultrasonido,<br />
                        ayudando a modelar el <br />
                        cuerpo de forma efectiva y segura.
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