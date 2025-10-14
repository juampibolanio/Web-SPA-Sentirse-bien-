import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiCheckCircle, FiDownload, FiShoppingBag } from 'react-icons/fi';
import styles from '../styles/SuccesPaymentPanel.module.css';

const ConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [animateTick, setAnimateTick] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const { paymentResult, items } = location.state || {};

  useEffect(() => {
    setAnimateTick(true);
    loadUserData();
  }, []);

  // ✅ FUNCIÓN CORREGIDA PARA DECODIFICAR JWT
  const decodeJWT = (token) => {
    try {
      // Dividir el token en sus partes
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Token JWT inválido');
      }

      // Decodificar el payload (segunda parte)
      const payload = parts[1];
      
      // Base64 URL decode - CORRECCIÓN PARA JWT
      const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
      const padding = '='.repeat((4 - base64.length % 4) % 4);
      const base64Padded = base64 + padding;
      
      const jsonPayload = decodeURIComponent(atob(base64Padded).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decodificando JWT:', error);
      return null;
    }
  };

  // ✅ FUNCIÓN MEJORADA PARA OBTENER DATOS DEL USUARIO
  const loadUserData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      console.log('🔐 Token encontrado:', token ? 'Sí' : 'No');
      
      if (!token) {
        console.warn('No hay token disponible, usando datos por defecto');
        setUserData(getDefaultUserData());
        return;
      }

      // ✅ USAR LA NUEVA FUNCIÓN DE DECODIFICACIÓN
      const payload = decodeJWT(token);
      
      if (payload) {
        console.log('✅ Token decodificado correctamente:', payload);
        
        // ✅ EXTRAER DATOS CORRECTAMENTE DEL PAYLOAD JWT
        const userData = {
          nombre: payload.nombre || 'Cliente',
          apellido: payload.apellido || '',
          email: payload.sub || 'No especificado', // 'sub' contiene el email en JWT
          dni: payload.dni || 'No especificado',
          id: payload.id || null,
          rol: payload.role || ''
        };
        
        console.log('👤 Datos del usuario desde token:', userData);
        setUserData(userData);
      } else {
        console.warn('❌ No se pudo decodificar el token, intentando desde API...');
        const userFromAPI = await fetchUserData();
        setUserData(userFromAPI);
      }
      
    } catch (error) {
      console.error('💥 Error cargando datos del usuario:', error);
      setUserData(getDefaultUserData());
    } finally {
      setLoading(false);
    }
  };

  // ✅ FUNCIÓN PARA OBTENER DATOS DEL USUARIO DESDE LA API (backup)
  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/api/usuarios/perfil', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const userData = await response.json();
        console.log('📡 Datos obtenidos desde API:', userData);
        return {
          nombre: userData.nombre || 'Cliente',
          apellido: userData.apellido || '',
          email: userData.email || '',
          dni: userData.dni || 'No especificado',
          telefono: userData.telefono || ''
        };
      } else {
        console.warn('API no respondió, usando datos por defecto');
      }
    } catch (error) {
      console.error('Error obteniendo datos de la API:', error);
    }

    // Datos por defecto si falla la API
    return getDefaultUserData();
  };

  // ✅ FUNCIÓN AUXILIAR PARA DATOS POR DEFECTO
  const getDefaultUserData = () => {
    return {
      nombre: 'Cliente',
      apellido: '',
      email: 'No especificado',
      dni: 'No especificado',
      telefono: ''
    };
  };

  // ✅ FUNCIÓN PARA DESCARGAR PDF
  const handleDownloadPDF = async () => {
    try {
      // Usar los datos del usuario que ya cargamos
      const userDataForPDF = userData || getDefaultUserData();

      console.log('📄 Generando PDF con datos:', userDataForPDF);

      // Importar dinámicamente el generador de PDF
      const { generateInvoicePDF } = await import('../services/pdfGenerator');
      
      // Generar y descargar el PDF
      generateInvoicePDF(paymentResult, userDataForPDF, items);
      
    } catch (error) {
      console.error('Error al generar PDF:', error);
      alert('Error al descargar el comprobante. Por favor, intente nuevamente.');
    }
  };

  if (!paymentResult) {
    return (
      <div className={styles.errorState}>
        <h2>No se encontró información del pago</h2>
        <button onClick={() => navigate('/carrito')}>Volver al Carrito</button>
      </div>
    );
  }

  // ✅ CALCULAR VALORES BASADO EN LOS DATOS REALES DEL BACKEND
  const calcularValoresReales = () => {
    const producto = items[0];
    const precioOriginal = producto.producto.precio;
    const descuentoProducto = producto.producto.descuento || 0;
    
    // Precio después del descuento del producto
    const precioConDescuentoProducto = descuentoProducto > 0 
      ? precioOriginal * (1 - descuentoProducto / 100)
      : precioOriginal;
    
    // Descuento de productos
    const descuentoProductoMonto = precioOriginal - precioConDescuentoProducto;
    
    // El backend ahora nos envía el total correcto
    const totalFinal = paymentResult.total || 0;
    
    // Calcular IVA (21% sobre el subtotal con descuentos de producto)
    const iva = precioConDescuentoProducto * 0.21;
    
    // Total antes de descuentos adicionales
    const totalAntesDescuentosAdicionales = precioConDescuentoProducto + iva;
    
    // Descuento por efectivo (si aplica)
    const descuentoEfectivo = paymentResult.method === 'cash' ? 
      (totalAntesDescuentosAdicionales * 0.10) : 0;

    return {
      precioOriginal,
      precioConDescuentoProducto,
      descuentoProductoMonto,
      iva,
      totalAntesDescuentosAdicionales,
      descuentoEfectivo,
      totalFinal
    };
  };

  const valores = calcularValoresReales();

  return (
    <div className={styles.confirmationPage}>
      <div className={styles.panelContent}>
        {/* Animación del tick */}
        <div className={`${styles.tickContainer} ${animateTick ? styles.animate : ''}`}>
          <FiCheckCircle className={styles.tickIcon} />
        </div>

        <h2>✅ Pago realizado con éxito</h2>
        <p>Gracias por tu compra! Tu pedido ha sido procesado correctamente.</p>

        {/* Resumen de la compra */}
        <div className={styles.purchaseSummary}>
          <h3>Resumen de tu pedido</h3>
          {items.map(item => {
            const precioBase = item.producto.precio;
            const descuentoProducto = item.producto.descuento || 0;
            const precioConDescuento = descuentoProducto > 0 
              ? precioBase * (1 - descuentoProducto / 100)
              : precioBase;
            
            return (
              <div key={item.id} className={styles.purchaseItem}>
                <img 
                  src={item.producto.imagen || '/assets/default-product.jpg'} 
                  alt={item.producto.nombre}
                  onError={(e) => { e.target.src = '/assets/default-product.jpg'; }}
                />
                <div className={styles.itemInfo}>
                  <span className={styles.itemName}>{item.producto.nombre}</span>
                  <span className={styles.itemQty}>x{item.cantidad}</span>
                  <div className={styles.itemPriceDetails}>
                    {descuentoProducto > 0 ? (
                      <>
                        <span className={styles.originalPrice}>${precioBase.toFixed(2)}</span>
                        <span className={styles.finalPrice}>${precioConDescuento.toFixed(2)}</span>
                        <span className={styles.discountBadge}>{descuentoProducto}% OFF</span>
                      </>
                    ) : (
                      <span className={styles.finalPrice}>${precioBase.toFixed(2)}</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          
          {/* ✅ DESCUENTOS BREAKDOWN ACTUALIZADO */}
          <div className={styles.discountsBreakdown}>
            {/* SUBTOTAL SIN DESCUENTOS */}
            <div className={styles.discountItem}>
              <span>Subtotal (sin descuentos):</span>
              <span>${valores.precioOriginal.toFixed(2)}</span>
            </div>
            
            {/* DESCUENTO DE PRODUCTOS */}
            {valores.descuentoProductoMonto > 0 && (
              <div className={styles.discountItem}>
                <span>Descuento de productos ({items[0]?.producto.descuento}%):</span>
                <span className={styles.discountAmount}>-${valores.descuentoProductoMonto.toFixed(2)}</span>
              </div>
            )}
            
            {/* SUBTOTAL CON DESCUENTOS DE PRODUCTO */}
            <div className={styles.discountItem}>
              <span>Subtotal (con descuentos de producto):</span>
              <span>${valores.precioConDescuentoProducto.toFixed(2)}</span>
            </div>
            
            {/* IVA */}
            <div className={styles.discountItem}>
              <span>IVA (21%):</span>
              <span>${valores.iva.toFixed(2)}</span>
            </div>
            
            {/* DESCUENTO EFECTIVO */}
            {paymentResult.method === 'cash' && (
              <div className={styles.discountItem}>
                <span>Descuento Pago en Efectivo (10%):</span>
                <span className={styles.discountAmount}>-${valores.descuentoEfectivo.toFixed(2)}</span>
              </div>
            )}
          </div>
          
          <div className={styles.purchaseTotal}>
            <strong>Total: ${valores.totalFinal.toFixed(2)}</strong>
          </div>
        </div>

        {/* Detalles de la transacción */}
        <div className={styles.transactionDetails}>
          <div className={styles.detailRow}>
            <span>Número de transacción:</span>
            <strong>{paymentResult.transactionId}</strong>
          </div>
          <div className={styles.detailRow}>
            <span>Método de pago:</span>
            <strong>
              {paymentResult.method === 'credit' && 'Tarjeta de Crédito'}
              {paymentResult.method === 'debit' && 'Tarjeta de Débito'}
              {paymentResult.method === 'cash' && 'Efectivo'}
            </strong>
          </div>
          <div className={styles.detailRow}>
            <span>Fecha:</span>
            <strong>{new Date().toLocaleDateString()}</strong>
          </div>
          
          {/* ✅ MOSTRAR DATOS REALES DEL USUARIO */}
          {!loading && userData ? (
            <>
              <div className={styles.detailRow}>
                <span>Cliente:</span>
                <strong>{userData.nombre} {userData.apellido}</strong>
              </div>
              <div className={styles.detailRow}>
                <span>Email:</span>
                <strong>{userData.email}</strong>
              </div>
              <div className={styles.detailRow}>
                <span>DNI:</span>
                <strong>{userData.dni}</strong>
              </div>
            </>
          ) : (
            <div className={styles.detailRow}>
              <span>Estado:</span>
              <strong>{loading ? 'Cargando datos...' : 'Datos no disponibles'}</strong>
            </div>
          )}
        </div>

        {/* Botones de acción */}
        <div className={styles.actionButtons}>
          <button 
            className={styles.btnPrimary}
            onClick={() => navigate('/productos')}
          >
            <FiShoppingBag /> Seguir Comprando
          </button>
          <button 
            className={styles.btnOutline}
            onClick={handleDownloadPDF}
            disabled={!userData || loading}
          >
            <FiDownload /> 
            {loading ? 'Cargando...' : (userData ? 'Descargar Comprobante' : 'Datos no disponibles')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPage;