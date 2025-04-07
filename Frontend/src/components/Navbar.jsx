import { Link } from "react-router-dom";
import styles from '../styles/Navbar.module.css'


function Navbar() {
    return(
        <nav>
            <div className={styles.nav}>
                <img className={styles.navImg} src="" alt="" srcset="" />
                <h1 className={styles.navTitle}></h1>
                <ul className={styles.navLinks}>
                    <li><Link to="/"> Home</Link></li>
                    <li><Link to="/servicios"> Servicios</Link></li>
                    <li><Link to="/contacto"> Contacto</Link></li>
                </ul>
            </div>
        </nav>
    )
}

export default Navbar;