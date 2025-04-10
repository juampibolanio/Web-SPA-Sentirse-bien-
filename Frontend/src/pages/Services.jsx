import styles from '../styles/Services.module.css'
import ServiceCard from '../components/ServiceCard'
import Hero from '../components/Hero'
import CardTitle from '../components/CardTitle'
import ImgHero from '../assets/Img/services-photo.avif'
import ImgCard1 from '../assets/Img/Dermohealht.jpg'
import ImgCard2 from '../assets/Img/CRIO.jpg'
import ImgCard3 from '../assets/Img/Captura de pantalla 2025-04-05 153714.png'
import BrownStripe from '../components/BrownStripe'
import CardsConteiner from '../components/CardsConteiner'

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
                <BrownStripe />
{/* MASAJES*/}
                <div className={styles.cardTitleWrapper}>
                    <CardTitle cardText='Masajes' />
                </div>

                <div className={styles.textService}>
                    <p>
                        Aliviá tensiones, mejorá tu circulación y conectá con tu <br />
                        bienestar a través de técnicas adaptadas a tus necesidades.
                    </p>
                </div>

                <CardsConteiner imgCard1={ImgCard1}
                imgCard2={ImgCard2}
                imgCard3={ImgCard3} 
                title1='Dermohealth' 
                title2='CRIO' 
                title3='nose'/>

{/* BELLEZA*/}
                <BrownStripe />
                <div className={styles.cardTitleWrapper}>
                    <CardTitle cardText='Belleza' />
                </div>

                <div className={styles.textService}>
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
                <div className={styles.cardTitleWrapper}>
                    <CardTitle cardText='Tratamientos faciales' />
                </div>

                <div className={styles.textService}>
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
                <div className={styles.cardTitleWrapper}>
                    <CardTitle cardText='Tratamientos corporales' />
                </div>

                <div className={styles.textService}>
                    <p>
                        Renová tu cuerpo con tratamientos que exfolian, nutren y <br />
                        modelan. Sentite más liviana, tonificada y con una piel <br />
                        suave al tacto.
                    </p>
                </div>

                <CardsConteiner imgCard1={ImgCard1}
                imgCard2={ImgCard2}
                imgCard3={ImgCard3} 
                title1='Vela Slim' 
                title2='Dermohealth' 
                title3='Ultracativación'/>

{/*SERVICIOS GRUPALES*/}
                <BrownStripe />
                <div className={styles.cardTitleWrapper}>
                    <CardTitle cardText='Servicios grupales' />
                </div>

                <div className={styles.textService}>
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
                title3={'Sauna'}
                />




                {/* Cuadro con imagen a la derecha */}
                <div className={styles.boxCard}>
                    <div className={styles.textWrapper}>
                        <h3 className={styles.offer}>¿Por qué elegirnos?</h3>
                        <p className={styles.mainText}>
                            En nuestro spa, cada detalle está pensado para que vivas una experiencia de<br />
                            bienestar única. No solo cuidamos tu cuerpo, también cuidamos tu mente y tu <br />
                            energía.
                        </p>
                        <p className={styles.secondaryText}>
                            Descubrí un refugio de paz, donde cuerpo, mente y alma se armonizan. En cada sesión, buscamos <br />
                            que te sientas renovado/a, cuidado/a y en equilibrio.
                        </p>
                    </div>
                    <div className={`${styles.imageFloat} ${styles.cardImageRight}`}>
                        <div className={styles.imageFrame}>
                            <img src={ImgCard1} alt="Ejemplo" className={styles.framedImage} />
                        </div>
                    </div>
                </div>

                {/* Cuadro con imagen a la izquierda */}
                <div className={styles.boxCardReverse}>
                    <div className={`${styles.imageFloat} ${styles.cardImageLeft}`}>
                        <div className={styles.imageFrame}>
                            <img src={ImgCard2} alt="Ejemplo" className={styles.framedImage} />
                        </div>
                    </div>
                    <div className={styles.textWrapper}>
                        <h3 className={styles.offer}>50% de descuento en tu primera grupal</h3>
                        <p className={styles.mainText}>
                            Viví la experiencia que tu cuerpo necesita. Reservá hoy y regalate un momento <br />
                            de bienestar para vos y un acompañante.
                        </p>
                    </div>
                </div>

                <div className={styles.testimonialBox}>
                    <h2 className={styles.testimonialTitle}>Testimonios</h2>
                    <div className={styles.testimonialQuote}>“</div>
                        <p className={styles.testimonialText}>
                            Desde que descubrí este spa, se convirtió en mi lugar favorito para desconectar del mundo.
                            La atención es impecable, el ambiente transmite paz y cada sesión me deja como nueva.
                            Lo recomiendo con los ojos cerrados.
                        </p>
                <p className={styles.testimonialAuthor}>Lucía G., 34 años</p>
                <p className={styles.testimonialDots}>...</p>
                </div>

            </div>
        </>
    )
}

export default Services
