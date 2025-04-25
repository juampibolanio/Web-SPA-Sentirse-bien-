import React from 'react'
import styles from '../styles/Services.module.css'
import Header2 from '../components/Header2';
import antistress from '../assets/spa_sb/AntiStress.jpg'
import descontracturantes from '../assets/spa_sb/Descontracturante.jpg'
import masajepiedra from '../assets/spa_sb/Masajes_con_piedras.jpg'
import circulatorio from '../assets/spa_sb/Circulatorios.jpg'
import CategoryNav from '../components/CategoryNav';
import { Link } from 'react-router-dom';

export const Services = () => {
  return (
    <>
      <Header2 customClass="bgServicios" />
      {/* BARRA*/}
      <section className={styles.bar_content}>
        <div className={styles.bar_content_title}>
          <h1>Masajes</h1>
        </div>
      </section>
      <CategoryNav />
      {/* CARTAS DE SERVICIOS*/}

      {/*1ERO*/}
      <section className={styles.services_card_container}>
        <div className={styles.card}>
          <div className={styles.card_img}>
            <img src={antistress} alt="Anti Stress" />
          </div>
          <div className={styles.card_description}>
            <h4 className={styles.card_title}>Anti Stress</h4>
            <p className={styles.card_text}>
              Liberá tensiones acumuladas
              y reconectá <br />
              con tu calma interior.
              Ideal para relajar <br />
              cuerpo y mente.
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
            <img src={descontracturantes} alt="Descontracturantes" />
          </div>
          <div className={styles.card_description}>
            <h4 className={styles.card_title}>Descontracturantes</h4>
            <p className={styles.card_text}>
              Trabajamos zonas de tensión muscular <br />
              profunda para aliviar dolores <br />
              y mejorar tu movilidad.
            </p>
          </div>
          <div className={styles.card_cost}>$50.000</div>
        </div>

        <Link to="/turnos" className={styles.card_button}>SOLICITAR</Link>
      </section>

      {/*3ERO */}
      <section className={styles.services_card_container}>
        <div className={styles.card}>
          <div className={styles.card_img}>
            <img src={masajepiedra} alt="Masajes con piedras" />
          </div>
          <div className={styles.card_description}>
            <h4 className={styles.card_title}>Masajes con piedras</h4>
            <p className={styles.card_text}>
              Energía, calor y relajación en un solo <br />
              tratamiento. 
              Las piedras ayudan a aliviar <br />
              tensiones 
              y armonizar tu energía.
            </p>
          </div>
          <div className={styles.card_cost}>$50.000</div>
        </div>

        <Link to="/turnos" className={styles.card_button}>SOLICITAR</Link>
      </section>

      {/* 4TO*/}
      <section className={styles.services_card_container}>
        <div className={styles.card}>
          <div className={styles.card_img}>
            <img src={circulatorio} alt="Circulatorios" />
          </div>
          <div className={styles.card_description}>
            <h4 className={styles.card_title}>Circulatorios</h4>
            <p className={styles.card_text}>
              Estimulan la circulación sanguínea, <br />
              reducen la retención de líquidos <br />
              y favorecen la sensación de ligereza.
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