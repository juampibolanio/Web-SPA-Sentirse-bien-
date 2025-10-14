import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getToken, logout, getUsuarioPorToken } from '../auth/auth';
import { useCarrito } from '../services/CarritoContext.jsx';
import styles from '../styles/Header.module.css';
import logo from '../assets/header/logo_spa.png';
import { FiLogIn, FiLogOut, FiHome, FiCalendar, FiHeart, FiMenu, FiX, FiShoppingBag } from 'react-icons/fi';
import { FaUser, FaChartBar, FaSpa } from 'react-icons/fa';

export default function Header() {
  const [usuario, setUsuario] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [carritoAbierto, setCarritoAbierto] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef();
  const navRef = useRef();

  const { items, actualizarCantidad, eliminarDelCarrito } = useCarrito();

  const toggleCarrito = () => setCarritoAbierto(prev => !prev);
  const toggleMenu = () => setMenuVisible(prev => !prev);
  const toggleNav = () => setNavOpen(prev => !prev);

  const handleActualizarCantidad = (itemId, nuevaCantidad) => {
    if (nuevaCantidad < 1) return;
    actualizarCantidad(itemId, nuevaCantidad);
  };

  const handleEliminarItem = (itemId) => {
    if (window.confirm('¿Eliminar este producto del carrito?')) {
      eliminarDelCarrito(itemId);
    }
  };

  const handleVerCarrito = () => {
    navigate('/carrito');
    setCarritoAbierto(false);
  };

  useEffect(() => {
    const fetchUser = async () => {
      const token = getToken();
      if (token) {
        try {
          const userData = await getUsuarioPorToken(token);
          setUsuario(userData);
        } catch {
          setUsuario(null);
        }
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) setMenuVisible(false);
      if (navRef.current && !navRef.current.contains(event.target)) setNavOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setUsuario(null);
    setMenuVisible(false);
    setNavOpen(false);
    navigate('/login');
    window.location.reload();
  };

  const renderMenuOptions = () => {
    if (!usuario) return null;
    if (usuario.rol === 'CLIENTE' || usuario.rol === 'PROFESIONAL') {
      return <Link to="/home" className={styles.dropdownItem} onClick={() => setMenuVisible(false)}><FaUser /> Mi Perfil</Link>;
    }
    if (usuario.rol === 'DRA_FELICIDAD') {
      return (
        <>
          <Link to="/home" className={styles.dropdownItem} onClick={() => setMenuVisible(false)}><FaSpa /> Gestión del spa</Link>
          <Link to="/dra/reportes" className={styles.dropdownItem} onClick={() => setMenuVisible(false)}><FaChartBar /> Reportes</Link>
        </>
      );
    }
    return null;
  };

  return (
    <header className={styles.header}>
      <div className={styles.navbar} ref={navRef}>
        {/* Logo */}
        <Link to="/" className={styles.logo}>
          <img src={logo} alt="Logo Sentirse Bien" />
          <span>Sentirse Bien</span>
        </Link>

        {/* Menú enlaces */}
        <nav className={`${styles.navLinks} ${navOpen ? styles.open : ''}`}>
          <Link to="/" onClick={() => setNavOpen(false)}><FiHome /> Inicio</Link>
          <Link to="/servicios-public" onClick={() => setNavOpen(false)}><FiHeart /> Servicios</Link>
          <Link to="/turnos" onClick={() => setNavOpen(false)}><FiCalendar /> Turnos</Link>
          <Link to="/productos" onClick={() => setNavOpen(false)}><FiShoppingBag /> Productos</Link>
        </nav>

        {/* Panel usuario y carrito */}
        <div className={styles.userPanel} ref={menuRef}>
          <button className={styles.btnCarrito} onClick={toggleCarrito}><FiShoppingBag /> Carrito ({items.length})</button>

          {!usuario ? (
            <Link to="/login" className={styles.loginButton}><FiLogIn /> Iniciar Sesión</Link>
          ) : (
            <>
              <button className={styles.userButton} onClick={toggleMenu}>
                <FaUser /> Hola, {usuario.nombre} ▼
              </button>
              {menuVisible && (
                <div className={styles.dropdown}>
                  {renderMenuOptions()}
                  <button onClick={handleLogout} className={styles.dropdownItem}><FiLogOut /> Cerrar Sesión</button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Botón hamburguesa */}
        <button className={styles.hamburger} onClick={toggleNav}>
          {navOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Carrito sidebar */}
      <div className={`${styles.carrito} ${carritoAbierto ? styles.abierto : ''}`}>
  <h3>Carrito</h3>
  {items.length === 0 ? (
    <p>Tu carrito está vacío</p>
  ) : (
    <div className={styles.listaCarrito}>
      {items.map(item => (
        <div key={item.id} className={styles.itemCarrito}>
          <img
            src={item.producto.imagen || '/assets/default-product.jpg'}
            alt={item.producto.nombre}
            onError={(e) => { e.target.src = '/assets/default-product.jpg'; }}
          />
          <div className={styles.infoItem}>
            <div className={styles.nombreProducto}>{item.producto.nombre}</div>
            <div className={styles.precio}>${item.producto.precio}</div>
            <div className={styles.cantidadControls}>
              <button onClick={() => handleActualizarCantidad(item.id, item.cantidad - 1)} disabled={item.cantidad <= 1}>-</button>
              <span>{item.cantidad}</span>
              <button onClick={() => handleActualizarCantidad(item.id, item.cantidad + 1)} disabled={item.cantidad >= item.producto.stock}>+</button>
              <button onClick={() => handleEliminarItem(item.id)} className={styles.btnEliminarCarrito}>🗑️</button>
            </div>
          </div>
        </div>
      ))}

      {/* Resumen total */}
      <div className={styles.resumenTotal}>
        <strong>Total: </strong>${items.reduce((acc, item) => acc + item.cantidad * item.producto.precio, 0)}
      </div>

      <button onClick={handleVerCarrito} className={styles.btnVerCarrito}>Ver Carrito</button>
    </div>
  )}
  <button onClick={toggleCarrito} className={styles.closeCarrito}>Cerrar</button>
</div>

{/* Overlay oscuro para cerrar el carrito al hacer click afuera */}
{carritoAbierto && <div className={styles.overlay} onClick={toggleCarrito}></div>}
    </header>
  );
}
