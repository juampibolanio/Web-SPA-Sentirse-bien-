import styles from '../styles/ResetPassword.module.css';
import logo from '../assets/img/logo_spa.png';

const ResetPassword = () => {
    return (
        <div className={styles.loginContainer}>
            <div className={styles.header}>
                <h1 className={styles.titleLogo}>
                    <span className={styles.left}>Sentirse</span>
                    <img src={logo} alt="Logo" className={styles.logo} />
                    <span className={styles.right}>Bien</span>
                </h1>
                <p className={styles.subtext}>Dra. Ana Felicidad</p>
            </div>

            <div className={styles.loginCard}>
                <h2 className={styles.title}>Recuperar contraseña</h2>
                <p className={styles.subtitle}>Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.</p>
                <form>
                    <input
                        type="email"
                        placeholder="Email"
                        required
                        className={styles.input}
                    />
                    <button type="submit" className={styles.submitBtn}>
                        Enviar enlace de recuperación
                    </button>

                    <div className={styles.linksRow}>
                        <p className={styles.linkLeft}>
                            <a href="/login">Volver a iniciar sesión</a>
                        </p>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
