import React from 'react';

const Inicio = ({ showSection, handleVerMapaCompleto }) => {
    return (
        <>
            <div className="project-hero">
                <div className="hero-content">
                    <div className="hero-badge">
                        <i className="fas fa-rocket"></i> Proyecto Innovador
                    </div>
                    <h1 className="hero-title">
                        <span className="gradient-text">MetroMed</span>
                        <br />
                        Transformando la movilidad urbana
                    </h1>
                    <p className="hero-description">
                        Una plataforma integral que combina gamificación, información en tiempo real
                        y apoyo comunitario para mejorar la experiencia de movilidad en Medellín.
                    </p>

                    <div className="hero-features">
                        <div className="feature-pill">
                            <i className="fas fa-trophy"></i>
                            <span>Sistema de Recompensas</span>
                        </div>
                        <div className="feature-pill">
                            <i className="fas fa-map-marked-alt"></i>
                            <span>Monitoreo en Tiempo Real</span>
                        </div>
                        <div className="feature-pill">
                            <i className="fas fa-users"></i>
                            <span>Comunidad Activa</span>
                        </div>
                    </div>

                    <div className="hero-actions">
                        <button
                            className="action-btn primary pulse"
                            onClick={() => showSection('juegos')}
                        >
                            <i className="fas fa-gamepad"></i> Explorar Juegos
                        </button>
                        <button
                            className="action-btn secondary"
                            onClick={() => showSection('congestion')}
                        >
                            <i className="fas fa-info-circle"></i> Ver Estado del Metro
                        </button>
                    </div>
                </div>

                <div className="hero-stats-floating">
                    <div className="floating-stat">
                        <div className="stat-icon">
                            <i className="fas fa-users"></i>
                        </div>
                        <div className="stat-info">
                            <div className="stat-number">15K+</div>
                            <div className="stat-label">Usuarios Activos</div>
                        </div>
                    </div>
                    <div className="floating-stat">
                        <div className="stat-icon">
                            <i className="fas fa-gamepad"></i>
                        </div>
                        <div className="stat-info">
                            <div className="stat-number">50K+</div>
                            <div className="stat-label">Juegos Completados</div>
                        </div>
                    </div>
                    <div className="floating-stat">
                        <div className="stat-icon">
                            <i className="fas fa-chart-line"></i>
                        </div>
                        <div className="stat-info">
                            <div className="stat-number">98%</div>
                            <div className="stat-label">Satisfacción</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="project-info-section">
                <h2 className="section-title">
                    <i className="fas fa-lightbulb"></i> Sobre MetroMed
                </h2>

                <div className="info-grid">
                    <div className="info-card">
                        <div className="info-icon">
                            <i className="fas fa-bullseye"></i>
                        </div>
                        <h3>Nuestra Misión</h3>
                        <p>
                            Mejorar la experiencia de movilidad urbana mediante tecnología innovadora,
                            gamificación y participación comunitaria activa.
                        </p>
                    </div>

                    <div className="info-card">
                        <div className="info-icon">
                            <i className="fas fa-eye"></i>
                        </div>
                        <h3>Nuestra Visión</h3>
                        <p>
                            Ser la plataforma líder en transformación de movilidad urbana en Latinoamérica,
                            conectando ciudades y personas de manera inteligente.
                        </p>
                    </div>

                    <div className="info-card">
                        <div className="info-icon">
                            <i className="fas fa-heart"></i>
                        </div>
                        <h3>Valores</h3>
                        <p>
                            Innovación, transparencia, comunidad, sostenibilidad y accesibilidad
                            son los pilares que guían nuestro trabajo diario.
                        </p>
                    </div>
                </div>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-number">1,250</div>
                    <div className="stat-label">MetroCoins</div>
                </div>
                <div className="stat-card">
                    <div className="stat-number">7</div>
                    <div className="stat-label">Días consecutivos</div>
                </div>
                <div className="stat-card">
                    <div className="stat-number">15</div>
                    <div className="stat-label">Juegos completados</div>
                </div>
                <div className="stat-card">
                    <div className="stat-number">5</div>
                    <div className="stat-label">Nivel actual</div>
                </div>
            </div>

            <div className="cta-games-section">
                <div className="cta-content">
                    <h2>¿Listo para divertirte?</h2>
                    <p>Participa en nuestros juegos interactivos y gana MetroCoins</p>
                    <button
                        className="action-btn large pulse"
                        onClick={() => showSection('juegos')}
                    >
                        <i className="fas fa-play-circle"></i> Ir a Juegos
                    </button>
                </div>
            </div>
        </>
    );
};

export default Inicio;