import React, { useEffect, useRef, useState } from 'react';
import styles from '../styles/Carrousel.module.css';

function Carrousel({ items }) {
    const visibleCards = 3;
    const cardWidth = 320;
    const gap = 16;

    const [currentIndex, setCurrentIndex] = useState(visibleCards);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const carrouselRef = useRef(null);

    // Clona elementos al inicio y final
    const extendedItems = [
        ...items.slice(-visibleCards), // clona últimos
        ...items,
        ...items.slice(0, visibleCards) // clona primeros
    ];

    const handleNext = () => {
        if (currentIndex < extendedItems.length - visibleCards) {
            setCurrentIndex(prev => prev + 1);
            setIsTransitioning(true);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
            setIsTransitioning(true);
        }
    };

    // Detectar si estamos en duplicado, y saltar sin transición
    useEffect(() => {
        if (!isTransitioning) return;

        const timeout = setTimeout(() => {
            if (currentIndex === extendedItems.length - visibleCards) {
                // si llegamos al final duplicado, saltamos al inicio real
                setIsTransitioning(false);
                setCurrentIndex(visibleCards);
            } else if (currentIndex === 0) {
                // si estamos en el inicio duplicado, saltamos al final real
                setIsTransitioning(false);
                setCurrentIndex(extendedItems.length - visibleCards * 2);
            } else {
                setIsTransitioning(true);
            }
        }, 500); // duración de la transición

        return () => clearTimeout(timeout);
    }, [currentIndex]);

    const getTranslateX = () => {
        return -(currentIndex * (cardWidth + gap));
    };

    return (
        <div className={styles.carrouselWrapper}>
            <button className={styles.arrow} onClick={handlePrev}>‹</button>

            <div
                className={styles.carrouselCards}
                style={{
                    transform: `translateX(${getTranslateX()}px)`,
                    transition: isTransitioning ? 'transform 0.5s ease' : 'none',
                    width: `${(cardWidth + gap) * extendedItems.length}px`
                }}
                ref={carrouselRef}
            >
                {extendedItems.map((item, index) => (
                    <div className={styles.carrouselCard} key={index}>
                        <img src={item.img} alt={item.titulo} className={styles.carrouselImg} />
                        <h3 className={styles.carrouselTitle}>{item.titulo}</h3>
                    </div>
                ))}
            </div>

            <button className={styles.arrow} onClick={handleNext}>›</button>
        </div>
    );
}

export default Carrousel;
