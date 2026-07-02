import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile } from '../services/authService';

const Perfil = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const profileData = await getProfile();
                // Sincronizar el saldo actualizado en localStorage
                // para que otros componentes también tengan el dato fresco
                const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
                localStorage.setItem('user', JSON.stringify({
                    ...storedUser,
                    saldo_metrocoins: profileData.saldo_metrocoins
                }));
                setUser(profileData);
            } catch (err) {
                console.error(err);
                setError('Error al cargar el perfil');
            } finally {
                setLoading(false);
            }
        };

        // Re-ejecutar cada vez que el usuario navega al perfil
        setLoading(true);
        fetchProfile();
    }, []);

    if (loading) {
        return (
            <div className="wrapped-loading" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', color: '#00ff88', flexDirection: 'column', gap: '1rem' }}>
                <i className="fas fa-circle-notch fa-spin" style={{ fontSize: '3rem' }}></i>
                <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Cargando perfil...</p>
            </div>
        );
    }

    if (error || !user) {
        return (
            <div className="wrapped-error" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', color: '#e74c3c', flexDirection: 'column', gap: '1rem' }}>
                <i className="fas fa-exclamation-triangle" style={{ fontSize: '3rem' }}></i>
                <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{error || 'No se pudo cargar el perfil'}</p>
            </div>
        );
    }

    // Formatear fecha de registro con validación
    let miembroDesde = 'MetroMed';
    if (user.fecha_registro) {
        const fechaReg = new Date(user.fecha_registro);
        if (!isNaN(fechaReg.getTime())) {
            miembroDesde = fechaReg.toLocaleDateString('es-ES', { year: 'numeric', month: 'long' });
        }
    }

    // Calcular nivel dinámico (1 nivel por cada 250 MetroCoins, mínimo nivel 1)
    const metrocoins = parseFloat(user.saldo_metrocoins) || 0;
    const nivel = Math.max(1, Math.floor(metrocoins / 250) + 1);

    return (
        <div className="game-card">
            <h2><i className="fas fa-user-circle"></i> Mi Perfil MetroMed</h2>

            <div className="profile-info">
                <div className="perfil-container fade-in">
                    <div className="profile-header">
                        <div className="profile-avatar-large">
                            {user.nombre ? user.nombre[0].toUpperCase() : 'U'}
                        </div>
                        <div className="profile-name">
                            <h2>{user.nombre}</h2>
                            <p className="profile-email">{user.correo}</p>
                        </div>
                    </div>

                    <div className="profile-details">
                        <div className="detail-item">
                            <span className="detail-label"><i className="fas fa-coins"></i> MetroCoins</span>
                            <span className="detail-value">{metrocoins.toLocaleString()}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label"><i className="fas fa-calendar-alt"></i> Miembro desde</span>
                            <span className="detail-value" style={{ textTransform: 'capitalize' }}>{miembroDesde}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label"><i className="fas fa-level-up-alt"></i> Nivel</span>
                            <span className="detail-value">{nivel} - MetroExperto</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label"><i className="fas fa-trophy"></i> Racha actual</span>
                            <span className="detail-value">7 días</span>
                        </div>
                    </div>

                    <div className="profile-actions">
                        <button className="action-btn" onClick={() => navigate('/Dashboard/juegos')} style={{ background: 'linear-gradient(90deg, #00ff88, #00d9ff)', color: '#000', fontWeight: 'bold' }}>
                            <i className="fas fa-gamepad"></i> Ir a Juegos
                        </button>
                        <button className="action-btn" onClick={() => navigate('/Dashboard/configuracion')}>
                            <i className="fas fa-cog"></i> Ajustes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Perfil;