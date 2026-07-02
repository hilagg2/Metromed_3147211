import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../services/authService';
import AdminAlertas from './AdminAlertas';
import { getDashboardStats } from '../services/adminService';
import './Dashboard_admin.css';

const initials = (name = '') => name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

const SIDEBAR_ITEMS = [
    { id: 'dashboard',   icon: 'fa-home',        label: 'Dashboard',                  path: null },
    { id: 'usuarios',    icon: 'fa-users',        label: 'Gestión de Usuarios',        path: '/admin/usuarios' },
    { id: 'reportes',    icon: 'fa-flag',         label: 'Gestión de Reportes',        path: '/admin/reportes' },
    { id: 'alertas',     icon: 'fa-bell',         label: 'Historial de Notificaciones', path: null },
    { id: 'juegos',      icon: 'fa-gamepad',      label: 'Gestión de Juegos',          path: '/admin/juegos' },
    { id: 'auditoria',   icon: 'fa-shield-alt',   label: 'Auditorías',                 path: '/admin/auditoria' },
];

// ─── Componente de tarjeta de estadística ─────────────────────────────────────
const StatCard = ({ icon, color, value, label, trend }) => (
    <div className="stat-card">
        <div className={`stat-icon-wrap ${color}`}>
            <i className={`fas ${icon}`} />
        </div>
        <div>
            <div className="stat-num">{value ?? '—'}</div>
            <div className="stat-lbl">{label}</div>
            {trend && <div className="stat-trend">{trend}</div>}
        </div>
    </div>
);

