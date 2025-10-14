import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../styles/AdminProductos.module.css";

export default function AdminDashboard() {
  const [editandoStock, setEditandoStock] = useState(null);
  const [nuevoStock, setNuevoStock] = useState("");
  const [seccion, setSeccion] = useState("productos");
  const [productos, setProductos] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [formType, setFormType] = useState("");
  const [cargando, setCargando] = useState(false);
  const [form, setForm] = useState({
    id: null,
    nombre: "",
    descripcion: "",
    precio: "",
    stock: "",
    categoria_id: "",
    proveedor_id: "",
    oferta: false,
    descuento: "",
    imagen: null,
    preview: null,
    contacto: "",
    direccion: "",
  });


  const token = localStorage.getItem('token');
  const API_URLS = {
    productos: "http://localhost:8080/api/productos",
    proveedores: "http://localhost:8080/api/proveedores",
    categorias: "http://localhost:8080/api/categorias"
  };

  // Configurar axios con el token por defecto
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, [token]);

  // Cargar todos los datos
  const fetchData = async () => {
    try {
      setCargando(true);
      const [productosRes, proveedoresRes, categoriasRes] = await Promise.all([
        axios.get(API_URLS.productos),
        axios.get(API_URLS.proveedores + "/todos"),
        axios.get(API_URLS.categorias)
      ]);
      setProductos(productosRes.data);
      setProveedores(proveedoresRes.data);
      setCategorias(categoriasRes.data);
      setCargando(false);
    } catch (err) {
      console.error("Error al cargar datos:", err);
      setCargando(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value, files, type, checked } = e.target;
    if (files) {
      setForm({
        ...form,
        imagen: files[0],
        preview: URL.createObjectURL(files[0]),
      });
    } else if (type === "checkbox") {
      setForm({ ...form, [name]: checked });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const resetForm = () => {
    setForm({
      id: null,
      nombre: "",
      descripcion: "",
      precio: "",
      categoria_id: "",
      proveedor_id: "",
      oferta: false,
      descuento: "",
      imagen: null,
      preview: null,
      contacto: "",
      direccion: "",
    });
  };

  const handleCreate = (type) => {
    resetForm();
    setFormType(type);
    setFormVisible(true);
  };

  const handleEdit = (item, type) => {
    if (type === "producto") {
      setForm({
        id: item.id,
        nombre: item.nombre,
        descripcion: item.descripcion,
        precio: item.precio,
        stock: item.stock || 0,
        categoria_id: item.categoria_id || (item.categoria && item.categoria.id) || "",
        proveedor_id: item.proveedor_id || (item.proveedor && item.proveedor.id) || "",
        oferta: item.oferta || false,
        descuento: item.descuento || "",
        imagen: null,
        preview: item.imagenUrl || item.imagen || null,
        contacto: "",
        direccion: "",
      });
    } else if (type === "proveedor") {
      setForm({
        id: item.id,
        nombre: item.nombre,
        contacto: item.contacto,
        direccion: item.direccion,
        descripcion: "",
        precio: "",
        categoria_id: "",
        proveedor_id: "",
        oferta: false,
        descuento: "",
        imagen: null,
        preview: null,
      });
    } else if (type === "categoria") {
      setForm({
        id: item.id,
        nombre: item.nombre,
        descripcion: "",
        precio: "",
        categoria_id: "",
        proveedor_id: "",
        oferta: false,
        descuento: "",
        imagen: null,
        preview: null,
        contacto: "",
        direccion: "",
      });
    }
    setFormType(type);
    setFormVisible(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validaciones básicas
    if (!form.nombre.trim()) {
      alert("El nombre es obligatorio");
      return;
    }

    if (formType === "producto") {
      if (!form.precio || parseFloat(form.precio) <= 0) {
        alert("El precio debe ser mayor a 0");
        return;
      }
      if (!form.descripcion.trim()) {
        alert("La descripción es obligatoria");
        return;
      }
    }

    if (formType === "proveedor") {
      if (!form.contacto.trim()) {
        alert("El contacto es obligatorio");
        return;
      }
    }

    try {
      if (formType === "producto") {
        const formData = new FormData();
        const productoData = {
          nombre: form.nombre.trim(),
          descripcion: form.descripcion.trim(),
          precio: parseFloat(form.precio),
          stock: parseInt(form.stock) || 0,
          categoria_id: form.categoria_id || null,
          proveedor_id: form.proveedor_id || null,
          oferta: form.oferta,
          descuento: form.descuento ? parseFloat(form.descuento) : null,
        };

        if (form.id) productoData.id = form.id;

        formData.append("producto", new Blob([JSON.stringify(productoData)], { type: "application/json" }));
        if (form.imagen) formData.append("imagen", form.imagen);

        const config = {
          headers: { 
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${token}`
          },
        };

        if (form.id) {
          await axios.put(`${API_URLS.productos}/${form.id}`, formData, config);
        } else {
          await axios.post(API_URLS.productos, formData, config);
        }
      } 
      else if (formType === "proveedor") {
        const proveedorData = {
          nombre: form.nombre.trim(),
          contacto: form.contacto.trim(),
          direccion: form.direccion.trim(),
        };

        if (form.id) {
          await axios.put(`${API_URLS.proveedores}/${form.id}/actualizar`, proveedorData);
        } else {
          await axios.post(`${API_URLS.proveedores}/registrar`, proveedorData);
        }
      }
      else if (formType === "categoria") {
        const categoriaData = {
          nombre: form.nombre.trim(),
        };

        if (form.id) {
          await axios.put(`${API_URLS.categorias}/${form.id}`, categoriaData);
        } else {
          await axios.post(API_URLS.categorias, categoriaData);
        }
      }

      resetForm();
      setFormVisible(false);
      fetchData();
    } catch (err) {
      console.error("Error al guardar:", err);
      alert("Error al guardar los datos");
    }
  };

  const handleDelete = async (id, type) => {
    if (!window.confirm(`¿Estás seguro de que quieres eliminar este ${type}?`)) return;

    try {
      if (type === "producto") {
        await axios.delete(`${API_URLS.productos}/${id}`);
      } else if (type === "proveedor") {
        await axios.delete(`${API_URLS.proveedores}/${id}`);
      } else if (type === "categoria") {
        await axios.delete(`${API_URLS.categorias}/${id}`);
      }
      fetchData();
    } catch (err) {
      console.error("Error al eliminar:", err);
      alert("Error al eliminar");
    }
  };

  // ✅ REEMPLAZAR la función actualizarStock en AdminDashboard.jsx
const actualizarStock = async (productoId) => {
  if (!nuevoStock || nuevoStock < 0) {
    alert("El stock debe ser un número positivo");
    return;
  }

  try {
    // ✅ Usar el endpoint ESPECÍFICO de stock (no el completo)
    await axios.put(`http://localhost:8080/api/productos/${productoId}/stock`, null, {
      params: { nuevoStock: parseInt(nuevoStock) },
      headers: { Authorization: `Bearer ${token}` }
    });
    
    alert("Stock actualizado correctamente");
    setEditandoStock(null);
    setNuevoStock("");
    fetchData();
  } catch (error) {
    console.error('Error al actualizar stock:', error);
    alert("Error al actualizar el stock");
  }
};

// Iniciar edición de stock
const iniciarEdicionStock = (producto) => {
  setEditandoStock(producto.id);
  setNuevoStock(producto.stock.toString());
};

// Cancelar edición
const cancelarEdicionStock = () => {
  setEditandoStock(null);
  setNuevoStock("");
};

// Helper para estado de stock
const getStockStatus = (stock) => {
  if (stock === 0) return { class: "stockAgotado", text: "Agotado", icon: "❌" };
  if (stock <= 5) return { class: "stockBajo", text: "Stock bajo", icon: "⚠️" };
  if (stock <= 15) return { class: "stockMedio", text: "Stock medio", icon: "📦" };
  return { class: "stockAlto", text: "Stock alto", icon: "✅" };
};

  // Helper functions
  const obtenerNombreCategoria = (producto) => {
    const categoriaId = producto.categoria_id || (producto.categoria && producto.categoria.id);
    const categoria = categorias.find(c => c.id === categoriaId);
    return categoria ? categoria.nombre : "Sin categoría";
  };

  const obtenerNombreProveedor = (producto) => {
    const proveedorId = producto.proveedor_id || (producto.proveedor && producto.proveedor.id);
    const proveedor = proveedores.find(p => p.id === proveedorId);
    return proveedor ? proveedor.nombre : "Sin proveedor";
  };

  // Estadísticas
  const totalProductos = productos.length;
  const productosOferta = productos.filter(p => p.oferta).length;
  const totalProveedores = proveedores.length;
  const totalCategorias = categorias.length;

  return (
    <div className={styles.dashboard}>
      {/* Sidebar Minimalista */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <div className={styles.logo}>
            <div className={styles.logoIcon}></div>
            <span>Admin</span>
          </div>
        </div>
        
        <nav className={styles.sidebarNav}>
          <div className={styles.navGroup}>
            <div className={styles.navLabel}>GESTIÓN</div>
            <button 
              className={`${styles.navItem} ${seccion === "productos" ? styles.active : ""}`}
              onClick={() => setSeccion("productos")}
            >
              <div className={styles.navIcon}></div>
              <span>Productos</span>
            </button>
            <button 
              className={`${styles.navItem} ${seccion === "proveedores" ? styles.active : ""}`}
              onClick={() => setSeccion("proveedores")}
            >
              <div className={styles.navIcon}></div>
              <span>Proveedores</span>
            </button>
            <button 
              className={`${styles.navItem} ${seccion === "categorias" ? styles.active : ""}`}
              onClick={() => setSeccion("categorias")}
            >
              <div className={styles.navIcon}></div>
              <span>Categorías</span>
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <div className={styles.main}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <h1 className={styles.pageTitle}>
              {seccion === "productos" && "Gestión de Productos"}
              {seccion === "proveedores" && "Gestión de Proveedores"}
              {seccion === "categorias" && "Gestión de Categorías"}
            </h1>
            <p className={styles.pageSubtitle}>
              {seccion === "productos" && "Administra tu catálogo de productos"}
              {seccion === "proveedores" && "Gestiona los proveedores del sistema"}
              {seccion === "categorias" && "Organiza las categorías de productos"}
            </p>
          </div>
          
          <div className={styles.headerActions}>
            <button 
              className={styles.primaryButton}
              onClick={() => handleCreate(seccion)}
            >
              <span className={styles.buttonIcon}>+</span>
              Nuevo {seccion === "productos" ? "Producto" : seccion === "proveedores" ? "Proveedor" : "Categoría"}
            </button>
          </div>
        </header>

        {/* Content */}
        <div className={styles.content}>
          {/* Stats Grid */}
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}></div>
              <div className={styles.statContent}>
                <div className={styles.statNumber}>{totalProductos}</div>
                <div className={styles.statLabel}>Total Productos</div>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}></div>
              <div className={styles.statContent}>
                <div className={styles.statNumber}>{productosOferta}</div>
                <div className={styles.statLabel}>En Oferta</div>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}></div>
              <div className={styles.statContent}>
                <div className={styles.statNumber}>{totalProveedores}</div>
                <div className={styles.statLabel}>Proveedores</div>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}></div>
              <div className={styles.statContent}>
                <div className={styles.statNumber}>{totalCategorias}</div>
                <div className={styles.statLabel}>Categorías</div>
              </div>
            </div>
          </div>

          {cargando ? (
            <div className={styles.loadingState}>
              <div className={styles.spinner}></div>
              <p>Cargando datos...</p>
            </div>
          ) : (
            <>
              {seccion === "productos" && (
  <div className={styles.section}>
    <div className={styles.sectionHeader}>
      <h2 className={styles.sectionTitle}>Todos los Productos</h2>
      <div className={styles.productsCount}>
        <span className={styles.countNumber}>{productos.length}</span>
        <span className={styles.countLabel}>productos</span>
      </div>
    </div>

    <div className={styles.productsGrid}>
      {productos.map((producto) => {
        const stockStatus = getStockStatus(producto.stock);
        return (
          <div key={producto.id} className={styles.productCard}>
            <div className={styles.productImage}>
              {producto.imagenUrl || producto.imagen ? (
                <img 
                  src={producto.imagenUrl || producto.imagen} 
                  alt={producto.nombre}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div 
                className={styles.imagePlaceholder}
                style={{ display: !producto.imagenUrl && !producto.imagen ? 'flex' : 'none' }}
              >
                <div className={styles.placeholderIcon}></div>
              </div>
              {producto.oferta && <div className={styles.offerBadge}>OFERTA</div>}
              
              {/* ✅ NUEVO: Badge de estado de stock */}
              <div className={`${styles.stockBadge} ${styles[stockStatus.class]}`}>
                {stockStatus.icon} {stockStatus.text}
              </div>
            </div>

            <div className={styles.productInfo}>
              <h3 className={styles.productName}>{producto.nombre}</h3>
              <p className={styles.productDescription}>{producto.descripcion}</p>
              
              <div className={styles.productMeta}>
                <div className={styles.priceSection}>
                  <span className={styles.price}>${producto.precio}</span>
                  {producto.descuento && (
                    <span className={styles.discount}>{producto.descuento}% OFF</span>
                  )}
                </div>
                
                {/* ✅ NUEVO: Información de stock */}
                <div className={styles.stockSection}>
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
                      <span className={styles.stockLabel}>unidades en stock</span>
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.productDetails}>
                <span className={styles.detailItem}>{obtenerNombreCategoria(producto)}</span>
                <span className={styles.detailItem}>{obtenerNombreProveedor(producto)}</span>
              </div>
            </div>

            <div className={styles.productActions}>
              {/* ✅ NUEVO: Botones de stock */}
              {editandoStock === producto.id ? (
                <>
                {/* ✅ AGREGAR ESTOS BOTONES - aquí sí usas actualizarStock */}
      <button 
        className={styles.confirmButton}
        onClick={() => actualizarStock(producto.id)}
      >
        ✅ Confirmar
      </button>
      <button 
        className={styles.cancelButton}
        onClick={cancelarEdicionStock}
      >
        ❌ Cancelar
      </button>
                </>
              ) : (
                <>
                  <button 
                    className={styles.stockButton}
                    onClick={() => iniciarEdicionStock(producto)}
                  >
                    📝 Stock
                  </button>
                  <button 
                    className={styles.editButton}
                    onClick={() => handleEdit(producto, "producto")}
                  >
                    Editar
                  </button>
                  <button 
                    className={styles.deleteButton}
                    onClick={() => handleDelete(producto.id, "producto")}
                  >
                    Eliminar
                  </button>
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>

    {productos.length === 0 && (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}></div>
        <h3>No hay productos</h3>
        <p>Comienza agregando tu primer producto al catálogo</p>
        <button 
          className={styles.primaryButton}
          onClick={() => handleCreate("producto")}
        >
          Agregar Primer Producto
        </button>
      </div>
    )}
  </div>
)}

              {/* Sección Proveedores */}
              {seccion === "proveedores" && (
                <div className={styles.section}>
                  <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Proveedores</h2>
                    <div className={styles.productsCount}>
                      <span className={styles.countNumber}>{proveedores.length}</span>
                      <span className={styles.countLabel}>proveedores</span>
                    </div>
                  </div>

                  <div className={styles.tableContainer}>
                    <table className={styles.dataTable}>
                      <thead>
                        <tr>
                          <th>Nombre</th>
                          <th>Contacto</th>
                          <th>Dirección</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {proveedores.map((proveedor) => (
                          <tr key={proveedor.id}>
                            <td className={styles.cellMain}>{proveedor.nombre}</td>
                            <td>{proveedor.contacto}</td>
                            <td>{proveedor.direccion}</td>
                            <td>
                              <div className={styles.tableActions}>
                                <button 
                                  className={styles.editButton}
                                  onClick={() => handleEdit(proveedor, "proveedor")}
                                >
                                  Editar
                                </button>
                                <button 
                                  className={styles.deleteButton}
                                  onClick={() => handleDelete(proveedor.id, "proveedor")}
                                >
                                  Eliminar
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {proveedores.length === 0 && (
                    <div className={styles.emptyState}>
                      <div className={styles.emptyIcon}></div>
                      <h3>No hay proveedores</h3>
                      <p>Comienza agregando tu primer proveedor</p>
                      <button 
                        className={styles.primaryButton}
                        onClick={() => handleCreate("proveedor")}
                      >
                        Agregar Primer Proveedor
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Sección Categorías */}
              {seccion === "categorias" && (
                <div className={styles.section}>
                  <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Categorías</h2>
                    <div className={styles.productsCount}>
                      <span className={styles.countNumber}>{categorias.length}</span>
                      <span className={styles.countLabel}>categorías</span>
                    </div>
                  </div>

                  <div className={styles.categoriesGrid}>
                    {categorias.map((categoria) => (
                      <div key={categoria.id} className={styles.categoryCard}>
                        <h3 className={styles.categoryName}>{categoria.nombre}</h3>
                        <div className={styles.categoryActions}>
                          <button 
                            className={styles.editButton}
                            onClick={() => handleEdit(categoria, "categoria")}
                          >
                            Editar
                          </button>
                          <button 
                            className={styles.deleteButton}
                            onClick={() => handleDelete(categoria.id, "categoria")}
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {categorias.length === 0 && (
                    <div className={styles.emptyState}>
                      <div className={styles.emptyIcon}></div>
                      <h3>No hay categorías</h3>
                      <p>Comienza agregando tu primera categoría</p>
                      <button 
                        className={styles.primaryButton}
                        onClick={() => handleCreate("categoria")}
                      >
                        Agregar Primera Categoría
                      </button>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modal de Formulario */}
      {formVisible && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>
                {form.id 
                  ? `Editar ${formType === "producto" ? "Producto" : formType === "proveedor" ? "Proveedor" : "Categoría"}` 
                  : `Nuevo ${formType === "producto" ? "Producto" : formType === "proveedor" ? "Proveedor" : "Categoría"}`
                }
              </h2>
              <button 
                className={styles.closeButton}
                onClick={() => setFormVisible(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className={styles.modalForm}>
              {/* Campos comunes */}
              <div className={styles.formGroup}>
                <label>Nombre *</label>
                <input
                  type="text"
                  name="nombre"
                  placeholder={`Ingresa el nombre ${formType === "producto" ? "del producto" : formType === "proveedor" ? "del proveedor" : "de la categoría"}`}
                  value={form.nombre}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Campos específicos de Producto */}
              {formType === "producto" && (
                <>
                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                      <label>Precio *</label>
                      <input
                        type="number"
                        name="precio"
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        value={form.precio}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className={styles.formGroup}>
                <label>Stock *</label>
                <input
                  type="number"
                  name="stock"
                  placeholder="0"
                  min="0"
                  value={form.stock || ""}
                  onChange={handleChange}
                  required
                />
              </div>

                    <div className={styles.formGroup}>
                      <label>Descuento (%)</label>
                      <input
                        type="number"
                        name="descuento"
                        placeholder="0"
                        step="0.01"
                        min="0"
                        max="100"
                        value={form.descuento}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                      <label>Categoría</label>
                      <select
                        name="categoria_id"
                        value={form.categoria_id}
                        onChange={handleChange}
                      >
                        <option value="">Seleccionar categoría</option>
                        {categorias.map(categoria => (
                          <option key={categoria.id} value={categoria.id}>
                            {categoria.nombre}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className={styles.formGroup}>
                      <label>Proveedor</label>
                      <select
                        name="proveedor_id"
                        value={form.proveedor_id}
                        onChange={handleChange}
                      >
                        <option value="">Seleccionar proveedor</option>
                        {proveedores.map(proveedor => (
                          <option key={proveedor.id} value={proveedor.id}>
                            {proveedor.nombre}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label>Descripción *</label>
                    <textarea
                      name="descripcion"
                      placeholder="Describe el producto..."
                      value={form.descripcion}
                      onChange={handleChange}
                      rows="3"
                      required
                    />
                  </div>

                  <div className={styles.formRow}>
                    <label className={styles.checkboxContainer}>
                      <input
                        type="checkbox"
                        name="oferta"
                        checked={form.oferta}
                        onChange={handleChange}
                      />
                      <span className={styles.checkboxLabel}>Producto en oferta</span>
                    </label>
                  </div>

                  <div className={styles.formGroup}>
                    <label>Imagen del Producto</label>
                    <div className={styles.fileUpload}>
                      <input 
                        type="file" 
                        name="imagen" 
                        accept="image/*" 
                        onChange={handleChange} 
                        id="imagen-upload"
                      />
                      <label htmlFor="imagen-upload" className={styles.fileUploadLabel}>
                        Seleccionar archivo
                      </label>
                    </div>
                    {form.preview && (
                      <div className={styles.imagePreview}>
                        <img src={form.preview} alt="Preview" />
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Campos específicos de Proveedor */}
              {formType === "proveedor" && (
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label>Contacto *</label>
                    <input
                      type="text"
                      name="contacto"
                      placeholder="Información de contacto"
                      value={form.contacto}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Dirección</label>
                    <input
                      type="text"
                      name="direccion"
                      placeholder="Dirección del proveedor"
                      value={form.direccion}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              )}

              <div className={styles.modalActions}>
                <button type="submit" className={styles.primaryButton}>
                  {form.id ? "Actualizar" : "Crear"}
                </button>
                <button 
                  type="button" 
                  className={styles.secondaryButton}
                  onClick={() => setFormVisible(false)}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}