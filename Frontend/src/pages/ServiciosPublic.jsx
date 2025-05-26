import React, { useState } from 'react';
import styles from '../styles/ServiciosPublic.module.css';

import AntiStress from '../assets/servicesHome/AntiStress.jpg'
import Descontracturantes from '../assets/servicesHome/Descontracturante.jpg'
import MasajesPiedras from '../assets/servicesHome/Masajes_con_piedras.jpg'
import Circulatorios from '../assets/servicesHome/Circulatorios.jpg'

import LiftingPestañas from '../assets/servicesHome/Lifting_de_pestañas.jpg'
import DepilacionFacial from '../assets/servicesHome/Depilacion_facial.jpg'
import BellezaManosPies from '../assets/servicesHome/manos_pies.jpg'

import PuntaDiamante from '../assets/servicesHome/microexfoliación.jpg'
import LimpiezaProfunda from '../assets/servicesHome/limpieza_profunda_hidratacion.jpg'
import CrioFrecuencia from '../assets/servicesHome/criofrecuencia.jpg'

import Velaslim from '../assets/servicesHome/velaSlim.jpg'
import Dermohealth from '../assets/servicesHome/dermoheatlh.jpg'
import CrioFrecuenciaCorp from '../assets/servicesHome/criofrecuencia_corporal.jpg'
import Ultracativacion from '../assets/servicesHome/ultracavitación.jpg'

import Hidromasajes from '../assets/servicesHome/hidromasajes.jpg'
import Yoga from '../assets/servicesHome/yoga_grupal.jpg'

import BannerServicios from '../assets/servicesHome/TOP_SERVICES.jpg'; // Ruta de la imagen de cabecera

function ServiciosPublic() {
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);

    const categorias = [
        {
            nombre: 'Masajes',
            servicios: [
                { id: 1, nombre: 'AntiStress', descripcion: 'Liberá tensiones acumuladas y reconectá con tu calma interior. Ideal para relajar cuerpo y mente.', precio: 3500, imagen: AntiStress },
                { id: 2, nombre: 'Descontracturantes', descripcion: 'Trabajamos zonas de tensión muscular profunda para aliviar dolores y mejorar tu movilidad.', precio: 3000, imagen: Descontracturantes },
                { id: 3, nombre: 'Masajes con piedras', descripcion: 'Energía, calor y relajación en un solo tratamiento. Las piedras ayudan a aliviar tensiones y armonizar tu energía.', precio: 4000, imagen: MasajesPiedras },
                { id: 4, nombre: 'Circulatorios', descripcion: 'Estimulan la circulación sanguínea, reducen la retención de líquidos y favorecen la sensación de ligereza.', precio: 3200, imagen: Circulatorios },
            ],
        },
        {
            nombre: 'Belleza',
            servicios: [
                { id: 5, nombre: 'Lifting de pestañas', descripcion: 'Realzá tu mirada con un efecto natural, curvado y duradero. Sin extensiones, sin mantenimiento diario.', precio: 2800, imagen: LiftingPestañas },
                { id: 6, nombre: 'Depilación facial', descripcion: 'Eliminamos el vello no deseado con precisión y cuidado, dejando tu piel suave y luminosa.', precio: 2500, imagen: DepilacionFacial },
                { id: 7, nombre: 'Belleza de manos y pies', descripcion: 'Tus manos y pies renovados, suaves y prolijos, con un acabado estético que resalta tu estilo personal.', precio: 3000, imagen: BellezaManosPies },
            ],
        },
        {
            nombre: 'Tratamientos faciales',
            servicios: [
                { id: 8, nombre: 'Punta de diamante Microexfoliación', descripcion: 'Tratamiento no invasivo que remueve células muertas y renueva la piel en profundidad, dejándola más suave, luminosa y uniforme.', precio: 3700, imagen: PuntaDiamante },
                { id: 9, nombre: 'Limpieza profunda e hidratación', descripcion: 'Eliminamos impurezas, puntos negros y células muertas, seguido de una hidratación intensiva que devuelve frescura y vitalidad al rostro.', precio: 3900, imagen: LimpiezaProfunda },
                { id: 10, nombre: 'Crio frecuencia facial', descripcion: 'Genera un shock térmico que activa el colágeno, mejora la elasticidad y produce un efecto lifting visible desde la primera sesión.', precio: 4100, imagen: CrioFrecuencia },
            ],
        },
        {
            nombre: 'Tratamientos corporales',
            servicios: [
                { id: 11, nombre: 'Velaslim', descripcion: 'Tratamiento no invasivo que reduce la circunferencia corporal y mejora visiblemente la celulitis, moldeando la silueta.', precio: 4800, imagen: Velaslim },
                { id: 12, nombre: 'Dermohealth', descripcion: 'Técnica de succión controlada que estimula la microcirculación, moviliza los tejidos y promueve un drenaje linfático eficaz.', precio: 4200, imagen: Dermohealth },
                { id: 13, nombre: 'Crio frecuencia corporal', descripcion: 'El shock térmico reactiva la piel y los tejidos, logrando un efecto lifting inmediato y mejorando la firmeza en zonas específicas.', precio: 4400, imagen: CrioFrecuenciaCorp },
                { id: 14, nombre: 'Ultracavitación', descripcion: 'Técnica reductora que actúa sobre la grasa localizada mediante ultrasonido, ayudando a modelar el cuerpo de forma efectiva y segura.', precio: 4600, imagen: Ultracativacion },
            ]
        },
        {
            nombre: 'Grupales',
            servicios: [
                { id: 15, nombre: 'Hidromasajes', descripcion: 'Relajación profunda en un ambiente cálido. El hidromasaje estimula la circulación y alivia tensiones, brindando bienestar. Precio por persona', precio: 4500, imagen: Hidromasajes },
                { id: 16, nombre: 'Yoga', descripcion: 'Una práctica guiada que conecta cuerpo, mente y respiración, promoviendo equilibrio y bienestar en grupo. Precio por persona', precio: 2200, imagen: Yoga },
            ]
        }
    ];

    const categoriasFiltradas = categoriaSeleccionada
        ? categorias.filter(cat => cat.nombre === categoriaSeleccionada)
        : categorias;

    return (
        <div className={styles.container}>
            <img src={BannerServicios} alt="Servicios Banner" className={styles.banner} />

            <h1>Servicios</h1>
            <p>Explorá nuestros tratamientos organizados por categoría.</p>

            <div className={styles.botones}>
                <button
                    className={!categoriaSeleccionada ? styles.activo : ''}
                    onClick={() => setCategoriaSeleccionada(null)}
                >
                    Todos
                </button>
                {categorias.map(cat => (
                    <button
                        key={cat.nombre}
                        className={categoriaSeleccionada === cat.nombre ? styles.activo : ''}
                        onClick={() => setCategoriaSeleccionada(cat.nombre)}
                    >
                        {cat.nombre}
                    </button>
                ))}
            </div>

            {categoriasFiltradas.map(categoria => (
                <div key={categoria.nombre} className={styles.categoria}>
                    <h2>{categoria.nombre}</h2>
                    <div className={styles.grid}>
                        {categoria.servicios.map(servicio => (
                            <div key={servicio.id} className={styles.card}>
                                <img
                                    src={servicio.imagen}
                                    alt={servicio.nombre}
                                    className={styles.imagen}
                                />
                                <h3>{servicio.nombre}</h3>
                                <p>{servicio.descripcion}</p>
                                <p className={styles.precio}>${servicio.precio}</p>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default ServiciosPublic;
