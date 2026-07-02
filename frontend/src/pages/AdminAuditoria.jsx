import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../services/authService';
import { getAuditoriaGeneral } from '../services/adminService';
import './Dashboard_admin.css';

const initials = (name = '') => name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

const SIDEBAR_ITEMS = [
    { id: 'home',      icon: 'fa-home',        label: 'Inicio',                      path: '/Dashboard_admin' },
    { id: 'usuarios',  icon: 'fa-users',        label: 'Gestión de Usuarios',        path: '/admin/usuarios' },
    { id: 'reportes',  icon: 'fa-flag',         label: 'Gestión de Reportes',        path: '/admin/reportes' },
    { id: 'alertas',   icon: 'fa-bell',         label: 'Historial de Notificaciones', path: '/Dashboard_admin' },
    { id: 'juegos',    icon: 'fa-gamepad',      label: 'Gestión de Juegos',          path: '/admin/juegos' },
    { id: 'auditoria', icon: 'fa-shield-alt',   label: 'Auditorías',                 path: null },
];

const MODULO_STYLES = {
    usuarios: { color: '#00b8ff', bg: 'rgba(0,184,255,0.12)', icon: 'fa-users' },
    reportes: { color: '#f39c12', bg: 'rgba(243,156,18,0.12)', icon: 'fa-flag' },
    juegos:   { color: '#9b59b6', bg: 'rgba(155,89,182,0.12)', icon: 'fa-gamepad' },
};

const ACCION_COLORS = {
    CREAR:            { color: '#00ff88', bg: 'rgba(0,255,136,0.12)' },
    EDITAR:           { color: '#00b8ff', bg: 'rgba(0,184,255,0.12)' },
    ACTIVAR:          { color: '#00ff88', bg: 'rgba(0,255,136,0.12)' },
    DESACTIVAR:       { color: '#e74c3c', bg: 'rgba(231,76,60,0.12)' },
    ELIMINAR_LOGICO:  { color: '#e74c3c', bg: 'rgba(231,76,60,0.12)' },
    CAMBIAR_ESTADO:   { color: '#f39c12', bg: 'rgba(243,156,18,0.12)' },
    HABILITAR:        { color: '#00ff88', bg: 'rgba(0,255,136,0.12)' },
    DESHABILITAR:     { color: '#e74c3c', bg: 'rgba(231,76,60,0.12)' },
    CAMBIAR_RECOMPENSA: { color: '#9b59b6', bg: 'rgba(155,89,182,0.12)' },
    ACTUALIZAR:       { color: '#00b8ff', bg: 'rgba(0,184,255,0.12)' },
};

