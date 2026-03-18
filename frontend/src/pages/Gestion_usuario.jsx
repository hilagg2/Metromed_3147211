import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../services/authService';
import './Dashboard_admin.css';

const initials = (name = '') => name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

const Gestion_usuario = () => {
    const navigate = useNavigate();
    const adminUser = JSON.parse(localStorage.getItem('user') || '{}');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editUser, setEditUser] = useState(null);
    const [form, setForm] = useState({ nombre: '', correo: '', rol: 'usuario', password: '' });
    const [saving, setSaving] = useState(false);

    const handleLogout = () => { logout(); navigate('/login'); };

    const fetchUsuarios = async () => {
        setLoading(true);
        try {
            const res = await fetch('http://localhost:5000/api/usuarios');
            if (!res.ok) throw new Error('Error al cargar usuarios');
            const data = await res.json();
            setUsuarios(data);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchUsuarios(); }, []);

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
        setSaving(true);
        try {
            const url = editUser
                ? `http://localhost:5000/api/usuarios/${editUser.id}`
                : 'http://localhost:5000/api/usuarios';
            const method = editUser ? 'PUT' : 'POST';
            const body = { ...form };
            if (editUser && !body.password) delete body.password;

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            if (!res.ok) {
                const d = await res.json();
                throw new Error(d.error || 'Error al guardar');
            }
            setShowModal(false);
            fetchUsuarios();
        } catch (e) {
            alert(e.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Eliminar este usuario?')) return;
        try {
            const res = await fetch(`http://localhost:5000/api/usuarios/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Error al eliminar');
            fetchUsuarios();
        } catch (e) {
            alert(e.message);
        }
    };

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
                        <i className="fas fa-shield-alt" />
                        Panel Administrador
                    </div>
                </div>

                <nav className="sidebar-nav">
                    <div className="nav-section-label">Principal</div>
                    <div className="nav-item" onClick={() => { setSidebarOpen(false); navigate('/Dashboard_admin'); }}>
                        <i className="fas fa-home nav-icon" />
                        Inicio
                    </div>
                    <div className="nav-item active" onClick={() => setSidebarOpen(false)}>
                        <i className="fas fa-users nav-icon" />
                        Gestión de Usuarios
                    </div>
                    <div className="nav-item" onClick={() => { setSidebarOpen(false); navigate('/admin/perfil'); }}>
                        <i className="fas fa-id-card nav-icon" />
                        Mi Perfil
                    </div>
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
                    <div className="notif-btn">
                        <i className="fas fa-bell" />
                        <div className="notif-dot" />
                    </div>
                    <div className="admin-avatar" title={adminUser.nombre}>
                        {initials(adminUser.nombre || 'AD')}
                    </div>
                </div>
            </header>

            {/* ── Main ────────────────────────────────────────── */}
            <main className="admin-main">
                <div style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h2 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-light)' }}>
                            Lista de Usuarios
                        </h2>
                        <button
                            onClick={openCreate}
                            style={{
                                background: 'var(--primary)', color: '#0a0a0a',
                                border: 'none', borderRadius: '8px',
                                padding: '0.6rem 1.2rem', fontWeight: 700,
                                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem'
                            }}
                        >
                            <i className="fas fa-user-plus" /> Nuevo Usuario
                        </button>
                    </div>

                    {loading && <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>Cargando...</p>}
                    {error && <p style={{ color: '#e74c3c', textAlign: 'center' }}>{error}</p>}

                    {!loading && !error && (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid var(--border)' }}>
                                        {['ID', 'Nombre', 'Correo', 'Rol', 'Estado', 'Acciones'].map(h => (
                                            <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600 }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {usuarios.map(u => (
                                        <tr key={u.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                            <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>{u.id}</td>
                                            <td style={{ padding: '0.75rem 1rem', color: 'var(--text-light)', fontWeight: 500 }}>{u.nombre}</td>
                                            <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>{u.correo}</td>
                                            <td style={{ padding: '0.75rem 1rem' }}>
                                                <span style={{
                                                    background: u.rol === 'administrador' ? 'rgba(0,200,255,0.15)' : 'rgba(0,255,136,0.12)',
                                                    color: u.rol === 'administrador' ? '#00c8ff' : 'var(--primary)',
                                                    borderRadius: '20px', padding: '0.2rem 0.7rem', fontSize: '0.8rem', fontWeight: 600
                                                }}>
                                                    {u.rol}
                                                </span>
                                            </td>
                                            <td style={{ padding: '0.75rem 1rem' }}>
                                                <span style={{
                                                    background: u.estado === 'activo' ? 'rgba(0,255,136,0.12)' : 'rgba(231,76,60,0.15)',
                                                    color: u.estado === 'activo' ? 'var(--primary)' : '#e74c3c',
                                                    borderRadius: '20px', padding: '0.2rem 0.7rem', fontSize: '0.8rem', fontWeight: 600
                                                }}>
                                                    {u.estado || 'activo'}
                                                </span>
                                            </td>
                                            <td style={{ padding: '0.75rem 1rem', display: 'flex', gap: '0.5rem' }}>
                                                <button onClick={() => openEdit(u)} title="Editar" style={{ background: 'rgba(0,200,255,0.15)', border: 'none', color: '#00c8ff', borderRadius: '6px', padding: '0.4rem 0.7rem', cursor: 'pointer' }}>
                                                    <i className="fas fa-edit" />
                                                </button>
                                                <button onClick={() => handleDelete(u.id)} title="Eliminar" style={{ background: 'rgba(231,76,60,0.15)', border: 'none', color: '#e74c3c', borderRadius: '6px', padding: '0.4rem 0.7rem', cursor: 'pointer' }}>
                                                    <i className="fas fa-trash" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {usuarios.length === 0 && (
                                        <tr><td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No hay usuarios registrados</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>

            {/* ── Modal ───────────────────────────────────────── */}
            {showModal && (
                <div style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                }}>
                    <div style={{
                        background: 'var(--surface)', borderRadius: '12px',
                        padding: '2rem', width: '100%', maxWidth: '420px',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.5)', border: '1px solid var(--border)'
                    }}>
                        <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-light)', fontWeight: 700 }}>
                            {editUser ? 'Editar Usuario' : 'Nuevo Usuario'}
                        </h3>

                        {[
                            { label: 'Nombre', key: 'nombre', type: 'text' },
                            { label: 'Correo', key: 'correo', type: 'email' },
                            { label: 'Contraseña' + (editUser ? ' (dejar vacío para no cambiar)' : ''), key: 'password', type: 'password' },
                        ].map(({ label, key, type }) => (
                            <div key={key} style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.4rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>{label}</label>
                                <input
                                    type={type}
                                    value={form[key]}
                                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                                    style={{
                                        width: '100%', padding: '0.6rem 0.8rem',
                                        background: 'var(--surface-2)', border: '1px solid var(--border)',
                                        borderRadius: '8px', color: 'var(--text-light)', fontSize: '0.9rem',
                                        boxSizing: 'border-box'
                                    }}
                                />
                            </div>
                        ))}

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.4rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Rol</label>
                            <select
                                value={form.rol}
                                onChange={e => setForm(f => ({ ...f, rol: e.target.value }))}
                                style={{
                                    width: '100%', padding: '0.6rem 0.8rem',
                                    background: 'var(--surface-2)', border: '1px solid var(--border)',
                                    borderRadius: '8px', color: 'var(--text-light)', fontSize: '0.9rem'
                                }}
                            >
                                <option value="usuario">usuario</option>
                                <option value="administrador">administrador</option>
                            </select>
                        </div>

                        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                            <button onClick={() => setShowModal(false)} style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--text-muted)', borderRadius: '8px', padding: '0.6rem 1.2rem', cursor: 'pointer' }}>
                                Cancelar
                            </button>
                            <button onClick={handleSave} disabled={saving} style={{ background: 'var(--primary)', color: '#0a0a0a', border: 'none', borderRadius: '8px', padding: '0.6rem 1.2rem', fontWeight: 700, cursor: 'pointer' }}>
                                {saving ? 'Guardando...' : 'Guardar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Gestion_usuario;