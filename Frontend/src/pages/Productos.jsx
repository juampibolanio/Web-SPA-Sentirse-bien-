import React from 'react';
import styles from '../styles/Productos.module.css'; 
import producto1 from '../assets/productosPage/AceiteCorporal.jpg'
import producto2 from '../assets/productosPage/BalsamoLabialNutritivo.jpg'
import producto3 from '../assets/productosPage/CremaDeManosSuave.jpg'
import producto4 from '../assets/productosPage/ExfolianteCorporal.jpg'
import producto5 from '../assets/productosPage/HidratanteFacial.jpg'
import producto6 from  '../assets/productosPage/MascarillaFacialdetox.jpg'

const Productos = () => {
    const productos = [
        { id: 1, nombre: "Crema Hidratante Facial", descripcion: "Hidrata profundamente y deja la piel suave", precio: 2500, imagen: producto1 },
        { id: 2, nombre: "Aceite Corporal Relajante", descripcion: "Ideal para masajes, aroma lavanda", precio: 3500, imagen: producto2  },
        { id: 3, nombre: "Exfoliante Corporal", descripcion: "Elimina células muertas y suaviza la piel", precio: 2200, imagen: producto3 },
        { id: 4, nombre: "Mascarilla Facial Detox", descripcion: "Limpieza profunda y revitalización de la piel", precio: 1800, imagen: producto4 },
        { id: 5, nombre: "Bálsamo Labial Nutritivo", descripcion: "Hidrata y protege los labios delicadamente", precio: 1200, imagen: producto5 },
        { id: 6, nombre: "Crema de Manos Suave", descripcion: "Nutre y suaviza las manos secas", precio: 1500, imagen: producto6 }
    ];

    return (
        <div className={styles.productosPage}>
            
            <aside className={styles.filtros}>
                <h3>Filtros</h3>
                <div>
                    <label>Categoría:</label>
                    <select>
                        <option>Todos</option>
                        <option>Facial</option>
                        <option>Corporal</option>
                        <option>Labial</option>
                    </select>
                </div>
                <div>
                    <label>Rango de precio:</label>
                    <input type="range" min="1000" max="5000" />
                </div>
                <div>
                    <label>Ofertas:</label>
                    <input type="checkbox" /> Solo ofertas
                </div>
            </aside>

            <div className={styles.mainContent}>
                
                <div className={styles.topBar}>
                    <div className={styles.contador}>
                        {productos.length} productos encontrados
                    </div>
                    <div className={styles.ordenar}>
                        <label>Ordenar por:</label>
                        <select>
                            <option>Precio</option>
                            <option>Fecha lanzamiento</option>
                            <option>Descuento</option>
                            <option>Más vendidos</option>
                        </select>
                    </div>
                </div>

                <div className={styles.productosContainer}>
                    {productos.map((producto) => (
                        <div key={producto.id} className={styles.productoCard}>
                            <img src={producto.imagen} alt={producto.nombre} className={styles.productoImagen} />
                            <h3 className={styles.productoNombre}>{producto.nombre}</h3>
                            <p className={styles.productoDescripcion}>{producto.descripcion}</p>
                            <p className={styles.productoPrecio}>${producto.precio}</p>
                            <button className={styles.btnAgregar}>Agregar al carrito</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Productos;
