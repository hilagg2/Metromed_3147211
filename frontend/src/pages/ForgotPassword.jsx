import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { forgotPassword, verifyCode, resetPassword } from '../services/authService'
import './ForgotPassword.css'

function ForgotPassword() {
    const navigate = useNavigate()
    const [step, setStep] = useState(1) // 1: email, 2: code, 3: new password
    const [email, setEmail] = useState('')
    const [code, setCode] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [resetToken, setResetToken] = useState('')

    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    // Step 1: Solicitar código
    const handleRequestCode = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        setSuccess('')

        try {
            await forgotPassword(email)
            setSuccess('¡Código enviado! Revisa tu correo electrónico.')
            setTimeout(() => {
                setStep(2)
                setSuccess('')
            }, 2000)
        } catch (err) {
            setError(err.message || 'Error al enviar el código')
        } finally {
            setLoading(false)
        }
    }

    // Step 2: Verificar código
    const handleVerifyCode = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const response = await verifyCode(email, code)
            setResetToken(response.resetToken)
            setSuccess('¡Código verificado! Ahora crea tu nueva contraseña.')
            setTimeout(() => {
                setStep(3)
                setSuccess('')
            }, 1500)
        } catch (err) {
            setError(err.message || 'Código incorrecto o expirado')
        } finally {
            setLoading(false)
        }
    }

    // Step 3: Resetear contraseña
    const handleResetPassword = async (e) => {
        e.preventDefault()

        if (newPassword !== confirmPassword) {
            setError('Las contraseñas no coinciden')
            return
        }

        if (newPassword.length < 8) {
            setError('La contraseña debe tener mínimo 8 caracteres')
            return
        }

        setLoading(true)
        setError('')

        try {
            await resetPassword(resetToken, newPassword)
            setSuccess('¡Contraseña actualizada exitosamente!')
            setTimeout(() => {
                navigate('/login')
            }, 2000)
        } catch (err) {
            setError(err.message || 'Error al actualizar la contraseña')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="forgot-password-page">
            <div className="forgot-password-background"></div>

            {/* Particles */}
            <div className="particles">
                <div className="particle"></div>
                <div className="particle"></div>
                <div className="particle"></div>
                <div className="particle"></div>
                <div className="particle"></div>
            </div>

            <div className="forgot-password-container animate-scaleIn">
                <div className="forgot-password-header">
                    <Link to="/login" className="back-link">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                        Volver
                    </Link>
                    <img src="/img/logo_metromed.png" alt="MetroMed" className="forgot-password-logo pulse-logo" />
                </div>

                <div className="forgot-password-card glass">
                    <div className="card-glow"></div>

                    <h2 className="forgot-password-title">
                        <span className="title-icon">🔑</span>
                        Recuperar Contraseña
                    </h2>
                    <p className="forgot-password-subtitle">
                        {step === 1 && 'Te enviaremos un código de verificación'}
                        {step === 2 && 'Ingresa el código que recibiste'}
                        {step === 3 && 'Crea tu nueva contraseña'}
                    </p>

                    {/* Step indicator */}
                    <div className="step-indicator">
                        <div className={`step ${step >= 1 ? 'active' : ''}`}>1</div>
                        <div className={`step-line ${step >= 2 ? 'active' : ''}`}></div>
                        <div className={`step ${step >= 2 ? 'active' : ''}`}>2</div>
                        <div className={`step-line ${step >= 3 ? 'active' : ''}`}></div>
                        <div className={`step ${step >= 3 ? 'active' : ''}`}>3</div>
                    </div>

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

                    {success && (
                        <div className="success-banner">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                <polyline points="22 4 12 14.01 9 11.01" />
                            </svg>
                            {success}
                        </div>
                    )}

                    {/* Step 1: Email */}
                    {step === 1 && (
                        <form onSubmit={handleRequestCode} className="forgot-password-form">
                            <div className="form-group">
                                <label htmlFor="email" className="form-label">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                        <polyline points="22,6 12,13 2,6" />
                                    </svg>
                                    Correo Electrónico
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    className="form-input"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="tu@email.com"
                                    required
                                    disabled={loading}
                                />
                            </div>

                            <button type="submit" className="btn btn-primary btn-submit" disabled={loading}>
                                {loading ? (
                                    <>
                                        <span className="spinner"></span>
                                        Enviando código...
                                    </>
                                ) : (
                                    <>
                                        Enviar Código
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M5 12h14M12 5l7 7-7 7" />
                                        </svg>
                                    </>
                                )}
                            </button>
                        </form>
                    )}

                    {/* Step 2: Code */}
                    {step === 2 && (
                        <form onSubmit={handleVerifyCode} className="forgot-password-form">
                            <div className="form-group">
                                <label htmlFor="code" className="form-label">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                    </svg>
                                    Código de Verificación
                                </label>
                                <input
                                    type="text"
                                    id="code"
                                    className="form-input code-input"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    placeholder="123456"
                                    maxLength="6"
                                    required
                                    disabled={loading}
                                />
                                <p className="input-hint">Código de 6 dígitos enviado a {email}</p>
                            </div>

                            <button type="submit" className="btn btn-primary btn-submit" disabled={loading || code.length !== 6}>
                                {loading ? (
                                    <>
                                        <span className="spinner"></span>
                                        Verificando...
                                    </>
                                ) : (
                                    <>
                                        Verificar Código
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                            <polyline points="22 4 12 14.01 9 11.01" />
                                        </svg>
                                    </>
                                )}
                            </button>

                            <button
                                type="button"
                                className="btn-text"
                                onClick={() => setStep(1)}
                                disabled={loading}
                            >
                                ← Cambiar correo
                            </button>
                        </form>
                    )}

                    {/* Step 3: New Password */}
                    {step === 3 && (
                        <form onSubmit={handleResetPassword} className="forgot-password-form">
                            <div className="form-group">
                                <label htmlFor="newPassword" className="form-label">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                    </svg>
                                    Nueva Contraseña
                                </label>
                                <div className="password-wrapper">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id="newPassword"
                                        className="form-input"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="••••••••"
                                        required
                                        disabled={loading}
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => setShowPassword(!showPassword)}
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

                            <div className="form-group">
                                <label htmlFor="confirmPassword" className="form-label">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M9 11l3 3L22 4" />
                                        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                                    </svg>
                                    Confirmar Contraseña
                                </label>
                                <div className="password-wrapper">
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        id="confirmPassword"
                                        className="form-input"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="••••••••"
                                        required
                                        disabled={loading}
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                            </div>

                            <button type="submit" className="btn btn-primary btn-submit" disabled={loading}>
                                {loading ? (
                                    <>
                                        <span className="spinner"></span>
                                        Actualizando...
                                    </>
                                ) : (
                                    <>
                                        Actualizar Contraseña
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                            <polyline points="22 4 12 14.01 9 11.01" />
                                        </svg>
                                    </>
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword
