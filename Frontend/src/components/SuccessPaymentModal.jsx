import React, { useEffect, useState } from 'react';
import { FiCheckCircle } from 'react-icons/fi';
import '../styles/SuccesPaymentModal.module.css';
import { Link } from 'react-router-dom';

export default function SuccessPaymentModal({ total, items, onClose }) {
  const [animateTick, setAnimateTick] = useState(false);

  useEffect(() => {
    setAnimateTick(true);
  }, []);

  // ✅ CORREGIDO: Asegurar que total sea un número
  const totalNumero = typeof total === 'number' ? total : 
                     typeof total === 'string' ? parseFloat(total) : 0;

  // ✅ CORREGIDO: Validar que items sea un array
  const itemsValidos = Array.isArray(items) ? items : [];

  return (
    <div className="modalOverlay">
      <div className="modalContent">
        {/* Animación del tick */}
        <div className={`tickContainer ${animateTick ? 'animate' : ''}`}>
          <FiCheckCircle className="tickIcon" />
        </div>

        <h2>✅ Pago realizado con éxito</h2>
        <p>Gracias por tu compra!</p>

        {/* Resumen de la compra */}
        <div className="orderSummary">
          <h3>Resumen de tu pedido</h3>
          {itemsValidos.length === 0 ? (
            <p>No hay productos en tu pedido.</p>
          ) : (
            <>
              {itemsValidos.map((item) => (
                <div key={item.id} className="orderItem">
                  <span>{item.producto?.nombre} x {item.cantidad}</span>
                  <span>${((item.producto?.precio || 0) * item.cantidad).toFixed(2)}</span>
                </div>
              ))}
              <div className="orderTotal">
                <strong>Total: ${totalNumero.toFixed(2)}</strong>
              </div>
            </>
          )}
        </div>

        {/* Botones de acción rápida */}
        <div className="actionButtons">
          <Link to="/productos" className="btnPrimary" onClick={onClose}>
            Volver a la tienda
          </Link>
          <button className="btnOutline" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}