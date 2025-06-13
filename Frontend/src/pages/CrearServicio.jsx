// Importación de React, hooks, router, estilos y un ícono de carga
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/CrearServicio.module.css';
import { FaSpinner } from 'react-icons/fa';

export default function CrearServicio() {
    const navigate = useNavigate(); // Hook para navegar entre rutas

    // Estados para manejar los datos del formulario y mensajes
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [precio, setPrecio] = useState('');
    const [profesionalId, setProfesionalId] = useState('');

    // Estados para manejar lista de profesionales y feedback al usuario
    const [profesionales, setProfesionales] = useState([]);
    const [error, setError] = useState('');
    const [exito, setExito] = useState('');
    const [loading, setLoading] = useState(false);

    const token = localStorage.getItem('token'); // Se obtiene el token del localStorage

    // Al montar el componente, se carga la lista de profesionales disponibles
    useEffect(() => {
        const fetchProfesionales = async () => {
            setLoading(true); // Activa el spinner
            try {
                const res = await fetch('http://localhost:8080/api/usuarios/profesionales', {
                    headers: {
                        Authorization: `Bearer ${token}`, // Autorización con el token
                    },
                });

                if (!res.ok) throw new Error('Error al cargar profesionales');

                const data = await res.json(); // Convierte la respuesta en JSON
                setProfesionales(data); // Guarda los profesionales en el estado
            } catch (err) {
                console.error(err);
                setError('No se pudo obtener la lista de profesionales');
            } finally {
                setLoading(false); // Oculta el spinner
            }
        };

        fetchProfesionales();
    }, [token]);

    // Función que maneja la creación de un servicio al hacer clic en "Crear"
    const handleCrear = async () => {
        // Validación básica: que no haya campos vacíos
        if (!nombre || !descripcion || !precio || !profesionalId) {
            setError('Completá todos los campos.');
            return;
        }

        // Resetea mensajes previos y activa loading
        setError('');
        setExito('');
        setLoading(true);

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
                    precio: parseFloat(precio), // Convierte el precio a número
                    profesionalId: parseInt(profesionalId), // Convierte el ID a número
                }),
            });

            if (!response.ok) throw new Error('Error al crear servicio');

            // Si la creación fue exitosa, limpia los campos y muestra mensaje de éxito
            setExito('Servicio creado correctamente');
            setNombre('');
            setDescripcion('');
            setPrecio('');
            setProfesionalId('');
        } catch (err) {
            console.error(err);
            setError('No se pudo crear el servicio.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.titulo}>Crear nuevo servicio</h2>

            {/* Campo de nombre del servicio */}
            <div className={styles.formGroup}>
                <label>Nombre:</label>
                <input value={nombre} onChange={(e) => setNombre(e.target.value)} />
            </div>

            {/* Campo de descripción */}
            <div className={styles.formGroup}>
                <label>Descripción:</label>
                <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
            </div>

            {/* Campo de precio */}
            <div className={styles.formGroup}>
                <label>Precio ($):</label>
                <input
                    type="number"
                    value={precio}
                    onChange={(e) => setPrecio(e.target.value)}
                />
            </div>

            {/* Selector de profesional */}
            <div className={styles.formGroup}>
                <label>Profesional:</label>
                <select
                    value={profesionalId}
                    onChange={(e) => setProfesionalId(e.target.value)}
                >
                    <option value="">Seleccionar profesional</option>
                    {profesionales.map((p) => (
                        <option key={p.id} value={p.id}>
                            {p.nombre} {p.apellido}
                        </option>
                    ))}
                </select>
            </div>

            {/* Spinner de carga */}
            {loading && (
                <div className={styles.loaderContainer}>
                    <FaSpinner className={styles.loader} />
                    <p>Cargando...</p>
                </div>
            )}

            {/* Mensajes de error o éxito */}
            {error && <p className={styles.error}>{error}</p>}
            {exito && <p className={styles.success}>{exito}</p>}

            {/* Botones de acción */}
            <div className={styles.buttonGroup}>
                <button
                    className={styles.boton}
                    onClick={handleCrear}
                    disabled={loading}
                >
                    Crear
                </button>
                <button
                    className={styles.volver}
                    onClick={() => navigate('/home')}
                    disabled={loading}
                >
                    Volver
                </button>
            </div>
        </div>
    );
}
