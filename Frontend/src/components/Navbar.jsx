import { Link } from "react-router-dom";
import styles from '../styles/Navbar.module.css';

function Navbar() {
    return (
    <>
    <div className={styles.topBar}>
        <div className={styles.left}>
            📞 3624679843
        </div>
        <div className={styles.right}>
            <a href="" target="_blank" rel="noopener noreferrer">📱</a>
            <a href="#" target="_blank" rel="noopener noreferrer">🌐</a>
        </div>
    </div>

    <nav className={styles.nav}>
        <div className={styles.logoSection}>
            <Link to="/" className={styles.linkTo}>
            <h1 className={styles.title}>SentirseBien</h1>
            <p className={styles.subtitle}>By Ana Felicidad</p>
            </Link>
        </div>

        <ul className={styles.links}>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/services">Servicio</Link></li>
            <li><Link to="/shifts">Turnos</Link></li>
            <li><Link to="/contact">Contacto</Link></li>
        </ul>

            <div className={styles.login}>
            <Link to="/login">Iniciar sesión</Link>
            </div>
        </nav>
    </>
    );
}

export default Navbar;
