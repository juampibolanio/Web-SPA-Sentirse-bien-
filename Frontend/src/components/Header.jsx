import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getToken, logout, getUsuarioPorToken } from '../auth/auth';
import styles from '../styles/Header.module.css';
import logo from '../assets/header/logo_spa.png';

// Iconos
import { FiLogIn, FiLogOut, FiHome, FiCalendar, FiHeart, FiMenu, FiX } from 'react-icons/fi';
import { FaUser, FaChartBar, FaSpa } from 'react-icons/fa';

export default function Header() {
    const [usuario, setUsuario] = useState(null);
    const [menuVisible, setMenuVisible] = useState(false);
    const [navOpen, setNavOpen] = useState(false); // para menú hamburguesa
    const navigate = useNavigate();
    const menuRef = useRef();
    const navRef = useRef();

    useEffect(() => {
        const fetchUser = async () => {
            const token = getToken();
            if (token) {
                try {
                    const userData = await getUsuarioPorToken(token);
                    setUsuario(userData);
                } catch (error) {
                    setUsuario(null);
                    console.log(error);
                }
            } else {
                setUsuario(null);
            }
        };
        fetchUser();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuVisible(false);
            }
            if (navRef.current && !navRef.current.contains(event.target)) {
                setNavOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        logout();
        setUsuario(null);
        setMenuVisible(false);
        setNavOpen(false);
        navigate('/login');
        window.location.reload();
    };

    const toggleMenu = () => {
        setMenuVisible(prev => !prev);
    };

    const toggleNav = () => {
        setNavOpen(prev => !prev);
    };

    const renderMenuOptions = () => {
        if (!usuario) return null;
        switch (usuario.rol) {
            case 'CLIENTE':
            case 'PROFESIONAL':
                return (
                    <Link to="/home" className={styles.dropdownItem} onClick={() => { setMenuVisible(false); setNavOpen(false); }}>
                        <FaUser className={styles.icon} /> Mi Perfil
                    </Link>
                );
            case 'DRA_FELICIDAD':
                return (
                    <>
                        <Link to="/home" className={styles.dropdownItem} onClick={() => { setMenuVisible(false); setNavOpen(false); }}>
                            <FaSpa className={styles.icon} /> Gestión del spa
                        </Link>
                        <Link to="/dra/reportes" className={styles.dropdownItem} onClick={() => { setMenuVisible(false); setNavOpen(false); }}>
                            <FaChartBar className={styles.icon} /> Reportes
                        </Link>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <header className={styles.header}>
            <nav className={styles.nav} ref={navRef}>
                <div className={styles.logoContainer}>
                    <Link to="/" className={styles.logoLink}>
                        <img src={logo} alt="Logo Sentirse Bien" className={styles.logoImg} />
                        <span className={styles.logoText}>Sentirse Bien</span>
                    </Link>
                </div>

                {/* Botón hamburguesa para móviles */}
                <button
                    className={styles.hamburgerButton}
                    aria-label={navOpen ? "Cerrar menú" : "Abrir menú"}
                    aria-expanded={navOpen}
                    onClick={toggleNav}
                >
                    {navOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                </button>

                {/* Enlaces principales */}
                <div className={`${styles.centerLinks} ${navOpen ? styles.open : ''}`}>
                    <Link to="/" className={styles.link} onClick={() => setNavOpen(false)}>
                        <FiHome className={styles.icon} />
                        Inicio
                    </Link>
                    <Link to="/servicios-public" className={styles.link} onClick={() => setNavOpen(false)}>
                        <FiHeart className={styles.icon} />
                        Servicios
                    </Link>
                    <Link to="/turnos" className={styles.link} onClick={() => setNavOpen(false)}>
                        <FiCalendar className={styles.icon} />
                        Turnos
                    </Link>
                </div>

                {/* Panel usuario/iniciar sesión */}
                <div className={styles.userPanel} ref={menuRef}>
                    {!usuario ? (
                        <Link to="/login" className={styles.loginButton} onClick={() => setNavOpen(false)}>
                            <FiLogIn className={styles.loginIcon} />
                            Iniciar Sesión
                        </Link>
                    ) : (
                        <>
                            <button
                                onClick={toggleMenu}
                                className={styles.userNameButton}
                                aria-haspopup="true"
                                aria-expanded={menuVisible}
                            >
                                <FaUser className={styles.userIcon} /> Hola, {usuario.nombre} ▼
                            </button>
                            {menuVisible && (
                                <div className={styles.dropdownMenu}>
                                    {renderMenuOptions()}
                                    <button
                                        onClick={handleLogout}
                                        className={styles.dropdownItem}
                                        type="button"
                                    >
                                        <FiLogOut className={styles.logoutIcon} />
                                        Cerrar Sesión
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </nav>
        </header>
    );
}