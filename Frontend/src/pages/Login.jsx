import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMail, FiLock } from 'react-icons/fi';
import styles from '../styles/Login.module.css';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [loading, setLoading] = useState(false); // Estado para loader
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensaje('');
        setLoading(true); // Mostrar loader

        try {
            const response = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                throw new Error('Correo electrónico o contraseña incorrecta.');
            }

            const data = await response.json();
            localStorage.setItem('token', data.token);
            navigate('/home');
            window.location.reload();

        } catch (error) {
            setMensaje(error.message);
        } finally {
            setLoading(false); // Ocultar loader
        }
    };

    return (
        <div className={styles.loginContainer}>
            <div className={styles.loginCard}>
                <h2 className={styles.title}>Iniciar sesión</h2>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Correo electrónico</label>
                        <div className={styles.inputWrapper}>
                            <FiMail className={styles.icon} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="ejemplo@mail.com"
                                className={styles.input}
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Contraseña</label>
                        <div className={styles.inputWrapper}>
                            <FiLock className={styles.icon} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="********"
                                className={styles.input}
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div className={styles.linksRow}>
                        <p className={styles.linkLeft}>
                            <a href="/register">¿No estás registrado? Regístrate aquí</a>
                        </p>
                    </div>

                    <button
                        className={styles.submitBtn}
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? <div className={styles.loader}></div> : 'Ingresar'}
                    </button>

                    {mensaje && <p className={styles.errorMsg}>{mensaje}</p>}
                </form>
            </div>
        </div>
    );
}
