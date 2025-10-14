import React, { useState } from 'react';
import styles from '../styles/PaymentGateway.module.css';
import { FaCreditCard, FaMoneyBillWave, FaUniversity, FaLock } from 'react-icons/fa';
import axios from 'axios';

// ✅ FUNCIÓN CORREGIDA - Solo obtener el ID
const obtenerUsuarioIdDelToken = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const userId = payload.id || payload.userId;
    return userId && !isNaN(userId) ? parseInt(userId) : null;
  } catch (error) {
    console.error('Error decodificando token:', error);
    return null;
  }
};

const PaymentGateway = ({ 
  total, 
  items, 
  onPaymentSuccess, 
  onPaymentCancel,
  userData 
}) => {
  const [activeStep, setActiveStep] = useState(1);
  const [selectedMethod, setSelectedMethod] = useState('');
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
    installments: 1
  });
  const [processing, setProcessing] = useState(false);

  const paymentMethods = [
    {
      id: 'credit',
      name: 'Tarjeta de Crédito',
      icon: FaCreditCard,
      description: 'Paga con tu tarjeta de crédito',
      color: '#6366f1'
    },
    {
      id: 'debit',
      name: 'Tarjeta de Débito',
      icon: FaUniversity,
      description: 'Paga con tu tarjeta de débito',
      color: '#10b981'
    },
    {
      id: 'cash',
      name: 'Efectivo',
      icon: FaMoneyBillWave,
      description: 'Paga en efectivo al retirar',
      color: '#f59e0b'
    }
  ];

  const handleMethodSelect = (methodId) => {
    setSelectedMethod(methodId);
    setActiveStep(2);
  };

  const handleInputChange = (field, value) => {
    setPaymentData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatCardNumber = (value) => {
    return value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
  };

  const formatExpiry = (value) => {
    return value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2').slice(0, 5);
  };

  const procesarPagoReal = async () => {
    setProcessing(true);
    try {
      const token = localStorage.getItem('token');
      
      // ✅ CORREGIDO: Solo obtener el ID, no el objeto completo
      const usuarioId = obtenerUsuarioIdDelToken();
      
      if (!usuarioId) {
        throw new Error('No se pudo obtener el ID del usuario');
      }

      // ✅ PAYLOAD CORREGIDO - Solo datos simples que el backend espera
      const payload = {
        usuarioId: usuarioId, // Solo el ID numérico
        metodoPago: selectedMethod === 'cash' ? 'EFECTIVO' : 
                    selectedMethod === 'credit' ? 'TARJETA_CREDITO' : 'TARJETA_DEBITO',
        productos: items.map(item => ({
          productoId: item.producto.id,
          cantidad: item.cantidad
          // ❌ REMOVER campos extra que el backend no espera
        })),
        total: parseFloat(total)
      };

      console.log("📤 Enviando payload:", payload);

      const response = await axios.post('http://localhost:8080/api/facturas', payload, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log("✅ Factura creada:", response.data);
      
      // ✅ PASAR DATOS SIMPLIFICADOS
      onPaymentSuccess({
        method: selectedMethod,
        transactionId: response.data.id,
        timestamp: new Date().toISOString(),
        items,
        // ✅ Solo los datos esenciales que sabemos que vienen del backend
        total: response.data.total,
        subtotal: response.data.subtotal,
        iva: response.data.iva,
        descuento: response.data.descuento
      });
      
    } catch (error) {
      console.error('❌ Error al procesar pago:', error);
      console.error('❌ Detalles del error:', error.response?.data);
      setProcessing(false);
      alert('Error al procesar el pago: ' + (error.response?.data?.message || error.message));
    }
  };

  const calculateInstallments = () => {
    if (selectedMethod !== 'credit') return [];
    
    const installments = [];
    for (let i = 1; i <= 12; i++) {
      const installmentAmount = total / i;
      installments.push({
        months: i,
        amount: installmentAmount.toFixed(2)
      });
    }
    return installments;
  };

  return (
    <div className={styles.paymentGateway}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.securityBadge}>
          <FaLock />
          <span>Pago 100% Seguro</span>
        </div>
        <h2>Finalizar Compra</h2>
        <div className={styles.amount}>
          Total: <span>${total}</span>
        </div>
      </div>

      {/* Progress Steps */}
      <div className={styles.progressSteps}>
        <div className={`${styles.step} ${activeStep >= 1 ? styles.active : ''}`}>
          <div className={styles.stepNumber}>1</div>
          <span>Método de Pago</span>
        </div>
        <div className={`${styles.step} ${activeStep >= 2 ? styles.active : ''}`}>
          <div className={styles.stepNumber}>2</div>
          <span>Datos de Pago</span>
        </div>
        <div className={`${styles.step} ${activeStep >= 3 ? styles.active : ''}`}>
          <div className={styles.stepNumber}>3</div>
          <span>Confirmación</span>
        </div>
      </div>

      {/* Step 1: Selección de Método */}
      {activeStep === 1 && (
        <div className={styles.stepContent}>
          <h3>Selecciona tu método de pago</h3>
          <div className={styles.paymentMethods}>
            {paymentMethods.map(method => (
              <div
                key={method.id}
                className={`${styles.methodCard} ${
                  selectedMethod === method.id ? styles.selected : ''
                }`}
                onClick={() => handleMethodSelect(method.id)}
              >
                <div className={styles.methodIcon} style={{ color: method.color }}>
                  <method.icon />
                </div>
                <div className={styles.methodInfo}>
                  <h4>{method.name}</h4>
                  <p>{method.description}</p>
                </div>
                <div className={styles.radio}>
                  <div className={styles.radioDot}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Datos de Pago */}
      {activeStep === 2 && selectedMethod !== 'cash' && (
        <div className={styles.stepContent}>
          <h3>Ingresa los datos de tu tarjeta</h3>
          
          <div className={styles.paymentForm}>
            <div className={styles.formGroup}>
              <label>Número de Tarjeta</label>
              <div className={styles.cardInput}>
                <FaCreditCard className={styles.inputIcon} />
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={formatCardNumber(paymentData.cardNumber)}
                  onChange={(e) => handleInputChange('cardNumber', e.target.value.replace(/\s/g, ''))}
                  maxLength={19}
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Nombre en la Tarjeta</label>
              <input
                type="text"
                placeholder="JUAN PEREZ"
                value={paymentData.cardName}
                onChange={(e) => handleInputChange('cardName', e.target.value.toUpperCase())}
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Fecha de Vencimiento</label>
                <input
                  type="text"
                  placeholder="MM/AA"
                  value={formatExpiry(paymentData.expiry)}
                  onChange={(e) => handleInputChange('expiry', e.target.value)}
                  maxLength={5}
                />
              </div>

              <div className={styles.formGroup}>
                <label>CVV</label>
                <div className={styles.cvvInput}>
                  <input
                    type="text"
                    placeholder="123"
                    value={paymentData.cvv}
                    onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, ''))}
                    maxLength={4}
                  />
                  <FaLock className={styles.lockIcon} />
                </div>
              </div>
            </div>

            {selectedMethod === 'credit' && (
              <div className={styles.formGroup}>
                <label>Cuotas</label>
                <select
                  value={paymentData.installments}
                  onChange={(e) => handleInputChange('installments', parseInt(e.target.value))}
                >
                  {calculateInstallments().map(installment => (
                    <option key={installment.months} value={installment.months}>
                      {installment.months} cuota{installment.months > 1 ? 's' : ''} de ${installment.amount}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className={styles.securityNote}>
              <FaLock />
              <span>Tus datos están protegidos con encriptación SSL</span>
            </div>
          </div>

          <div className={styles.actionButtons}>
            <button 
              className={styles.secondaryButton}
              onClick={() => setActiveStep(1)}
            >
              Volver
            </button>
            <button 
              className={styles.primaryButton}
              onClick={procesarPagoReal}
              disabled={processing || !paymentData.cardNumber || !paymentData.cardName || !paymentData.expiry || !paymentData.cvv}
            >
              {processing ? 'Procesando...' : `Pagar $${total}`}
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Efectivo */}
      {activeStep === 2 && selectedMethod === 'cash' && (
        <div className={styles.stepContent}>
          <div className={styles.cashPayment}>
            <div className={styles.cashIcon}>
              <FaMoneyBillWave />
            </div>
            <h3>Pago en Efectivo</h3>
            <p>Podrás pagar en efectivo al momento de retirar tu pedido.</p>
            
            <div className={styles.cashDetails}>
              <div className={styles.detailItem}>
                <span>Total a pagar:</span>
                <strong>${total}</strong>
              </div>
              <div className={styles.detailItem}>
                <span>Descuento por pago en efectivo:</span>
                <strong className={styles.discount}>-${(total * 0.10).toFixed(2)}</strong>
              </div>
              <div className={styles.detailItem}>
                <span>Total final:</span>
                <strong className={styles.finalAmount}>${(total * 0.90).toFixed(2)}</strong>
              </div>
            </div>

            <div className={styles.actionButtons}>
              <button 
                className={styles.secondaryButton}
                onClick={() => setActiveStep(1)}
              >
                Volver
              </button>
              <button 
                className={styles.primaryButton}
                onClick={procesarPagoReal}
                disabled={processing}
              >
                {processing ? 'Confirmando...' : 'Confirmar Pedido'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Resumen del Pedido */}
      <div className={styles.orderSummary}>
        <h4>Resumen del Pedido</h4>
        {items.map(item => (
          <div key={item.id} className={styles.summaryItem}>
            <span>{item.cantidad}x {item.producto.nombre}</span>
            <span>${(item.producto.precio * item.cantidad).toFixed(2)}</span>
          </div>
        ))}
        <div className={styles.summaryTotal}>
          <span>Total</span>
          <span>${total}</span>
        </div>
      </div>
    </div>
  );
};

export default PaymentGateway;