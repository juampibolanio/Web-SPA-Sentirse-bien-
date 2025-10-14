// components/SuccessPaymentPanel.jsx
import React, { useEffect, useState } from 'react';
import { FiCheckCircle, FiDownload, FiHeadphones } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import '../styles/SuccesPaymentPanel.module.css';

export default function SuccessPaymentPanel({ items, total, onClose }) {
  const [animateTick, setAnimateTick] = useState(false);

  useEffect(() => {
    setAnimateTick(true);
  }, []);

  return (
    <div className="panelOverlay">
      <div className="panelContent">
        {/* Tick animado */}
        <div className={`tickContainer ${animateTick ? 'animate' : ''}`}>
          <FiCheckCircle className="tickIcon" />
        </div>
        <h2>✅ Pago realizado con éxito</h2>
        <p>Gracias por tu compra!</p>

        {/* Resumen de compra */}
        <div className="purchaseSummary">
          {items.map(item => (
            <div key={item.id} className="purchaseItem">
              <img src={item.producto.imagen || '/assets/default-product.jpg'} alt={item.producto.nombre} />
              <div className="itemInfo">
                <span className="itemName">{item.producto.nombre}</span>
                <span className="itemQty">x{item.cantidad}</span>
                <span className="itemPrice">${item.producto.precio * item.cantidad}</span>
              </div>
            </div>
          ))}
          <div className="purchaseTotal">
            <strong>Total:</strong> ${total}
          </div>
        </div>

        {/* Acciones rápidas */}
        <div className="actionButtons">
          <Link to="/productos" className="btnPrimary" onClick={onClose}>Volver a la tienda</Link>
          <Link to="/carrito" className="btnOutline" onClick={onClose}>Ver pedido</Link>
          <button className="btnOutline" onClick={() => alert('Factura descargada!')}>
            <FiDownload /> Descargar factura
          </button>
          <button className="btnOutline" onClick={() => alert('Soporte abierto!')}>
            <FiHeadphones /> Soporte inmediato
          </button>
        </div>
      </div>
    </div>
  );
}
