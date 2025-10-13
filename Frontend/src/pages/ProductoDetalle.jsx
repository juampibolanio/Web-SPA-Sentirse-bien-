import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getToken } from '../auth/auth';
import { useCarrito } from '../services/CarritoContext.jsx';
import styles from '../styles/ProductoDetalle.module.css';

const ProductoDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [producto, setProducto] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [agregando, setAgregando] = useState(false);

  const token = getToken();
  const { agregarAlCarrito, estaEnCarrito, obtenerCantidadProducto } = useCarrito();

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        setCargando(true);
        const res = await axios.get(`http://localhost:8080/api/productos/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        setProducto(res.data);
        setCargando(false);
      } catch (err) {
        console.error('Error al obtener el producto:', err);
        setError('Producto no encontrado');
        setCargando(false);
      }
    };

    fetchProducto();
  }, [id, token]);

  // Función para validar stock disponible
  const validarStockDisponible = (cantidadDeseada) => {
    if (!producto) return false;
    return cantidadDeseada <= producto.stock;
  };

  // Función para obtener el mensaje de stock
  const getMensajeStock = () => {
    if (!producto) return '';
    
    if (producto.stock === 0) {
      return <span className={styles.stockAgotado}>❌ Producto agotado</span>;
    } else if (producto.stock <= 5) {
      return <span className={styles.stockBajo}>⚠️ Últimas {producto.stock} unidades</span>;
    } else {
      return <span className={styles.stockDisponible}>✅ En stock ({producto.stock} disponibles)</span>;
    }
  };

  const handleAgregarCarrito = async () => {
    if (!token) {
      navigate('/login');
      return;
    }

    // Validar stock antes de agregar al carrito
    if (!validarStockDisponible(cantidad)) {
      alert(`No hay suficiente stock disponible. Solo quedan ${producto.stock} unidades.`);
      return;
    }

    setAgregando(true);
    
    try {
      const result = agregarAlCarrito(producto, cantidad);
      
      if (result.success) {
        alert(`¡${producto.nombre} agregado al carrito!`);
        setCantidad(1);
      } else {
        alert(result.error || 'Error al agregar al carrito');
      }
    } catch (err) {
      console.error('Error al agregar al carrito:', err);
      alert('Error al agregar el producto al carrito');
    } finally {
      setAgregando(false);
    }
  };

  const handleComprarAhora = async () => {
    if (!token) {
      navigate('/login');
      return;
    }

    // Validar stock antes de comprar
    if (!validarStockDisponible(cantidad)) {
      alert(`No hay suficiente stock disponible. Solo quedan ${producto.stock} unidades.`);
      return;
    }

    setAgregando(true);
    
    try {
      const result = agregarAlCarrito(producto, cantidad);
      
      if (result.success) {
        navigate('/carrito');
      } else {
        alert(result.error || 'Error al agregar al carrito');
      }
    } catch (err) {
      console.error('Error al agregar al carrito:', err);
      alert('Error al agregar el producto al carrito');
    } finally {
      setAgregando(false);
    }
  };

  const incrementarCantidad = () => {
    if (producto && cantidad < producto.stock) {
      setCantidad(prev => prev + 1);
    } else if (producto) {
      alert(`No puedes agregar más de ${producto.stock} unidades.`);
    }
  };

  const decrementarCantidad = () => {
    setCantidad(prev => prev > 1 ? prev - 1 : 1);
  };

  // Función para verificar si los botones deben estar deshabilitados
  const isBotonDeshabilitado = () => {
    return !producto || producto.stock === 0 || cantidad > producto.stock || agregando;
  };

  // Verificar si el producto ya está en el carrito
  const productoEnCarrito = producto ? estaEnCarrito(producto.id) : false;
  const cantidadEnCarrito = producto ? obtenerCantidadProducto(producto.id) : 0;

  if (cargando) {
    return (
      <div className={styles.cargandoContainer}>
        <div className={styles.cargando}>Cargando producto...</div>
      </div>
    );
  }

  if (error || !producto) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.error}>
          <h2>Producto no encontrado</h2>
          <p>El producto que buscas no existe o ha sido removido.</p>
          <button 
            className={styles.btnVolver}
            onClick={() => navigate('/productos')}
          >
            Volver a productos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.detallePage}>
      <div className={styles.detalleContainer}>
        {/* Imagen del producto */}
        <div className={styles.imagenContainer}>
          <img 
            src={producto.imagenUrl || producto.imagen || '/assets/default-product.jpg'} 
            alt={producto.nombre}
            className={styles.imagen}
            onError={(e) => {
              e.target.src = '/assets/default-product.jpg';
            }}
          />
        </div>

        {/* Información del producto */}
        <div className={styles.infoContainer}>
          <div className={styles.infoContent}>
            <h1 className={styles.nombre}>{producto.nombre}</h1>
            <p className={styles.descripcion}>{producto.descripcion}</p>
            
            <div className={styles.precioContainer}>
              <span className={styles.precio}>${producto.precio}</span>
              {producto.oferta && (
                <span className={styles.badgeOferta}>¡En oferta!</span>
              )}
            </div>

            {/* Información de stock */}
            <div className={styles.stockContainer}>
              {getMensajeStock()}
              {productoEnCarrito && (
                <div className={styles.productoEnCarrito}>
                  ✅ Ya tienes {cantidadEnCarrito} unidad(es) en el carrito
                </div>
              )}
            </div>

            {/* Selector de cantidad */}
            <div className={styles.cantidadContainer}>
              <label className={styles.cantidadLabel}>Cantidad:</label>
              <div className={styles.cantidadControls}>
                <button 
                  className={styles.cantidadBtn} 
                  onClick={decrementarCantidad}
                  disabled={cantidad <= 1 || producto.stock === 0 || agregando}
                >
                  -
                </button>
                <span className={styles.cantidad}>{cantidad}</span>
                <button 
                  className={styles.cantidadBtn} 
                  onClick={incrementarCantidad}
                  disabled={!producto || cantidad >= producto.stock || agregando}
                >
                  +
                </button>
              </div>
              {cantidad > producto.stock && (
                <div className={styles.errorCantidad}>
                  ❌ No hay suficiente stock. Máximo: {producto.stock}
                </div>
              )}
            </div>

            {/* Opciones de pago */}
            <div className={styles.opcionesPago}>
              <h3>Beneficios de tu compra</h3>
              <ul>
                <li>✅ 10% de descuento con débito</li>
                <li>✅ Si sos cliente del Spa y realizaste tres servicios en el ultimo mes tendras un 15% de descuento</li>
              </ul>
            </div>

            {/* Botones de acción */}
            <div className={styles.botones}>
              <button 
                className={`${styles.btnAgregar} ${
                  isBotonDeshabilitado() ? styles.btnDeshabilitado : 
                  agregando ? styles.btnAgregando : 
                  productoEnCarrito ? styles.btnEnCarrito : ''
                }`}
                onClick={handleAgregarCarrito}
                disabled={isBotonDeshabilitado()}
              >
                {agregando ? 'Agregando...' : 
                 producto.stock === 0 ? 'Producto agotado' : 
                 productoEnCarrito ? `Agregar más (${cantidadEnCarrito} en carrito)` : 
                 'Agregar al carrito'}
              </button>
              <button 
                className={`${styles.btnComprar} ${
                  isBotonDeshabilitado() ? styles.btnDeshabilitado : 
                  agregando ? styles.btnAgregando : ''
                }`}
                onClick={handleComprarAhora}
                disabled={isBotonDeshabilitado()}
              >
                {agregando ? 'Procesando...' : 
                 producto.stock === 0 ? 'Producto agotado' : 
                 'Comprar ahora'}
              </button>
            </div>

            {/* Información adicional */}
            <div className={styles.infoAdicional}>
              <div className={styles.infoItem}>
                <strong>💳 Medios de pago:</strong> Todas las tarjetas y transferencias
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductoDetalle;