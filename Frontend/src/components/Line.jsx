import styles from '../styles/Line.module.css'

function Line() {
    return (
        <div className={styles.waveSeparator}>
            <svg
                viewBox="0 0 1440 150"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
            >
                <path
                    d="M0,100 C360,-40 1080,190 1440,50"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="4"
                />
            </svg>
        </div>
    )
}

export default Line;
