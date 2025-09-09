import React from 'react';
import styles from '../styles/Productos.module.css'; 


const Productos = () => {
  const productos = [
  {
    id: 1,
    nombre: "Crema Hidratante Facial",
    descripcion: "Hidrata profundamente y deja la piel suave",
    precio: 2500,
    imagen: "https://via.placeholder.com/150"
  },
  {
    id: 2,
    nombre: "Aceite Corporal Relajante",
    descripcion: "Ideal para masajes, aroma lavanda",
    precio: 3500,
    imagen: "https://via.placeholder.com/150"
  },
  {
    id: 3,
    nombre: "Exfoliante Corporal",
    descripcion: "Elimina células muertas y suaviza la piel",
    precio: 2200,
    imagen: "https://via.placeholder.com/150"
  },
  {
    id: 4,
    nombre: "Mascarilla Facial Detox",
    descripcion: "Limpieza profunda y revitalización de la piel",
    precio: 1800,
    imagen: "https://via.placeholder.com/150"
  },
  {
    id: 5,
    nombre: "Bálsamo Labial Nutritivo",
    descripcion: "Hidrata y protege los labios delicadamente",
    precio: 1200,
    imagen: "https://via.placeholder.com/150"
  },
  {
    id: 6,
    nombre: "Crema de Manos Suave",
    descripcion: "Nutre y suaviza las manos secas",
    precio: 1500,
    imagen: "https://via.placeholder.com/150"
  }
];

  return (
    <div className={styles.productosContainer}>
      {productos.map((producto) => (
        <div key={producto.id} className={styles.productoCard}>
          <img
            src={producto.imagen}
            alt={producto.nombre}
            className={styles.productoImagen}
          />
          <h3 className={styles.productoNombre}>{producto.nombre}</h3>
          <p className={styles.productoDescripcion}>{producto.descripcion}</p>
          <p className={styles.productoPrecio}>${producto.precio}</p>
          <button className={styles.btnAgregar}>Agregar al carrito</button>
        </div>
      ))}
    </div>
  );
};

export default Productos;