import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../services/authService';
import './Dashboard_admin.css';

const initials = (name = '') => name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

/**
 * Componente funcional AdminAuditoria
 * Renderiza la interfaz de usuario para el Registro de Auditoría de Administradores.
 * 
 * Funcionalidades clave:
 * - Consulta el endpoint GET `/api/auditoria` de forma asíncrona usando el JWT almacenado.
 * - Muestra un menú de navegación unificado (Dashboard, Gestión Usuarios, Alertas, Perfil).
 * - Renderiza una tabla reactiva con el historial cronológico de todas las acciones hechas por admins.
 * - Asigna códigos de color a diferentes acciones (`CREAR` = verde, `ACTUALIZAR` = cian, `ELIMINAR` = rojo, etc.) para rápida legibilidad visual.
 * 
 * @component
 * @example
 * return <AdminAuditoria />
 */
const AdminAuditoria = () => {
    const navigate = useNavigate();
    const adminUser = JSON.parse(localStorage.getItem('user') || '{}');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [historial, setHistorial] = useState([]);
    const [loading, setLoading] = useState(true);

    const handleLogout = () => { logout(); navigate('/login'); };

    const fetchAuditoria = async () => {
        setLoading(true);
        try {
            const res = await fetch('http://localhost:3000/api/auditoria', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            const data = await res.json();
            if (data.success) {
                setHistorial(data.data);
            }
        } catch (error) {
            console.error('Error fetching auditoria:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAuditoria();
    }, []);

    const getColorAction = (accion) => {
        switch (accion) {
            case 'CREAR': return '#00ff88';
            case 'ACTUALIZAR': return '#00b8ff';
            case 'ELIMINAR': return '#e74c3c';
            case 'REENVIAR': return '#f39c12';
            default: return 'var(--text-light)';
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
                        <i className="fas fa-home nav-icon" /> Inicio
                    </div>

                    <div className="nav-item" onClick={() => { setSidebarOpen(false); navigate('/admin/usuarios'); }}>
                        <i className="fas fa-users nav-icon" /> Gestión de Usuarios
                    </div>

                    <div className="nav-item" onClick={() => { setSidebarOpen(false); navigate('/Dashboard_admin', { state: { section: 'alertas' } }); }}>
                        <i className="fas fa-bell nav-icon" /> Gestión de Alertas
                    </div>

                    <div className="nav-item active" onClick={() => setSidebarOpen(false)}>
                        <i className="fas fa-history nav-icon" /> Registro de Auditoría
                    </div>

                    <div className="nav-item" onClick={() => { setSidebarOpen(false); navigate('/admin/perfil'); }}>
                        <i className="fas fa-id-card nav-icon" /> Mi Perfil
                    </div>
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
                        <div className="header-title">Registro de Auditoría</div>
                        <div className="header-breadcrumb">
                            <span>Admin</span><span className="breadcrumb-sep">›</span><span style={{ color: 'var(--primary)' }}>Auditoría</span>
                        </div>
                    </div>
                </div>

                <div className="header-right">
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
                            <i className="fas fa-history" style={{ marginRight: '0.5rem', color: 'var(--primary)' }} /> 
                            Registro de Actividades Administrativas
                        </h2>
                        <button onClick={fetchAuditoria} style={{ background: 'var(--card-border)', color: 'var(--primary)', border: '1px solid var(--primary)', borderRadius: '8px', padding: '0.5rem 1rem', cursor: 'pointer', fontWeight: 'bold' }}>
                            <i className="fas fa-sync-alt" /> Refrescar
                        </button>
                    </div>

                    <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
                        {loading ? (
                            <p style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Cargando auditoría...</p>
                        ) : historial.length === 0 ? (
                            <p style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No hay acciones registradas aún.</p>
                        ) : (
                            <div style={{ overflowX: 'auto' }}>
                                <table className="users-table">
                                    <thead>
                                        <tr>
                                            <th>Fecha</th>
                                            <th>Administrador</th>
                                            <th>Acción</th>
                                            <th>Entidad</th>
                                            <th>Detalles</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {historial.map((a, i) => (
                                            <tr key={i}>
                                                <td style={{ color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                                                    {new Date(a.fecha_accion).toLocaleString('es-CO')}
                                                </td>
                                                <td>
                                                    <div style={{ fontWeight: 'bold', color: 'var(--text-white)' }}>{a.admin_nombre}</div>
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{a.admin_correo}</div>
                                                </td>
                                                <td style={{ fontWeight: 'bold', color: getColorAction(a.accion) }}>{a.accion}</td>
                                                <td>{a.entidad} <span style={{ color: 'var(--text-muted)' }}>#{a.entidad_id}</span></td>
                                                <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem', maxWidth: '300px' }}>
                                                    <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all', fontFamily: 'monospace' }}>
                                                        {JSON.stringify(a.detalles, null, 2)}
                                                    </pre>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminAuditoria;
