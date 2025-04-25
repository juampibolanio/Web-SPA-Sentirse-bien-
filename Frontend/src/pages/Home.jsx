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
import Contacto from '../components/Contact_Form';
import imgFoot from '../assets/img/PNG_FOTTER.png';
import Header from '../components/Header';
import { Link } from 'react-router-dom';


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
      <Header customClass="bgHome" />
      <section
        className={styles.hero}
        style={{ backgroundImage: `url(${slides[currentSlide].image})` }}
      >
        <div className={styles.overlay}>
          <hr className={styles.line_over} />
          <h1 className={styles.title}>{slides[currentSlide].title}</h1>
          <p className={styles.subtitle}>{slides[currentSlide].subtitle}</p>

          <div className={styles.buttonsContainer}>
            <Link to="/turnos" className={styles.button}>TURNOS</Link>
            <a href="#contacto" className={styles.button}>CONTACTO</a>
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
        <Link to="/masajes" className={styles.newButton}>
          Ver todos los servicios
        </Link>
      </section>
      <div className={styles.services_carrousel}>
        <Carrousel items={servicios} />
      </div>


      {/* SECCION DESCUENTO */}
      <section className={styles.offer}>
        <div className={styles.text_container}>
          <p>50% <br />OFF</p>
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
      {/* IMAGEN CHA-COR */}
      <div className={styles.container_maps}>
        <div className={styles.ubication_container}>
          <p className={styles.textA}> <div className={styles.text_Tit}>RESISTENCIA </div> <br />
            C. Don Bosco 311 <br />
            TEL: 3624978693  </p>
          <p className={styles.textA}><div className={styles.text_Tit}>CORRIENTES </div><br />
            San Martín 1430 <br />
            TEL: 3794869473
          </p>
        </div>
      </div>

      {/* SECCION DONDE ENCONTRARNOS */}
      <div className={styles.maps}>
        <div className={styles.cards_conteiner}>
          <div className={styles.card_map}>
            <iframe
              title="Mapa Resistencia"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3540.5813647150867!2d-58.983551424863904!3d-27.45115461591578!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94450cf12a2995c3%3A0x6ae1c7e5cbf90278!2sC.%20Don%20Bosco%20311%2C%20H3500%20Resistencia%2C%20Chaco!5e0!3m2!1ses!2sar!4v1745427728897!5m2!1ses!2sar"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className={styles.mapa}
            ></iframe>
          </div>
          <div className={styles.card_map}>
            <iframe
              title="Mapa Corrientes"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3539.967608977773!2d-58.837807120602776!3d-27.470267755650042!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94456ca1a37aeea3%3A0xe478b15a1364adea!2sSan%20Mart%C3%ADn%201430%2C%20W3400%20Corrientes!5e0!3m2!1ses!2sar!4v1745427840096!5m2!1ses!2sar"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className={styles.mapa}
            ></iframe>
          </div>
        </div>
      </div>


      {/*SECCION FORMULARIO CABECERA CONTACTO*/}
      <section id ="contacto" className={styles.form_header}>
        <img src={logo} alt="Decoración" className={styles.icon_about} />
        <hr className={styles.line_about} />
        <h2 className={styles.title_about}>Contacto</h2>
        <p className={styles.text_about}>
          Estamos acá para ayudarte. <br />
          Si tenés dudas, querés reservar un turno o simplemente necesitás más información sobre nuestros servicios, <br />
          no dudes en escribirnos.
        </p>
      </section>

      {/*FORMULARIO DE CONTACTO */}
      <div className={styles.form_section}>
        <div className={styles.form_container}>
          <div className={styles.formbox}>
            <Contacto />
          </div>
          <img src={imgFoot} alt="Contacto" className={styles.imgContact} />
        </div>
      </div>

    </>
  );
}

export default Home;
