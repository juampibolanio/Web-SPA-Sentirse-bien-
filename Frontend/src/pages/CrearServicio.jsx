// src/pages/CrearServicio.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/CrearServicio.module.css';

export default function CrearServicio() {
    const navigate = useNavigate();
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [precio, setPrecio] = useState('');
    const [profesionalId, setProfesionalId] = useState('');
    const [profesionales, setProfesionales] = useState([]);
    const [error, setError] = useState('');
    const [exito, setExito] = useState('');
    const token = localStorage.getItem('token');

    // Obtener lista de profesionales al cargar el componente
    useEffect(() => {
        const fetchProfesionales = async () => {
            try {
                const res = await fetch('http://localhost:8080/api/usuarios/profesionales', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!res.ok) throw new Error('Error al cargar profesionales');
                const data = await res.json();
                setProfesionales(data);
            } catch (err) {
                console.error(err);
                setError('No se pudo obtener la lista de profesionales');
            }
        };

        fetchProfesionales();
    }, [token]);

    const handleCrear = async () => {
        if (!nombre || !descripcion || !precio || !profesionalId) {
            setError('Completá todos los campos.');
            return;
        }

        setError('');
        try {
            const response = await fetch('http://localhost:8080/api/servicios/crear', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    nombre,
                    descripcion,
                    precio: parseFloat(precio),
                    profesionalId: parseInt(profesionalId),
                }),
            });

            if (!response.ok) throw new Error('Error al crear servicio');
            setExito('Servicio creado correctamente');
            setNombre('');
            setDescripcion('');
            setPrecio('');
            setProfesionalId('');
        } catch (err) {
            console.error(err);
            setError('No se pudo crear el servicio.');
        }
    };

    return (
        <div className={styles.container}>
            <h2>Crear nuevo servicio</h2>

            <div className={styles.formGroup}>
                <label>Nombre:</label>
                <input value={nombre} onChange={(e) => setNombre(e.target.value)} />
            </div>

            <div className={styles.formGroup}>
                <label>Descripción:</label>
                <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
            </div>

            <div className={styles.formGroup}>
                <label>Precio ($):</label>
                <input
                    type="number"
                    value={precio}
                    onChange={(e) => setPrecio(e.target.value)}
                />
            </div>

            <div className={styles.formGroup}>
                <label>Profesional que brinda este servicio:</label>
                <select value={profesionalId} onChange={(e) => setProfesionalId(e.target.value)}>
                    <option value="">Seleccionar profesional</option>
                    {profesionales.map((p) => (
                        <option key={p.id} value={p.id}>
                            {p.nombre} {p.apellido}
                        </option>
                    ))}
                </select>
            </div>

            {error && <p className={styles.error}>{error}</p>}
            {exito && <p className={styles.success}>{exito}</p>}

            <button className={styles.boton} onClick={handleCrear}>Crear</button>
            <button className={styles.volver} onClick={() => navigate('/home')}>Volver</button>
        </div>
    );
}

//ACÁ QUEDAMOS EN SEGUIR TERMINANDO LA PESTAÑÑA DE LA DRA FELICIDAD