const AdminAuditoria = () => {
    const navigate  = useNavigate();
    const adminUser = JSON.parse(localStorage.getItem('user') || '{}');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [registros,   setRegistros]   = useState([]);
    const [loading,     setLoading]     = useState(true);
    const [filtroModulo, setFiltroModulo] = useState('');

    const handleLogout = () => { logout(); navigate('/login'); };

    const fetchAuditoria = async () => {
        setLoading(true);
        try {
            const res = await getAuditoriaGeneral(filtroModulo);
            if (res.success) setRegistros(res.data);
        } catch { /* silencioso */ }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchAuditoria(); }, [filtroModulo]);

    return (
        <div className="admin-page">

            {/* ── Sidebar ─────────────────────────────────────── */}
            <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-brand">
                    <div className="brand-logo">
                        <div className="brand-icon">M</div>
                        <span className="brand-name">MetroMed</span>
                    </div>
                    <div className="brand-role"><i className="fas fa-shield-alt" /> Panel Administrador</div>
                </div>
                <nav className="sidebar-nav">
                    <div className="nav-section-label">Principal</div>
                    {SIDEBAR_ITEMS.map(item => (
                        <div
                            key={item.id}
                            className={`nav-item ${item.id === 'auditoria' ? 'active' : ''}`}
                            onClick={() => { setSidebarOpen(false); if (item.path) navigate(item.path); }}
                        >
                            <i className={`fas ${item.icon} nav-icon`} />{item.label}
                        </div>
                    ))}
                </nav>
                <div className="sidebar-footer">
                    <button className="logout-btn" onClick={handleLogout}>
                        <i className="fas fa-sign-out-alt nav-icon" /> Cerrar sesión
                    </button>
                </div>
            </aside>

            {/* ── Header ──────────────────────────────────────── */}
            <header className="admin-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button className="mobile-menu-btn" style={{ background: 'none', border: 'none', color: 'var(--text-light)', fontSize: '1.1rem', cursor: 'pointer' }} onClick={() => setSidebarOpen(o => !o)}>
                        <i className="fas fa-bars" />
                    </button>
                    <div className="header-left">
                        <div className="header-title">Registro de Auditorías</div>
                        <div className="header-breadcrumb">
                            <span>Admin</span><span className="breadcrumb-sep">›</span>
                            <span style={{ color: 'var(--primary)' }}>Auditorías</span>
                        </div>
                    </div>
                </div>
                <div className="header-right">
                    <div className="notif-btn"><i className="fas fa-bell" /><div className="notif-dot" /></div>
                    <div className="admin-avatar" title={adminUser.nombre}>{initials(adminUser.nombre || 'AD')}</div>
                </div>
            </header>

            {/* ── Main ────────────────────────────────────────── */}
            <main className="admin-main">

                {/* Encabezado de sección */}
                <div className="section-header">
                    <div className="section-title-wrap">
                        <h1 className="section-title">
                            <i className="fas fa-shield-alt" /> Auditoría del Sistema
                        </h1>
                        <p className="section-subtitle">Registro completo de todas las acciones administrativas</p>
                    </div>
                    <button className="filter-btn" onClick={fetchAuditoria}>
                        <i className="fas fa-sync-alt" /> Actualizar
                    </button>
                </div>

                {/* Contadores rápidos */}
                <div className="stats-row" style={{ marginBottom: '1.5rem' }}>
                    {[
                        { label: 'Total Registros', value: registros.length, icon: 'fa-list', color: 'green' },
                        { label: 'Usuarios',         value: registros.filter(r => r.modulo === 'usuarios').length, icon: 'fa-users', color: 'blue' },
                        { label: 'Reportes',         value: registros.filter(r => r.modulo === 'reportes').length, icon: 'fa-flag', color: 'yellow' },
                        { label: 'Juegos',           value: registros.filter(r => r.modulo === 'juegos').length,   icon: 'fa-gamepad', color: 'purple' },
                    ].map(({ label, value, icon, color }) => (
                        <div key={label} className="stat-card">
                            <div className={`stat-icon-wrap ${color}`}><i className={`fas ${icon}`} /></div>
                            <div>
                                <div className="stat-num">{value}</div>
                                <div className="stat-lbl">{label}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Filtro por módulo */}
                <div className="card">
                    <div className="table-controls" style={{ marginBottom: '1.25rem' }}>
                        <div className="filter-group">
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', alignSelf: 'center' }}>Módulo:</span>
                            {[
                                { value: '',         label: 'Todos' },
                                { value: 'usuarios', label: '👥 Usuarios' },
                                { value: 'reportes', label: '🚩 Reportes' },
                                { value: 'juegos',   label: '🎮 Juegos' },
                            ].map(({ value, label }) => (
                                <button
                                    key={value}
                                    className={`filter-btn ${filtroModulo === value ? 'active' : ''}`}
                                    onClick={() => setFiltroModulo(value)}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>
                            {registros.length} registro{registros.length !== 1 ? 's' : ''}
                        </span>
                    </div>

                    {loading ? (
                        <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-light)' }}>
                            <i className="fas fa-spinner fa-spin" style={{ marginRight: '0.5rem' }} /> Cargando auditorías...
                        </p>
                    ) : (
                        <div className="users-table-wrap">
                            <table className="users-table">
                                <thead>
                                    <tr>
                                        {['#', 'Módulo', 'Administrador', 'Entidad Afectada', 'Acción', 'Descripción', 'Fecha'].map(h => (
                                            <th key={h}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {registros.map((r, idx) => {
                                        const mod     = MODULO_STYLES[r.modulo] || {};
                                        const accion  = ACCION_COLORS[r.accion] || { color: '#fff', bg: 'rgba(255,255,255,0.08)' };
                                        return (
                                            <tr key={`${r.modulo}-${r.id_auditoria}-${idx}`}>
                                                <td style={{ color: 'var(--text-light)', fontSize: '0.8rem' }}>{r.id_auditoria}</td>
                                                <td>
                                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.25rem 0.65rem', borderRadius: '50px', fontSize: '0.72rem', fontWeight: 700, background: mod.bg, color: mod.color }}>
                                                        <i className={`fas ${mod.icon}`} />
                                                        {r.modulo}
                                                    </span>
                                                </td>
                                                <td style={{ color: 'var(--primary)', fontWeight: 600 }}>{r.administrador}</td>
                                                <td style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>{r.entidad_afectada}</td>
                                                <td>
                                                    <span style={{ padding: '0.2rem 0.6rem', borderRadius: '50px', fontSize: '0.72rem', fontWeight: 700, background: accion.bg, color: accion.color }}>
                                                        {r.accion}
                                                    </span>
                                                </td>
                                                <td style={{ color: 'var(--text-light)', fontSize: '0.8rem', maxWidth: '220px' }}>{r.descripcion}</td>
                                                <td style={{ color: 'var(--text-light)', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>{r.fecha}</td>
                                            </tr>
                                        );
                                    })}
                                    {registros.length === 0 && !loading && (
                                        <tr>
                                            <td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-light)' }}>
                                                <i className="fas fa-shield-alt" style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem', opacity: 0.3 }} />
                                                No hay registros de auditoría
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AdminAuditoria;
