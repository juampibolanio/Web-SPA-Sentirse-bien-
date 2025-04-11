import styles from '../styles/Home.module.css'
import Hero from '../components/Hero'
import ServiceCardHome from '../components/ServiceCardHome'
import Img from '../assets/Img/ppalimg.avif'
import srv1 from '../assets/Img/MujerAcostada.avif'
import srv2 from '../assets/Img/CRIO.jpg' 
import srv3 from '../assets/Img/Velaslim-Plus-17307579281.jpg'

function Home() {
  return (
    <>
      <Hero 
        titleLines={["SPA", "RELAJACIÓN", "PARA TU", "CUERPO"]}
        buttonText='Solicitá tu turno'
        buttonLink='/shifts'
        showButton={true}
        backgroundImage={Img}
      />

      <div className={styles.srvDivision}></div>
      
      <div className={styles.srvDescription}>
        <h6 className={styles.srvSubtitle}>Lorem ipsum at dolor</h6>
        <div className={styles.srvTitle}>
          <h1>La mejor elección para tu <br />cuerpo es venir aquí</h1>
        </div>
        <p className={styles.srvDescription}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. 
          Suscipit asperiores aspernatur aperiam repellat <br /> fugiat maxime explicabo iusto repellendus ea qui? 
          Repudiandae, quisquam. Necessitatibus vitae cum fugiat <br /> distinctio officiis molestiae modi. 
          Suscipit asperiores aspernatur <br />
        </p>
      </div>

      <section className={styles.services}>
        <h2>Algunos de nuestros servicios</h2>
        
        <div className={styles.cardsWrapper}>
          <div className={styles.whiteDivisor}></div>
          <div className={styles.cardsConteiner}>
            <ServiceCardHome 
              imagen={srv1}
              titulo="Masajes relajantes"
              descripcion="Alivia el estrés con nuestros masajes especializados.  Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nemo laudantium facilis, natus rerum nisi dolore aut veritatis impedit laboriosam consectetur. Similique unde aperiam quidem aliquid dolore iusto sint ad minus!"
            />
            <ServiceCardHome 
              imagen={srv2}
              titulo="Aromaterapia"
              descripcion="Disfruta de un ambiente único con velas y aromas.   Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nemo laudantium facilis, natus rerum nisi dolore aut veritatis impedit laboriosam consectetur. Similique unde aperiam quidem aliquid dolore iusto sint ad minus!"
            />
            <ServiceCardHome 
              imagen={srv3}
              titulo="lorem ipsum at dolor"
              descripcion="Acá va una descripción  Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nemo laudantium facilis, natus rerum nisi dolore aut veritatis impedit laboriosam consectetur. Similique unde aperiam quidem aliquid dolore iusto sint ad minus!"
            />
          </div>
        </div>
      </section>
      
      <div className={styles.about}>
        <div className={styles.overlay}></div>
        
        <div className={styles.aboutContent}>
          <h2>Acerca de nosotros</h2>
          <h3>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. 
            Suscipit asperiores aspernatur braperiam repellat. 
            Suscipit asperiores aspernatur aperiam repellat. <br />
            Suscipit asperiores aspernatur aperiam repellat.
          </h3>

          <h1>
            Sentirse bien <br />
            By Ana Felicidad
          </h1>
        </div>
      </div>
    </>
  )
}

export default Home;
