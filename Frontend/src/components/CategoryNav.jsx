import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/CategoryNav.module.css';

const CategoryNav = () => {
    return (
        <div className={styles.nav_container}>
            <h3>Explorar otras categorías</h3>
            <div className={styles.buttons}>
                <Link to="/masajes">
                    <button className={styles.button}>Masajes</button>
                </Link>
                <Link to="/belleza">
                    <button className={styles.button}>Belleza</button>
                </Link>
                <Link to="/tratamientosfaciales">
                    <button className={styles.button}>Tratamientos faciales</button>
                </Link>
                <Link to="/tratamientoscorporales">
                    <button className={styles.button}>Tratamientos corporales</button>
                </Link>
                <Link to="/grupales"> 
                    <button className={styles.button}>Grupales</button>
                </Link>
            </div>
        </div>
    );
};

export default CategoryNav;
