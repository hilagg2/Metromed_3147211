import React, { useEffect, useState, useCallback } from 'react';
import { io } from 'socket.io-client';
import toast, { Toaster } from 'react-hot-toast';
import { getHistorialUsuario, marcarAlertaLeida } from '../services/alertasService';
import './UserNotificaciones.css';

const API_URL = 'http://localhost:5000';

const TIPO_META = {
    retraso:          { icon: '🕐', label: 'Retraso', color: '#ff0055' },
    cierre_estacion:  { icon: '🚫', label: 'Cierre de Estación', color: '#e74c3c' },
    mantenimiento:    { icon: '🔧', label: 'Mantenimiento', color: '#f39c12' },
};

const formatFecha = (iso) => {
    const d = new Date(iso);
    return d.toLocaleString('es-CO', {
        weekday: 'long', day: 'numeric', month: 'long',
        hour: '2-digit', minute: '2-digit',
    });
};

const UserNotificaciones = () => {
    const [alertas, setAlertas] = useState([]);
    const [alertaSeleccionada, setAlertaSeleccionada] = useState(null);
    const [loading, setLoading] = useState(true);

    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = currentUser.id;

    const fetchHistorial = useCallback(async () => {
        setLoading(true);
        const { success, data } = await getHistorialUsuario();
        if (success && data) {
            setAlertas(data);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchHistorial();

        if (!userId) return;

        const socket = io(API_URL, {
            auth: { userId },
            transports: ['websocket'],
        });

        socket.on('nueva_notificacion', (alerta) => {
            setAlertas(prev => [{ ...alerta, leida: false }, ...prev]);
            
            const meta = TIPO_META[alerta.tipo_evento] || { icon: '🔔', label: alerta.tipo_evento, color: '#00ff88' };
            toast.custom((t) => (
                <div
                    style={{
                        background: '#050a08', border: `1px solid ${meta.color}`,
                        padding: '1rem', borderRadius: '8px', color: '#fff',
                        boxShadow: `0 0 15px ${meta.color}40`, opacity: t.visible ? 1 : 0, transition: 'opacity 0.3s'
                    }}
                >
                    <div style={{ fontWeight: 'bold', color: meta.color, marginBottom: '0.5rem' }}>
                        {meta.icon} {meta.label}
                    </div>
                    <div style={{ fontSize: '0.9rem', marginBottom: '0.2rem' }}>{alerta.titulo}</div>
                    <div style={{ fontSize: '0.8rem', color: '#888' }}>📍 {alerta.entidad_afectada}</div>
                </div>
            ), { duration: 7000, position: 'top-right' });
        });

        return () => socket.disconnect();
    }, [userId, fetchHistorial]);

    const handleSelectAlerta = async (alerta) => {
        setAlertaSeleccionada(alerta);
        if (!alerta.leida) {
            await marcarAlertaLeida(alerta.id_historial);
            setAlertas(prev => prev.map(a => a.id_historial === alerta.id_historial ? { ...a, leida: true } : a));
        }
    };

    const cerrarDetalle = () => setAlertaSeleccionada(null);

    return (
        <div className="user-notif-container">
            <Toaster />
            <div className="un-header">
                <h1 className="un-title"><i className="fas fa-bell"></i> Buzón de Alertas</h1>
                <p className="un-subtitle">Revisa el detalle de todas las notificaciones emitidas por MetroMed</p>
                <button onClick={fetchHistorial} className="un-refresh-btn">
                    <i className="fas fa-sync-alt"></i> Actualizar
                </button>
            </div>

            <div className="un-content">
                {/* LISTA DE ALERTAS */}
                <div className={`un-list-section ${alertaSeleccionada ? 'hide-on-mobile' : ''}`}>
                    {loading ? (
                        <div className="un-loading">
                            <i className="fas fa-circle-notch fa-spin"></i> Cargando alertas...
                        </div>
                    ) : alertas.length === 0 ? (
                        <div className="un-empty">
                            <div className="un-empty-icon">📭</div>
                            <p>No tienes alertas en tu historial.</p>
                        </div>
                    ) : (
                        <div className="un-list">
                            {alertas.map(a => {
                                const meta = TIPO_META[a.tipo_evento] || { icon: '🔔', label: a.tipo_evento, color: '#00ff88' };
                                const isSelected = alertaSeleccionada?.id_historial === a.id_historial;
                                
                                return (
                                    <div 
                                        key={a.id_historial} 
                                        className={`un-card ${!a.leida ? 'unread' : ''} ${isSelected ? 'selected' : ''}`}
                                        onClick={() => handleSelectAlerta(a)}
                                    >
                                        <div className="un-card-indicator" style={{ backgroundColor: meta.color }}></div>
                                        <div className="un-card-body">
                                            <div className="un-card-top">
                                                <span className="un-card-type" style={{ color: meta.color }}>
                                                    {meta.icon} {meta.label}
                                                </span>
                                                <span className="un-card-date">{new Date(a.fecha_recepcion).toLocaleDateString()}</span>
                                            </div>
                                            <h3 className="un-card-title">{a.titulo}</h3>
                                            <p className="un-card-desc-short">{a.descripcion.substring(0, 50)}...</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* DETALLE DE ALERTA */}
                <div className={`un-detail-section ${!alertaSeleccionada ? 'hide-on-mobile' : ''}`}>
                    {alertaSeleccionada ? (
                        <div className="un-detail-view">
                            <button className="un-back-btn" onClick={cerrarDetalle}>
                                <i className="fas fa-arrow-left"></i> Volver a la lista
                            </button>
                            
                            <div className="un-detail-card">
                                {(() => {
                                    const a = alertaSeleccionada;
                                    const meta = TIPO_META[a.tipo_evento] || { icon: '🔔', label: a.tipo_evento, color: '#00ff88' };
                                    return (
                                        <>
                                            <div className="un-detail-header" style={{ borderBottom: `2px solid ${meta.color}40` }}>
                                                <div className="un-detail-type" style={{ color: meta.color }}>
                                                    <span className="un-icon-large">{meta.icon}</span>
                                                    {meta.label}
                                                </div>
                                                <div className="un-detail-date">
                                                    <i className="far fa-calendar-alt"></i> {formatFecha(a.fecha_recepcion)}
                                                </div>
                                            </div>
                                            
                                            <div className="un-detail-body">
                                                <h2 className="un-detail-title">{a.titulo}</h2>
                                                
                                                <div className="un-detail-affected">
                                                    <div className="un-affected-label">Zona o Línea Afectada</div>
                                                    <div className="un-affected-value">
                                                        <i className="fas fa-map-marker-alt"></i> {a.entidad_afectada}
                                                    </div>
                                                </div>
                                                
                                                <div className="un-detail-desc">
                                                    <div className="un-desc-label">Detalles del Evento</div>
                                                    <div className="un-desc-text">{a.descripcion}</div>
                                                </div>
                                            </div>
                                        </>
                                    );
                                })()}
                            </div>
                        </div>
                    ) : (
                        <div className="un-no-selection">
                            <i className="fas fa-envelope-open-text"></i>
                            <p>Selecciona una alerta de la lista para ver sus detalles completos</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserNotificaciones;
