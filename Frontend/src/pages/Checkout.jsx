import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCarrito } from '../services/CarritoContext.jsx';
import styles from '../styles/Checkout.module.css';
import axios from 'axios';

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

const Checkout = () => {
  const navigate = useNavigate();
  const { calcularTotales, items, vaciarCarrito } = useCarrito();
  
  // ✅ CORREGIDO: Obtener infoDescuento desde calcularTotales()
  const { subtotal, iva, total, cantidadTotal, descuentoFrecuente, infoDescuento } = calcularTotales();
  
  const token = localStorage.getItem('token');
  const usuarioId = obtenerUsuarioDelToken();

  useEffect(() => {
    if (!token || !usuarioId) {
      alert('Debes iniciar sesión para realizar una compra');
      navigate('/login');
    }
  }, [token, usuarioId, navigate]);

  const [form, setForm] = useState({
    nombre: '',
    email: '',
    direccion: '',
    tarjeta: '',
    vencimiento: '',
    cvv: '',
    metodoPago: 'TARJETA_CREDITO' // ✅ NUEVO: Campo para método de pago
  });

  const [errores, setErrores] = useState({});
  const [procesando, setProcesando] = useState(false);
  const [showSuccessPanel, setShowSuccessPanel] = useState(false);
  const [itemsComprados, setItemsComprados] = useState([]);

  // ✅ NUEVO: Manejar cambio de método de pago
  const handleMetodoPagoChange = (metodo) => {
    setForm(prev => ({ ...prev, metodoPago: metodo }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'tarjeta') formattedValue = value.replace(/\D/g, '').slice(0,16);
    if (name === 'vencimiento') formattedValue = value.replace(/\D/g,'').replace(/(\d{2})(\d)/,'$1/$2').slice(0,5);
    if (name === 'cvv') formattedValue = value.replace(/\D/g,'').slice(0,4);

    setForm(prev => ({ ...prev, [name]: formattedValue }));
  };

  const validar = () => {
    const erroresTmp = {};
    if (!form.nombre.trim()) erroresTmp.nombre = 'Nombre obligatorio';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) erroresTmp.email = 'Email inválido';
    if (!form.direccion.trim()) erroresTmp.direccion = 'Dirección obligatoria';
    
    // ✅ SOLO validar tarjeta si no es efectivo
    if (form.metodoPago !== 'EFECTIVO') {
      if (!/^\d{16}$/.test(form.tarjeta)) erroresTmp.tarjeta = 'Tarjeta inválida (16 dígitos)';
      if (!/^\d{2}\/\d{2}$/.test(form.vencimiento)) erroresTmp.vencimiento = 'Formato MM/AA requerido';
      if (!/^\d{3,4}$/.test(form.cvv)) erroresTmp.cvv = 'CVV inválido (3-4 dígitos)';
    }
    
    setErrores(erroresTmp);
    return Object.keys(erroresTmp).length === 0;
  };

  const handlePago = async (e) => {
    e.preventDefault();
    if (!validar()) return;

    setProcesando(true);
    const fecha = new Date().toISOString();

    // ✅ CORREGIDO: Payload dinámico con método de pago seleccionado
    const payload = {
      usuarioId,
      metodoPago: form.metodoPago, // ← DINÁMICO del form
      productos: items.map(item => ({
        productoId: item.producto.id,
        productoNombre: item.producto.nombre,
        productoPrecio: item.producto.precio,
        cantidad: item.cantidad,
        subtotal: item.producto.precio * item.cantidad
      })),
      total: parseFloat(total),
      descuento: parseFloat(descuentoFrecuente) || 0,
      fecha,
      datosEnvio: {
        nombre: form.nombre,
        email: form.email,
        direccion: form.direccion
      }
    };

    // ✅ SOLO incluir datos de tarjeta si no es efectivo
    if (form.metodoPago !== 'EFECTIVO') {
      payload.datosTarjeta = {
        tarjeta: form.tarjeta,
        vencimiento: form.vencimiento,
        cvv: form.cvv
      };
    }

    console.log("📤 PAYLOAD COMPLETO:", JSON.stringify(payload, null, 2));

    try {
      const response = await axios.post('http://localhost:8080/api/facturas', payload, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log("✅ Factura creada:", response.data);
      
      await vaciarCarrito();
      setItemsComprados([...items]);
      setShowSuccessPanel(true);
    } catch (error) {
      console.error('Error al procesar el pago:', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        alert('Sesión expirada o sin permisos. Por favor inicia sesión nuevamente.');
        localStorage.removeItem('token');
        navigate('/login');
      } else if (error.response?.status === 400) {
        alert('Error en los datos: ' + (error.response.data.message || 'Verifica la información'));
      } else {
        alert('Hubo un error al procesar tu pago. Intenta nuevamente.');
      }
    } finally {
      setProcesando(false);
    }
  };

  if (!token || !usuarioId) {
    return (
      <div className={styles.checkoutPage}>
        <div className={styles.cargando}>Redirigiendo al login...</div>
      </div>
    );
  }

  return (
    <div className={styles.checkoutPage}>
      <h1>Pasarela de Pagos</h1>

      {!showSuccessPanel ? (
        <form className={styles.formPago} onSubmit={handlePago}>
          <div className={styles.seccion}>
            <h2>Datos de Envío</h2>
            <label>
              Nombre Completo *
              <input type="text" name="nombre" value={form.nombre} onChange={handleChange} placeholder="Ingresa tu nombre completo" />
              {errores.nombre && <span className={styles.error}>{errores.nombre}</span>}
            </label>
            <label>
              Email *
              <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="tu@email.com" />
              {errores.email && <span className={styles.error}>{errores.email}</span>}
            </label>
            <label>
              Dirección de Envío *
              <input type="text" name="direccion" value={form.direccion} onChange={handleChange} placeholder="Dirección completa" />
              {errores.direccion && <span className={styles.error}>{errores.direccion}</span>}
            </label>
          </div>

          {/* ✅ NUEVO: Selector de método de pago */}
          <div className={styles.seccion}>
            <h2>Método de Pago</h2>
            <div className={styles.metodosPago}>
              <label className={styles.metodoPagoOption}>
                <input
                  type="radio"
                  name="metodoPago"
                  value="TARJETA_CREDITO"
                  checked={form.metodoPago === 'TARJETA_CREDITO'}
                  onChange={(e) => handleMetodoPagoChange(e.target.value)}
                />
                <span>Tarjeta de Crédito</span>
              </label>
              
              <label className={styles.metodoPagoOption}>
                <input
                  type="radio"
                  name="metodoPago"
                  value="TARJETA_DEBITO"
                  checked={form.metodoPago === 'TARJETA_DEBITO'}
                  onChange={(e) => handleMetodoPagoChange(e.target.value)}
                />
                <span>Tarjeta de Débito</span>
              </label>
              
              <label className={styles.metodoPagoOption}>
                <input
                  type="radio"
                  name="metodoPago"
                  value="EFECTIVO"
                  checked={form.metodoPago === 'EFECTIVO'}
                  onChange={(e) => handleMetodoPagoChange(e.target.value)}
                />
                <span>Efectivo (10% de descuento)</span>
              </label>
            </div>
          </div>

          {/* ✅ MOSTRAR campos de tarjeta solo si no es efectivo */}
          {form.metodoPago !== 'EFECTIVO' && (
            <div className={styles.seccion}>
              <h2>Datos de Tarjeta</h2>
              <label>
                Número de Tarjeta *
                <input type="text" name="tarjeta" value={form.tarjeta} onChange={handleChange} placeholder="1234 5678 9012 3456" maxLength={16} />
                {errores.tarjeta && <span className={styles.error}>{errores.tarjeta}</span>}
              </label>
              <div className={styles.fila}>
                <label className={styles.medio}>
                  Vencimiento (MM/AA) *
                  <input type="text" name="vencimiento" value={form.vencimiento} onChange={handleChange} placeholder="MM/AA" maxLength={5} />
                  {errores.vencimiento && <span className={styles.error}>{errores.vencimiento}</span>}
                </label>
                <label className={styles.medio}>
                  CVV *
                  <input type="text" name="cvv" value={form.cvv} onChange={handleChange} placeholder="123" maxLength={4} />
                  {errores.cvv && <span className={styles.error}>{errores.cvv}</span>}
                </label>
              </div>
            </div>
          )}

          {/* ✅ CORREGIDO: Resumen con infoDescuento definida */}
          <div className={styles.resumen}>
            <h2>Resumen de Compra</h2>
            <div className={styles.resumenItem}><span>Productos ({cantidadTotal}):</span><span>${subtotal}</span></div>
            <div className={styles.resumenItem}><span>IVA (21%):</span><span>${iva}</span></div>

            {infoDescuento?.aplicaDescuento && (
              <div className={styles.resumenDescuento}>
                <span>Descuento Cliente Frecuente (15%):</span>
                <span className={styles.descuentoTexto}>-${descuentoFrecuente}</span>
              </div>
            )}

            {form.metodoPago === 'EFECTIVO' && (
              <div className={styles.resumenDescuento}>
                <span>Descuento por Pago en Efectivo (10%):</span>
                <span className={styles.descuentoTexto}>-${(parseFloat(subtotal) * 0.10).toFixed(2)}</span>
              </div>
            )}

            <div className={styles.resumenTotal}><span>Total:</span><span>${total}</span></div>
          </div>

          <button type="submit" disabled={procesando} className={procesando ? styles.btnProcesando : ''}>
            {procesando ? 'Procesando Pago...' : `Pagar $${total}`}
          </button>
        </form>
      ) : (
        <div className={styles.successPanel}>
          <div className={styles.successIcon}>✓</div>
          <h2>¡Pago Exitoso!</h2>
          <p className={styles.totalPagado}>Total pagado: <strong>${total}</strong></p>
          {infoDescuento?.aplicaDescuento && (
            <p className={styles.descuentoAplicado}>Se aplicó descuento de cliente frecuente: <strong>-${descuentoFrecuente}</strong></p>
          )}
          {form.metodoPago === 'EFECTIVO' && (
            <p className={styles.descuentoAplicado}>Se aplicó descuento por pago en efectivo: <strong>-${(parseFloat(subtotal) * 0.10).toFixed(2)}</strong></p>
          )}
          <ul>
            {itemsComprados.map(item => (
              <li key={item.id}>
                <span>{item.cantidad}x</span> <span>{item.producto.nombre}</span> <span>${(item.producto.precio*item.cantidad).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <button onClick={() => navigate('/productos')} className={styles.btnSeguirComprando}>Seguir Comprando</button>
        </div>
      )}
    </div>
  );
};

export default Checkout;