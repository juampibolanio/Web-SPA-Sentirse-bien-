import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../styles/AdminDashboard.module.css";
import { FiPackage, FiEdit, FiSave, FiX, FiTrash2, FiAlertTriangle } from "react-icons/fi";

const AdminDashboard = () => {
  const [seccion, setSeccion] = useState("stock");
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [editandoStock, setEditandoStock] = useState(null);
  const [nuevoStock, setNuevoStock] = useState("");

  const token = localStorage.getItem('token');

  const cargarProductos = async () => {
    try {
      setCargando(true);
      const response = await axios.get('http://localhost:8080/api/productos', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProductos(response.data);
      setCargando(false);
    } catch (error) {
      console.error('Error al cargar productos:', error);
      setCargando(false);
    }
  };

  useEffect(() => {
    if (seccion === "stock") {
      cargarProductos();
    }
  }, [seccion]);

  const actualizarStock = async (productoId) => {
    if (!nuevoStock || nuevoStock < 0) {
      alert("El stock debe ser un número positivo");
      return;
    }

    try {
      await axios.put(`http://localhost:8080/api/productos/${productoId}/stock`, null, {
        params: { nuevoStock: parseInt(nuevoStock) },
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setEditandoStock(null);
      setNuevoStock("");
      cargarProductos();
    } catch (error) {
      console.error('Error al actualizar stock:', error);
      alert("Error al actualizar el stock");
    }
  };

  const iniciarEdicionStock = (producto) => {
    setEditandoStock(producto.id);
    setNuevoStock(producto.stock.toString());
  };

  const cancelarEdicion = () => {
    setEditandoStock(null);
    setNuevoStock("");
  };

  const getStockStatus = (stock) => {
    if (stock === 0) return { class: styles.stockAgotado, text: "Agotado", icon: "❌" };
    if (stock <= 5) return { class: styles.stockBajo, text: "Stock bajo", icon: "⚠️" };
    if (stock <= 15) return { class: styles.stockMedio, text: "Stock medio", icon: "📦" };
    return { class: styles.stockAlto, text: "Stock alto", icon: "✅" };
  };

  return (
    <div className={styles.dashboard}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <div className={styles.logo}>
            <FiPackage className={styles.logoIcon} />
            <span>Panel Admin</span>
          </div>
        </div>
        <nav className={styles.sidebarNav}>
          <div className={styles.navGroup}>
            <div className={styles.navLabel}>GESTIÓN</div>
            <button 
              className={`${styles.navItem} ${seccion === "stock" ? styles.active : ""}`}
              onClick={() => setSeccion("stock")}
            >
              <FiPackage className={styles.navIcon} />
              <span>Gestión de Stock</span>
            </button>
            <button 
              className={`${styles.navItem} ${seccion === "descuentos" ? styles.active : ""}`}
              onClick={() => setSeccion("descuentos")}
            >
              <div className={styles.navIcon}>🎯</div>
              <span>Descuentos</span>
            </button>
            <button 
              className={`${styles.navItem} ${seccion === "reportes" ? styles.active : ""}`}
              onClick={() => setSeccion("reportes")}
            >
              <div className={styles.navIcon}>📊</div>
              <span>Reportes</span>
            </button>
          </div>
        </nav>
      </aside>

      <div className={styles.main}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <h1 className={styles.pageTitle}>Gestión de Stock</h1>
            <p className={styles.pageSubtitle}>Administra el inventario de productos</p>
          </div>
          <div className={styles.headerActions}>
            <button className={styles.primaryButton} onClick={cargarProductos}>
              🔄 Actualizar
            </button>
          </div>
        </header>

        <div className={styles.content}>
          {/* Stats Grid */}
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>📦</div>
              <div className={styles.statContent}>
                <div className={styles.statNumber}>{productos.length}</div>
                <div className={styles.statLabel}>Total Productos</div>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>⚠️</div>
              <div className={styles.statContent}>
                <div className={styles.statNumber}>
                  {productos.filter(p => p.stock <= 5).length}
                </div>
                <div className={styles.statLabel}>Stock Bajo</div>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>❌</div>
              <div className={styles.statContent}>
                <div className={styles.statNumber}>
                  {productos.filter(p => p.stock === 0).length}
                </div>
                <div className={styles.statLabel}>Agotados</div>
              </div>
            </div>
          </div>

          {cargando ? (
            <div className={styles.loadingState}>
              <div className={styles.spinner}></div>
              <p>Cargando productos...</p>
            </div>
          ) : (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Inventario de Productos</h2>
                <div className={styles.productsCount}>
                  <span className={styles.countNumber}>{productos.length}</span>
                  <span className={styles.countLabel}>productos</span>
                </div>
              </div>

              <div className={styles.tableContainer}>
                <table className={styles.dataTable}>
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Stock</th>
                      <th>Estado</th>
                      <th>Precio</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productos.map((producto) => {
                      const stockStatus = getStockStatus(producto.stock);
                      return (
                        <tr key={producto.id}>
                          <td className={styles.cellMain}>
                            <div className={styles.productInfo}>
                              <div className={styles.productName}>{producto.nombre}</div>
                              <div className={styles.productCategory}>
                                {producto.categoria?.nombre || "Sin categoría"}
                              </div>
                            </div>
                          </td>
                          <td>
                            {editandoStock === producto.id ? (
                              <div className={styles.stockEdit}>
                                <input
                                  type="number"
                                  value={nuevoStock}
                                  onChange={(e) => setNuevoStock(e.target.value)}
                                  min="0"
                                  className={styles.stockInput}
                                  autoFocus
                                />
                                <span className={styles.stockLabel}>unidades</span>
                              </div>
                            ) : (
                              <div className={styles.stockDisplay}>
                                <span className={styles.stockNumber}>{producto.stock}</span>
                                <span className={styles.stockLabel}>unidades</span>
                              </div>
                            )}
                          </td>
                          <td>
                            <div className={`${styles.stockStatus} ${stockStatus.class}`}>
                              <span className={styles.statusIcon}>{stockStatus.icon}</span>
                              <span className={styles.statusText}>{stockStatus.text}</span>
                            </div>
                          </td>
                          <td className={styles.priceCell}>${producto.precio}</td>
                          <td>
                            <div className={styles.tableActions}>
                              {editandoStock === producto.id ? (
                                <>
                                  <button 
                                    className={styles.iconButtonSuccess}
                                    onClick={() => actualizarStock(producto.id)}
                                    title="Guardar"
                                  >
                                    <FiSave />
                                  </button>
                                  <button 
                                    className={styles.iconButtonDanger}
                                    onClick={cancelarEdicion}
                                    title="Cancelar"
                                  >
                                    <FiX />
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button 
                                    className={styles.iconButtonPrimary}
                                    onClick={() => iniciarEdicionStock(producto)}
                                    title="Editar stock"
                                  >
                                    <FiEdit />
                                  </button>
                                  <button 
                                    className={styles.iconButtonDanger}
                                    onClick={() => {/* función eliminar */}}
                                    title="Eliminar producto"
                                  >
                                    <FiTrash2 />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {productos.length === 0 && (
                <div className={styles.emptyState}>
                  <div className={styles.emptyIcon}>📦</div>
                  <h3>No hay productos</h3>
                  <p>No se encontraron productos en el sistema</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;