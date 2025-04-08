import styles from '../styles/Home.module.css'
import ServiceCardHome from '../components/ServiceCardHome'

function Home() {
  return (

      <>

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
      <div className={styles.cardsConteiner}>
        <ServiceCardHome 
          imagen={null}
          titulo="Masajes relajantes"
          descripcion="Alivia el estrés con nuestros masajes especializados."
        />
        <ServiceCardHome 
          imagen={null}
          titulo="Aromaterapia con velas"
          descripcion="Disfruta de un ambiente único con velas y aromas."
        />

        <ServiceCardHome 
          imagen={null}
          titulo="lorem ipsum at dolor "
          descripcion="Acá va una descripción"
        />
      </div>
    </section>

    <div className={styles.about}>
      <h2>Acerca de <br /> nosotros</h2>
      <h3>Lorem ipsum dolor sit amet consectetur adipisicing elit. <br />
      Suscipit asperiores aspernatur braperiam repellat.  <br />
      Suscipit asperiores aspernatur aperiam repellat. <br />
      Suscipit asperiores aspernatur aperiam repellat.
      </h3>
    </div>

    </>
  )
}

export default Home
