import React, { useState, useEffect } from 'react';
import styles from '../styles/DraFacturacion.module.css';
import { FaSearch, FaSync, FaExclamationTriangle, FaMoneyBillWave, FaBox, FaFilter } from 'react-icons/fa';
import axios from 'axios';

export default function DraFacturacion() {
    // Estados para gestión de stock
    const [productosStock, setProductosStock] = useState([]);
    const [cargandoStock, setCargandoStock] = useState(false);
    const [filtrosStock, setFiltrosStock] = useState({
        categoriaId: '',
        nombre: '',
        stockMin: '',
        stockMax: ''
    });
    const [productosStockBajo, setProductosStockBajo] = useState([]);

    // Estados para facturación y reportes
    const [reporteFlujoCaja, setReporteFlujoCaja] = useState(null);
    const [fechasReporte, setFechasReporte] = useState({
        desde: new Date().toISOString().split('T')[0],
        hasta: new Date().toISOString().split('T')[0]
    });
    const [cargandoReporte, setCargandoReporte] = useState(false);

    // Cargar datos al montar el componente
    useEffect(() => {
        cargarStock();
        cargarStockBajo();
        generarReporteFlujoCaja();
    }, []);

    // Funciones para gestión de stock
    const cargarStock = async () => {
        try {
            setCargandoStock(true);
            const token = localStorage.getItem('token');

            const params = new URLSearchParams();
            if (filtrosStock.categoriaId) params.append('categoriaId', filtrosStock.categoriaId);
            if (filtrosStock.nombre) params.append('nombre', filtrosStock.nombre);
            if (filtrosStock.stockMin) params.append('stockMin', filtrosStock.stockMin);
            if (filtrosStock.stockMax) params.append('stockMax', filtrosStock.stockMax);

            const response = await axios.get(
                `http://localhost:8080/api/productos/stock/consulta?${params}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setProductosStock(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Error al cargar stock:', error);
            setProductosStock([]);
        } finally {
            setCargandoStock(false);
        }
    };

    const cargarStockBajo = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                'http://localhost:8080/api/productos/stock/bajo?limite=10',
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            setProductosStockBajo(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Error al cargar stock bajo:', error);
            setProductosStockBajo([]);
        }
    };

    const actualizarStock = async (productoId, nuevoStock) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(
                `http://localhost:8080/api/productos/${productoId}/stock?nuevoStock=${nuevoStock}`,
                null,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            await cargarStock();
            await cargarStockBajo();
        } catch (error) {
            console.error('Error al actualizar stock:', error);
            alert('Error al actualizar el stock');
        }
    };

    // Funciones para facturación y reportes
    const generarReporteFlujoCaja = async () => {
        try {
            setCargandoReporte(true);
            const token = localStorage.getItem('token');

            const response = await axios.get(
                `http://localhost:8080/api/facturas/flujo-caja?desde=${fechasReporte.desde}T00:00:00&hasta=${fechasReporte.hasta}T23:59:59`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setReporteFlujoCaja(response.data);
        } catch (error) {
            console.error('Error al generar reporte:', error);
            setReporteFlujoCaja(null);
        } finally {
            setCargandoReporte(false);
        }
    };

    const limpiarFiltrosStock = () => {
        setFiltrosStock({
            categoriaId: '',
            nombre: '',
            stockMin: '',
            stockMax: ''
        });
    };

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <div className={styles.headerContent}>
                    <h1 className={styles.title}>Facturación & Control de Stock</h1>
                    <p className={styles.subtitle}>
                        Gestión de flujo de caja y control de existencias
                    </p>
                </div>
            </div>

            {/* Sección de Alertas de Stock Bajo */}
            {productosStockBajo.length > 0 && (
                <div className={styles.alertSection}>
                    <div className={styles.alertHeader}>
                        <FaExclamationTriangle className={styles.alertIcon} />
                        <h3>Productos con Stock Bajo</h3>
                    </div>
                    <div className={styles.alertGrid}>
                        {productosStockBajo.map(producto => (
                            <div key={producto.id} className={styles.alertItem}>
                                <span className={styles.alertProduct}>{producto.nombre}</span>
                                <span className={styles.alertStock}>Stock: {producto.stock} unidades</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className={styles.contentGrid}>
                {/* Panel de Control de Stock */}
                <div className={styles.panel}>
                    <div className={styles.panelHeader}>
                        <h2>
                            <FaBox className={styles.panelIcon} />
                            Control de Stock
                        </h2>
                        <div className={styles.panelActions}>
                            <button className={styles.refreshButton} onClick={cargarStock}>
                                <FaSync /> Actualizar
                            </button>
                        </div>
                    </div>

                    {/* Filtros de Stock */}
                    <div className={styles.filterSection}>
                        <div className={styles.filterHeader}>
                            <FaFilter className={styles.filterIcon} />
                            <h3>Filtrar Existencias</h3>
                        </div>
                        <div className={styles.filterGrid}>
                            <div className={styles.filterGroup}>
                                <label>Nombre del Producto</label>
                                <input
                                    type="text"
                                    placeholder="Buscar por nombre..."
                                    value={filtrosStock.nombre}
                                    onChange={(e) => setFiltrosStock(prev => ({
                                        ...prev,
                                        nombre: e.target.value
                                    }))}
                                />
                            </div>
                            <div className={styles.filterGroup}>
                                <label>Stock Mínimo</label>
                                <input
                                    type="number"
                                    placeholder="0"
                                    value={filtrosStock.stockMin}
                                    onChange={(e) => setFiltrosStock(prev => ({
                                        ...prev,
                                        stockMin: e.target.value
                                    }))}
                                />
                            </div>
                            <div className={styles.filterGroup}>
                                <label>Stock Máximo</label>
                                <input
                                    type="number"
                                    placeholder="999"
                                    value={filtrosStock.stockMax}
                                    onChange={(e) => setFiltrosStock(prev => ({
                                        ...prev,
                                        stockMax: e.target.value
                                    }))}
                                />
                            </div>
                            <div className={styles.filterActions}>
                                <button 
                                    className={styles.searchButton}
                                    onClick={cargarStock}
                                >
                                    <FaSearch /> Buscar
                                </button>
                                <button 
                                    className={styles.clearButton}
                                    onClick={limpiarFiltrosStock}
                                >
                                    Limpiar
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Tabla de Stock */}
                    <div className={styles.tableSection}>
                        {cargandoStock ? (
                            <div className={styles.loading}>
                                <div className={styles.spinner}></div>
                                Cargando stock...
                            </div>
                        ) : (
                            <div className={styles.tableContainer}>
                                <table className={styles.dataTable}>
                                    <thead>
                                        <tr>
                                            <th>Producto</th>
                                            <th>Categoría</th>
                                            <th>Stock Actual</th>
                                            <th>Precio</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {productosStock.map(producto => (
                                            <tr key={producto.id}>
                                                <td className={styles.cellMain}>
                                                    <div className={styles.productInfo}>
                                                        <strong>{producto.nombre}</strong>
                                                        <span className={styles.productDesc}>
                                                            {producto.descripcion}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td>{producto.categoriaNombre || 'Sin categoría'}</td>
                                                <td>
                                                    <span className={`
                                                        ${styles.stockBadge} 
                                                        ${producto.stock <= 5 ? styles.stockLow : ''}
                                                        ${producto.stock === 0 ? styles.stockOut : ''}
                                                    `}>
                                                        {producto.stock} unidades
                                                    </span>
                                                </td>
                                                <td>${producto.precio}</td>
                                                <td>
                                                    <div className={styles.stockActions}>
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            defaultValue={producto.stock}
                                                            className={styles.stockInput}
                                                            onBlur={(e) => actualizarStock(producto.id, parseInt(e.target.value))}
                                                        />
                                                        <button 
                                                            className={styles.updateButton}
                                                            onClick={(e) => {
                                                                const input = e.target.previousSibling;
                                                                actualizarStock(producto.id, parseInt(input.value));
                                                            }}
                                                        >
                                                            Actualizar
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {productosStock.length === 0 && (
                                    <div className={styles.emptyState}>
                                        <p>No se encontraron productos con los filtros aplicados</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Panel de Flujo de Caja */}
                <div className={styles.panel}>
                    <div className={styles.panelHeader}>
                        <h2>
                            <FaMoneyBillWave className={styles.panelIcon} />
                            Flujo de Caja
                        </h2>
                        <div className={styles.panelActions}>
                            <div className={styles.dateRange}>
                                <input
                                    type="date"
                                    value={fechasReporte.desde}
                                    onChange={(e) => setFechasReporte(prev => ({
                                        ...prev,
                                        desde: e.target.value
                                    }))}
                                />
                                <span>a</span>
                                <input
                                    type="date"
                                    value={fechasReporte.hasta}
                                    onChange={(e) => setFechasReporte(prev => ({
                                        ...prev,
                                        hasta: e.target.value
                                    }))}
                                />
                            </div>
                            <button 
                                className={styles.primaryButton}
                                onClick={generarReporteFlujoCaja}
                                disabled={cargandoReporte}
                            >
                                {cargandoReporte ? 'Generando...' : 'Generar Reporte'}
                            </button>
                        </div>
                    </div>

                    {cargandoReporte ? (
                        <div className={styles.loading}>
                            <div className={styles.spinner}></div>
                            Generando reporte de flujo de caja...
                        </div>
                    ) : reporteFlujoCaja ? (
                        <div className={styles.reportSection}>
                            {/* Resumen General */}
                            <div className={styles.summaryGrid}>
                                <div className={styles.summaryCard}>
                                    <h3>Total General</h3>
                                    <div className={styles.summaryAmount}>
                                        ${reporteFlujoCaja.totalGeneral?.toFixed(2) || '0.00'}
                                    </div>
                                </div>
                                <div className={styles.summaryCard}>
                                    <h3>Efectivo</h3>
                                    <div className={styles.summaryAmount}>
                                        ${reporteFlujoCaja.totalEfectivo?.toFixed(2) || '0.00'}
                                    </div>
                                </div>
                                <div className={styles.summaryCard}>
                                    <h3>Tarjeta Débito</h3>
                                    <div className={styles.summaryAmount}>
                                        ${reporteFlujoCaja.totalDebito?.toFixed(2) || '0.00'}
                                    </div>
                                </div>
                                <div className={styles.summaryCard}>
                                    <h3>Tarjeta Crédito</h3>
                                    <div className={styles.summaryAmount}>
                                        ${reporteFlujoCaja.totalCredito?.toFixed(2) || '0.00'}
                                    </div>
                                </div>
                            </div>

                            {/* Detalle por Categoría */}
                            {reporteFlujoCaja.detallePorCategoria && reporteFlujoCaja.detallePorCategoria.length > 0 && (
                                <div className={styles.detailSection}>
                                    <h3>Ventas por Categoría</h3>
                                    <div className={styles.categoriesGrid}>
                                        {reporteFlujoCaja.detallePorCategoria.map((categoria, index) => (
                                            <div key={index} className={styles.categoryCard}>
                                                <h4>{categoria.categoriaNombre}</h4>
                                                <div className={styles.categoryTotal}>
                                                    ${categoria.subtotalCategoria?.toFixed(2) || '0.00'}
                                                </div>
                                                <div className={styles.categoryProducts}>
                                                    {categoria.productos && categoria.productos.slice(0, 3).map((producto, pIndex) => (
                                                        <div key={pIndex} className={styles.productItem}>
                                                            <span className={styles.productName}>{producto.productoNombre}</span>
                                                            <span className={styles.productSubtotal}>${producto.subtotal?.toFixed(2)}</span>
                                                        </div>
                                                    ))}
                                                    {categoria.productos && categoria.productos.length > 3 && (
                                                        <div className={styles.moreProducts}>
                                                            +{categoria.productos.length - 3} más productos
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className={styles.emptyState}>
                            <p>Selecciona un rango de fechas y genera el reporte de flujo de caja</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}