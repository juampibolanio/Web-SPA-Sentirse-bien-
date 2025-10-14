import jsPDF from 'jspdf';

export const generateInvoicePDF = (paymentData, userData, items) => {
  const doc = new jsPDF();
  
  // Configuración inicial
  const pageWidth = doc.internal.pageSize.getWidth();
  let yPosition = 20;

  // Logo y Header
  doc.setFillColor(102, 126, 234);
  doc.rect(0, 0, pageWidth, 30, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('SPA SENTIRSE BIEN', pageWidth / 2, 15, { align: 'center' });
  doc.setFontSize(12);
  doc.text('Comprobante de Pago', pageWidth / 2, 23, { align: 'center' });

  // Información de la transacción
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  yPosition = 45;

  // Datos del cliente
  doc.setFont('helvetica', 'bold');
  doc.text('DATOS DEL CLIENTE:', 20, yPosition);
  doc.setFont('helvetica', 'normal');
  yPosition += 7;
  doc.text(`Nombre: ${userData.nombre} ${userData.apellido}`, 20, yPosition);
  yPosition += 5;
  doc.text(`Email: ${userData.email}`, 20, yPosition);
  yPosition += 5;
  doc.text(`DNI: ${userData.dni}`, 20, yPosition);

  // Datos de la transacción
  doc.setFont('helvetica', 'bold');
  doc.text('DATOS DE LA TRANSACCIÓN:', 110, 45);
  doc.setFont('helvetica', 'normal');
  let yPosRight = 52;
  doc.text(`N° Transacción: ${paymentData.transactionId}`, 110, yPosRight);
  yPosRight += 5;
  doc.text(`Fecha: ${new Date().toLocaleString()}`, 110, yPosRight);
  yPosRight += 5;
  doc.text(`Método: ${getPaymentMethodName(paymentData.method)}`, 110, yPosRight);
  yPosRight += 5;
  doc.text(`Estado: COMPLETADO`, 110, yPosRight);

  // Tabla de productos (manual sin autotable)
  yPosition = 80;
  
  // Encabezado de la tabla
  doc.setFillColor(102, 126, 234);
  doc.rect(20, yPosition, pageWidth - 40, 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.text('Producto', 25, yPosition + 5);
  doc.text('Cantidad', 120, yPosition + 5);
  doc.text('Precio Unit.', 150, yPosition + 5);
  doc.text('Subtotal', 180, yPosition + 5);

  // Filas de productos
  yPosition += 12;
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');

  items.forEach((item, index) => {
    const producto = item.producto;
    const precioConDescuento = producto.descuento > 0 
      ? producto.precio * (1 - producto.descuento / 100)
      : producto.precio;
    
    const subtotal = precioConDescuento * item.cantidad;

    // Línea separadora
    if (index > 0) {
      doc.setDrawColor(200, 200, 200);
      doc.line(20, yPosition - 2, pageWidth - 20, yPosition - 2);
    }

    doc.text(producto.nombre.substring(0, 30), 25, yPosition);
    doc.text(item.cantidad.toString(), 120, yPosition);
    doc.text(`$${precioConDescuento.toFixed(2)}`, 150, yPosition);
    doc.text(`$${subtotal.toFixed(2)}`, 180, yPosition);
    
    yPosition += 8;
  });

  // ✅ CALCULAR TOTALES REALES
  const subtotalSinDescuentos = items.reduce((sum, item) => 
    sum + (item.producto.precio * item.cantidad), 0
  );
  
  const subtotalConDescuentoProducto = items.reduce((sum, item) => {
    const precioBase = item.producto.precio;
    const descuentoProducto = item.producto.descuento || 0;
    const precioConDescuento = descuentoProducto > 0 
      ? precioBase * (1 - descuentoProducto / 100)
      : precioBase;
    return sum + (precioConDescuento * item.cantidad);
  }, 0);
  
  const descuentoProductos = subtotalSinDescuentos - subtotalConDescuentoProducto;
  const iva = subtotalConDescuentoProducto * 0.21;
  const totalAntesEfectivo = subtotalConDescuentoProducto + iva;
  const descuentoEfectivo = paymentData.method === 'cash' ? totalAntesEfectivo * 0.10 : 0;
  const totalFinal = totalAntesEfectivo - descuentoEfectivo;

  // Mostrar breakdown de precios
  yPosition += 15;
  
  doc.setFont('helvetica', 'normal');
  doc.text('Subtotal (sin descuentos):', 120, yPosition);
  doc.text(`$${subtotalSinDescuentos.toFixed(2)}`, 180, yPosition);
  yPosition += 6;

  if (descuentoProductos > 0) {
    doc.text('Descuento productos:', 120, yPosition);
    doc.text(`-$${descuentoProductos.toFixed(2)}`, 180, yPosition);
    yPosition += 6;
  }

  doc.text('Subtotal con descuentos:', 120, yPosition);
  doc.text(`$${subtotalConDescuentoProducto.toFixed(2)}`, 180, yPosition);
  yPosition += 6;

  doc.text('IVA (21%):', 120, yPosition);
  doc.text(`$${iva.toFixed(2)}`, 180, yPosition);
  yPosition += 6;

  if (paymentData.method === 'cash') {
    doc.text('Descuento efectivo (10%):', 120, yPosition);
    doc.text(`-$${descuentoEfectivo.toFixed(2)}`, 180, yPosition);
    yPosition += 6;
  }

  // Total final
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('TOTAL FINAL:', 120, yPosition + 5);
  doc.text(`$${totalFinal.toFixed(2)}`, 180, yPosition + 5);

  // Pie de página
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text('Gracias por su compra - SPA Sentirse Bien', pageWidth / 2, 280, { align: 'center' });
  doc.text('Este comprobante es válido como factura', pageWidth / 2, 285, { align: 'center' });

  // ✅ GUARDAR EL PDF
  const fileName = `comprobante-${paymentData.transactionId}.pdf`;
  doc.save(fileName);
};

const getPaymentMethodName = (method) => {
  const methods = {
    'credit': 'Tarjeta de Crédito',
    'debit': 'Tarjeta de Débito',
    'cash': 'Efectivo'
  };
  return methods[method] || method;
};