const Dashboard_admin = () => {
    const navigate     = useNavigate();
    const adminUser    = JSON.parse(localStorage.getItem('user') || '{}');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('dashboard');
    const [stats, setStats]   = useState(null);
    const [loadingStats, setLoadingStats] = useState(true);

    const handleLogout = () => { logout(); navigate('/login'); };

    const handleNav = (item) => {
        setSidebarOpen(false);
        if (item.path) {
            navigate(item.path);
        } else {
            setActiveSection(item.id);
        }
    };

    // Cargar estadísticas del dashboard
    useEffect(() => {
        if (adminUser.rol !== 2 && adminUser.rol !== '2') {
            navigate('/Dashboard');
            return;
        }

        if (activeSection !== 'dashboard') return;
        setLoadingStats(true);
        getDashboardStats()
            .then(res => { if (res.success) setStats(res.data); })
            .catch(console.error)
            .finally(() => setLoadingStats(false));
    }, [activeSection, adminUser.rol, navigate]);

    return (
        <div className="admin-page">

            {/* ── Sidebar ─────────────────────────────────────── */}
            <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-brand">
                    <div className="brand-logo">
                        <div className="brand-icon">M</div>
                        <span className="brand-name">MetroMed</span>
                    </div>
                    <div className="brand-role">
                        <i className="fas fa-shield-alt" /> Panel Administrador
                    </div>
                </div>

                <nav className="sidebar-nav">
                    <div className="nav-section-label">Principal</div>
                    {SIDEBAR_ITEMS.map(item => (
                        <div
                            key={item.id}
                            className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
                            onClick={() => handleNav(item)}
                        >
                            <i className={`fas ${item.icon} nav-icon`} />
                            {item.label}
                        </div>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <button className="logout-btn" onClick={handleLogout}>
                        <i className="fas fa-sign-out-alt nav-icon" />
                        Cerrar sesión
                    </button>
                </div>
            </aside>

            {/* ── Header ──────────────────────────────────────── */}
            <header className="admin-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button
                        className="mobile-menu-btn"
                        style={{ background: 'none', border: 'none', color: 'var(--text-light)', fontSize: '1.1rem', cursor: 'pointer' }}
                        onClick={() => setSidebarOpen(o => !o)}
                    >
                        <i className="fas fa-bars" />
                    </button>
                    <div className="header-left">
                        <div className="header-title">
                            {SIDEBAR_ITEMS.find(i => i.id === activeSection)?.label || 'Panel Administrador'}
                        </div>
                        <div className="header-breadcrumb">
                            <span>Admin</span>
                            <span className="breadcrumb-sep">›</span>
                            <span style={{ color: 'var(--primary)' }}>
                                {SIDEBAR_ITEMS.find(i => i.id === activeSection)?.label || 'Inicio'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="header-right">
                    <div className="notif-btn">
                        <i className="fas fa-bell" />
                        <div className="notif-dot" />
                    </div>
                    <div className="admin-avatar" title={adminUser.nombre}>
                        {initials(adminUser.nombre || 'AD')}
                    </div>
                </div>
            </header>

            {/* ── Main ────────────────────────────────────────────── */}
            <main className="admin-main">

                {/* ── Dashboard ─────────────────────────────── */}
                {activeSection === 'dashboard' && (
                    <div>
                        <div className="section-header">
                            <div className="section-title-wrap">
                                <h1 className="section-title">
                                    <i className="fas fa-chart-line" /> Resumen General
                                </h1>
                                <p className="section-subtitle">Estado actual del sistema MetroMed</p>
                            </div>
                        </div>

                        {loadingStats ? (
                            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-light)' }}>
                                <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem', marginBottom: '1rem', display: 'block' }} />
                                Cargando estadísticas...
                            </div>
                        ) : (
                            <>
                                <div className="stats-row">
                                    <StatCard icon="fa-users"        color="green"  value={stats?.total_usuarios}       label="Total Usuarios"         trend="Todos los registros" />
                                    <StatCard icon="fa-user-check"   color="green"  value={stats?.usuarios_activos}      label="Usuarios Activos"       trend="✅ Cuentas habilitadas" />
                                    <StatCard icon="fa-user-times"   color="red"    value={stats?.usuarios_inactivos}    label="Usuarios Inactivos"     trend="⛔ Cuentas desactivadas" />
                                    <StatCard icon="fa-flag"         color="yellow" value={stats?.total_reportes}        label="Total Reportes"         />
                                    <StatCard icon="fa-clock"        color="red"    value={stats?.reportes_pendientes}   label="Reportes Pendientes"    trend="⚠️ Requieren atención" />
                                    <StatCard icon="fa-gamepad"      color="purple" value={stats?.juegos_activos}        label="Juegos Activos"         />
                                    <StatCard icon="fa-bell"         color="blue"   value={stats?.notificaciones_totales} label="Notificaciones Enviadas" />
                                </div>

                                {/* Accesos rápidos */}
                                <div className="section-header" style={{ marginTop: '1rem' }}>
                                    <div className="section-title-wrap">
                                        <h2 className="section-title" style={{ fontSize: '1.1rem' }}>
                                            <i className="fas fa-bolt" /> Accesos Rápidos
                                        </h2>
                                    </div>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                                    {[
                                        { label: 'Gestionar Usuarios',      icon: 'fa-users',      path: '/admin/usuarios',   color: 'green' },
                                        { label: 'Ver Reportes',            icon: 'fa-flag',       path: '/admin/reportes',   color: 'yellow' },
                                        { label: 'Enviar Notificación',     icon: 'fa-bell',       section: 'alertas',        color: 'blue' },
                                        { label: 'Configurar Juegos',       icon: 'fa-gamepad',    path: '/admin/juegos',     color: 'purple' },
                                        { label: 'Ver Auditorías',          icon: 'fa-shield-alt', path: '/admin/auditoria',  color: 'red' },
                                    ].map(item => (
                                        <div
                                            key={item.label}
                                            className="card"
                                            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1rem' }}
                                            onClick={() => item.path ? navigate(item.path) : setActiveSection(item.section)}
                                        >
                                            <div className={`stat-icon-wrap ${item.color}`}>
                                                <i className={`fas ${item.icon}`} />
                                            </div>
                                            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.label}</span>
                                            <i className="fas fa-chevron-right" style={{ marginLeft: 'auto', opacity: 0.3 }} />
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                )}

                {/* ── Alertas ───────────────────────────────── */}
                {activeSection === 'alertas' && (
                    <div style={{ padding: '0', background: 'transparent', minHeight: '100%' }}>
                        <AdminAlertas />
                    </div>
                )}

            </main>
        </div>
    );
};

export default Dashboard_admin;