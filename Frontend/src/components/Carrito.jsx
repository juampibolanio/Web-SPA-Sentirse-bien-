import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCarrito } from '../services/CarritoContext.jsx';
import styles from '../styles/Carrito.module.css';

const Carrito = () => {
  const navigate = useNavigate();
  const {
    items,
    cargando,
    actualizarCantidad,
    eliminarDelCarrito,
    vaciarCarrito,
    calcularTotales
  } = useCarrito();

  const [actualizando, setActualizando] = useState(null);

  const handleActualizarCantidad = async (itemId, nuevaCantidad) => {
    if (nuevaCantidad < 1) return;
    
    setActualizando(itemId);
    try {
      const result = await actualizarCantidad(itemId, nuevaCantidad);
      if (!result.success) {
        alert(result.error);
      }
    } catch {
      alert('Error al actualizar la cantidad');
    } finally {
      setActualizando(null);
    }
  };

  const handleEliminarItem = async (itemId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto del carrito?')) {
      try {
        const result = await eliminarDelCarrito(itemId);
        if (!result.success) {
          alert(result.error);
        }
      } catch {
        alert('Error al eliminar el producto');
      }
    }
  };

  const handleVaciarCarrito = async () => {
    if (window.confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
      try {
        const result = await vaciarCarrito();
        if (!result.success) {
          alert(result.error);
        }
      } catch {
        alert('Error al vaciar el carrito');
      }
    }
  };

  const handleProcederPago = () => {
    navigate('/checkout');
  };

  const handleSeguirComprando = () => {
    navigate('/productos');
  };

  if (cargando) {
    return (
      <div className={styles.cargandoContainer}>
        <div className={styles.cargando}>Cargando carrito...</div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className={styles.carritoVacio}>
        <h2>Tu carrito está vacío</h2>
        <p>Agrega algunos productos para comenzar a comprar</p>
        <button 
          className={styles.btnSeguirComprando}
          onClick={handleSeguirComprando}
        >
          Seguir comprando
        </button>
      </div>
    );
  }

  const { subtotal, iva, total, cantidadTotal } = calcularTotales();

  return (
    <div className={styles.carritoPage}>
      <div className={styles.carritoHeader}>
        <h1>Carrito de Compras</h1>
        <button 
          className={styles.btnVaciar}
          onClick={handleVaciarCarrito}
        >
          Vaciar carrito
        </button>
      </div>

      <div className={styles.carritoContainer}>
        <div className={styles.itemsContainer}>
          {items.map((item) => (
            <div key={item.id} className={styles.item}>
              <div className={styles.itemImagen}>
                <img 
                  src={item.producto.imagen || '/assets/default-product.jpg'} 
                  alt={item.producto.nombre}
                  onError={(e) => {
                    e.target.src = '/assets/default-product.jpg';
                  }}
                />
              </div>
              
              <div className={styles.itemInfo}>
                <h3>{item.producto.nombre}</h3>
                <p className={styles.itemDescripcion}>{item.producto.descripcion}</p>
                <p className={styles.itemPrecio}>${item.producto.precio}</p>
                {item.producto.oferta && (
                  <span className={styles.badgeOferta}>Oferta</span>
                )}
                <div className={styles.stockInfo}>
                  Stock disponible: {item.producto.stock}
                </div>
              </div>

              <div className={styles.itemCantidad}>
                <button 
                  onClick={() => handleActualizarCantidad(item.id, item.cantidad - 1)}
                  disabled={item.cantidad <= 1 || actualizando === item.id}
                >
                  -
                </button>
                <span>{item.cantidad}</span>
                <button 
                  onClick={() => handleActualizarCantidad(item.id, item.cantidad + 1)}
                  disabled={actualizando === item.id || item.cantidad >= item.producto.stock}
                >
                  +
                </button>
              </div>

              <div className={styles.itemSubtotal}>
                ${(item.producto.precio * item.cantidad).toFixed(2)}
              </div>

              <button 
                className={styles.btnEliminar}
                onClick={() => handleEliminarItem(item.id)}
                disabled={actualizando === item.id}
                title="Eliminar del carrito"
              >
                🗑️
              </button>
            </div>
          ))}
        </div>

        <div className={styles.resumen}>
          <h2>Resumen del Pedido</h2>
          <div className={styles.resumenItem}>
            <span>Productos ({cantidadTotal})</span>
            <span>${subtotal}</span>
          </div>
          <div className={styles.resumenItem}>
            <span>IVA (21%)</span>
            <span>${iva}</span>
          </div>
          <div className={styles.resumenTotal}>
            <span>Total</span>
            <span>${total}</span>
          </div>
          
          <button 
            className={styles.btnPagar}
            onClick={handleProcederPago}
          >
            Proceder al Pago
          </button>
          
          <button 
            className={styles.btnSeguirComprando}
            onClick={handleSeguirComprando}
          >
            Seguir comprando
          </button>
        </div>
      </div>
    </div>
  );
};

export default Carrito;