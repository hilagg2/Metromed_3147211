import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './ServiceCard.css'

function ServiceCard({ title, image, delay = 0 }) {
    const [isHovered, setIsHovered] = useState(false)
    const navigate = useNavigate()

    const handleClick = () => {
        alert('Para acceder a esta función, debes iniciar sesión o registrarte.')
        navigate('/login')
    }

    return (
        <div
            className="service-card animate-scaleIn"
            style={{
                backgroundImage: `url(${image})`,
                animationDelay: `${delay}s`
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleClick}
        >
            <div className={`card-overlay ${isHovered ? 'hovered' : ''}`}></div>
            <div className="card-content">
                <h3 className="card-title">{title}</h3>
                <div className={`card-icon ${isHovered ? 'show' : ''}`}>
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                </div>
            </div>

            {/* Shine effect */}
            <div className={`card-shine ${isHovered ? 'active' : ''}`}></div>
        </div>
    )
}

export default ServiceCard
