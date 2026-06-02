import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Perfil = ({ showSection }) => {
    const [userData, setUserData] = useState(null);
    const [historial, setHistorial] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPerfilData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const config = { headers: { Authorization: `Bearer ${token}` } };
                
                // Asumiendo que existe una ruta en authRoutes o usuarioRoutes que devuelve el perfil completo
                // Por ahora usaremos el localStorage y las rutas de juegos para historial
                const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
                setUserData(storedUser);

                const histRes = await axios.get('http://localhost:5000/api/juegos/historial', config);
                if (histRes.data.success) {
                    setHistorial(histRes.data.historial);
                }
            } catch (error) {
                console.error('Error fetching profile data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPerfilData();
    }, []);

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Cargando perfil...</div>;

    const initials = userData?.nombre ? userData.nombre.substring(0, 2).toUpperCase() : 'U';
    
    // Si la BD no devuelve saldo o nivel en el localStorage, ponemos valores por defecto
    // (Lo ideal es actualizar el localStorage cuando se juega o hacer un fetch al endpoint de perfil)
    const saldo = userData?.saldo_metrocoins || 0;
    const nivel = userData?.nivel || 1;

    return (
        <div className="profile-container" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="game-card" style={{ margin: 0 }}>
                <h2><i className="fas fa-user-circle"></i> Mi Perfil MetroMed</h2>

                <div className="profile-info">
                    <div className="profile-header">
                        <div className="profile-avatar-large">{initials}</div>
                        <div className="profile-name">
                            <h2>{userData?.nombre || 'Usuario'}</h2>
                            <p className="profile-email">{userData?.correo || 'correo@ejemplo.com'}</p>
                        </div>
                    </div>

                    <div className="profile-details">
                        <div className="detail-item">
                            <span className="detail-label"><i className="fas fa-coins" style={{ color: 'gold' }}></i> MetroCoins</span>
                            <span className="detail-value">{saldo}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label"><i className="fas fa-level-up-alt" style={{ color: 'var(--primary)' }}></i> Nivel</span>
                            <span className="detail-value">{nivel}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label"><i className="fas fa-id-badge"></i> Rol</span>
                            <span className="detail-value" style={{ textTransform: 'capitalize' }}>{userData?.rol || 'Usuario'}</span>
                        </div>
                    </div>

                    <div className="profile-actions">
                        <button className="action-btn" onClick={() => showSection('configuracion')}>
                            <i className="fas fa-cog"></i> Configuración
                        </button>
                    </div>
                </div>
            </div>

            <div className="game-card" style={{ margin: 0 }}>
                <h2><i className="fas fa-history"></i> Historial de Juegos</h2>
                {historial.length === 0 ? (
                    <p style={{ color: 'var(--text-light)', textAlign: 'center', padding: '2rem 0' }}>
                        Aún no has jugado. ¡Ve a la sección de Juegos y gana MetroCoins!
                    </p>
                ) : (
                    <div style={{ overflowX: 'auto', marginTop: '1rem' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-light)' }}>
                                    <th style={{ padding: '0.75rem' }}>Fecha</th>
                                    <th style={{ padding: '0.75rem' }}>Juego</th>
                                    <th style={{ padding: '0.75rem' }}>Detalles</th>
                                    <th style={{ padding: '0.75rem' }}>Monedas</th>
                                </tr>
                            </thead>
                            <tbody>
                                {historial.map(h => (
                                    <tr key={h.id_historial} style={{ borderBottom: '1px solid var(--border)' }}>
                                        <td style={{ padding: '0.75rem', fontSize: '0.9rem' }}>
                                            {new Date(h.fecha_jugada).toLocaleDateString()} {new Date(h.fecha_jugada).toLocaleTimeString()}
                                        </td>
                                        <td style={{ padding: '0.75rem', fontWeight: 'bold' }}>{h.juego}</td>
                                        <td style={{ padding: '0.75rem', color: 'var(--text-light)', fontSize: '0.9rem' }}>{h.detalles}</td>
                                        <td style={{ padding: '0.75rem', fontWeight: 'bold', color: h.monedas_obtenidas > 0 ? '#34c759' : 'var(--text)' }}>
                                            {h.monedas_obtenidas > 0 ? '+' : ''}{h.monedas_obtenidas}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Perfil;
