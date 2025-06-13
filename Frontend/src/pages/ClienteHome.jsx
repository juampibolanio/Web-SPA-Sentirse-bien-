// Importa React y el hook useNavigate para navegar entre rutas
import React from 'react';
import { useNavigate } from 'react-router-dom';

// Importa los estilos específicos para este componente
import styles from '../styles/ClienteHome.module.css';

// Importa íconos desde react-icons para representar visualmente las acciones
import { FaConciergeBell, FaCalendarPlus } from 'react-icons/fa';

// Componente funcional que representa la pantalla de inicio para un usuario cliente
function ClienteHome({ usuario }) {
    // Hook para cambiar de página programáticamente
    const navigate = useNavigate();

    return (
        <div className={styles.container}> {/* Contenedor principal con estilos */}
            {/* Saludo personalizado con el nombre del usuario si existe */}
            <h2 className={styles.titulo}>Bienvenido, {usuario?.nombre}!</h2>

            {/* Subtítulo con una pregunta orientadora */}
            <p className={styles.subtitulo}>¿Qué deseas hacer hoy?</p>

            {/* Contenedor de los botones de acción */}
            <div className={styles.botones}>
                {/* Botón para ir a la página de servicios públicos */}
                <button onClick={() => navigate('/servicios-public')} className={styles.boton}>
                    <FaConciergeBell className={styles.icono} /> {/* Ícono */}
                    Ver Servicios
                </button>

                {/* Botón para ir a la página de solicitud de turno */}
                <button onClick={() => navigate('/solicitud-turno')} className={styles.boton}>
                    <FaCalendarPlus className={styles.icono} /> {/* Ícono */}
                    Pedir Turno
                </button>
            </div>
        </div>
    );
}

// Exporta el componente para poder usarlo en otras partes de la app
export default ClienteHome;
