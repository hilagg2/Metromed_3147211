import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../services/authService';
import './Dashboard_admin.css';

const initials = (name = '') => name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

const API_BASE = 'http://localhost:5000/api/usuarios';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
};

const SIDEBAR_ITEMS = [
    { id: 'home',      icon: 'fa-home',        label: 'Inicio',                      path: '/Dashboard_admin' },
    { id: 'usuarios',  icon: 'fa-users',        label: 'Gestión de Usuarios',        path: null },
    { id: 'reportes',  icon: 'fa-flag',         label: 'Gestión de Reportes',        path: '/admin/reportes' },
    { id: 'alertas',   icon: 'fa-bell',         label: 'Historial de Notificaciones', path: '/Dashboard_admin' },
    { id: 'juegos',    icon: 'fa-gamepad',      label: 'Gestión de Juegos',          path: '/admin/juegos' },
    { id: 'auditoria', icon: 'fa-shield-alt',   label: 'Auditorías',                 path: '/admin/auditoria' },
];

const Gestion_usuario = () => {
    const navigate   = useNavigate();
    const adminUser  = JSON.parse(localStorage.getItem('user') || '{}');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('lista'); // 'lista' | 'auditoria'

    // ── Estado de la tabla ─────────────────────────────────────────────────────
    const [usuarios,  setUsuarios]  = useState([]);
    const [auditoria, setAuditoria] = useState([]);
    const [loading,   setLoading]   = useState(true);
    const [toast,     setToast]     = useState(null); // { msg, ok }

    // ── Filtros ────────────────────────────────────────────────────────────────
    const [filtroEstado, setFiltroEstado] = useState('todos');
    const [filtroRol,    setFiltroRol]    = useState('todos');
    const [buscar,       setBuscar]       = useState('');

    // ── Modal ──────────────────────────────────────────────────────────────────
    const [showModal, setShowModal] = useState(false);
    const [editUser,  setEditUser]  = useState(null);
    const [form,      setForm]      = useState({ nombre: '', correo: '', rol: 'usuario', password: '' });
    const [saving,    setSaving]    = useState(false);

    const handleLogout = () => { logout(); navigate('/login'); };

    const showToast = (msg, ok = true) => {
        setToast({ msg, ok });
        setTimeout(() => setToast(null), 3500);
    };

    // ── Fetch usuarios ─────────────────────────────────────────────────────────
    const fetchUsuarios = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (filtroEstado !== 'todos') params.append('estado', filtroEstado);
            if (filtroRol    !== 'todos') params.append('rol', filtroRol);
            if (buscar)                   params.append('buscar', buscar);

            const qs = params.toString();
            const res = await fetch(`${API_BASE}${qs ? '?' + qs : ''}`, { headers: getAuthHeaders() });
            const data = await res.json();
            if (data.success) setUsuarios(data.data);
            else showToast(data.message || 'Error al cargar usuarios', false);
        } catch (e) {
            showToast('Error de red al cargar usuarios', false);
        } finally {
            setLoading(false);
        }
    }, [filtroEstado, filtroRol, buscar]);

    useEffect(() => { fetchUsuarios(); }, [fetchUsuarios]);

    // ── Fetch auditoría ────────────────────────────────────────────────────────
    const fetchAuditoria = async () => {
        try {
            const res = await fetch(`${API_BASE}/auditoria`, { headers: getAuthHeaders() });
            const data = await res.json();
            if (data.success) setAuditoria(data.data);
        } catch { /* silencioso */ }
    };

    useEffect(() => {
        if (activeTab === 'auditoria') fetchAuditoria();
    }, [activeTab]);

    // ── Modal helpers ──────────────────────────────────────────────────────────
    const openCreate = () => {
        setEditUser(null);
        setForm({ nombre: '', correo: '', rol: 'usuario', password: '' });
        setShowModal(true);
    };

    const openEdit = (u) => {
        setEditUser(u);
        setForm({ nombre: u.nombre, correo: u.correo, rol: u.rol, password: '' });
        setShowModal(true);
    };

    const handleSave = async () => {
        if (!form.nombre || !form.correo) {
            showToast('Nombre y correo son obligatorios', false);
            return;
        }
        if (!editUser && !form.password) {
            showToast('La contraseña es obligatoria al crear un usuario', false);
            return;
        }

        setSaving(true);
        try {
            const url    = editUser ? `${API_BASE}/${editUser.id}` : API_BASE;
            const method = editUser ? 'PUT' : 'POST';
            const body   = { ...form };
            if (editUser && !body.password) delete body.password;

            const res  = await fetch(url, { method, headers: getAuthHeaders(), body: JSON.stringify(body) });
            const data = await res.json();

            if (!res.ok) throw new Error(data.message || 'Error al guardar');
            showToast(data.message || 'Guardado exitosamente');
            setShowModal(false);
            fetchUsuarios();
        } catch (e) {
            showToast(e.message, false);
        } finally {
            setSaving(false);
        }
    };

    // ── Cambiar estado (activar/desactivar) ────────────────────────────────────
    const handleToggleEstado = async (u) => {
        const nuevoEstado = u.estado === 'activo' ? 'inactivo' : 'activo';
        const accion      = nuevoEstado === 'activo' ? 'activar' : 'desactivar';
        if (!window.confirm(`¿${accion.charAt(0).toUpperCase() + accion.slice(1)} la cuenta de "${u.nombre}"?`)) return;

        try {
            const res  = await fetch(`${API_BASE}/${u.id}/estado`, {
                method:  'PATCH',
                headers: getAuthHeaders(),
                body:    JSON.stringify({ estado: nuevoEstado }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            showToast(data.message);
            fetchUsuarios();
        } catch (e) {
            showToast(e.message, false);
        }
    };

    // ── Cambiar Rol ────────────────────────────────────────────────────────────
    const handleToggleRole = async (u) => {
        const nuevoRol = u.rol === 'administrador' ? 'usuario' : 'administrador';
        if (!window.confirm(`¿Cambiar el rol de "${u.nombre}" a ${nuevoRol.toUpperCase()}?`)) return;

        try {
            const res = await fetch(`${API_BASE}/${u.id}/rol`, {
                method: 'PATCH',
                headers: getAuthHeaders(),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            showToast(data.message);
            fetchUsuarios();
        } catch (e) {
            showToast(e.message, false);
        }
    };

    // ── Eliminación física ─────────────────────────────────────────────────────
    const handleDelete = async (u) => {
        if (!window.confirm(`¿⚠️ ELIMINAR permanentemente la cuenta de "${u.nombre}"?\nEsta acción destruirá todos sus datos y no se puede deshacer.`)) return;
        try {
            const res  = await fetch(`${API_BASE}/${u.id}`, { method: 'DELETE', headers: getAuthHeaders() });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            showToast(data.message);
            fetchUsuarios();
        } catch (e) {
            showToast(e.message, false);
        }
    };

    // ── Avatar colors ──────────────────────────────────────────────────────────
    const avatarColors = ['#00ff88', '#00b8ff', '#9b59b6', '#f39c12', '#e74c3c'];
    const getColor = (id) => avatarColors[id % avatarColors.length];

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
                    <div className="brand-role">
                        <i className="fas fa-shield-alt" /> Panel Administrador
                    </div>
                </div>

                <nav className="sidebar-nav">
                    <div className="nav-section-label">Principal</div>
                    {SIDEBAR_ITEMS.map(item => (
                        <div
                            key={item.id}
                            className={`nav-item ${item.id === 'usuarios' ? 'active' : ''}`}
                            onClick={() => {
                                setSidebarOpen(false);
                                if (item.path) navigate(item.path);
                            }}
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
                        <div className="header-title">Gestión de Usuarios</div>
                        <div className="header-breadcrumb">
                            <span>Admin</span>
                            <span className="breadcrumb-sep">›</span>
                            <span style={{ color: 'var(--primary)' }}>Usuarios</span>
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
                        { id: 'lista',     label: '👥 Usuarios' },
                        { id: 'auditoria', label: '📋 Auditoría' },
                    ].map(t => (
                        <button
                            key={t.id}
                            className={`filter-btn ${activeTab === t.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(t.id)}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>

                {/* ── Tab: Lista de Usuarios ──────────────────── */}
                {activeTab === 'lista' && (
                    <div className="card">
                        {/* Controles */}
                        <div className="table-controls">
                            {/* Búsqueda */}
                            <div className="header-search" style={{ flex: 1, maxWidth: '320px' }}>
                                <i className="fas fa-search" />
                                <input
                                    type="text"
                                    placeholder="Buscar por nombre o correo..."
                                    value={buscar}
                                    onChange={e => setBuscar(e.target.value)}
                                />
                            </div>

                            {/* Filtros */}
                            <div className="filter-group">
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', alignSelf: 'center' }}>Estado:</span>
                                {['todos', 'activo', 'inactivo'].map(e => (
                                    <button key={e} className={`filter-btn ${filtroEstado === e ? 'active' : ''}`} onClick={() => setFiltroEstado(e)}>
                                        {e.charAt(0).toUpperCase() + e.slice(1)}
                                    </button>
                                ))}
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', alignSelf: 'center', marginLeft: '0.5rem' }}>Rol:</span>
                                {['todos', 'usuario', 'administrador'].map(r => (
                                    <button key={r} className={`filter-btn ${filtroRol === r ? 'active' : ''}`} onClick={() => setFiltroRol(r)}>
                                        {r.charAt(0).toUpperCase() + r.slice(1)}
                                    </button>
                                ))}
                            </div>

                            <button className="add-user-btn" onClick={openCreate}>
                                <i className="fas fa-user-plus" /> Nuevo Usuario
                            </button>
                        </div>

                        {/* Tabla */}
                        {loading ? (
                            <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-light)' }}>
                                <i className="fas fa-spinner fa-spin" /> Cargando...
                            </p>
                        ) : (
                            <div className="users-table-wrap" style={{ overflowX: 'auto', maxWidth: '100%', paddingBottom: '10px' }}>
                                <table className="users-table">
                                    <thead>
                                        <tr>
                                            {['Usuario', 'Correo', 'Rol', 'Estado', 'Fecha Creación', 'Acciones'].map(h => (
                                                <th key={h}>{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {usuarios.map(u => (
                                            <tr key={u.id}>
                                                <td>
                                                    <div className="user-cell">
                                                        <div className="user-avatar-sm" style={{ background: getColor(u.id) }}>
                                                            {initials(u.nombre)}
                                                        </div>
                                                        <div>
                                                            <div className="user-name">{u.nombre}</div>
                                                            <div className="user-email">#{u.id}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td style={{ color: 'var(--text-light)' }}>{u.correo}</td>
                                                <td>
                                                    <span className={`role-badge ${u.rol === 'administrador' ? 'admin' : 'user'}`}>
                                                        <i className={`fas ${u.rol === 'administrador' ? 'fa-shield-alt' : 'fa-user'}`} />
                                                        {u.rol}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className={`status-pill ${u.estado === 'activo' ? 'active' : 'inactive'}`}>
                                                        <span className={`status-dot ${u.estado === 'activo' ? 'active' : 'inactive'}`} />
                                                        {u.estado}
                                                    </span>
                                                </td>
                                                <td style={{ color: 'var(--text-light)', fontSize: '0.8rem' }}>
                                                    {u.fecha_creacion || '—'}
                                                </td>
                                                <td>
                                                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'nowrap' }}>
                                                        <button 
                                                            onClick={() => openEdit(u)} 
                                                            style={{ padding: '0.3rem 0.6rem', borderRadius: '6px', background: 'rgba(52,152,219,0.12)', border: 'none', color: 'var(--secondary)', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}
                                                        >
                                                            <i className="fas fa-edit" /> Editar
                                                        </button>
                                                        <button
                                                            onClick={() => handleToggleRole(u)}
                                                            style={{ padding: '0.3rem 0.6rem', borderRadius: '6px', background: 'rgba(155,89,182,0.12)', border: 'none', color: '#9b59b6', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}
                                                        >
                                                            <i className={`fas ${u.rol === 'administrador' ? 'fa-user-minus' : 'fa-user-shield'}`} /> {u.rol === 'administrador' ? 'Hacer Pasajero' : 'Hacer Admin'}
                                                        </button>
                                                        <button
                                                            onClick={() => handleToggleEstado(u)}
                                                            style={{ padding: '0.3rem 0.6rem', borderRadius: '6px', background: u.estado === 'activo' ? 'rgba(243,156,18,0.12)' : 'rgba(0,255,136,0.12)', border: 'none', color: u.estado === 'activo' ? 'var(--accent-yellow)' : 'var(--primary)', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}
                                                        >
                                                            <i className={`fas ${u.estado === 'activo' ? 'fa-toggle-off' : 'fa-toggle-on'}`} /> {u.estado === 'activo' ? 'Desactivar' : 'Activar'}
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDelete(u)} 
                                                            style={{ padding: '0.3rem 0.6rem', borderRadius: '6px', background: 'rgba(231,76,60,0.12)', border: 'none', color: 'var(--accent-red)', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}
                                                        >
                                                            <i className="fas fa-trash" /> Eliminar
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        {usuarios.length === 0 && !loading && (
                                            <tr>
                                                <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-light)' }}>
                                                    <i className="fas fa-users-slash" style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem', opacity: 0.3 }} />
                                                    No hay usuarios con los filtros seleccionados
                                                </td>
                                            </tr>
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
                                Historial de Auditoría de Usuarios
                            </h3>
                            <button className="filter-btn" onClick={fetchAuditoria}>
                                <i className="fas fa-sync-alt" /> Actualizar
                            </button>
                        </div>
                        <div className="users-table-wrap" style={{ overflowX: 'auto', maxWidth: '100%', paddingBottom: '10px' }}>
                            <table className="users-table">
                                <thead>
                                    <tr>
                                        {['#', 'Administrador', 'Usuario Afectado', 'Acción', 'Descripción', 'Fecha'].map(h => (
                                            <th key={h}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {auditoria.map(a => (
                                        <tr key={a.id_auditoria}>
                                            <td style={{ color: 'var(--text-light)' }}>{a.id_auditoria}</td>
                                            <td style={{ color: 'var(--primary)', fontWeight: 600 }}>{a.administrador}</td>
                                            <td>{a.usuario_afectado}</td>
                                            <td>
                                                <span style={{
                                                    padding: '0.2rem 0.6rem', borderRadius: '50px', fontSize: '0.72rem', fontWeight: 700,
                                                    background: a.accion.includes('DESACTIVAR') || a.accion.includes('ELIMINAR')
                                                        ? 'rgba(231,76,60,0.15)' : a.accion === 'ACTIVAR'
                                                        ? 'rgba(0,255,136,0.12)' : 'rgba(52,152,219,0.12)',
                                                    color: a.accion.includes('DESACTIVAR') || a.accion.includes('ELIMINAR')
                                                        ? 'var(--accent-red)' : a.accion === 'ACTIVAR'
                                                        ? 'var(--primary)' : 'var(--secondary)',
                                                }}>
                                                    {a.accion}
                                                </span>
                                            </td>
                                            <td style={{ color: 'var(--text-light)', fontSize: '0.8rem', maxWidth: '240px' }}>{a.descripcion}</td>
                                            <td style={{ color: 'var(--text-light)', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>{a.fecha}</td>
                                        </tr>
                                    ))}
                                    {auditoria.length === 0 && (
                                        <tr><td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-light)' }}>Sin registros de auditoría</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </main>

            {/* ── Modal Crear/Editar ────────────────────────── */}
            {showModal && (
                <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
                    <div className="modal-box">
                        <div className="modal-header">
                            <div className="modal-title">
                                <i className={`fas ${editUser ? 'fa-user-edit' : 'fa-user-plus'}`} style={{ color: 'var(--primary)' }} />
                                {editUser ? 'Editar Usuario' : 'Nuevo Usuario'}
                            </div>
                            <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-light)', cursor: 'pointer', fontSize: '1.1rem' }}>
                                <i className="fas fa-times" />
                            </button>
                        </div>
                        <div style={{ padding: '1.5rem' }}>
                            {[
                                { label: 'Nombre completo',    key: 'nombre',   type: 'text',     placeholder: 'Ej: Juan Pérez' },
                                { label: 'Correo electrónico', key: 'correo',   type: 'email',    placeholder: 'Ej: juan@metro.com' },
                                { label: editUser ? 'Contraseña (dejar vacío para no cambiar)' : 'Contraseña', key: 'password', type: 'password', placeholder: '••••••••' },
                            ].map(({ label, key, type, placeholder }) => (
                                <div key={key} style={{ marginBottom: '1.1rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.35rem', color: 'var(--secondary)', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>{label}</label>
                                    <input
                                        type={type}
                                        placeholder={placeholder}
                                        value={form[key]}
                                        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                                        style={{ width: '100%', padding: '0.65rem 0.9rem', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--card-border)', borderRadius: '8px', color: 'var(--text-white)', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                                    />
                                </div>
                            ))}

                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.35rem', color: 'var(--secondary)', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Rol</label>
                                <select
                                    value={form.rol}
                                    onChange={e => setForm(f => ({ ...f, rol: e.target.value }))}
                                    style={{ width: '100%', padding: '0.65rem 0.9rem', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--card-border)', borderRadius: '8px', color: 'var(--text-white)', fontSize: '0.9rem' }}
                                >
                                    <option value="usuario">Usuario</option>
                                    <option value="administrador">Administrador</option>
                                </select>
                            </div>

                            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                                <button
                                    onClick={() => setShowModal(false)}
                                    style={{ padding: '0.65rem 1.3rem', borderRadius: '8px', background: 'transparent', border: '1px solid var(--card-border)', color: 'var(--text-light)', cursor: 'pointer' }}
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="add-user-btn"
                                >
                                    <i className={`fas ${saving ? 'fa-spinner fa-spin' : 'fa-save'}`} />
                                    {saving ? 'Guardando...' : 'Guardar'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Gestion_usuario;