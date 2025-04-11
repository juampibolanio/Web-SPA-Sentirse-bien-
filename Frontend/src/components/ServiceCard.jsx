import styles from '../styles/ServiceCard.module.css'

function ServiceCard({ imageSrc, title }) {
    return (
        <div className={styles.card}>
            <div className={styles.imgWrapper}>
                <img src={imageSrc} alt={title} className={styles.img} />
            </div>
            <div className={styles.text}>
                {title}
            </div>
        </div>
    )
}

export default ServiceCard;
