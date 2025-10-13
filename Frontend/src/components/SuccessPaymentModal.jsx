// components/SuccessPaymentModal.jsx
import React, { useEffect, useState } from 'react';
import { FiCheckCircle } from 'react-icons/fi';
import '../styles/SuccesPaymentModal.module.css';
import { Link } from 'react-router-dom';

export default function SuccessPaymentModal({ total, items, onClose }) {
  const [animateTick, setAnimateTick] = useState(false);

  useEffect(() => {
    setAnimateTick(true);
  }, []);

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
          {items.length === 0 ? (
            <p>No hay productos en tu pedido.</p>
          ) : (
            items.map((item) => (
              <div key={item.id} className="orderItem">
                <span>{item.producto.nombre} x {item.cantidad}</span>
                <span>${(item.producto.precio * item.cantidad).toFixed(2)}</span>
              </div>
            ))
          )}
          <div className="orderTotal">
            <strong>Total: ${total.toFixed(2)}</strong>
          </div>
        </div>

        {/* Botones de acción rápida */}
        <div className="actionButtons">
          <Link to="/productos" className="btnPrimary" onClick={onClose}>
            Volver a la tienda
          </Link>
          <Link to="/carrito" className="btnOutline" onClick={onClose}>
            Ver pedido
          </Link>
          {/* Opcional: descarga de factura */}
          {/* <button className="btnOutline">Descargar factura</button> */}
        </div>
      </div>
    </div>
  );
}
