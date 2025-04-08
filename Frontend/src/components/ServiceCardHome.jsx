import styles from '../styles/ServiceCardHome.module.css'

function ServiceCardHome({imagen, titulo, descripcion}) {

    return (
    <div className={styles.card}>
        <img src={imagen} alt={titulo} className={styles.image} />
        <h3 className={styles.title}>{titulo}</h3>
        <p className={styles.description}>{descripcion}</p>
    </div>
    );
}

export default ServiceCardHome;