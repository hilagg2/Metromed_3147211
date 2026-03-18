import { Link } from 'react-router-dom'
import './Navbar.css'

function Navbar() {
    return (
        <header className="navbar animate-slideDown">
            <div className="navbar-logo">
                <img src="/img/logo_metromed.png" alt="MetroMed Logo" />
                <span className="logo-text">MetroMed</span>
            </div>

            <nav className="navbar-links">
                <a href="#inicio" className="nav-link">Inicio</a>
                <a href="#servicios" className="nav-link">Servicios</a>
                <a href="#contacto" className="nav-link">Contacto</a>
            </nav>

            <div className="navbar-auth">
                <Link to="/login" className="btn btn-login">Iniciar Sesión</Link>
                <Link to="/registro" className="btn btn-register">Registrarse</Link>
            </div>
        </header>
    )
}

export default Navbar
