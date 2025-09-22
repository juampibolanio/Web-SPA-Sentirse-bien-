import React from 'react';
import styles from '../styles/ProductoDetalle.module.css';
import producto1 from '../assets/productosPage/AceiteCorporal.jpg'
import producto2 from '../assets/productosPage/BalsamoLabialNutritivo.jpg'
import producto3 from '../assets/productosPage/CremaDeManosSuave.jpg'
import producto4 from '../assets/productosPage/ExfolianteCorporal.jpg'
import producto5 from '../assets/productosPage/HidratanteFacial.jpg'
import producto6 from '../assets/productosPage/MascarillaFacialdetox.jpg'

const productos = [
  { id: 1, nombre: "Crema Hidratante Facial", descripcion: "Hidrata profundamente y deja la piel suave", precio: 2500, imagen: producto1 },
  { id: 2, nombre: "Aceite Corporal Relajante", descripcion: "Ideal para masajes, aroma lavanda", precio: 3500, imagen: producto2  },
  { id: 3, nombre: "Exfoliante Corporal", descripcion: "Elimina células muertas y suaviza la piel", precio: 2200, imagen: producto3 },
  { id: 4, nombre: "Mascarilla Facial Detox", descripcion: "Limpieza profunda y revitalización de la piel", precio: 1800, imagen: producto4 },
  { id: 5, nombre: "Bálsamo Labial Nutritivo", descripcion: "Hidrata y protege los labios delicadamente", precio: 1200, imagen: producto5 },
  { id: 6, nombre: "Crema de Manos Suave", descripcion: "Nutre y suaviza las manos secas", precio: 1500, imagen: producto6 }
];

const ProductoDetalle = ({ id }) => {
  const producto = productos.find((p) => p.id === id) || productos[0];

  return (
    <div className={styles.detallePage}>
      <div className={styles.detalleContainer}>
        <div className={styles.imagenContainer}>
          <img src={producto.imagen} alt={producto.nombre} />
        </div>

        <div className={styles.infoContainer}>
          <h2 className={styles.nombre}>{producto.nombre}</h2>
          <p className={styles.descripcion}>{producto.descripcion}</p>
          <p className={styles.precio}>${producto.precio}</p>

          <div className={styles.opcionesPago}>
            <p><strong>Pagá con tarjetas:</strong></p>
            <ul>
              <li>3 cuotas sin interés</li>
              <li>10% de descuento con débito</li>
              <li>Envío gratis desde $5000</li>
            </ul>
          </div>

          <div className={styles.botones}>
            <button className={styles.btnAgregar}>Agregar al carrito</button>
            <button className={styles.btnComprar}>Comprar ahora</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductoDetalle;
