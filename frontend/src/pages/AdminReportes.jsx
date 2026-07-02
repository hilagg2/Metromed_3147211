import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../services/authService';
import { getReportes, crearReporte, cambiarEstadoReporte, getAuditoriaReportes } from '../services/reportesService';
import './Dashboard_admin.css';

const initials = (name = '') => name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

const SIDEBAR_ITEMS = [
    { id: 'home',      icon: 'fa-home',        label: 'Inicio',                      path: '/Dashboard_admin' },
    { id: 'usuarios',  icon: 'fa-users',        label: 'Gestión de Usuarios',        path: '/admin/usuarios' },
    { id: 'reportes',  icon: 'fa-flag',         label: 'Gestión de Reportes',        path: null },
    { id: 'alertas',   icon: 'fa-bell',         label: 'Historial de Notificaciones', path: '/Dashboard_admin' },
    { id: 'juegos',    icon: 'fa-gamepad',      label: 'Gestión de Juegos',          path: '/admin/juegos' },
    { id: 'auditoria', icon: 'fa-shield-alt',   label: 'Auditorías',                 path: '/admin/auditoria' },
];

const TIPO_LABELS = {
    problema_tecnico: { label: 'Problema Técnico', icon: 'fa-bug',     color: '#e74c3c', bg: 'rgba(231,76,60,0.12)' },
    sugerencia:       { label: 'Sugerencia',        icon: 'fa-lightbulb', color: '#f39c12', bg: 'rgba(243,156,18,0.12)' },
};

const ESTADO_LABELS = {
    pendiente:  { label: 'Pendiente',  color: '#f39c12', bg: 'rgba(243,156,18,0.12)' },
    validado:   { label: 'Validado',   color: '#00ff88', bg: 'rgba(0,255,136,0.12)' },
    descartado: { label: 'Descartado', color: '#e74c3c', bg: 'rgba(231,76,60,0.12)' },
};

