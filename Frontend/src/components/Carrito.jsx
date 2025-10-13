import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCarrito } from '../services/CarritoContext.jsx';
import styles from '../styles/Carrito.module.css';
import SuccessPaymentModal from '../components/SuccessPaymentModal.jsx';
import axios from 'axios';

// Utilidad para decodificar el token
const obtenerUsuarioDelToken = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.userId || payload.sub || payload.id;
  } catch (error) {
    console.error('Error decodificando token:', error);
    return null;
  }
};

const Carrito = () => {
  const navigate = useNavigate();
  const { items, cargando, actualizarCantidad, eliminarDelCarrito, vaciarCarrito, calcularTotales, verificarStockDisponible } = useCarrito();
  const [actualizando, setActualizando] = useState(null);
  const [modalPagoAbierto, setModalPagoAbierto] = useState(false);
  const [pagoExitoso, setPagoExitoso] = useState(false);
  const [itemsComprados, setItemsComprados] = useState([]);
  const { subtotal, iva, total, cantidadTotal } = calcularTotales();

  const token = localStorage.getItem('token');

  const handleActualizarCantidad = async (itemId, nuevaCantidad) => {
    if (nuevaCantidad < 1) return;
    setActualizando(itemId);
    try {
      const result = await actualizarCantidad(itemId, nuevaCantidad);
      if (!result.success) alert(result.error);
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
        if (!result.success) alert(result.error);
      } catch {
        alert('Error al eliminar el producto');
      }
    }
  };

  const handleVaciarCarrito = async () => {
    if (window.confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
      try {
        const result = await vaciarCarrito();
        if (!result.success) alert(result.error);
      } catch {
        alert('Error al vaciar el carrito');
      }
    }
  };

  const handleProcederPago = () => {
    const usuarioId = obtenerUsuarioDelToken();

    if (!token || !usuarioId) {
      alert('Debes iniciar sesión para realizar una compra');
      navigate('/login');
      return;
    }

    const stockCheck = verificarStockDisponible();
    if (!stockCheck.disponible) {
      const productosSinStock = stockCheck.productosSinStock.map(p => `${p.nombre}: max ${p.stockDisponible}`).join('\n');
      alert(`No hay suficiente stock para algunos productos:\n${productosSinStock}`);
      return;
    }

    setModalPagoAbierto(true);
  };

  const handleSeguirComprando = () => navigate('/productos');

  const handleSeleccionMetodoPago = async (metodo) => {
    const usuarioId = obtenerUsuarioDelToken();
    if (!token || !usuarioId) {
      alert('Debes iniciar sesión para realizar una compra');
      navigate('/login');
      return;
    }

    setModalPagoAbierto(false);
    const fecha = new Date().toISOString();

    const payload = {
      usuarioId,
      metodoPago: metodo.toUpperCase(),
      productos: items.map(item => ({
        productoId: item.producto.id,
        productoNombre: item.producto.nombre,
        productoPrecio: item.producto.precio,
        cantidad: item.cantidad,
        subtotal: item.producto.precio * item.cantidad
      })),
      total: parseFloat(total),
      descuento: 0,
      fecha
    };

    try {
      await axios.post('http://localhost:8080/api/facturas', payload, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setItemsComprados([...items]);
      setPagoExitoso(true);
      await vaciarCarrito();
    } catch (error) {
      console.error('Error al generar factura:', error);
      if (error.response) {
        alert(`Error al procesar el pago:\nStatus: ${error.response.status}\nMensaje: ${JSON.stringify(error.response.data)}`);
      } else {
        alert(`Error al procesar el pago: ${error.message}`);
      }
    }
  };

  if (cargando) return <div className={styles.cargandoContainer}><div className={styles.cargando}>Cargando carrito...</div></div>;

  if (items.length === 0)
    return (
      <div className={styles.carritoVacio}>
        <h2>Tu carrito está vacío</h2>
        <p>Agrega algunos productos para comenzar a comprar</p>
        <button className={styles.btnSeguirComprando} onClick={handleSeguirComprando}>Seguir comprando</button>
      </div>
    );

  return (
    <div className={styles.carritoPage}>
      <div className={styles.carritoHeader}>
        <h1>Carrito de Compras</h1>
        <button className={styles.btnVaciar} onClick={handleVaciarCarrito}>Vaciar carrito</button>
      </div>

      <div className={styles.carritoContainer}>
        <div className={styles.itemsContainer}>
          {items.map(item => (
            <div key={item.id} className={styles.item}>
              <div className={styles.itemImagen}>
                <img 
                  src={item.producto.imagen || '/assets/default-product.jpg'} 
                  alt={item.producto.nombre} 
                  onError={(e) => { e.target.src = '/assets/default-product.jpg'; }}
                />
              </div>
              <div className={styles.itemInfo}>
                <h3>{item.producto.nombre}</h3>
                <p className={styles.itemDescripcion}>{item.producto.descripcion}</p>
                <p className={styles.itemPrecio}>${item.producto.precio}</p>
                {item.producto.oferta && <span className={styles.badgeOferta}>Oferta</span>}
                <div className={styles.stockInfo}>Stock disponible: {item.producto.stock}</div>
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
              <div className={styles.itemSubtotal}>${(item.producto.precio * item.cantidad).toFixed(2)}</div>
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
          <div className={styles.resumenItem}><span>Productos ({cantidadTotal})</span><span>${subtotal}</span></div>
          <div className={styles.resumenItem}><span>IVA (21%)</span><span>${iva}</span></div>
          <div className={styles.resumenTotal}><span>Total</span><span>${total}</span></div>
          <button className={styles.btnPagar} onClick={handleProcederPago}>Proceder al Pago</button>
          <button className={styles.btnSeguirComprando} onClick={handleSeguirComprando}>Seguir comprando</button>
        </div>
      </div>

      {modalPagoAbierto && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>Selecciona tu método de pago</h3>
            <button onClick={() => handleSeleccionMetodoPago('efectivo')} className={styles.btnEfectivo}>Efectivo</button>
            <button onClick={() => handleSeleccionMetodoPago('credito')} className={styles.btnTarjeta}>Crédito</button>
            <button onClick={() => handleSeleccionMetodoPago('debito')} className={styles.btnTarjeta}>Débito</button>
            <button onClick={() => setModalPagoAbierto(false)} className={styles.btnCerrar}>Cancelar</button>
          </div>
        </div>
      )}

      {pagoExitoso && (
        <SuccessPaymentModal 
          total={total} 
          items={itemsComprados} 
          onClose={() => {
            setPagoExitoso(false);
            navigate('/productos');
          }} 
        />
      )}
    </div>
  );
};

export default Carrito;
