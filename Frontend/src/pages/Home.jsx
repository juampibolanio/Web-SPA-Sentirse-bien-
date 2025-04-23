import React, { useState } from 'react';
import styles from '../styles/Home.module.css';
import img1 from '../assets/img/carrousel_home1.jpg';
import img2 from '../assets/img/carrousel_home2.jpg';
import img3 from '../assets/img/carrousel_home3.jpg';
import img4 from '../assets/img/acerca_de_nosotros_imagen.avif'
import masajeImg from '../assets/img/TRATAMIENTO_MASAJES.jpg';
import bellezaImg from '../assets/img/BELLEZA_TRATAMIENTO.jpg';
import facialesImg from '../assets/img/TRATAMIENTOS_FACIALES.jpg';
import spaInd from '../assets/img/SPA_INDIV1.jpg'
import spaGro from '../assets/img/SPA_GRUPAL2.jpg'
import logo from '../assets/img/logo_spa.png'
import Carrousel from '../components/Carrousel';

const slides = [
  {
    image: img1,
    title: "SENTIRSE BIEN SPA ",
    subtitle: "Descubre el lugar perfecto para renovar cuerpo y mente. Un entorno de paz y lujo.",
  },
  {
    image: img2,
    title: "UN MUNDO DE CALMA",
    subtitle: "Ingresá a un espacio donde cada detalle está pensado para tu bienestar. Disfrutá de rituales que restauran cuerpo, mente y alma.",
  },
  {
    image: img3,
    title: "PARA CUERPO Y MENTE",
    subtitle: "Descubrí un santuario donde tu cuerpo se relaja y tu mente encuentra paz. Soltá el estrés y reconectá con tu armonía interior a través de cada aroma y caricia.",
  }
];

function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const servicios = [
    { titulo: 'MASAJES', img: masajeImg },
    { titulo: 'BELLEZA', img: bellezaImg },
    { titulo: 'TRATAMIENTOS FACIALES', img: facialesImg },
    { titulo: 'SESIONES INDIVIDUALES', img: spaInd },
    { titulo: 'SESIONES GRUPALES', img: spaGro }
  ]

  return (
    <>
      {/* SECCION INICIO */}
      <section
        className={styles.hero}
        style={{ backgroundImage: `url(${slides[currentSlide].image})` }}
      >
        <div className={styles.overlay}>
          <hr className={styles.line_over} />
          <h1 className={styles.title}>{slides[currentSlide].title}</h1>
          <p className={styles.subtitle}>{slides[currentSlide].subtitle}</p>

          <div className={styles.buttonsContainer}>
            <button className={styles.button}>TURNOS</button>
            <button className={styles.button}>CONTACTO</button>
          </div>

          <div className={styles.arrows}>
            <button className={`${styles.arrow} ${styles.arrowLeft}`} onClick={prevSlide}>❮</button>
            <button className={`${styles.arrow} ${styles.arrowRight}`} onClick={nextSlide}>❯</button>
          </div>
        </div>
      </section>

      {/* SECCION ACERCA DE NOSOTROS */}

      <section className={styles.aboutSection}>
        <img src={logo} alt="Decoración" className={styles.icon_about} />
        <hr className={styles.line_about} />
        <h2 className={styles.title_about}>Acerca de nosotros</h2>
        <p className={styles.text_about}>
          Somos un espacio dedicado al bienestar del cuerpo y la mente. <br />
          Nuestro objetivo es ayudarte a desconectar del estrés diario y reconectar con tu equilibrio interior. <br />
          Con atención personalizada y un ambiente pensado para tu comodidad, te invitamos a vivir una experiencia de relajación profunda y renovación.
        </p>
      </section>

      {/* IMAGEN ENTRE MEDIO A*/}
      <div className={styles.imageContainer}>
        <img src={img4} alt="Masaje relajante" className={styles.imageBelowAbout} />
      </div>

      {/* SECCION CARRUSEL DE SERVICIOS */}

      <section className={styles.our_services_container}>
        <img src={logo} alt="Decoración" className={styles.icon_about} />
        <hr className={styles.line_about} />
        <h2 className={styles.title_about}>Nuestros servicios</h2>
        <p className={styles.text_about}>
          Cada persona es única, y por eso nuestros servicios están pensados para acompañarte en tu propio camino hacia el bienestar. <br />
          s tratamientos que relajan, equilibran y revitalizan, combinando técnicas profesionales con un enfoque consciente y personalizado. <br />
            Te invitamos a descubrir un espacio donde cuerpo y mente se alinean en perfecta armonía.
        </p>
        <button className={styles.newButton}>Ver todos los servicios</button> {/* Botón agregado */}
      </section>
      <div className={styles.services_carrousel}>
        <Carrousel items={servicios} />
      </div>


      {/* SECCION DESCUENTO */}
      <section className={styles.offer}>
        <div className={styles.text_container}>
          <p>50%</p>
          <p>EN TU <br />PRIMERA <br />SESIÓN</p>
        </div>
      </section>

      {/* SECCION DONDE ENCONTRARNOS */}
      <section className={styles.ubication}>
        <img src={logo} alt="Decoración" className={styles.icon_about} />
        <hr className={styles.line_about} />
        <h2 className={styles.title_about}>Donde encontrarnos</h2>
        <p className={styles.text_about}>
          Te esperamos en nuestro espacio de bienestar, donde cada rincón está pensado para tu descanso y renovación. <br />
          Nos encontramos en un lugar tranquilo, de fácil acceso, ideal para desconectar del ritmo diario y regalarte un momento <br />
          solo para vos.
        </p>

        
      </section>
    </>
  );
}

export default Home;