const AdminReportes = () => {
    const navigate  = useNavigate();
    const adminUser = JSON.parse(localStorage.getItem('user') || '{}');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeTab, setActiveTab]     = useState('historial'); // 'historial' | 'auditoria'
    const [toast,     setToast]         = useState(null);

    // ── Historial ──────────────────────────────────────────────────────────────
    const [reportes,  setReportes]  = useState([]);
    const [auditoria, setAuditoria] = useState([]);
    const [loading,   setLoading]   = useState(false);

    // ── Filtros ────────────────────────────────────────────────────────────────
    const [filtroTipo,       setFiltroTipo]       = useState('todos');
    const [filtroEstado,     setFiltroEstado]     = useState('todos');
    const [filtroFechaDesde, setFiltroFechaDesde] = useState('');
    const [filtroFechaHasta, setFiltroFechaHasta] = useState('');


    const handleLogout = () => { logout(); navigate('/login'); };

    const showToast = (msg, ok = true) => {
        setToast({ msg, ok });
        setTimeout(() => setToast(null), 3500);
    };

    // ── Fetch reportes ─────────────────────────────────────────────────────────
    const fetchReportes = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getReportes({
                tipo: filtroTipo, estado: filtroEstado,
                fecha_desde: filtroFechaDesde, fecha_hasta: filtroFechaHasta,
            });
            if (res.success) setReportes(res.data);
        } catch { showToast('Error de red', false); }
        finally { setLoading(false); }
    }, [filtroTipo, filtroEstado, filtroFechaDesde, filtroFechaHasta]);

    useEffect(() => { if (activeTab === 'historial') fetchReportes(); }, [fetchReportes, activeTab]);

    const fetchAuditoria = async () => {
        const res = await getAuditoriaReportes();
        if (res.success) setAuditoria(res.data);
    };

    useEffect(() => { if (activeTab === 'auditoria') fetchAuditoria(); }, [activeTab]);


    // ── Cambiar estado ─────────────────────────────────────────────────────────
    const handleCambiarEstado = async (id, nuevoEstado) => {
        try {
            const res = await cambiarEstadoReporte(id, nuevoEstado);
            if (res.success) { showToast(res.message); fetchReportes(); }
            else              showToast(res.message, false);
        } catch { showToast('Error de red', false); }
    };

    return (
        <div className="admin-page">

            {/* Toast */}
            {toast && (
                <div style={{
                    position: 'fixed', top: '1.5rem', right: '1.5rem', zIndex: 9999,
                    padding: '0.85rem 1.5rem', borderRadius: '10px', fontWeight: 600, fontSize: '0.9rem',
                    background: toast.ok ? 'rgba(0,255,136,0.12)' : 'rgba(231,76,60,0.12)',
                    color: toast.ok ? 'var(--primary)' : 'var(--accent-red)',
                    border: `1px solid ${toast.ok ? 'rgba(0,255,136,0.3)' : 'rgba(231,76,60,0.3)'}`,
                    backdropFilter: 'blur(10px)', boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                    animation: 'slideUp 0.3s ease',
                }}>
                    <i className={`fas ${toast.ok ? 'fa-check-circle' : 'fa-times-circle'}`} style={{ marginRight: '0.5rem' }} />
                    {toast.msg}
                </div>
            )}

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
                            className={`nav-item ${item.id === 'reportes' ? 'active' : ''}`}
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
                        <div className="header-title">Gestión de Reportes</div>
                        <div className="header-breadcrumb">
                            <span>Admin</span><span className="breadcrumb-sep">›</span>
                            <span style={{ color: 'var(--primary)' }}>Reportes</span>
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
                {/* Tabs */}
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                    {[
                        { id: 'historial', label: '📋 Historial de Reportes' },
                        { id: 'auditoria', label: '🔍 Auditoría' },
                    ].map(t => (
                        <button key={t.id} className={`filter-btn ${activeTab === t.id ? 'active' : ''}`} onClick={() => setActiveTab(t.id)}>
                            {t.label}
                        </button>
                    ))}
                </div>

                {/* ── Tab: Historial ──────────────────────────── */}
                {activeTab === 'historial' && (
                    <div className="card">
                        {/* Filtros */}
                        <div className="table-controls" style={{ marginBottom: '1.25rem' }}>
                            <div className="filter-group">
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', alignSelf: 'center' }}>Tipo:</span>
                                {['todos', 'problema_tecnico', 'sugerencia'].map(t => (
                                    <button key={t} className={`filter-btn ${filtroTipo === t ? 'active' : ''}`} onClick={() => setFiltroTipo(t)}>
                                        {t === 'todos' ? 'Todos' : TIPO_LABELS[t]?.label}
                                    </button>
                                ))}
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', alignSelf: 'center', marginLeft: '0.5rem' }}>Estado:</span>
                                {['todos', 'pendiente', 'validado', 'descartado'].map(e => (
                                    <button key={e} className={`filter-btn ${filtroEstado === e ? 'active' : ''}`} onClick={() => setFiltroEstado(e)}>
                                        {e.charAt(0).toUpperCase() + e.slice(1)}
                                    </button>
                                ))}
                            </div>
                            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                <input type="date" value={filtroFechaDesde} onChange={e => setFiltroFechaDesde(e.target.value)}
                                    style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--card-border)', background: 'transparent', color: 'var(--text-light)', fontSize: '0.8rem' }} />
                                <span style={{ color: 'var(--text-light)', fontSize: '0.8rem' }}>→</span>
                                <input type="date" value={filtroFechaHasta} onChange={e => setFiltroFechaHasta(e.target.value)}
                                    style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--card-border)', background: 'transparent', color: 'var(--text-light)', fontSize: '0.8rem' }} />
                                <button className="filter-btn" onClick={fetchReportes}><i className="fas fa-filter" /> Filtrar</button>
                            </div>
                        </div>

                        {/* Tabla */}
                        {loading ? (
                            <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-light)' }}><i className="fas fa-spinner fa-spin" /> Cargando...</p>
                        ) : (
                            <div className="users-table-wrap">
                                <table className="users-table">
                                    <thead>
                                        <tr>{['#', 'Tipo', 'Descripción', 'Estado', 'Creador', 'Fecha', 'Acciones'].map(h => <th key={h}>{h}</th>)}</tr>
                                    </thead>
                                    <tbody>
                                        {reportes.map(r => (
                                            <tr key={r.id_reporte}>
                                                <td style={{ color: 'var(--text-light)' }}>{r.id_reporte}</td>
                                                <td>
                                                    <span style={{ padding: '0.25rem 0.65rem', borderRadius: '50px', fontSize: '0.72rem', fontWeight: 700, background: TIPO_LABELS[r.tipo]?.bg, color: TIPO_LABELS[r.tipo]?.color }}>
                                                        <i className={`fas ${TIPO_LABELS[r.tipo]?.icon}`} style={{ marginRight: '0.3rem' }} />
                                                        {TIPO_LABELS[r.tipo]?.label || r.tipo}
                                                    </span>
                                                </td>
                                                <td style={{ maxWidth: '240px', fontSize: '0.82rem', color: 'var(--text-light)' }}>
                                                    {r.descripcion.length > 90 ? r.descripcion.slice(0, 90) + '…' : r.descripcion}
                                                </td>
                                                <td>
                                                    <span style={{ padding: '0.25rem 0.65rem', borderRadius: '50px', fontSize: '0.72rem', fontWeight: 700, background: ESTADO_LABELS[r.estado]?.bg, color: ESTADO_LABELS[r.estado]?.color }}>
                                                        {ESTADO_LABELS[r.estado]?.label || r.estado}
                                                    </span>
                                                </td>
                                                <td style={{ color: 'var(--text-light)', fontSize: '0.82rem' }}>{r.usuario_creador || '—'}</td>
                                                <td style={{ color: 'var(--text-light)', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>{r.fecha_creacion}</td>
                                                <td>
                                                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                                                        {r.estado !== 'validado' && (
                                                            <button
                                                                title="Validar"
                                                                onClick={() => handleCambiarEstado(r.id_reporte, 'validado')}
                                                                style={{ padding: '0.3rem 0.6rem', borderRadius: '6px', background: 'rgba(0,255,136,0.12)', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}
                                                            >
                                                                <i className="fas fa-check" /> Validar
                                                            </button>
                                                        )}
                                                        {r.estado !== 'descartado' && (
                                                            <button
                                                                title="Descartar"
                                                                onClick={() => handleCambiarEstado(r.id_reporte, 'descartado')}
                                                                style={{ padding: '0.3rem 0.6rem', borderRadius: '6px', background: 'rgba(231,76,60,0.12)', border: 'none', color: 'var(--accent-red)', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}
                                                            >
                                                                <i className="fas fa-times" /> Descartar
                                                            </button>
                                                        )}
                                                        {r.estado !== 'pendiente' && (
                                                            <button
                                                                title="Reabrir"
                                                                onClick={() => handleCambiarEstado(r.id_reporte, 'pendiente')}
                                                                style={{ padding: '0.3rem 0.6rem', borderRadius: '6px', background: 'rgba(243,156,18,0.12)', border: 'none', color: 'var(--accent-yellow)', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}
                                                            >
                                                                <i className="fas fa-redo" /> Reabrir
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        {reportes.length === 0 && !loading && (
                                            <tr><td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-light)' }}>
                                                <i className="fas fa-flag" style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem', opacity: 0.3 }} />
                                                No hay reportes con los filtros seleccionados
                                            </td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}


                {/* ── Tab: Auditoría ──────────────────────────── */}
                {activeTab === 'auditoria' && (
                    <div className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                            <h3 style={{ fontWeight: 700, fontSize: '1rem' }}>
                                <i className="fas fa-history" style={{ color: 'var(--primary)', marginRight: '0.5rem' }} />
                                Historial de Auditoría de Reportes
                            </h3>
                            <button className="filter-btn" onClick={fetchAuditoria}><i className="fas fa-sync-alt" /> Actualizar</button>
                        </div>
                        <div className="users-table-wrap">
                            <table className="users-table">
                                <thead>
                                    <tr>{['#', 'Reporte', 'Tipo', 'Administrador', 'Acción', 'Descripción', 'Fecha'].map(h => <th key={h}>{h}</th>)}</tr>
                                </thead>
                                <tbody>
                                    {auditoria.map(a => (
                                        <tr key={a.id_auditoria}>
                                            <td style={{ color: 'var(--text-light)' }}>{a.id_auditoria}</td>
                                            <td style={{ color: 'var(--secondary)' }}>#{a.id_reporte}</td>
                                            <td>
                                                <span style={{ padding: '0.2rem 0.5rem', borderRadius: '50px', fontSize: '0.7rem', fontWeight: 700, background: TIPO_LABELS[a.tipo_reporte]?.bg, color: TIPO_LABELS[a.tipo_reporte]?.color }}>
                                                    {TIPO_LABELS[a.tipo_reporte]?.label || a.tipo_reporte}
                                                </span>
                                            </td>
                                            <td style={{ color: 'var(--primary)', fontWeight: 600 }}>{a.administrador}</td>
                                            <td>
                                                <span style={{ padding: '0.2rem 0.6rem', borderRadius: '50px', fontSize: '0.72rem', fontWeight: 700, background: 'rgba(52,152,219,0.12)', color: 'var(--secondary)' }}>
                                                    {a.accion}
                                                </span>
                                            </td>
                                            <td style={{ color: 'var(--text-light)', fontSize: '0.8rem', maxWidth: '220px' }}>{a.descripcion}</td>
                                            <td style={{ color: 'var(--text-light)', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>{a.fecha}</td>
                                        </tr>
                                    ))}
                                    {auditoria.length === 0 && (
                                        <tr><td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-light)' }}>Sin registros de auditoría</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminReportes;
