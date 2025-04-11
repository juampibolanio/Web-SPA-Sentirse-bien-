import styles from '../styles/Services.module.css'
import Hero from '../components/Hero'
import ImgHero from '../assets/Img/services-photo.avif'
import CardTitle from '../components/CardTitle'
import CardsConteiner  from '../components/CardsContainer'
import ImgCard1 from '../assets/Img/Dermohealht.jpg'
import ImgCard2 from '../assets/Img/CRIO.jpg'
import ImgCard3 from '../assets/Img/Captura de pantalla 2025-04-05 153714.png'
import BrownStripe from '../components/BrownStripe'

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
            <div className={styles.servicesContainerT}>
                
{/* MASAJES*/}
            <div className={styles.srvTitle}>
                <CardTitle cardText='Masajes'/>
            </div>

            <div className={styles.srvText}>
                <p>
                    Aliviá tensiones, mejorá tu circulación y conectá con tu <br />
                    bienestar a través de técnicas adaptadas a tus necesidades.
                </p>
            </div>

            <CardsConteiner imgCard1={ImgCard1}
                imgCard2={ImgCard2}
                imgCard3={ImgCard3} 
                title1='Anti stress' 
                title2='Descontracturantes' 
                title3='Con piedras'/>
            <BrownStripe />

{/* BELLEZA*/}
            <div className={styles.srvTitle}>
                <CardTitle cardText='Belleza' />
            </div>

            <div className={styles.srvText}>
                <p>
                    Realizamos tu belleza natural con tratamientos que cuidan, <br />
                    nutren y embellecen tu piel, manos, pies y cuerpo. Sentite  <br />
                    radiante, por dentro y por fuera.
                </p>
            </div>

            <CardsConteiner imgCard1={ImgCard1}
                imgCard2={ImgCard2}
                imgCard3={ImgCard3} 
                title1='Lifting pestañas' 
                title2='Depilación facial' 
                title3='Manos y pies'/>

{/*TRATAMIENTOS FACIALES*/}
            <BrownStripe />
            <div className={styles.srvTitle}>
                <CardTitle cardText='Tratamientos faciales' />
            </div>

            <div className={styles.srvText}>
                <p>
                    Cuidá tu piel con rituales faciales pensados para limpiar, <br />
                    hidratar y rejuvenecer. Devolvele a tu rostro frescura, <br />
                    suavidad y luminosidad.
                </p>
            </div>

            <CardsConteiner imgCard1={ImgCard1}
                imgCard2={ImgCard2}
                imgCard3={ImgCard3} 
                title1='Punta de diamante' 
                title2='Limpieza profunda' 
                title3='Crio frecuencia'/>

{/*TRATAMIENTOS CORPORALES*/}
            <BrownStripe />
            <div className={styles.srvTitle}>
                <CardTitle cardText='Tratamientos corporales' />
            </div>

            <div className={styles.srvText}>
                <p>
                    Renová tu cuerpo con tratamientos que exfolian, nutren y <br />
                    modelan. Sentite más liviana, tonificada y con una piel <br />
                    suave al tacto.
                </p>
            </div>

            <div className={styles.cardConteiner}>
                <CardsConteiner imgCard1={ImgCard1}
                    imgCard2={ImgCard2}
                    imgCard3={ImgCard3} 
                    title1='Vela slim' 
                    title2='Ultracativación' 
                    title3='Dermohealth'/>
            </div>

{/*SERVICIOS GRUPALES*/}
            <BrownStripe />
            <div className={styles.srvTitle}>
                <CardTitle cardText='Servicios grupales' />
            </div>

            <div className={styles.srvText}>
                <p>
                    Compartí una experiencia de bienestar única junto a <br />
                    quienes más querés. Sesiones diseñadas para grupos, <br />
                    amigas, parejas o eventos especiales, en un ambiente <br />
                    íntimo y relajante. 
                </p>
            </div>
                <CardsConteiner imgCard1={ImgCard1}
                    imgCard2={ImgCard2}
                    imgCard3={ImgCard3} 
                    title1='Hidromasajes' 
                    title2='Yoga' 
                    title3='Sauna'/>
            
            <BrownStripe />

            <div className={styles.srvTitle}>
                <CardTitle cardText='¿Por qué elegirnos?'/>
            </div>

            <div className={styles.srvText}>
                <p>
                Descubrí un refugio de paz donde cuerpo, mente y alma se armonizan. <br />
                En cada sesión, buscamos que te sientas renovado/a, cuidado/a y en equilibrio. <br />
                En nuestro spa, cada detalle está pensado para que vivas una experiencia de bienestar única. <br />
                No solo cuidamos tu cuerpo, también cuidamos tu mente y tu energía.
                </p>
            </div>

            <br /><br />

            <div className={styles.srvTitle}>
                <CardTitle cardText='50% de descuento en tu primera sesión grupal'/>
            </div>
            <br />
            <div className={styles.srvText}>
                <p>
                Viví la experiencia que tu cuerpo necesita. Reservá hoy y regalate <br />
                un momento de bienestar para vos y un acompañante.
                </p>
            </div>

            
            </div>
        </div>

        </>
    )
}

export default Services
