import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, NavLink, Outlet, useLocation } from 'react-router-dom';
import { logout, getProfile } from '../services/authService';
import { getNotificaciones, marcarNotificacionesLeidas } from '../services/congestionService';
import './Dashboard.css';

const Dashboard = () => {
    // Estados
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [profile, setProfile] = useState(null);
    const [notifs, setNotifs] = useState([]);
    const [showNotifDropdown, setShowNotifDropdown] = useState(false);
    const [toastMessage, setToastMessage] = useState(null);
    const lastNotifIdRef = useRef(null);

    const navigate = useNavigate();
    const location = useLocation();

    // Obtener datos del usuario de localStorage como fallback inicial
    const user = JSON.parse(localStorage.getItem('user') || '{"nombre": "Usuario", "correo": "usuario@metromed.com"}');

    const fetchProfile = async () => {
        try {
            const data = await getProfile();
            setProfile(data);
        } catch (err) {
            console.error('Error fetching profile in dashboard:', err);
        }
    };

    const fetchNotifications = async () => {
        try {
            const list = await getNotificaciones();
            setNotifs(list || []);
            
            // Mostrar toast si llega una nueva alerta no leída
            const unread = list.filter(n => !n.leida);
            if (unread.length > 0) {
                const newest = unread[0];
                if (newest.id_notificacion !== lastNotifIdRef.current) {
                    lastNotifIdRef.current = newest.id_notificacion;
                    setToastMessage(newest.mensaje);
                    setTimeout(() => setToastMessage(null), 6000);
                }
            }
        } catch (err) {
            console.error('Error fetching notifications:', err);
        }
    };

    useEffect(() => {
        fetchProfile();
        fetchNotifications();
        // Encuesta de notificaciones cada 15 segundos
        const interval = setInterval(fetchNotifications, 15000);
        return () => clearInterval(interval);
    }, [location.pathname]); // Refrescar cuando navega

    const activeUser = profile || user;
    const coins = parseFloat(activeUser.saldo_metrocoins) || 0;
    const level = Math.max(1, Math.floor(coins / 250) + 1);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Funciones de navegación
    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const closeSidebarMobile = () => {
        if (window.innerWidth <= 768) {
            setSidebarOpen(false);
        }
    };

    // Componente para ítems del sidebar
    const SidebarItem = ({ icon, text, path }) => (
        <div className="nav-item">
            <NavLink
                to={path}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={closeSidebarMobile}
                end={path === '/Dashboard'}
            >
                <i className={icon}></i>
                <span>{text}</span>
            </NavLink>
        </div>
    );

    // Datos simulados de líneas de metro para interactividad
    const metroLines = [
        { name: 'Línea A', status: 'Normal', color: '#00ff88', icon: 'fa-subway' },
        { name: 'Línea B', status: 'Normal', color: '#00ff88', icon: 'fa-subway' },
        { name: 'Tranvía', status: 'Congestión Media', color: '#ffbb00', icon: 'fa-train' },
        { name: 'Metrocable K', status: 'Mantenimiento', color: '#ff3333', icon: 'fa-tram' },
    ];

    const isDashboardHome = location.pathname === '/Dashboard' || location.pathname === '/Dashboard/';

    return (
        <div className="dashboard-page">
            {/* Botón móvil para menú */}
            <button className="mobile-menu-toggle" onClick={toggleSidebar}>
                <i className="fas fa-bars"></i>
            </button>

            {/* Sidebar */}
            <nav className={`sidebar ${sidebarOpen ? 'show' : ''}`}>
                <div className="sidebar-header">
                    <div className="logo" onClick={() => navigate('/Dashboard')} style={{ cursor: 'pointer' }}>
                        <i className="fas fa-subway"></i> MetroMed
                    </div>
                </div>

                <div className="nav-menu">
                    <SidebarItem
                        icon="fas fa-home"
                        text="Inicio"
                        path="/Dashboard"
                    />
                    <SidebarItem
                        icon="fas fa-gamepad"
                        text="Juegos"
                        path="/Dashboard/juegos"
                    />
                    <SidebarItem
                        icon="fas fa-chart-pie"
                        text="Wrapped"
                        path="/Dashboard/wrapped"
                    />
                    <SidebarItem
                        icon="fas fa-traffic-light"
                        text="Congestión"
                        path="/Dashboard/congestion"
                    />
                    <SidebarItem
                        icon="fas fa-user"
                        text="Perfil"
                        path="/Dashboard/perfil"
                    />
                    <SidebarItem
                        icon="fas fa-heart"
                        text="Apoyo Psicológico"
                        path="/Dashboard/apoyo-psicologico"
                    />
                    <SidebarItem
                        icon="fas fa-cog"
                        text="Configuración"
                        path="/Dashboard/configuracion"
                    />
                </div>

                <div className="sidebar-footer">
                    <button className="logout-btn red-logout" onClick={handleLogout}>
                        <i className="fas fa-sign-out-alt"></i> Cerrar sesión
                    </button>
                </div>
            </nav>

            {/* Pop-up Toast de Notificación (RF-23) */}
            {toastMessage && (
                <div style={{
                    position: 'fixed',
                    top: '20px',
                    right: '20px',
                    background: 'rgba(231, 76, 60, 0.95)',
                    border: '1px solid #e74c3c',
                    backdropFilter: 'blur(10px)',
                    color: '#fff',
                    padding: '1rem 1.5rem',
                    borderRadius: '12px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                    zIndex: 9999,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    maxWidth: '350px'
                }}>
                    <i className="fas fa-exclamation-triangle" style={{ fontSize: '1.2rem', color: '#fff' }}></i>
                    <div style={{ flexGrow: 1 }}>
                        <strong style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.2rem' }}>Alerta de Congestión</strong>
                        <span style={{ fontSize: '0.85rem', lineHeight: '1.4' }}>{toastMessage}</span>
                    </div>
                    <button onClick={() => setToastMessage(null)} style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '1.2rem', cursor: 'pointer', padding: '0 0.2rem' }}>&times;</button>
                </div>
            )}

            {/* Header superior */}
            <header className="top-header">
                <div className="welcome-text">
                    <i className="fas fa-subway"></i> Bienvenido al MetroHub
                </div>

                <div className="search-bar-container">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Buscar en MetroMed..."
                    />
                </div>

                <div className="profile-section" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', position: 'relative' }}>
                    {/* Bell Icon for Notifications (RF-23, RF-26) */}
                    <div className="bell-container" style={{ position: 'relative', cursor: 'pointer' }} onClick={() => setShowNotifDropdown(!showNotifDropdown)}>
                        <i className="fas fa-bell" style={{ fontSize: '1.3rem', color: unreadCount > 0 ? '#ffcc00' : 'rgba(255,255,255,0.7)' }}></i>
                        {unreadCount > 0 && (
                            <span className="badge" style={{
                                position: 'absolute',
                                top: '-6px',
                                right: '-6px',
                                background: '#e74c3c',
                                color: '#fff',
                                borderRadius: '50%',
                                width: '16px',
                                height: '16px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.65rem',
                                fontWeight: 'bold'
                            }}>
                                {unreadCount}
                            </span>
                        )}

                        {showNotifDropdown && (
                            <div className="notif-dropdown" style={{
                                position: 'absolute',
                                top: '35px',
                                right: '-60px',
                                background: 'rgba(20,20,30,0.98)',
                                border: '1px solid rgba(255,255,255,0.08)',
                                borderRadius: '12px',
                                width: '320px',
                                maxHeight: '350px',
                                overflowY: 'auto',
                                zIndex: 10000,
                                boxShadow: '0 10px 30px rgba(0,0,0,0.6)',
                                padding: '1rem',
                                cursor: 'default'
                            }} onClick={(e) => e.stopPropagation()}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
                                    <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 'bold' }}>Alertas de Servicio ({unreadCount})</h4>
                                    {unreadCount > 0 && (
                                        <button
                                            onClick={async () => {
                                                await marcarNotificacionesLeidas();
                                                fetchNotifications();
                                            }}
                                            style={{ background: 'transparent', border: 'none', color: '#00ff88', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold' }}
                                        >
                                            Marcar leídas
                                        </button>
                                    )}
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    {notifs.length === 0 ? (
                                        <p style={{ fontSize: '0.8rem', color: '#64748b', textAlign: 'center', padding: '1rem 0' }}>No hay alertas recientes</p>
                                    ) : (
                                        notifs.map(n => (
                                            <div key={n.id_notificacion} style={{
                                                padding: '0.6rem',
                                                borderRadius: '8px',
                                                background: n.leida ? 'transparent' : 'rgba(231,76,60,0.1)',
                                                borderLeft: `3px solid ${n.leida ? 'rgba(255,255,255,0.1)' : '#e74c3c'}`,
                                                fontSize: '0.8rem',
                                                marginBottom: '0.25rem'
                                            }}>
                                                <p style={{ margin: '0 0 0.25rem 0', color: '#e2e8f0', lineHeight: '1.4' }}>{n.mensaje}</p>
                                                <span style={{ fontSize: '0.7rem', color: '#64748b' }}>{new Date(n.fecha).toLocaleTimeString()}</span>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <NavLink to="/Dashboard/perfil" className="profile-pic" style={{ textDecoration: 'none' }}>
                        {activeUser.nombre ? activeUser.nombre[0].toUpperCase() : 'U'}
                    </NavLink>
                </div>
            </header>

            {/* Contenido principal */}
            <main className="main-content">
                {isDashboardHome ? (
                    <div className="dashboard-home-container animate-fadeIn">
                         {/* Banner de Bienvenida */}
                         <div className="welcome-banner-card">
                             <div className="banner-overlay"></div>
                             <div className="banner-content">
                                 <span className="banner-badge">🚇 PLATAFORMA INTEGRAL</span>
                                 <h1>¡Hola, <span className="gradient-text">{activeUser.nombre}</span>! 👋</h1>
                                 <p>Tu nivel actual es <strong>Nivel {level} - MetroExperto</strong>. Sigue acumulando MetroCoins viajando y jugando.</p>
                                 <div className="banner-quick-stats">
                                     <div className="b-stat">
                                         <i className="fas fa-coins text-gold"></i>
                                         <span>{coins.toLocaleString()} MetroCoins</span>
                                     </div>
                                     <div className="b-stat">
                                         <i className="fas fa-fire text-orange"></i>
                                         <span>7 Días de Racha</span>
                                     </div>
                                 </div>
                             </div>
                         </div>

                        {/* Fila de Información del Proyecto */}
                        <div className="project-info-grid">
                            <div className="info-main-card">
                                <h2>¿Qué es <span className="text-primary">MetroMed</span>?</h2>
                                <p>
                                    MetroMed es una plataforma de movilidad inteligente y colaborativa diseñada para el Metro de Medellín.
                                    Combinamos tecnología en tiempo real, gamificación y apoyo psicosocial para transformar la experiencia diaria de viaje de millones de usuarios.
                                </p>
                                <div className="info-pills">
                                    <span className="info-pill"><i className="fas fa-check-circle"></i> Gamificación</span>
                                    <span className="info-pill"><i className="fas fa-check-circle"></i> Tiempo Real</span>
                                    <span className="info-pill"><i className="fas fa-check-circle"></i> Salud Mental</span>
                                    <span className="info-pill"><i className="fas fa-check-circle"></i> Comunidad</span>
                                </div>
                            </div>

                            <div className="status-card-container">
                                <h3><i className="fas fa-info-circle"></i> Estado del Sistema Metro</h3>
                                <div className="line-status-list">
                                    {metroLines.map((line, idx) => (
                                        <div key={idx} className="line-status-item">
                                            <div className="line-name">
                                                <i className={`fas ${line.icon}`} style={{ color: line.color }}></i>
                                                <span>{line.name}</span>
                                            </div>
                                            <span className="status-badge" style={{ backgroundColor: `${line.color}20`, color: line.color }}>
                                                {line.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Misión, Visión y Valores */}
                        <div className="mvv-section">
                            <div className="mvv-card">
                                <div className="mvv-icon"><i className="fas fa-bullseye"></i></div>
                                <h3>Nuestra Misión</h3>
                                <p>Optimizar la experiencia de movilidad urbana mediante la integración de tecnología, incentivos y participación comunitaria activa.</p>
                            </div>
                            <div className="mvv-card">
                                <div className="mvv-icon"><i className="fas fa-eye"></i></div>
                                <h3>Nuestra Visión</h3>
                                <p>Ser el modelo referente de movilidad inteligente y bienestar social en sistemas de transporte de Latinoamérica para 2028.</p>
                            </div>
                            <div className="mvv-card">
                                <div className="mvv-icon"><i className="fas fa-heart"></i></div>
                                <h3>Nuestros Valores</h3>
                                <p>Innovación constante, empatía comunitaria, sostenibilidad ambiental, transparencia y accesibilidad universal.</p>
                            </div>
                        </div>

                        {/* Secciones del Proyecto */}
                        <h2 className="section-title-home">Explora los Servicios</h2>
                        <div className="services-quick-grid">
                            <div className="service-quick-card" onClick={() => navigate('/Dashboard/juegos')}>
                                <div className="sq-icon-container bg-purple">
                                    <i className="fas fa-gamepad"></i>
                                </div>
                                <h3>Zona de Juegos</h3>
                                <p>Juega a MetroTrivia, Ahorcado o Emparejamiento para ganar MetroCoins y premios.</p>
                                <span className="sq-action">Jugar ahora <i className="fas fa-arrow-right"></i></span>
                            </div>

                            <div className="service-quick-card" onClick={() => navigate('/Dashboard/congestion')}>
                                <div className="sq-icon-container bg-green">
                                    <i className="fas fa-traffic-light"></i>
                                </div>
                                <h3>Estado de Congestión</h3>
                                <p>Consulta la ocupación de las estaciones en tiempo real y reporta novedades.</p>
                                <span className="sq-action">Ver mapa <i className="fas fa-arrow-right"></i></span>
                            </div>

                            <div className="service-quick-card" onClick={() => navigate('/Dashboard/apoyo-psicologico')}>
                                <div className="sq-icon-container bg-red">
                                    <i className="fas fa-heart"></i>
                                </div>
                                <h3>Apoyo Psicológico</h3>
                                <p>Recibe orientación psicológica profesional, técnicas de respiración y líneas de ayuda.</p>
                                <span className="sq-action">Obtener apoyo <i className="fas fa-arrow-right"></i></span>
                            </div>

                            <div className="service-quick-card" onClick={() => navigate('/Dashboard/wrapped')}>
                                <div className="sq-icon-container bg-blue">
                                    <i className="fas fa-chart-pie"></i>
                                </div>
                                <h3>Tu Wrapped</h3>
                                <p>Mira las estadísticas de tus viajes de todo el año recopiladas de forma interactiva.</p>
                                <span className="sq-action">Ver estadísticas <i className="fas fa-arrow-right"></i></span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <Outlet />
                )}
            </main>
        </div>
    );
};

export default Dashboard;
