import React from "react";

const Productos = () => {
  const productos = [
    {
      id: 1,
      nombre: "Auriculares Gamer",
      descripcion: "Sonido envolvente 7.1, RGB",
      precio: 25000,
      imagen: "https://via.placeholder.com/150"
    },
    {
      id: 2,
      nombre: "Teclado Mecánico",
      descripcion: "Switches Red, retroiluminado",
      precio: 35000,
      imagen: "https://via.placeholder.com/150"
    },
    {
      id: 3,
      nombre: "Mouse Inalámbrico",
      descripcion: "Sensor óptico 16000 DPI",
      precio: 15000,
      imagen: "https://via.placeholder.com/150"
    }
  ];

  return (
    <div className="productos-container">
      {productos.map((producto) => (
        <div key={producto.id} className="producto-card">
          <img
            src={producto.imagen}
            alt={producto.nombre}
            className="producto-imagen"
          />
          <h3 className="producto-nombre">{producto.nombre}</h3>
          <p className="producto-descripcion">{producto.descripcion}</p>
          <p className="producto-precio">${producto.precio}</p>
          <button className="btn-agregar">Agregar al carrito</button>
        </div>
      ))}
    </div>
  );
};

export default Productos;