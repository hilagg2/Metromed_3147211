import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import ServiceCard from '../components/ServiceCard'
import './Home.css'

function Home() {
    return (
        <div className="home-page">
            <Navbar />
            <Hero />

            {/* Services Section */}
            <section className="services-section" id="servicios">
                <div className="container">
                    <h2 className="section-title animate-slideUp">
                        ¿Qué puedes hacer en <span className="text-gradient">MetroMed</span>?
                    </h2>

                    <div className="services-grid">
                        <ServiceCard
                            title="Ver Tráfico"
                            image="/img/Trafico.png"
                            delay={0.1}
                        />
                        <ServiceCard
                            title="Juegos"
                            image="/img/Juegos.png"
                            delay={0.2}
                        />
                        <ServiceCard
                            title="Wrapped"
                            image="/img/Wrapped.png"
                            delay={0.3}
                        />
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="contact-section" id="contacto">
                <div className="container">
                    <h2 className="section-title">Contáctanos</h2>
                    <p className="contact-text">
                        ¿Tienes ideas o comentarios? Escríbenos a{' '}
                        <a href="mailto:soporte@metromed.co" className="contact-link">
                            soporte@metromed.co
                        </a>{' '}
                        y ayúdanos a mejorar la movilidad de Medellín.
                    </p>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <p>© 2025 MetroMed — Innovando la movilidad urbana</p>
            </footer>
        </div>
    )
}

export default Home
