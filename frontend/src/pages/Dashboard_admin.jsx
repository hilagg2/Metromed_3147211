import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../services/authService';
import './Dashboard_admin.css';

// ── Helpers ───────────────────────────────────────────────────────────────────
const initials = (name = '') => name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

const Dashboard_admin = () => {
    const navigate = useNavigate();
    const adminUser = JSON.parse(localStorage.getItem('user') || '{}');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = () => { logout(); navigate('/login'); };

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

                    {/* Al hacer click redirige a la página de gestión de usuarios */}
                    <div
                        className="nav-item"
                        onClick={() => { setSidebarOpen(false); navigate('/admin/usuarios'); }}
                    >
                        <i className="fas fa-users nav-icon" />
                        Gestión de Usuarios
                    </div>

                    <div
                        className="nav-item"
                        onClick={() => { setSidebarOpen(false); navigate('/admin/perfil'); }}
                    >
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
                        <div className="header-title">Panel Administrador</div>
                        <div className="header-breadcrumb">
                            <span>Admin</span>
                            <span className="breadcrumb-sep">›</span>
                            <span style={{ color: 'var(--primary)' }}>Inicio</span>
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
                <div style={{ padding: '2rem', textAlign: 'center', marginTop: '5rem' }}>
                    <i className="fas fa-th-large" style={{ fontSize: '3rem', opacity: 0.15, marginBottom: '1rem', display: 'block' }} />
                    <p style={{ opacity: 0.4, color: 'var(--text-light)' }}>
                        Selecciona una opción del menú lateral
                    </p>
                </div>
            </main>
        </div>
    );
};

export default Dashboard_admin;