import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../services/authService';
import axios from 'axios';
import './Dashboard_admin.css';

const initials = (name = '') => name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

const AdminJuegos = () => {
    const navigate = useNavigate();
    const adminUser = JSON.parse(localStorage.getItem('user') || '{}');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    
    const [juegos, setJuegos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [mensaje, setMensaje] = useState({ text: '', type: '' });
    
    const token = localStorage.getItem('token');
    const axiosConfig = { headers: { Authorization: `Bearer ${token}` } };

    const handleLogout = () => { logout(); navigate('/login'); };

    useEffect(() => { fetchJuegos(); }, []);

    const fetchJuegos = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:5000/api/juegos?admin=true', axiosConfig);
            if (response.data.success) {
                setJuegos(response.data.juegos);
            }
        } catch (error) {
            console.error('Error fetching juegos:', error);
            setMensaje({ text: 'Error al cargar los juegos', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (id, field, value) => {
        try {
            const data = {};
            data[field] = value;
            
            const response = await axios.put(`http://localhost:5000/api/juegos/${id}`, data, axiosConfig);
            if (response.data.success) {
                setMensaje({ text: 'Juego actualizado correctamente', type: 'success' });
                setJuegos(prev => prev.map(j => j.id_juego === id ? { ...j, [field]: value } : j));
                setTimeout(() => setMensaje({ text: '', type: '' }), 3000);
            }
        } catch (error) {
            console.error('Error actualizando juego:', error);
            setMensaje({ text: 'Error al actualizar', type: 'error' });
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
                        <i className="fas fa-shield-alt" /> Panel Administrador
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
                    <div className="nav-item active" onClick={() => setSidebarOpen(false)}>
                        <i className="fas fa-gamepad nav-icon" /> Gestión de Juegos
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
                    <button
                        className="mobile-menu-btn"
                        style={{ background: 'none', border: 'none', color: 'var(--text-light)', fontSize: '1.1rem', cursor: 'pointer' }}
                        onClick={() => setSidebarOpen(o => !o)}
                    >
                        <i className="fas fa-bars" />
                    </button>
                    <div className="header-left">
                        <div className="header-title">Gestión de Juegos</div>
                        <div className="header-breadcrumb">
                            <span>Admin</span>
                            <span className="breadcrumb-sep">›</span>
                            <span style={{ color: 'var(--primary)' }}>Juegos</span>
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
                    {mensaje.text && (
                        <div style={{ 
                            padding: '1rem', marginBottom: '1.5rem', borderRadius: '8px',
                            backgroundColor: mensaje.type === 'error' ? 'rgba(255, 59, 48, 0.1)' : 'rgba(52, 199, 89, 0.1)',
                            color: mensaje.type === 'error' ? '#ff3b30' : '#34c759',
                            border: `1px solid ${mensaje.type === 'error' ? '#ff3b30' : '#34c759'}`
                        }}>
                            {mensaje.text}
                        </div>
                    )}

                    {loading ? (
                        <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>Cargando juegos...</p>
                    ) : (
                        <div style={{ overflowX: 'auto', background: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid var(--border)' }}>
                                        {['ID', 'Nombre', 'Identificador', 'Recompensa Base', 'Estado'].map(h => (
                                            <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600 }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {juegos.map(juego => (
                                        <tr key={juego.id_juego} style={{ borderBottom: '1px solid var(--border)' }}>
                                            <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>{juego.id_juego}</td>
                                            <td style={{ padding: '0.75rem 1rem', color: 'var(--text-light)', fontWeight: 500 }}>{juego.nombre}</td>
                                            <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}><code>{juego.identificador}</code></td>
                                            <td style={{ padding: '0.75rem 1rem' }}>
                                                <input 
                                                    type="number" 
                                                    value={juego.recompensa_base}
                                                    onChange={(e) => {
                                                        const val = parseInt(e.target.value) || 0;
                                                        setJuegos(prev => prev.map(j => j.id_juego === juego.id_juego ? { ...j, recompensa_base: val } : j));
                                                    }}
                                                    onBlur={(e) => handleUpdate(juego.id_juego, 'recompensa_base', parseInt(e.target.value) || 0)}
                                                    style={{ 
                                                        width: '80px', padding: '0.4rem', borderRadius: '6px', 
                                                        border: '1px solid var(--border)', background: 'var(--surface-2)', color: 'var(--text-light)' 
                                                    }}
                                                />
                                            </td>
                                            <td style={{ padding: '0.75rem 1rem' }}>
                                                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                                                    <input 
                                                        type="checkbox" 
                                                        checked={juego.activo === 1 || juego.activo === true}
                                                        onChange={(e) => handleUpdate(juego.id_juego, 'activo', e.target.checked)}
                                                        style={{ marginRight: '0.5rem', width: '1.2rem', height: '1.2rem', accentColor: 'var(--primary)' }}
                                                    />
                                                    <span style={{ 
                                                        color: (juego.activo === 1 || juego.activo === true) ? '#34c759' : '#ff3b30', 
                                                        fontWeight: 600, background: (juego.activo === 1 || juego.activo === true) ? 'rgba(52, 199, 89, 0.1)' : 'rgba(255, 59, 48, 0.1)',
                                                        padding: '0.2rem 0.5rem', borderRadius: '20px', fontSize: '0.8rem'
                                                    }}>
                                                        {(juego.activo === 1 || juego.activo === true) ? 'Activo' : 'Inactivo'}
                                                    </span>
                                                </label>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AdminJuegos;
