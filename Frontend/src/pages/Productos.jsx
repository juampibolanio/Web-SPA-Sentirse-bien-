import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getToken } from '../auth/auth';
import { useCarrito } from '../services/CarritoContext.jsx';
import styles from '../styles/Productos.module.css';

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [filtros, setFiltros] = useState({
    categorias: [],
    oferta: false,
    rangoPrecio: null,
    precioMin: '',
    precioMax: ''
  });
  const [orden, setOrden] = useState('precioAsc');
  const [categoriaAbierta, setCategoriaAbierta] = useState(false);
  const [mostrarModalLogin, setMostrarModalLogin] = useState(false);
  const [agregandoProducto, setAgregandoProducto] = useState(null);

  const token = getToken();
  const navigate = useNavigate();
  const { agregarAlCarrito, estaEnCarrito, obtenerCantidadProducto } = useCarrito();

  // Cargar productos y categorías
  useEffect(() => {
    const fetchData = async () => {
      try {
        setCargando(true);
        
        // Cargar productos
        const productosRes = await axios.get('http://localhost:8080/api/productos', {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        
        // Cargar categorías
        const categoriasRes = await axios.get('http://localhost:8080/api/categorias');
        
        setProductos(productosRes.data);
        setProductosFiltrados(productosRes.data);
        setCategorias(categoriasRes.data);
        setCargando(false);
      } catch (err) {
        console.error('Error al obtener los datos:', err);
        setCargando(false);
      }
    };

    fetchData();
  }, [token]);

  // Aplicar filtros
  useEffect(() => {
    let productosFiltrados = [...productos];

    // Filtro por categorías - CORREGIDO
    if (filtros.categorias.length > 0) {
      productosFiltrados = productosFiltrados.filter(producto => {
        // Manejar tanto el caso donde viene categoria_id como categoria object
        const categoriaId = producto.categoria_id || (producto.categoria && producto.categoria.id);
        return filtros.categorias.includes(categoriaId);
      });
    }

    // Filtro por oferta
    if (filtros.oferta) {
      productosFiltrados = productosFiltrados.filter(producto => producto.oferta);
    }

    // Filtro por rango de precio
    if (filtros.rangoPrecio) {
      switch (filtros.rangoPrecio) {
        case '0-50':
          productosFiltrados = productosFiltrados.filter(p => p.precio <= 50);
          break;
        case '50-100':
          productosFiltrados = productosFiltrados.filter(p => p.precio > 50 && p.precio <= 100);
          break;
        case '100-200':
          productosFiltrados = productosFiltrados.filter(p => p.precio > 100 && p.precio <= 200);
          break;
        case '200+':
          productosFiltrados = productosFiltrados.filter(p => p.precio > 200);
          break;
        default:
          break;
      }
    }

    // Filtro por precio mínimo y máximo personalizado
    if (filtros.precioMin) {
      productosFiltrados = productosFiltrados.filter(p => p.precio >= parseFloat(filtros.precioMin));
    }
    if (filtros.precioMax) {
      productosFiltrados = productosFiltrados.filter(p => p.precio <= parseFloat(filtros.precioMax));
    }

    // Aplicar ordenamiento
    productosFiltrados = ordenarProductos(productosFiltrados, orden);

    setProductosFiltrados(productosFiltrados);
  }, [productos, filtros, orden]);

  // Función para ordenar productos
  const ordenarProductos = (productos, criterio) => {
    const productosOrdenados = [...productos];
    
    switch (criterio) {
      case 'precioAsc':
        return productosOrdenados.sort((a, b) => a.precio - b.precio);
      case 'precioDesc':
        return productosOrdenados.sort((a, b) => b.precio - a.precio);
      case 'nombreAsc':
        return productosOrdenados.sort((a, b) => a.nombre.localeCompare(b.nombre));
      case 'nombreDesc':
        return productosOrdenados.sort((a, b) => b.nombre.localeCompare(a.nombre));
      case 'fechaDesc':
        // Usando fechaLanzamiento del DTO
        return productosOrdenados.sort((a, b) => new Date(b.fechaLanzamiento || 0) - new Date(a.fechaLanzamiento || 0));
      case 'fechaAsc':
        return productosOrdenados.sort((a, b) => new Date(a.fechaLanzamiento || 0) - new Date(b.fechaLanzamiento || 0));
      case 'descuentoDesc':
        // Usando descuento del DTO
        return productosOrdenados.sort((a, b) => {
          const descA = a.descuento || (a.oferta ? 1 : 0);
          const descB = b.descuento || (b.oferta ? 1 : 0);
          return descB - descA;
        });
      default:
        return productosOrdenados;
    }
  };

  // Manejar cambios en los filtros
  const handleCategoriaChange = (categoriaId) => {
    setFiltros(prev => ({
      ...prev,
      categorias: prev.categorias.includes(categoriaId)
        ? prev.categorias.filter(id => id !== categoriaId)
        : [...prev.categorias, categoriaId]
    }));
  };

  const handleOfertaChange = (e) => {
    setFiltros(prev => ({
      ...prev,
      oferta: e.target.checked
    }));
  };

  const handleRangoPrecioChange = (rango) => {
    setFiltros(prev => ({
      ...prev,
      rangoPrecio: prev.rangoPrecio === rango ? null : rango
    }));
  };

  const handlePrecioMinChange = (e) => {
    setFiltros(prev => ({
      ...prev,
      precioMin: e.target.value
    }));
  };

  const handlePrecioMaxChange = (e) => {
    setFiltros(prev => ({
      ...prev,
      precioMax: e.target.value
    }));
  };

  const handleOrdenChange = (e) => {
    setOrden(e.target.value);
  };

  // Limpiar todos los filtros
  const limpiarFiltros = () => {
    setFiltros({
      categorias: [],
      oferta: false,
      rangoPrecio: null,
      precioMin: '',
      precioMax: ''
    });
    setOrden('precioAsc');
  };

  // Obtener nombre de categoría para un producto
  const obtenerNombreCategoria = (producto) => {
    const categoriaId = producto.categoria_id || (producto.categoria && producto.categoria.id);
    const categoria = categorias.find(c => c.id === categoriaId);
    return categoria ? categoria.nombre : '';
  };

  // Manejar agregar al carrito
  const handleAgregarCarrito = async (producto) => {
    if (!token) {
      setMostrarModalLogin(true);
      return;
    }

    // Validar stock
    if (producto.stock === 0) {
      alert('Este producto está agotado');
      return;
    }

    setAgregandoProducto(producto.id);
    
    try {
      const result = agregarAlCarrito(producto, 1);
      
      if (result.success) {
        console.log(`✅ ${producto.nombre} agregado al carrito`);
      } else {
        alert(result.error || 'Error al agregar al carrito');
      }
    } catch (error) {
      console.error('Error al agregar al carrito:', error);
      alert('Error al agregar el producto al carrito');
    } finally {
      setTimeout(() => {
        setAgregandoProducto(null);
      }, 1000);
    }
  };

  // Verificar si un producto está en el carrito
  const productoEnCarrito = (productoId) => {
    return estaEnCarrito(productoId);
  };

  // Obtener cantidad en carrito
  const cantidadEnCarrito = (productoId) => {
    return obtenerCantidadProducto(productoId);
  };

  // Manejar login
  const handleLogin = () => {
    navigate('/login');
  };

  // Cerrar modal
  const cerrarModal = () => {
    setMostrarModalLogin(false);
  };

  if (cargando) {
    return <p className={styles.cargando}>Cargando productos...</p>;
  }

  return (
    <>
      <div className={styles.productosPage}>
        {/* Filtros */}
        <div className={styles.filtros}>
          <div className={styles.filtrosHeader}>
            <h3>Filtros</h3>
            <button 
              className={styles.btnLimpiar}
              onClick={limpiarFiltros}
            >
              Limpiar
            </button>
          </div>

          {/* Filtro por Categorías - Ahora desplegable */}
          <div className={styles.filtroGrupo}>
            <div 
              className={styles.filtroHeader}
              onClick={() => setCategoriaAbierta(!categoriaAbierta)}
            >
              <h4>Categorías</h4>
              <span className={`${styles.flecha} ${categoriaAbierta ? styles.flechaAbierta : ''}`}>
                ▼
              </span>
            </div>
            <div className={`${styles.categoriasLista} ${categoriaAbierta ? styles.categoriasAbierta : ''}`}>
              {categorias.map(categoria => (
                <div key={categoria.id} className={styles.filtroOpcion}>
                  <input 
                    type="checkbox" 
                    id={`categoria-${categoria.id}`}
                    checked={filtros.categorias.includes(categoria.id)}
                    onChange={() => handleCategoriaChange(categoria.id)}
                  />
                  <label htmlFor={`categoria-${categoria.id}`}>
                    {categoria.nombre}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Filtro por Oferta */}
          <div className={styles.filtroGrupo}>
            <h4>Ofertas</h4>
            <div className={styles.filtroOpcion}>
              <input 
                type="checkbox" 
                id="oferta"
                checked={filtros.oferta}
                onChange={handleOfertaChange}
              />
              <label htmlFor="oferta">En oferta</label>
            </div>
          </div>

          {/* Filtro por Rango de Precio */}
          <div className={styles.filtroGrupo}>
            <h4>Rango de Precio</h4>
            <div className={styles.filtroOpcion}>
              <input 
                type="radio" 
                name="rangoPrecio"
                id="rango-0-50"
                checked={filtros.rangoPrecio === '0-50'}
                onChange={() => handleRangoPrecioChange('0-50')}
              />
              <label htmlFor="rango-0-50">$0 - $50</label>
            </div>
            <div className={styles.filtroOpcion}>
              <input 
                type="radio" 
                name="rangoPrecio"
                id="rango-50-100"
                checked={filtros.rangoPrecio === '50-100'}
                onChange={() => handleRangoPrecioChange('50-100')}
              />
              <label htmlFor="rango-50-100">$50 - $100</label>
            </div>
            <div className={styles.filtroOpcion}>
              <input 
                type="radio" 
                name="rangoPrecio"
                id="rango-100-200"
                checked={filtros.rangoPrecio === '100-200'}
                onChange={() => handleRangoPrecioChange('100-200')}
              />
              <label htmlFor="rango-100-200">$100 - $200</label>
            </div>
            <div className={styles.filtroOpcion}>
              <input 
                type="radio" 
                name="rangoPrecio"
                id="rango-200-plus"
                checked={filtros.rangoPrecio === '200+'}
                onChange={() => handleRangoPrecioChange('200+')}
              />
              <label htmlFor="rango-200-plus">$200+</label>
            </div>
          </div>

          {/* Filtro por Precio Personalizado */}
          <div className={styles.filtroGrupo}>
            <h4>Precio Personalizado</h4>
            <div className={styles.precioPersonalizado}>
              <div className={styles.precioInput}>
                <label htmlFor="precioMin">Mínimo</label>
                <input 
                  type="number" 
                  id="precioMin"
                  placeholder="$0"
                  value={filtros.precioMin}
                  onChange={handlePrecioMinChange}
                />
              </div>
              <div className={styles.precioInput}>
                <label htmlFor="precioMax">Máximo</label>
                <input 
                  type="number" 
                  id="precioMax"
                  placeholder="$999"
                  value={filtros.precioMax}
                  onChange={handlePrecioMaxChange}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        <div className={styles.mainContent}>
          <div className={styles.topBar}>
            <div className={styles.contador}>
              {productosFiltrados.length} {productosFiltrados.length === 1 ? 'producto' : 'productos'}
              {filtros.categorias.length > 0 || filtros.oferta || filtros.rangoPrecio || filtros.precioMin || filtros.precioMax ? 
                ` (filtrados)` : ''
              }
            </div>
            <div className={styles.ordenar}>
              <label htmlFor="ordenar">Ordenar por:</label>
              <select 
                id="ordenar"
                value={orden}
                onChange={handleOrdenChange}
              >
                <option value="precioAsc">Precio: menor a mayor</option>
                <option value="precioDesc">Precio: mayor a menor</option>
                <option value="nombreAsc">Nombre: A-Z</option>
                <option value="nombreDesc">Nombre: Z-A</option>
                <option value="fechaDesc">Más recientes</option>
                <option value="fechaAsc">Más antiguos</option>
                <option value="descuentoDesc">Mayor descuento</option>
              </select>
            </div>
          </div>

          <div className={styles.productosGrid}>
            {productosFiltrados.length === 0 ? (
              <div className={styles.productosVacios}>
                <h3>No se encontraron productos</h3>
                <p>Intenta ajustar los filtros o limpiarlos para ver más productos.</p>
                <button 
                  className={styles.btnLimpiar}
                  onClick={limpiarFiltros}
                >
                  Limpiar filtros
                </button>
              </div>
            ) : (
              productosFiltrados.map(producto => {
                const enCarrito = productoEnCarrito(producto.id);
                const cantidad = cantidadEnCarrito(producto.id);
                const agregando = agregandoProducto === producto.id;
                
                return (
                  <div key={producto.id} className={styles.productoCard}>
                    {producto.oferta && <span className={styles.badge}>Oferta</span>}
                    
                    {/* Indicador de producto en carrito */}
                    {enCarrito && (
                      <div className={styles.enCarritoBadge}>
                        ✅ En carrito ({cantidad})
                      </div>
                    )}
                    
                    {/* Indicador de stock bajo */}
                    {producto.stock > 0 && producto.stock <= 5 && (
                      <div className={styles.stockBajoBadge}>
                        ⚠️ Últimas {producto.stock} unidades
                      </div>
                    )}
                    
                    {/* Indicador de agotado */}
                    {producto.stock === 0 && (
                      <div className={styles.agotadoBadge}>
                        ❌ Agotado
                      </div>
                    )}

                    <div className={styles.productoImagenContainer}>
                      <Link to={`/producto/${producto.id}`} className={styles.productoLink}>
                        {producto.imagenUrl || producto.imagen ? (
                          <img 
                            src={producto.imagenUrl || producto.imagen} 
                            alt={producto.nombre} 
                            className={styles.productoImagen} 
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div className={styles.imagenPlaceholder} style={{ display: !producto.imagenUrl && !producto.imagen ? 'flex' : 'none' }}>
                          Imagen no disponible
                        </div>
                      </Link>
                    </div>

                    <div className={styles.productoContenido}>
                      <Link to={`/producto/${producto.id}`} className={styles.productoLink}>
                        <h3 className={styles.productoNombre}>{producto.nombre}</h3>
                      </Link>
                      
                      <p className={styles.productoDescripcion}>
                        {producto.descripcion}
                      </p>
                      
                      <div className={styles.productoPrecioContainer}>
                        <span className={styles.productoPrecio}>${producto.precio}</span>
                        {obtenerNombreCategoria(producto) && (
                          <span className={styles.productoCategoria}>
                            {obtenerNombreCategoria(producto)}
                          </span>
                        )}
                      </div>

                      <div className={styles.stockInfo}>
                        {producto.stock > 0 ? (
                          <span className={styles.stockDisponible}>
                            Stock: {producto.stock}
                          </span>
                        ) : (
                          <span className={styles.stockAgotado}>
                            Sin stock
                          </span>
                        )}
                      </div>

                      <button 
                        className={`${styles.btnAgregar} ${
                          producto.stock === 0 ? styles.btnDeshabilitado : 
                          agregando ? styles.btnAgregando : 
                          enCarrito ? styles.btnEnCarrito : ''
                        }`}
                        onClick={() => handleAgregarCarrito(producto)}
                        disabled={producto.stock === 0 || agregando}
                      >
                        {agregando ? 'Agregando...' : 
                         producto.stock === 0 ? 'Agotado' :
                         enCarrito ? `En carrito (${cantidad})` : 
                         'Agregar al carrito'}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Modal de Login */}
      {mostrarModalLogin && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>Iniciar sesión requerido</h3>
              <button className={styles.closeButton} onClick={cerrarModal}>×</button>
            </div>
            <div className={styles.modalContent}>
              <p>Para agregar productos al carrito necesitas iniciar sesión.</p>
              <div className={styles.modalActions}>
                <button className={styles.btnCancelar} onClick={cerrarModal}>
                  Seguir explorando
                </button>
                <button className={styles.btnLogin} onClick={handleLogin}>
                  Iniciar sesión
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Productos;