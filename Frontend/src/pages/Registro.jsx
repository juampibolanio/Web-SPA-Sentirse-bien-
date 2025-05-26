// src/pages/Registro.jsx
import React, { useState } from 'react';
import styles from '../styles/Registro.module.css';
import { useNavigate } from 'react-router-dom';

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

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setExito('');

        // Validación básica
        const { nombre, apellido, dni, email, password } = form;
        if (!nombre || !apellido || !dni || !email || !password) {
            setError('Todos los campos son obligatorios');
            return;
        }

        fetch('http://localhost:8080/api/auth/registro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nombre,
                apellido,
                dni,
                email,
                password,
                rol: 'CLIENTE',
            }),
        })
        .then(res => {
            if (!res.ok) throw new Error('Error en el registro');
            return res.json();
        })
        .then(data => {
            setExito('Registro exitoso. Ahora podés iniciar sesión.');
            setTimeout(() => navigate('/login'), 2000);
        })
        .catch(() => {
            setError('Hubo un problema al registrarse. Verificá los datos.');
        });
    };

    return (
        <div className={styles.container}>
            <h2>Registro de usuario</h2>
            <form onSubmit={handleSubmit} className={styles.formulario}>
                <input type="text" name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} />
                <input type="text" name="apellido" placeholder="Apellido" value={form.apellido} onChange={handleChange} />
                <input type="text" name="dni" placeholder="DNI" value={form.dni} onChange={handleChange} />
                <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} />
                <input type="password" name="password" placeholder="Contraseña" value={form.password} onChange={handleChange} />
                <button type="submit">Registrarse</button>
            </form>

            {error && <p className={styles.error}>{error}</p>}
            {exito && <p className={styles.exito}>{exito}</p>}
        </div>
    );
}

export default Registro;
