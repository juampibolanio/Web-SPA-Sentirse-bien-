import React, { useState, useEffect, useRef} from 'react';
import { useNavigate } from 'react-router-dom';
import { useCarrito } from '../services/CarritoContext.jsx';
import styles from '../styles/Carrito.module.css';

const obtenerUsuarioIdDelToken = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const userId = payload.id;
    return userId && !isNaN(userId) ? parseInt(userId) : null;
  } catch (error) {
    console.error('Error decodificando token:', error);
    return null;
  }
};

const verificarTokenValido = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000;
    return Date.now() < exp;
  } catch {
    return false;
  }
};

const Carrito = () => {
  const ultimaVerificacionRef = useRef(0);
  const navigate = useNavigate();
  const { 
    items, 
    cargando, 
    actualizarCantidad, 
    eliminarDelCarrito, 
    vaciarCarrito, 
    calcularTotales, 
    verificarStockDisponible,
    verificarDescuentoFrecuente
  } = useCarrito();
  
  const { 
    subtotal, 
    iva, 
    total, 
    cantidadTotal, 
    descuentoFrecuente,
    infoDescuento 
  } = calcularTotales();
  
  const [actualizando, setActualizando] = useState(null);
  const [verificandoDescuento, setVerificandoDescuento] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const verificarDescuento = async () => {
      if (!token || items.length === 0) return;
      
      const usuarioId = obtenerUsuarioIdDelToken();
      if (!usuarioId) return;

      const ahora = Date.now();
      if (ahora - ultimaVerificacionRef.current < 10000) {
        console.log('⏰ Esperando para nueva verificación...');
        return;
      }
      ultimaVerificacionRef.current = ahora;
      
      setVerificandoDescuento(true);
      await verificarDescuentoFrecuente(usuarioId);
      setVerificandoDescuento(false);
    };
    
    verificarDescuento();
  }, [token, items.length, verificarDescuentoFrecuente]);

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
    if (!token || !verificarTokenValido()) {
      alert('Tu sesión ha expirado. Por favor inicia sesión nuevamente.');
      localStorage.removeItem('token');
      navigate('/login');
      return;
    }

    const usuarioId = obtenerUsuarioIdDelToken();
    if (!usuarioId) {
      alert('Error al obtener información del usuario.');
      navigate('/login');
      return;
    }

    const stockCheck = verificarStockDisponible();
    if (!stockCheck.disponible) {
      const productosSinStock = stockCheck.productosSinStock.map(p => 
        `${p.nombre}: disponible ${p.stockDisponible}, solicitado ${p.cantidadSolicitada}`
      ).join('\n');
      alert(`No hay suficiente stock para:\n${productosSinStock}`);
      return;
    }

    navigate('/carrito/pago');
  };

  const handleSeguirComprando = () => navigate('/productos');

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

      {infoDescuento && (
        <div className={`${styles.descuentoBanner} ${infoDescuento.aplicaDescuento ? styles.descuentoAplicado : styles.descuentoNoAplicado}`}>
          {infoDescuento.aplicaDescuento ? (
            <div className={styles.descuentoInfo}>
              <span className={styles.descuentoIcon}>🎉</span>
              <div>
                <strong>¡15% DE DESCUENTO APLICADO!</strong>
                <p>Por ser cliente frecuente ({infoDescuento.turnosUltimoMes} turnos este mes)</p>
              </div>
              <span className={styles.descuentoMonto}>-${descuentoFrecuente}</span>
            </div>
          ) : infoDescuento.turnosUltimoMes > 0 ? (
            <div className={styles.descuentoInfo}>
              <span className={styles.descuentoIcon}>📊</span>
              <div>
                <strong>Te faltan {infoDescuento.turnosFaltantes} turnos para el 15% de descuento</strong>
                <p>Llevás {infoDescuento.turnosUltimoMes} turnos este mes (necesitás 3)</p>
              </div>
            </div>
          ) : (
            <div className={styles.descuentoInfo}>
              <span className={styles.descuentoIcon}>💡</span>
              <div>
                <strong>Descuento por cliente frecuente</strong>
                <p>Realiza 3 turnos en un mes y obtén 15% de descuento en productos</p>
              </div>
            </div>
          )}
        </div>
      )}

      <div className={styles.carritoContainer}>
        <div className={styles.itemsContainer}>
          {items.map(item => {
            const precioBase = item.producto.precio;
            const descuentoProducto = item.producto.descuento || 0;
            const precioConDescuento = descuentoProducto > 0 
              ? precioBase * (1 - descuentoProducto / 100)
              : precioBase;
            
            return (
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
                  
                  {/* ✅ MOSTRAR DESCUENTO VARIABLE */}
                  <div className={styles.itemPrecioContainer}>
                    {descuentoProducto > 0 ? (
                      <>
                        <span className={styles.precioOriginal}>${precioBase.toFixed(2)}</span>
                        <span className={styles.precioConDescuento}>${precioConDescuento.toFixed(2)}</span>
                        <span className={styles.descuentoBadge}>{descuentoProducto}% OFF</span>
                      </>
                    ) : (
                      <span className={styles.itemPrecio}>${precioBase.toFixed(2)}</span>
                    )}
                  </div>
                  
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
                
                <div className={styles.itemSubtotal}>
                  ${(precioConDescuento * item.cantidad).toFixed(2)}
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
            );
          })}
        </div>

        <div className={styles.resumen}>
          <h2>Resumen del Pedido</h2>
          <div className={styles.resumenItem}><span>Productos ({cantidadTotal})</span><span>${subtotal}</span></div>
          <div className={styles.resumenItem}><span>IVA (21%)</span><span>${iva}</span></div>
          
          {infoDescuento?.aplicaDescuento && (
            <div className={styles.resumenDescuento}>
              <span>Descuento Cliente Frecuente (15%)</span>
              <span className={styles.descuentoTexto}>-${descuentoFrecuente}</span>
            </div>
          )}
          
          <div className={styles.resumenTotal}>
            <span>Total</span>
            <span>${total}</span>
          </div>
          
          <button 
            className={styles.btnPagar} 
            onClick={handleProcederPago}
            disabled={verificandoDescuento}
          >
            {verificandoDescuento ? 'Verificando descuento...' : `Pagar $${total}`}
          </button>
          <button className={styles.btnSeguirComprando} onClick={handleSeguirComprando}>
            Seguir comprando
          </button>
        </div>
      </div>
    </div>
  );
};

export default Carrito;