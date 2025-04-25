import React from 'react';
import styles from '../styles/ServiceCard.module.css';

const ServiceCard = ({ image, title, text, price }) => {
    return (
        <div className={styles.card_container}>
            <div className={styles.card}>
                <div className={styles.card_img}>
                    <img src={image} alt={title} />
                </div>

                <div className={styles.card_description}>
                    <h4 className={styles.card_title}>{title}</h4>
                    <p className={styles.card_text}>{text}</p>
                    <div className={styles.card_cost}>{price}</div>
                </div>
            </div>

            <button className={styles.card_button} type="button">
                SOLICITAR
            </button>
        </div>
    );
};

export default ServiceCard;
