import styles from '../styles/CardsConteiner.module.css'
import ServiceCard from './ServiceCard';

function CardsConteiner({imgCard1, imgCard2, imgCard3, title1, title2, title3}) {

    return(
        <div className={styles.cardsContainer}>
            <ServiceCard imageSrc={imgCard1} title={title1} />
            <ServiceCard imageSrc={imgCard2} title={title2} />
            <ServiceCard imageSrc={imgCard3} title={title3} />
        </div>
    )
}

export default CardsConteiner;