import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../services/authService'
import './Login.css'

function Login() {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        correo: '',
        contrasena: ''
    })

    const [showPassword, setShowPassword] = useState(false)
    const [focusedInput, setFocusedInput] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
        setError('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const response = await login(formData)
            console.log('Login exitoso:', response)

            if (response.token) {
                localStorage.setItem('token', response.token)
                localStorage.setItem('user', JSON.stringify(response.user))
            }

            alert(`¡Bienvenido/a ${response.user.nombre}! 🎉`)


            if (response.user.rol === 2) {
                navigate('/Dashboard_admin')
            } else {
                navigate('/Dashboard')
            }

        } catch (err) {
            console.error('Error en login:', err)
            setError(err.message || 'Error al iniciar sesión')
        } finally {
            setLoading(false)
        }
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword)
    }

    return (
        <div className="login-page">
            <div className="login-background"></div>

            {/* Particles decoration */}
            <div className="particles">
                <div className="particle"></div>
                <div className="particle"></div>
                <div className="particle"></div>
                <div className="particle"></div>
                <div className="particle"></div>
            </div>

            <div className="login-container animate-scaleIn">
                <div className="login-header">
                    <Link to="/" className="back-link">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                        Volver
                    </Link>
                    <img src="/img/logo_metromed.png" alt="MetroMed" className="login-logo pulse-logo" />
                </div>

                <div className="login-card glass">
                    <div className="card-glow"></div>

                    <h2 className="login-title">
                        <span className="title-icon">🔐</span>
                        Iniciar Sesión
                    </h2>
                    <p className="login-subtitle">Accede a tu cuenta de MetroMed</p>

                    <form onSubmit={handleSubmit} className="login-form">
                        {error && (
                            <div className="error-banner">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="12" y1="8" x2="12" y2="12" />
                                    <line x1="12" y1="16" x2="12.01" y2="16" />
                                </svg>
                                {error}
                            </div>
                        )}

                        <div className="form-group">
                            <label htmlFor="correo" className="form-label">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                    <polyline points="22,6 12,13 2,6" />
                                </svg>
                                Correo Electrónico
                            </label>
                            <div className={`input-wrapper ${focusedInput === 'correo' ? 'focused' : ''}`}>
                                <input
                                    type="email"
                                    id="correo"
                                    name="correo"
                                    className="form-input"
                                    value={formData.correo}
                                    onChange={handleChange}
                                    onFocus={() => setFocusedInput('correo')}
                                    onBlur={() => setFocusedInput(null)}
                                    required
                                    placeholder="tu@email.com"
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="contrasena" className="form-label">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                </svg>
                                Contraseña
                            </label>
                            <div className={`input-wrapper password-wrapper ${focusedInput === 'contrasena' ? 'focused' : ''}`}>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="contrasena"
                                    name="contrasena"
                                    className="form-input"
                                    value={formData.contrasena}
                                    onChange={handleChange}
                                    onFocus={() => setFocusedInput('contrasena')}
                                    onBlur={() => setFocusedInput(null)}
                                    required
                                    placeholder="••••••••"
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={togglePasswordVisibility}
                                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                                    disabled={loading}
                                >
                                    {showPassword ? (
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                            <line x1="1" y1="1" x2="23" y2="23" />
                                        </svg>
                                    ) : (
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                            <circle cx="12" cy="12" r="3" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary btn-submit" disabled={loading}>
                            {loading ? (
                                <>
                                    <span className="spinner"></span>
                                    Iniciando sesión...
                                </>
                            ) : (
                                <>
                                    Iniciar Sesión
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M5 12h14M12 5l7 7-7 7" />
                                    </svg>
                                </>
                            )}
                        </button>

                        <div className="form-links">
                            <Link to="/forgot-password" className="link-forgot">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10" />
                                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                                    <line x1="12" y1="17" x2="12.01" y2="17" />
                                </svg>
                                ¿Olvidaste tu contraseña?
                            </Link>
                        </div>
                    </form>

                    <div className="login-footer">
                        <p className="signup-text">
                            ¿No tienes cuenta?{' '}
                            <Link to="/registro" className="link-primary">
                                Regístrate aquí
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login