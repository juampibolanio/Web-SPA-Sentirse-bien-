import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Registro.module.css';
import { FaUser, FaIdCard, FaEnvelope, FaLock, FaArrowLeft } from 'react-icons/fa';

function Registro() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        nombre: '',
        apellido: '',
        dni: '',
        email: '',
        password: '',
    });

    const [error, setError] = useState('');
    const [exito, setExito] = useState('');
    const [cargando, setCargando] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setExito('');
        setCargando(true);

        const { nombre, apellido, dni, email, password } = form;
        if (!nombre || !apellido || !dni || !email || !password) {
            setError('Todos los campos son obligatorios');
            setCargando(false);
            return;
        }

        fetch('http://localhost:8080/api/auth/registro', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...form, rol: 'CLIENTE' }),
        })
            .then((res) => {
                if (!res.ok) throw new Error('Error en el registro');
                return res.json();
            })
            .then(() => {
                setExito('Registro exitoso. Ahora podés iniciar sesión.');
                setTimeout(() => navigate('/login'), 2000);
            })
            .catch(() => {
                setError('Hubo un problema al registrarse. Verificá los datos.');
            })
            .finally(() => setCargando(false));
    };

    return (
        <div className={styles.registerContainer}>
            <div className={styles.registerCard}>
                <h2 className={styles.title}>Registro de usuario</h2>
                <form onSubmit={handleSubmit}>
                    <div className={styles.inputGroup}>
                        <FaUser className={styles.icon} />
                        <input
                            type="text"
                            name="nombre"
                            placeholder="Nombre"
                            value={form.nombre}
                            onChange={handleChange}
                            required
                            disabled={cargando}
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <FaUser className={styles.icon} />
                        <input
                            type="text"
                            name="apellido"
                            placeholder="Apellido"
                            value={form.apellido}
                            onChange={handleChange}
                            required
                            disabled={cargando}
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <FaIdCard className={styles.icon} />
                        <input
                            type="text"
                            name="dni"
                            placeholder="DNI"
                            value={form.dni}
                            onChange={handleChange}
                            required
                            disabled={cargando}
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <FaEnvelope className={styles.icon} />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            disabled={cargando}
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <FaLock className={styles.icon} />
                        <input
                            type="password"
                            name="password"
                            placeholder="Contraseña"
                            value={form.password}
                            onChange={handleChange}
                            required
                            disabled={cargando}
                        />
                    </div>

                    <button
                        type="submit"
                        className={styles.submitBtn}
                        disabled={cargando}
                    >
                        {cargando ? 'Registrando...' : 'Registrarse'}
                    </button>

                    <button
                        type="button"
                        className={styles.backBtn}
                        onClick={() => navigate('/login')}
                        disabled={cargando}
                    >
                        <FaArrowLeft className={styles.iconBack} />
                        ¿Ya tienes una cuenta? Inicia sesión
                    </button>

                    {error && <p className={styles.error}>{error}</p>}
                    {exito && <p className={styles.success}>{exito}</p>}
                </form>
            </div>
        </div>
    );
}

export default Registro;