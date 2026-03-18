import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../services/authService';
import Trafico from './Trafico';
import Inicio from './Inicio';
import Juegos from './Juegos';
import Wrapped from './Wrapped';
import Perfil from './Perfil';
import ApoyoPsicologico from './Apoyopsiqui';
import Configuracion from './Configuracion';
import './Dashboard.css';

const Dashboard = () => {
    // Estados
    const [activeSection, setActiveSection] = useState('inicio');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();

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
            case 'apoyo-psicologico':
                return <ApoyoPsicologico />;
            case 'configuracion':
                return <Configuracion />;
            default:
                return <Inicio
                    showSection={showSection}
                    handleVerMapaCompleto={handleVerMapaCompleto}
                />;
        }
    };

    return (
        <div className="dashboard-page">
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
                    <div className="profile-pic" onClick={() => showSection('perfil')}>U</div>
                </div>
            </header>

            {/* Contenido principal */}
            <main className="main-content">
                {renderActiveSection()}
            </main>
        </div>
    );
};

export default Dashboard;