import styles from '../styles/Footer.module.css'
import { FiArrowRight } from 'react-icons/fi'
import { FaRegCopyright } from 'react-icons/fa';
function Footer() {
    return (
        <>
            <footer className={styles.footer}>
                <div className={styles.topSection}>
                    <div className={styles.leftDescription}>
                        <div className={styles.title}>
                            <h3>Sentirse bien</h3>
                            <p>By Ana Felicidad</p> 
                        </div>

                        <div className={styles.inputMail}>
                            <input type="email" name="email" placeholder='Escribe tu e-mail' />
                            <button type="submit">
                                <FiArrowRight size={20} />
                            </button>
                        </div>

                        <div className={styles.leftText}>
                            <p>Envianos tu mail para obtener <br />
                                novedades y descuentos del SPA.
                            </p>
                        </div>
                    </div>

                    <div className={styles.rightLinks}>
                        <div className={styles.links}>
                            <ul>
                                <h3 className={styles.linkTitle}>Links</h3>
                                <li>Visita nuestro sitio</li>
                                <li>Seguinos en Twitter</li>
                                <li>Escribinos por Whatsapp</li>
                                <li>Seguinos en Instagram</li>
                            </ul>
                        </div>
                        <div className={styles.legal}>
                            <ul>
                                <h3 className={styles.linkTitle}>Legales</h3>
                                <li>Términos y condiciones</li>
                                <li>Política de privacidad</li>
                            </ul>
                        </div>
                        <div className={styles.contact}>
                            <ul>
                                <h3 className={styles.linkTitle}>Contacto</h3>
                                <li>+54 3624 001023</li>
                                <li>Resistencia Chaco</li>
                                <li>SpaSB@gmail.com</li>
                            </ul>
                        </div>
                        <div className={styles.navegation}>
                            <ul>
                                <h3 className={styles.linkTitle}>Navegar</h3>
                                <li>Sobre nosotros</li>
                                <li>Servicios</li>
                                <li>Turnos</li>
                                <li>Contacto</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <p className={styles.copyright}>
                    <FaRegCopyright style={{ marginRight: '5px' }} />
                    2025 Sentirse Bien. Todos los derechos reservados.
                </p>
            </footer>
        </>
    )
}

export default Footer;