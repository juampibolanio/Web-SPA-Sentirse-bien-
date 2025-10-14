import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCarrito } from '../services/CarritoContext.jsx';
import PaymentGateway from './PaymentGateway.jsx';
import styles from '../styles/PaymentGateway.module.css';

const obtenerUsuarioDelToken = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      id: payload.id ? parseInt(payload.id) : null,
      nombre: payload.nombre || '',
      email: payload.email || '',
    };
  } catch (error) {
    console.error('Error decodificando token:', error);
    return null;
  }
};

const PaymentPage = () => {
  const navigate = useNavigate();
  const { calcularTotales, items, vaciarCarrito } = useCarrito();
  
  // Solo obtener el total para mostrar en el PaymentGateway
  const { total, infoDescuento } = calcularTotales();

  const handlePaymentSuccess = async (paymentResult) => {
    await vaciarCarrito();
    
    // ✅ CORREGIDO: Usar SOLO los datos que vienen del paymentResult
    // El backend ya calculó todo correctamente
    navigate('/carrito/confirmacion', { 
      state: { 
        paymentResult: {
          ...paymentResult,
          // El backend ya tiene todos los cálculos correctos
          // No sobreescribir con cálculos del frontend
        },
        items: [...items],
        total: paymentResult.total // Usar el total REAL del backend
      }
    });
  };

  const handlePaymentCancel = () => {
    navigate('/carrito');
  };

  return (
    <div className={styles.paymentPage}>
      <div className={styles.pageHeader}>
        <button 
          className={styles.backButton}
          onClick={() => navigate('/carrito')}
        >
          ← Volver al Carrito
        </button>
        <h1>Finalizar Compra</h1>
      </div>
      
      <PaymentGateway
        total={parseFloat(total)}
        items={items}
        userData={obtenerUsuarioDelToken()}
        onPaymentSuccess={handlePaymentSuccess}
        onPaymentCancel={handlePaymentCancel}
      />
    </div>
  );
};

export default PaymentPage;