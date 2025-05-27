// src/components/PageLoader.jsx
import { FaSpinner } from 'react-icons/fa';
import styles from '../styles/PageLoader.module.css';

export default function PageLoader() {
    return (
        <div className={styles.overlay}>
            <FaSpinner className={styles.spinner} />
        </div>
    );
}
