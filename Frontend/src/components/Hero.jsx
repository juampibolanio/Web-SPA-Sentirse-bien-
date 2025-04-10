import { Link } from "react-router-dom";
import styles from '../styles/Hero.module.css';

function Hero({titleLines = [], 
    buttonText = "Solicitá tu turno", 
    buttonLink="/shifts", 
    showButton=false, 
    backgroundImage,
    extraClass}
    ) {

    return(
        <>
        <section 
            className={`${styles.hero} ${extraClass || ''}`}
            style={{backgroundImage: `url(${backgroundImage})`}}
        >
            <div className={styles.arrowLeft}>‹</div>
            {showButton && (
                <Link to={buttonLink}>
                    <button className={styles.cta} >{buttonText} </button> 
                </Link>
            )}

            <div className={styles.content}>
            <h1 className={styles.title}>
                {titleLines.map((line, i) => (
                    <span key={i}>
                        {line}<br />
                    </span>
                ))}
            </h1>
        </div>
        <div className={styles.arrowRight}>›</div>
        </section>
        </>
    )
}

export default Hero;