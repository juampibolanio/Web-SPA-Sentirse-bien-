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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setCargando(true);
        const productosRes = await axios.get('http://localhost:8080/api/productos', {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
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

  useEffect(() => {
    let filtrados = [...productos];

    if (filtros.categorias.length > 0) {
      filtrados = filtrados.filter(p => {
        const categoriaId = p.categoria_id || (p.categoria && p.categoria.id);
        return filtros.categorias.includes(categoriaId);
      });
    }

if (filtros.oferta) filtrados = filtrados.filter(p => p.oferta === true);

    if (filtros.rangoPrecio) {
      switch (filtros.rangoPrecio) {
        case '0-50': filtrados = filtrados.filter(p => p.precio <= 50); break;
        case '50-100': filtrados = filtrados.filter(p => p.precio > 50 && p.precio <= 100); break;
        case '100-200': filtrados = filtrados.filter(p => p.precio > 100 && p.precio <= 200); break;
        case '200+': filtrados = filtrados.filter(p => p.precio > 200); break;
      }
    }

    if (filtros.precioMin) filtrados = filtrados.filter(p => p.precio >= parseFloat(filtros.precioMin));
    if (filtros.precioMax) filtrados = filtrados.filter(p => p.precio <= parseFloat(filtros.precioMax));

    filtrados = ordenarProductos(filtrados, orden);
    setProductosFiltrados(filtrados);
  }, [productos, filtros, orden]);

  const ordenarProductos = (lista, criterio) => {
    const res = [...lista];
    switch (criterio) {
      case 'precioAsc': return res.sort((a, b) => a.precio - b.precio);
      case 'precioDesc': return res.sort((a, b) => b.precio - a.precio);
      case 'nombreAsc': return res.sort((a, b) => a.nombre.localeCompare(b.nombre));
      case 'nombreDesc': return res.sort((a, b) => b.nombre.localeCompare(a.nombre));
      case 'fechaDesc': return res.sort((a, b) => new Date(b.fechaLanzamiento || 0) - new Date(a.fechaLanzamiento || 0));
      case 'fechaAsc': return res.sort((a, b) => new Date(a.fechaLanzamiento || 0) - new Date(b.fechaLanzamiento || 0));
      case 'descuentoDesc':
        return res.sort((a, b) => {
          const descA = a.descuento || (a.oferta ? 1 : 0);
          const descB = b.descuento || (b.oferta ? 1 : 0);
          return descB - descA;
        });
      default: return res;
    }
  };

  const handleCategoriaChange = id => setFiltros(prev => ({
    ...prev,
    categorias: prev.categorias.includes(id) ? prev.categorias.filter(c => c !== id) : [...prev.categorias, id]
  }));
  const handleOfertaChange = e => setFiltros(prev => ({ ...prev, oferta: e.target.checked }));
  const handleRangoPrecioChange = r => setFiltros(prev => ({ ...prev, rangoPrecio: prev.rangoPrecio === r ? null : r }));
  const handlePrecioMinChange = e => setFiltros(prev => ({ ...prev, precioMin: e.target.value }));
  const handlePrecioMaxChange = e => setFiltros(prev => ({ ...prev, precioMax: e.target.value }));
  const handleOrdenChange = e => setOrden(e.target.value);
  const limpiarFiltros = () => setFiltros({ categorias: [], oferta: false, rangoPrecio: null, precioMin: '', precioMax: '' });

  const obtenerNombreCategoria = producto => {
    const categoriaId = producto.categoria_id || (producto.categoria && producto.categoria.id);
    const cat = categorias.find(c => c.id === categoriaId);
    return cat ? cat.nombre : '';
  };

  const handleAgregarCarrito = producto => {
    if (!token) { setMostrarModalLogin(true); return; }
    if (producto.stock === 0) { alert('Este producto está agotado'); return; }
    setAgregandoProducto(producto.id);
    try { agregarAlCarrito(producto, 1); } 
    catch (e) { console.error(e); alert('Error al agregar al carrito'); } 
    finally { setTimeout(() => setAgregandoProducto(null), 500); }
  };

  if (cargando) return <p className={styles.cargando}>Cargando productos...</p>;

  return (
    <>
      <div className={styles.productosPage}>
        <div className={styles.filtros}>
          <div className={styles.filtrosHeader}>
            <h3>Filtros</h3>
            <button className={styles.btnLimpiar} onClick={limpiarFiltros}>Limpiar</button>
          </div>

          <div className={styles.filtroGrupo}>
            <div className={styles.filtroHeader} onClick={() => setCategoriaAbierta(!categoriaAbierta)}>
              <h4>Categorías</h4>
              <span className={`${styles.flecha} ${categoriaAbierta ? styles.flechaAbierta : ''}`}>▼</span>
            </div>
            <div className={`${styles.categoriasLista} ${categoriaAbierta ? styles.categoriasAbierta : ''}`}>
              {categorias.map(cat => (
                <div key={cat.id} className={styles.filtroOpcion}>
                  <input type="checkbox" id={`categoria-${cat.id}`} checked={filtros.categorias.includes(cat.id)} onChange={() => handleCategoriaChange(cat.id)} />
                  <label htmlFor={`categoria-${cat.id}`}>{cat.nombre}</label>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.filtroGrupo}>
            <h4>Ofertas</h4>
            <div className={styles.filtroOpcion}>
              <input type="checkbox" id="oferta" checked={filtros.oferta} onChange={handleOfertaChange} />
              <label htmlFor="oferta">En oferta</label>
            </div>
          </div>

          <div className={styles.filtroGrupo}>
            <h4>Rango de Precio</h4>
            {['0-50','50-100','100-200','200+'].map(r => (
              <div key={r} className={styles.filtroOpcion}>
                <input type="radio" name="rangoPrecio" id={`rango-${r}`} checked={filtros.rangoPrecio===r} onChange={()=>handleRangoPrecioChange(r)} />
                <label htmlFor={`rango-${r}`}>${r.replace('-',' - ')}</label>
              </div>
            ))}
          </div>

          <div className={styles.filtroGrupo}>
            <h4>Precio Personalizado</h4>
            <div className={styles.precioPersonalizado}>
              <div className={styles.precioInput}>
                <label htmlFor="precioMin">Mínimo</label>
                <input type="number" id="precioMin" placeholder="$0" value={filtros.precioMin} onChange={handlePrecioMinChange} />
              </div>
              <div className={styles.precioInput}>
                <label htmlFor="precioMax">Máximo</label>
                <input type="number" id="precioMax" placeholder="$999" value={filtros.precioMax} onChange={handlePrecioMaxChange} />
              </div>
            </div>
          </div>
        </div>

        <div className={styles.mainContent}>
          <div className={styles.topBar}>
            <div className={styles.contador}>
              {productosFiltrados.length} {productosFiltrados.length===1?'producto':'productos'}
              {(filtros.categorias.length>0||filtros.oferta||filtros.rangoPrecio||filtros.precioMin||filtros.precioMax)?' (filtrados)':''}
            </div>
            <div className={styles.ordenar}>
              <label htmlFor="ordenar">Ordenar por:</label>
              <select id="ordenar" value={orden} onChange={handleOrdenChange}>
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
            {productosFiltrados.length===0 ? (
              <div className={styles.productosVacios}>
                <h3>No se encontraron productos</h3>
                <p>Intenta ajustar los filtros o limpiarlos para ver más productos.</p>
                <button className={styles.btnLimpiar} onClick={limpiarFiltros}>Limpiar filtros</button>
              </div>
            ) : productosFiltrados.map(prod => {
              const enCarrito = estaEnCarrito(prod.id);
              const cantidad = obtenerCantidadProducto(prod.id);
              const agregando = agregandoProducto === prod.id;

              return (
                <div key={prod.id} className={styles.productoCard}>
                  {prod.oferta && <span className={styles.badge}>Oferta</span>}
                  {enCarrito && <div className={styles.enCarritoBadge}>✅ En carrito ({cantidad})</div>}
                  {prod.stock>0 && prod.stock<=5 && <div className={styles.stockBajoBadge}>⚠️ Últimas {prod.stock} unidades</div>}
                  {prod.stock===0 && <div className={styles.agotadoBadge}>❌ Agotado</div>}

                  <div className={styles.productoImagenContainer}>
                    <Link to={`/producto/${prod.id}`} className={styles.productoLink}>
                      {prod.imagenUrl||prod.imagen ? (
                        <img src={prod.imagenUrl||prod.imagen} alt={prod.nombre} className={styles.productoImagen} />
                      ) : <div className={styles.imagenPlaceholder}>Imagen no disponible</div>}
                    </Link>
                  </div>

                  <div className={styles.productoContenido}>
                    <Link to={`/producto/${prod.id}`} className={styles.productoLink}>
                      <h3 className={styles.productoNombre}>{prod.nombre}</h3>
                    </Link>
                    <p className={styles.productoDescripcion}>{prod.descripcion}</p>
                    <div className={styles.productoPrecioContainer}>
                      <span className={styles.productoPrecio}>${prod.precio}</span>
                      {obtenerNombreCategoria(prod) && <span className={styles.productoCategoria}>{obtenerNombreCategoria(prod)}</span>}
                    </div>
                    <div className={styles.stockInfo}>
                      {prod.stock>0 ? <span className={styles.stockDisponible}>Stock: {prod.stock}</span> : <span className={styles.stockAgotado}>Sin stock</span>}
                    </div>

                    <button
                      className={`${styles.btnAgregar} ${prod.stock===0?styles.btnDeshabilitado: agregando?styles.btnAgregando: enCarrito?styles.btnEnCarrito:''}`}
                      onClick={()=>handleAgregarCarrito(prod)}
                      disabled={prod.stock===0 || agregando}
                    >
                      {agregando ? 'Agregando...' : prod.stock===0 ? 'Agotado' : enCarrito ? `En carrito (${cantidad})` : 'Agregar al carrito'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {mostrarModalLogin && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>Iniciar sesión requerido</h3>
              <button className={styles.closeButton} onClick={()=>setMostrarModalLogin(false)}>×</button>
            </div>
            <div className={styles.modalContent}>
              <p>Para agregar productos al carrito necesitas iniciar sesión.</p>
              <div className={styles.modalActions}>
                <button className={styles.btnCancelar} onClick={()=>setMostrarModalLogin(false)}>Seguir explorando</button>
                <button className={styles.btnLogin} onClick={()=>navigate('/login')}>Iniciar sesión</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
};

export default Productos;
