import React, { useState } from 'react';
import styles from '../styles/HomePublic.module.css';

// Importa el componente Carousel para mostrar imágenes con transición automática
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

// Importa imágenes para el carrusel
import spa1 from '../assets/carrouselHome/spa1.jpg';
import spa2 from '../assets/carrouselHome/spa2.jpg';
import spa3 from '../assets/carrouselHome/spa3.jpg';

// Importa íconos para usar en diferentes secciones del sitio
import { FaQuestionCircle, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';
import { FiMail, FiUser, FiMessageCircle } from 'react-icons/fi';

// Importa Link de react-router-dom para navegación interna sin recarga
import { Link } from 'react-router-dom';

// Imágenes adicionales para contenido visual estático
import logo from '../assets/homePublic/LOGO.png';
import imageMedium from '../assets/homePublic/imagenMed.jpg';
import imageMedium4 from '../assets/homePublic/imagenMed4.avif';

// Librería para enviar correos desde frontend vía EmailJS
import emailjs from 'emailjs-com';

function HomePublic() {

    // Estado para controlar los datos del formulario de contacto
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    // Actualiza el estado con los valores que ingresa el usuario en el formulario
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Envía el formulario usando EmailJS y resetea campos o muestra error
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Formulario enviado:', formData);

        // IDs de EmailJS (configurados en el panel de EmailJS)
        const serviceID = 'service_740jui9'; 
        const templateID = 'template_ey91ehp'; 
        const userID = 'Jxi-rcnsc0T3gnOtc';

        // Enviar el correo a través de EmailJS
        emailjs.send(serviceID, templateID, formData, userID)
            .then((response) => {
                console.log('Correo enviado:', response);
                alert('Tu mensaje ha sido enviado correctamente');
                setFormData({
                    name: '',
                    email: '',
                    message: ''
                });
            })
            .catch((err) => {
                console.error('Error al enviar correo:', err);
                alert('Ocurrió un error al enviar tu mensaje');
            });
    };

    return (
        <>
            {/* --------------------- SECCIÓN CARROUSEL --------------------- */}
            <div className={styles.heroCarousel}>
                <div className={styles.overlay}></div>
                <Carousel
                    autoPlay
                    infiniteLoop
                    showThumbs={false}
                    showStatus={false}
                    showIndicators={false}
                    showArrows={false}
                    swipeable
                    emulateTouch
                    interval={5000}
                >
                    {/* Imágenes que rotan en el carrusel */}
                    <div><img src={spa1} alt="Spa 1" /></div>
                    <div><img src={spa2} alt="Spa 2" /></div>
                    <div><img src={spa3} alt="Spa 3" /></div>
                </Carousel>

                {/* Texto y botones sobre el carrusel */}
                <div className={styles.heroText}>
                    <hr className={styles.line_over} />
                    <h1>SENTIRSE BIEN SPA</h1>
                    <p>Tu espacio de relajación, salud y bienestar. Servicios profesionales para cuidar de vos.</p>
                    <div className={styles.buttonGroup}>
                        <Link to="/servicios-public" className={styles.heroButton}>Ver Servicios</Link>
                        <Link to="/turnos" className={styles.heroButton}>Pedir Turno</Link>
                    </div>
                </div>
            </div>

            {/* --------------------- SECCIÓN ACERCA DE --------------------- */}
            <section className={styles.servicios}>
                <img src={logo} alt="Decoración" className={styles.icon_about} />
                <hr className={styles.line_about} />
                <h2 className={styles.titulo}>Acerca de nosotros</h2>
                <p className={styles.descripcion}>
                    En "Sentirse Bien" nos dedicamos al bienestar integral. Con más de 10 años de trayectoria,
                    combinamos técnicas ancestrales con tratamientos modernos para ofrecer una experiencia
                    relajante, renovadora y personalizada.
                </p>
                <p className={styles.descripcion}>
                    Nuestro equipo está conformado por profesionales certificados en estética, masajes, y
                    terapias corporales. Nos apasiona ayudarte a <strong>Sentirte Bien</strong>, por dentro y por fuera.
                </p>
            </section>

            {/* --------------------- IMAGEN ENTRE MEDIO 1 --------------------- */}
            <div className={styles.imageContainer}>
                <img src={imageMedium} alt="Masaje relajante" className={styles.imageBelowAbout} />
            </div>

            {/* --------------------- SECCIÓN SERVICIOS --------------------- */}
            <section className={styles.servicios}>
                <img src={logo} alt="Decoración" className={styles.icon_about} />
                <hr className={styles.line_about} />
                <h2 className={styles.titulo}>Nuestros Servicios</h2>
                <p className={styles.descripcion}>
                    Cada persona es única, y por eso nuestros servicios están pensados para acompañarte en tu propio camino hacia el bienestar.
                    Tratamientos que relajan, equilibran y revitalizan, combinando técnicas profesionales con un enfoque consciente y personalizado.
                    Te invitamos a descubrir un espacio donde cuerpo y mente se alinean en perfecta armonía.
                </p>
                <div className={styles.buttonGroup}>
                    <Link to="/servicios" className={styles.heroButton}>Ver Servicios</Link>
                </div>
            </section>

            {/* --------------------- IMAGEN ENTRE MEDIO 2 --------------------- */}
            <div className={styles.imageContainer}>
                <img src={imageMedium4} alt="Masaje relajante" className={styles.imageBelowAbout} />
            </div>

            {/* --------------------- SECCIÓN DONDE ENCONTRARNOS --------------------- */}
            <section className={styles.servicios}>
                <img src={logo} alt="Decoración" className={styles.icon_about} />
                <hr className={styles.line_about} />
                <h2 className={styles.titulo}>Dónde encontrarnos</h2>
                <p className={styles.descripcion}>
                    Te esperamos en nuestro espacio de bienestar, donde cada rincón está pensado para tu descanso y renovación.
                    Nos encontramos en un lugar tranquilo, de fácil acceso, ideal para desconectar del ritmo diario y regalarte un momento
                    solo para vos.
                </p>
            </section>

            {/* --------------------- SECCIÓN DE MAPAS CON UBICACIONES --------------------- */}
            <div className={styles.container}>
                <section className={styles.servicios}>
                    <h2 className={styles.titulo}>Nuestras Sedes</h2>

                    <div className={styles.mapsContainer}>
                        {/* Mapa de la sede Resistencia */}
                        <div className={styles.mapCard}>
                            <h3 className={styles.mapTitle}>Resistencia</h3>
                            <iframe
                                title="Resistencia"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3540.5813647150867!2d-58.983551424863904!3d-27.45115461591578!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94450cf12a2995c3%3A0x6ae1c7e5cbf90278!2sC.%20Don%20Bosco%20311%2C%20H3500%20Resistencia%2C%20Chaco!5e0!3m2!1ses!2sar!4v1745427728897!5m2!1ses!2sar"
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className={styles.mapIframe}
                            ></iframe>
                        </div>

                        {/* Mapa de la sede Corrientes */}
                        <div className={styles.mapCard}>
                            <h3 className={styles.mapTitle}>Corrientes</h3>
                            <iframe
                                title="Corrientes"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3539.967608977773!2d-58.837807120602776!3d-27.470267755650042!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94456ca1a37aeea3%3A0xe478b15a1364adea!2sSan%20Mart%C3%ADn%201430%2C%20W3400%20Corrientes!5e0!3m2!1ses!2sar!4v1745427840096!5m2!1ses!2sar"
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className={styles.mapIframe}
                            ></iframe>
                        </div>
                    </div>
                </section>

                {/* --------------------- SECCIÓN DE MÉTODOS DE PAGO --------------------- */}
                <section className={styles.servicios}>
                    <img src={logo} alt="Decoración" className={styles.icon_about} />
                    <hr className={styles.line_about} />
                    <h2 className={styles.titulo}>Métodos de pago</h2>
                    <p className={styles.descripcion}>
                        Aceptamos <strong>tarjetas de débito</strong> y <strong>pagos en efectivo</strong>{' '}
                        <span>¡Consultá por descuentos exclusivos por pago anticipado!</span>
                    </p>
                </section>

                {/* --------------------- SECCIÓN DE CONTACTO --------------------- */}
                <section className={styles.contacto}>
                    <img src={logo} alt="Decoración" className={styles.icon_about} />
                    <hr className={styles.line_about} />
                    <h2 className={styles.titulo}>Contacto</h2>

                    <p className={styles.descripcion}>
                        Estamos acá para ayudarte. Si tenés dudas, querés reservar un turno o simplemente necesitás más información sobre nuestros servicios, no dudes en escribirnos.
                    </p>

                    {/* Dirección y teléfono Resistencia */}
                    <div className={styles.dato}>
                        <FaMapMarkerAlt className={styles.icono} />
                        <div>
                            <p>Don Bosco 311, Ciudad de Resistencia</p>
                        </div>
                    </div>

                    <div className={styles.dato}>
                        <FaPhoneAlt className={styles.icono} />
                        <div>
                            <p>3624-978693</p>
                        </div>
                    </div>

                    {/* Dirección y teléfono Corrientes */}
                    <div className={styles.dato}>
                        <FaMapMarkerAlt className={styles.icono} />
                        <div>
                            <p>San Martín 1430, Ciudad de Corrientes</p>
                        </div>
                    </div>

                    <div className={styles.dato}>
                        <FaPhoneAlt className={styles.icono} />
                        <div>
                            <p>3794-869473</p>
                        </div>
                    </div>

                    {/* Email */}
                    <div className={styles.dato}>
                        <FaEnvelope className={styles.icono} />
                        <div>
                            <p><strong>sentirsebienaf@gmail.com</strong></p>
                        </div>
                    </div>

                    {/* Horarios */}
                    <div className={styles.dato}>
                        <div>
                            <p>Lunes a viernes: de 9 a 20 hs.</p>
                            <p>Sábados: de 9 a 14 hs.</p>
                        </div>
                    </div>
                </section>

                {/* --------------------- FORMULARIO DE CONTACTO --------------------- */}
                <section className={styles.sectionFormulario}>
                    <h2>Formulario de Contacto</h2>
                    <p>¿Tienes alguna duda? Contáctanos mediante este formulario y te atenderemos.</p>

                    <form className={styles.formulario} onSubmit={handleSubmit}>
                        {/* Campo nombre */}
                        <div className={styles.inputGroup}>
                            <label htmlFor="nombre">Nombre:</label>
                            <div className={styles.inputIconWrapper}>
                                <FiUser className={styles.inputIcon} />
                                <input 
                                    type="text" 
                                    id="nombre" 
                                    name="name" 
                                    placeholder="Tu nombre" 
                                    required  
                                    value={formData.name} 
                                    onChange={handleChange} 
                                />
                            </div>
                        </div>

                        {/* Campo email */}
                        <div className={styles.inputGroup}>
                            <label htmlFor="email">Email:</label>
                            <div className={styles.inputIconWrapper}>
                                <FiMail className={styles.inputIcon} />
                                <input 
                                    type="email" 
                                    id="email" 
                                    name="email" 
                                    placeholder="tu@email.com" 
                                    required 
                                    value={formData.email} 
                                    onChange={handleChange} 
                                />
                            </div>
                        </div>

                        {/* Campo mensaje */}
                        <div className={styles.inputGroup}>
                            <label htmlFor="mensaje">Mensaje:</label>
                            <div className={styles.inputIconWrapper}>
                                <FiMessageCircle className={styles.inputIcon} />
                                <textarea 
                                    id="mensaje" 
                                    name="message" 
                                    rows="5" 
                                    placeholder="Escribe tu mensaje aquí..." 
                                    required  
                                    value={formData.message} 
                                    onChange={handleChange} 
                                />
                            </div>
                        </div>

                        <button className={styles.buttonSubmit} type="submit">Enviar</button>
                    </form>
                </section>
            </div>
        </>
    );
}

export default HomePublic;
