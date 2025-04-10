import styles from '../styles/CardTitle.module.css'

function CardTitle({cardText="Undefined"}) {

    return(

        <div className={styles.card}>
            <h2>{cardText}</h2>
        </div>
    )
}

export default CardTitle;