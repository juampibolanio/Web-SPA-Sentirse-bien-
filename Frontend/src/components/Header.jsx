import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getToken, logout, getUsuarioPorToken } from '../auth/auth';
import styles from '../styles/Header.module.css';
import logo from '../assets/header/logo_spa.png';

// Iconos
import { FiLogIn, FiLogOut, FiHome, FiCalendar, FiHeart } from 'react-icons/fi';
import { FaUser, FaCalendarCheck, FaChartBar, FaSpa } from 'react-icons/fa';

export default function Header() {
    const [usuario, setUsuario] = useState(null);
    const [menuVisible, setMenuVisible] = useState(false);
    const navigate = useNavigate();
    const menuRef = useRef();

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
        navigate('/login');
        window.location.reload();
    };

    const toggleMenu = () => {
        setMenuVisible(prev => !prev);
    };

    const renderMenuOptions = () => {
        if (!usuario) return null;
        switch (usuario.rol) {
            case 'CLIENTE':
                return (
                    <>
                        <Link to="/home" className={styles.dropdownItem}>
                            <FaUser className={styles.icon} /> Mi Perfil
                        </Link>
                        <Link to="/mis-turnos" className={styles.dropdownItem}>
                            <FaCalendarCheck className={styles.icon} /> Mis Turnos
                        </Link>
                    </>
                );
            case 'PROFESIONAL':
                return (
                    <>
                        <Link to="/home" className={styles.dropdownItem}>
                            <FaUser className={styles.icon} /> Mi Perfil
                        </Link>
                        <Link to="/panel-profesional" className={styles.dropdownItem}>
                            <FaCalendarCheck className={styles.icon} /> Mis Turnos
                        </Link>
                    </>
                );
            case 'DRA_FELICIDAD':
                return (
                    <>
                        <Link to="/home" className={styles.dropdownItem}>
                            <FaSpa className={styles.icon} /> Gestión del spa
                        </Link>
                        <Link to="/dra/reportes" className={styles.dropdownItem}>
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
            <nav className={styles.nav}>
                <div className={styles.logoContainer}>
                    <Link to="/" className={styles.logoLink}>
                        <img src={logo} alt="Logo Sentirse Bien" className={styles.logoImg} />
                        <span className={styles.logoText}>Sentirse Bien</span>
                    </Link>
                </div>

                <div className={styles.centerLinks}>
                    <Link to="/" className={styles.link}>
                        <FiHome className={styles.icon} />
                        Inicio
                    </Link>
                    <Link to="/servicios-public" className={styles.link}>
                        <FiHeart className={styles.icon} />
                        Servicios
                    </Link>
                    <Link to="/turnos" className={styles.link}>
                        <FiCalendar className={styles.icon} />
                        Turnos
                    </Link>
                </div>

                <div className={styles.userPanel} ref={menuRef}>
                    {!usuario ? (
                        <Link to="/login" className={styles.loginButton}>
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
