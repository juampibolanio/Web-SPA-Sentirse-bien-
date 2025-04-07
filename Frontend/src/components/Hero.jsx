import { Link } from "react-router-dom";
import styles from '../styles/Hero.module.css';

function Hero() {

    return(

        <section className={styles.hero}>
            <div className={styles.arrowLeft}>‹</div>
            <button className={styles.cta}>Solicitá tu turno</button>
            <div className={styles.content}>
            <h1 className={styles.title}>
                SPA<br />
                RELAJACIÓN<br />
                PARA TU<br />
                CUERPO
            </h1>
        </div>

        <div className={styles.arrowRight}>›</div>
        </section>

    )
}

export default Hero;