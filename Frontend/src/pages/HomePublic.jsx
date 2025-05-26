import React from 'react';
import styles from '../styles/HomePublic.module.css';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import spa1 from '../assets/carrouselHome/spa1.jpg';
import spa2 from '../assets/carrouselHome/spa2.jpg';
import spa3 from '../assets/carrouselHome/spa3.jpg';

import { FiMail, FiUser, FiMessageCircle } from 'react-icons/fi';
//Queda pendiente, terminar el home por completo. luego ir a los servicios. AGREGAR SERVICIOS A LA BD, REGISTRAR PROFESIONALES, TESTEAR TODO, AGREGAR TODOS LOS ESTILOS. 
function HomePublic() {
    return (
        <>
            {/* Hero / Banner carrusel full ancho */}
            <div className={styles.heroCarousel}>
                <Carousel autoPlay infiniteLoop showThumbs={false} showStatus={false} showIndicators={false} swipeable emulateTouch>
                    <div>
                        <img src={spa1} alt="Spa 1" />
                    </div>
                    <div>
                        <img src={spa2} alt="Spa 2" />
                    </div>
                    <div>
                        <img src={spa3} alt="Spa 3" />
                    </div>
                </Carousel>
                <div className={styles.heroText}>
                    <h1>Bienvenidos a Sentirse Bien SPA</h1>
                    <p>Tu espacio de relajación, salud y bienestar. Servicios profesionales para cuidar de vos.</p>
                </div>
            </div>

            <div className={styles.container}>
                <section className={styles.section}>
                    <h2>Contacto</h2>
                    <p>Dirección: Av. Bienestar 123, Ciudad Feliz</p>
                    <p>Teléfono: (123) 456-7890</p>
                    <p>Email: contacto@spaanafelicidad.com</p>
                </section>

                <section className={styles.section}>
                    <h2>Métodos de Pago</h2>
                    <p>
                        Aceptamos tarjetas de débito, crédito y transferencias bancarias.{' '}
                        <span className={styles.highlight}>¡Consultá por descuentos exclusivos por pago anticipado!</span>
                    </p>
                </section>

                {/* Nueva sección de mapas */}
                <section className={styles.section}>
                    <h2>Nuestras Sedes</h2>
                    <div className={styles.mapsContainer}>
                        <iframe
                            title="Resistencia"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3540.5813647150867!2d-58.983551424863904!3d-27.45115461591578!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94450cf12a2995c3%3A0x6ae1c7e5cbf90278!2sC.%20Don%20Bosco%20311%2C%20H3500%20Resistencia%2C%20Chaco!5e0!3m2!1ses!2sar!4v1745427728897!5m2!1ses!2sar"
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            className={styles.mapIframe}
                        ></iframe>

                        <iframe
                            title="Corrientes"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3539.967608977773!2d-58.837807120602776!3d-27.470267755650042!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94456ca1a37aeea3%3A0xe478b15a1364adea!2sSan%20Mart%C3%ADn%201430%2C%20W3400%20Corrientes!5e0!3m2!1ses!2sar!4v1745427840096!5m2!1ses!2sar"
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            className={styles.mapIframe}
                        ></iframe>
                    </div>
                </section>

                <section className={styles.section}>
                    <h2>Formulario de Contacto</h2>
                    <form className={styles.formulario} onSubmit={e => e.preventDefault()}>
                        <div className={styles.inputGroup}>
                            <label htmlFor="nombre">Nombre:</label>
                            <div className={styles.inputIconWrapper}>
                                <FiUser className={styles.inputIcon} />
                                <input type="text" id="nombre" name="nombre" placeholder="Tu nombre" required />
                            </div>
                        </div>

                        <div className={styles.inputGroup}>
                            <label htmlFor="email">Email:</label>
                            <div className={styles.inputIconWrapper}>
                                <FiMail className={styles.inputIcon} />
                                <input type="email" id="email" name="email" placeholder="tu@email.com" required />
                            </div>
                        </div>

                        <div className={styles.inputGroup}>
                            <label htmlFor="mensaje">Mensaje:</label>
                            <div className={styles.inputIconWrapper}>
                                <FiMessageCircle className={styles.inputIcon} />
                                <textarea id="mensaje" name="mensaje" rows="5" placeholder="Escribe tu mensaje aquí..." required />
                            </div>
                        </div>

                        <button type="submit">Enviar</button>
                    </form>
                </section>
            </div>
        </>
    );
}

export default HomePublic;
