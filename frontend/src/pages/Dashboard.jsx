import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../services/authService';
import { io } from 'socket.io-client';
import toast, { Toaster } from 'react-hot-toast';
import Trafico from './Trafico';
import Inicio from './Inicio';
import Juegos from './Juegos';
import Wrapped from './Wrapped';
import Perfil from './Perfil';
import Ranking from './Ranking';
import ApoyoPsicologico from './Apoyopsiqui';
import Configuracion from './Configuracion';
import NotificationsPanel from '../components/NotificationsPanel';
import AlertasPreferencias from '../components/AlertasPreferencias';
import UserNotificaciones from './UserNotificaciones';
import './Dashboard.css';

const API_URL = 'http://localhost:5000';

const TIPO_META = {
    retraso:          { icon: '🕐', label: 'Retraso', color: '#ff0055' },
    cierre_estacion:  { icon: '🚫', label: 'Cierre de Estación', color: '#e74c3c' },
    mantenimiento:    { icon: '🔧', label: 'Mantenimiento', color: '#f39c12' },
};

const Dashboard = () => {
    // Estados
    const [activeSection,    setActiveSection]    = useState('inicio');
    const [sidebarOpen,      setSidebarOpen]      = useState(false);
    const [notifPanelOpen,   setNotifPanelOpen]   = useState(false);

    // Obtener userId del localStorage
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = currentUser.id;
    const navigate = useNavigate();
    
    // Escuchar notificaciones globalmente (en todo el Dashboard)
    useEffect(() => {
        if (!userId) return;

        const socket = io(API_URL, {
            auth: { userId },
            transports: ['websocket'],
        });

        socket.on('nueva_notificacion', (alerta) => {
            const meta = TIPO_META[alerta.tipo_evento] || { icon: '🔔', label: alerta.tipo_evento, color: '#00ff88' };
            toast.custom((t) => (
                <div
                    style={{
                        background: '#050a08', border: `1px solid ${meta.color}`, cursor: 'pointer',
                        padding: '1rem', borderRadius: '8px', color: '#fff',
                        boxShadow: `0 0 15px ${meta.color}40`, opacity: t.visible ? 1 : 0, transition: 'opacity 0.3s'
                    }}
                    onClick={() => {
                        toast.dismiss(t.id);
                        showSection('alertas');
                    }}
                >
                    <div style={{ fontWeight: 'bold', color: meta.color, marginBottom: '0.5rem' }}>
                        {meta.icon} {meta.label}
                    </div>
                    <div style={{ fontSize: '0.9rem', marginBottom: '0.2rem' }}>{alerta.titulo}</div>
                    <div style={{ fontSize: '0.8rem', color: '#888' }}>📍 {alerta.entidad_afectada}</div>
                </div>
            ), { duration: 7000, position: 'top-right' });
        });

        return () => socket.disconnect();
    }, [userId]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Funciones de navegación
    const showSection = (sectionId) => {
        setActiveSection(sectionId);
        // Cerrar sidebar en móvil al seleccionar
        if (window.innerWidth <= 768) {
            setSidebarOpen(false);
        }
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const handleVerMapaCompleto = () => {
        showSection('congestion');
    };

    // Componente para ítems del sidebar
    const SidebarItem = ({ icon, text, section, isActive, onClick }) => (
        <div className="nav-item">
            <div
                className={`nav-link ${isActive ? 'active' : ''}`}
                onClick={() => onClick(section)}
                role="button"
                tabIndex={0}
            >
                <i className={icon}></i>
                <span>{text}</span>
            </div>
        </div>
    );

    // Renderizado de sección activa
    const renderActiveSection = () => {
        switch (activeSection) {
            case 'inicio':
                return <Inicio
                    showSection={showSection}
                    handleVerMapaCompleto={handleVerMapaCompleto}
                />;
            case 'juegos':
                return <Juegos />;
            case 'wrapped':
                return <Wrapped userId="user123" />;
            case 'congestion':
                return <Trafico onBack={() => showSection('inicio')} />;
            case 'perfil':
                return <Perfil showSection={showSection} />;
            case 'ranking':
                return <Ranking />;
            case 'apoyo-psicologico':
                return <ApoyoPsicologico />;
            case 'configuracion':
                return (
                    <div style={{ padding: '1.5rem' }}>
                        <AlertasPreferencias />
                    </div>
                );
            case 'alertas':
                return <UserNotificaciones />;
            default:
                return <Inicio
                    showSection={showSection}
                    handleVerMapaCompleto={handleVerMapaCompleto}
                />;
        }
    };

    return (
        <div className="dashboard-page">
            <Toaster />
            {/* Botón móvil para menú */}
            <button className="mobile-menu-toggle" onClick={toggleSidebar}>
                <i className="fas fa-bars"></i>
            </button>

            {/* Sidebar */}
            <nav className={`sidebar ${sidebarOpen ? 'show' : ''}`}>
                <div className="sidebar-header">
                    <div className="logo">
                        <i className="fas fa-subway"></i> MetroMed
                    </div>
                </div>

                <div className="nav-menu">
                    <SidebarItem
                        icon="fas fa-home"
                        text="Inicio"
                        section="inicio"
                        isActive={activeSection === 'inicio'}
                        onClick={showSection}
                    />
                    <SidebarItem
                        icon="fas fa-gamepad"
                        text="Juegos"
                        section="juegos"
                        isActive={activeSection === 'juegos'}
                        onClick={showSection}
                    />
                    <SidebarItem
                        icon="fas fa-trophy"
                        text="Ranking"
                        section="ranking"
                        isActive={activeSection === 'ranking'}
                        onClick={showSection}
                    />
                    <SidebarItem
                        icon="fas fa-chart-pie"
                        text="Wrapped"
                        section="wrapped"
                        isActive={activeSection === 'wrapped'}
                        onClick={showSection}
                    />
                    <SidebarItem
                        icon="fas fa-traffic-light"
                        text="Congestión"
                        section="congestion"
                        isActive={activeSection === 'congestion'}
                        onClick={showSection}
                    />
                    <SidebarItem
                        icon="fas fa-user"
                        text="Perfil"
                        section="perfil"
                        isActive={activeSection === 'perfil'}
                        onClick={showSection}
                    />
                    <SidebarItem
                        icon="fas fa-heart"
                        text="Apoyo Psicológico"
                        section="apoyo-psicologico"
                        isActive={activeSection === 'apoyo-psicologico'}
                        onClick={showSection}
                    />
                    <SidebarItem
                        icon="fas fa-envelope-open-text"
                        text="Buzón Alertas"
                        section="alertas"
                        isActive={activeSection === 'alertas'}
                        onClick={showSection}
                    />
                    <SidebarItem
                        icon="fas fa-cog"
                        text="Configuración"
                        section="configuracion"
                        isActive={activeSection === 'configuracion'}
                        onClick={showSection}
                    />
                </div>

                <div className="sidebar-footer">
                    <button className="logout-btn red-logout" onClick={handleLogout}>
                        <i className="fas fa-sign-out-alt"></i> Cerrar sesión
                    </button>
                </div>
            </nav>

            {/* Header superior */}
            <header className="top-header">
                <div className="welcome-text">
                    <i className="fas fa-gamepad"></i> Bienvenido al MetroHub
                </div>

                <div className="search-bar-container">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Buscar en MetroMed..."
                    />
                </div>

                <div className="profile-section">
                    {/* Botón campana de alertas en la cabecera, abre panel o va a sección */}
                    <div
                        title="Notificaciones"
                        onClick={() => showSection('alertas')}
                        style={{ 
                            display: 'flex', alignItems: 'center', gap: '0.5rem',
                            cursor: 'pointer', marginRight: '1rem', padding: '8px 14px', 
                            borderRadius: 12, background: activeSection === 'alertas' ? 'rgba(0,255,136,0.2)' : 'rgba(255,255,255,0.05)', 
                            color: activeSection === 'alertas' ? '#00ff88' : '#fff', fontWeight: 600, fontSize: '0.9rem',
                            transition: 'all 0.2s', border: activeSection === 'alertas' ? '1px solid #00ff88' : '1px solid rgba(255,255,255,0.1)'
                        }}
                    >
                        🔔 <span style={{ display: window.innerWidth > 768 ? 'inline' : 'none' }}>Notificaciones</span>
                    </div>
                    <div className="profile-pic" onClick={() => showSection('perfil')}>U</div>
                </div>
            </header>

            {/* Panel de notificaciones deslizable */}
            {notifPanelOpen && (
                <div style={{
                    position: 'fixed', top: 0, right: 0, width: 340, height: '100vh',
                    zIndex: 1000, boxShadow: '-4px 0 30px rgba(0,0,0,0.5)',
                    display: 'flex', flexDirection: 'column', overflow: 'hidden',
                }}>
                    <NotificationsPanel userId={userId} />
                </div>
            )}

            {/* Contenido principal */}
            <main className="main-content">
                {renderActiveSection()}
            </main>
        </div>
    );
};

export default Dashboard;