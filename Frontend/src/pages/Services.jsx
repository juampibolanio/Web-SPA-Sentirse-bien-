import styles from '../styles/Services.module.css'
import ServiceCard from '../components/ServiceCard'
import Hero from '../components/Hero'
import CardTitle from '../components/CardTitle'
import ImgHero from '../assets/Img/services-photo.avif'
import ImgCard1 from '../assets/Img/Dermohealht.jpg'
import ImgCard2 from '../assets/Img/CRIO.jpg'
import ImgCard3 from '../assets/Img/Captura de pantalla 2025-04-05 153714.png'

function Services() {
    return (
        <>
            <Hero
                titleLines={["NUESTROS", "SERVICIOS"]}
                showButton={false}
                backgroundImage={ImgHero}
                extraClass={styles.heroServices}
            />

            <div className={styles.servicesContainer}>
                {/* Franja marrón detrás */}
                <div className={styles.brownStripe}></div>

                <div className={styles.cardTitleWrapper}>
                    <CardTitle cardText='Masajes' />
                </div>

                <div className={styles.textService}>
                    <p>
                        Aliviá tensiones, mejorá tu circulación y conectá con tu <br />
                        bienestar a través de técnicas adaptadas a tus necesidades.
                    </p>
                </div>

                <div className={styles.cardsContainer}>
                    <ServiceCard imageSrc={ImgCard1} title={"Dermohealth"} />
                    <ServiceCard imageSrc={ImgCard2} title={"CRIO"} />
                    <ServiceCard imageSrc={ImgCard3} title={"nose"} />
                </div>
            </div>
        </>
    )
}

export default Services
