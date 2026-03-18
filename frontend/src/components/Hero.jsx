import './Hero.css'

function Hero() {
    return (
        <section className="hero animate-fadeIn" id="inicio">
            <div className="hero-content">
                <div className="hero-badge animate-slideDown">
                    🚇 Sistema de Movilidad Inteligente
                </div>

                <h1 className="hero-title animate-slideUp">
                    Bienvenido a <span className="text-gradient">MetroMed</span>
                </h1>

                <p className="hero-description animate-slideUp" style={{ animationDelay: '0.2s' }}>
                    La plataforma colaborativa que conecta pasajeros y estaciones para mejorar
                    la movilidad y la experiencia de transporte en Medellín.
                </p>

                <div className="hero-stats animate-slideUp" style={{ animationDelay: '0.3s' }}>
                    <div className="stat-item">
                        <div className="stat-number">24/7</div>
                        <div className="stat-label">Disponible</div>
                    </div>
                    <div className="stat-divider"></div>
                    <div className="stat-item">
                        <div className="stat-number">3</div>
                        <div className="stat-label">Servicios</div>
                    </div>
                    <div className="stat-divider"></div>
                    <div className="stat-item">
                        <div className="stat-number">∞</div>
                        <div className="stat-label">Posibilidades</div>
                    </div>
                </div>

                <div className="hero-cta animate-slideUp" style={{ animationDelay: '0.5s' }}>
                    <a href="#servicios" className="btn btn-primary btn-hero">
                        <span>Explorar Servicios</span>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </a>
                </div>
            </div>

            {/* Scroll indicator */}
            <div className="scroll-indicator">
                <div className="scroll-mouse">
                    <div className="scroll-wheel"></div>
                </div>
                <span>Desliza para explorar</span>
            </div>

            {/* Decorative elements */}
            <div className="hero-decoration">
                <div className="decoration-circle circle-1"></div>
                <div className="decoration-circle circle-2"></div>
                <div className="decoration-circle circle-3"></div>
                <div className="decoration-line line-1"></div>
                <div className="decoration-line line-2"></div>
            </div>
        </section>
    )
}

export default Hero
