import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register } from '../services/authService'
import './Register.css'

function Register() {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        nombre: '',
        correo: '',
        contrasena: '',
        confirmar_contrasena: ''
    })

    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [focusedInput, setFocusedInput] = useState(null)
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)
    const [apiError, setApiError] = useState('')

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
        // Clear error when user starts typing
        if (errors[e.target.name]) {
            setErrors({
                ...errors,
                [e.target.name]: ''
            })
        }
        setApiError('')
    }

    const validateForm = () => {
        const newErrors = {}

        if (formData.contrasena !== formData.confirmar_contrasena) {
            newErrors.confirmar_contrasena = 'Las contraseñas no coinciden'
        }

        if (formData.contrasena.length < 8) {
            newErrors.contrasena = 'La contraseña debe tener mínimo 8 caracteres'
        }

        return newErrors
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const newErrors = validateForm()

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }

        setLoading(true)
        setApiError('')

        try {
            const response = await register({
                nombre: formData.nombre,
                correo: formData.correo,
                contrasena: formData.contrasena
            })

            console.log('Registro exitoso:', response)
            alert('¡Cuenta creada exitosamente! 🎉 Ahora puedes iniciar sesión.')

            // Redirigir al login
            navigate('/login')
        } catch (err) {
            console.error('Error en registro:', err)
            setApiError(err.message || 'Error al crear la cuenta')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="register-page">
            <div className="register-background"></div>

            {/* Particles decoration */}
            <div className="particles">
                <div className="particle"></div>
                <div className="particle"></div>
                <div className="particle"></div>
                <div className="particle"></div>
                <div className="particle"></div>
            </div>

            <div className="register-container animate-scaleIn">
                <div className="register-header">
                    <Link to="/" className="back-link">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                        Volver
                    </Link>
                    <img src="/img/logo_metromed.png" alt="MetroMed" className="register-logo pulse-logo" />
                </div>

                <div className="register-card glass">
                    <div className="card-glow"></div>

                    <h2 className="register-title">
                        <span className="title-icon">✨</span>
                        Crear Cuenta
                    </h2>
                    <p className="register-subtitle">Únete a la comunidad de MetroMed</p>

                    <form onSubmit={handleSubmit} className="register-form">
                        {apiError && (
                            <div className="error-banner">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="12" y1="8" x2="12" y2="12" />
                                    <line x1="12" y1="16" x2="12.01" y2="16" />
                                </svg>
                                {apiError}
                            </div>
                        )}

                        <div className="form-group">
                            <label htmlFor="nombre" className="form-label">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                                Nombre completo
                            </label>
                            <div className={`input-wrapper ${focusedInput === 'nombre' ? 'focused' : ''}`}>
                                <input
                                    type="text"
                                    id="nombre"
                                    name="nombre"
                                    className="form-input"
                                    placeholder="Tu nombre"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    onFocus={() => setFocusedInput('nombre')}
                                    onBlur={() => setFocusedInput(null)}
                                    required
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="correo" className="form-label">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                    <polyline points="22,6 12,13 2,6" />
                                </svg>
                                Correo electrónico
                            </label>
                            <div className={`input-wrapper ${focusedInput === 'correo' ? 'focused' : ''}`}>
                                <input
                                    type="email"
                                    id="correo"
                                    name="correo"
                                    className="form-input"
                                    placeholder="ejemplo@gmail.com"
                                    value={formData.correo}
                                    onChange={handleChange}
                                    onFocus={() => setFocusedInput('correo')}
                                    onBlur={() => setFocusedInput(null)}
                                    required
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
                                    className={`form-input ${errors.contrasena ? 'error' : ''}`}
                                    placeholder="••••••••"
                                    value={formData.contrasena}
                                    onChange={handleChange}
                                    onFocus={() => setFocusedInput('contrasena')}
                                    onBlur={() => setFocusedInput(null)}
                                    required
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
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
                            {errors.contrasena && (
                                <span className="error-message">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10" />
                                        <line x1="12" y1="8" x2="12" y2="12" />
                                        <line x1="12" y1="16" x2="12.01" y2="16" />
                                    </svg>
                                    {errors.contrasena}
                                </span>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmar_contrasena" className="form-label">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M9 11l3 3L22 4" />
                                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                                </svg>
                                Confirmar contraseña
                            </label>
                            <div className={`input-wrapper password-wrapper ${focusedInput === 'confirmar_contrasena' ? 'focused' : ''}`}>
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    id="confirmar_contrasena"
                                    name="confirmar_contrasena"
                                    className={`form-input ${errors.confirmar_contrasena ? 'error' : ''}`}
                                    placeholder="••••••••"
                                    value={formData.confirmar_contrasena}
                                    onChange={handleChange}
                                    onFocus={() => setFocusedInput('confirmar_contrasena')}
                                    onBlur={() => setFocusedInput(null)}
                                    required
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    aria-label={showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                                    disabled={loading}
                                >
                                    {showConfirmPassword ? (
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
                            {errors.confirmar_contrasena && (
                                <span className="error-message">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10" />
                                        <line x1="12" y1="8" x2="12" y2="12" />
                                        <line x1="12" y1="16" x2="12.01" y2="16" />
                                    </svg>
                                    {errors.confirmar_contrasena}
                                </span>
                            )}
                        </div>

                        <button type="submit" className="btn btn-primary btn-submit" disabled={loading}>
                            {loading ? (
                                <>
                                    <span className="spinner"></span>
                                    Creando cuenta...
                                </>
                            ) : (
                                <>
                                    <span>Registrarme</span>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                        <polyline points="22 4 12 14.01 9 11.01" />
                                    </svg>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="register-footer">
                        <p className="login-text">
                            ¿Ya tienes una cuenta?{' '}
                            <Link to="/login" className="link-primary">
                                Inicia sesión aquí
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register
