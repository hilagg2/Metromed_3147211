import React, { useEffect, useState, useCallback } from 'react';
import { io } from 'socket.io-client';
import toast, { Toaster } from 'react-hot-toast';
import { getHistorialUsuario, marcarAlertaLeida } from '../services/alertasService';
import './NotificationsPanel.css';

const API_URL = 'http://localhost:5000';

const TIPO_META = {
    retraso:          { icon: '🕐', label: 'Retraso' },
    cierre_estacion:  { icon: '🚫', label: 'Cierre de Estación' },
    mantenimiento:    { icon: '🔧', label: 'Mantenimiento' },
};

/**
 * Formatea una fecha ISO a una cadena legible.
 */
const formatFecha = (iso) => {
    const d = new Date(iso);
    return d.toLocaleString('es-CO', {
        day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
    });
};

/**
 * RF-43, RF-44, RF-45 — Panel de notificaciones en tiempo real.
 * Muestra alertas más recientes primero (RN-43.3) y emite Toasts emergentes (RN-44.3).
 *
 * @param {{ userId: number }} props
 */
const NotificationsPanel = ({ userId }) => {
    const [alertas,     setAlertas]     = useState([]);
    const [connected,   setConnected]   = useState(false);
    const [noLeidas,    setNoLeidas]    = useState(0);

    // ── Carga inicial del historial (RF-45) ───────────────────────────────────
    const fetchHistorial = useCallback(async () => {
        try {
            const { success, data } = await getHistorialUsuario();
            if (success && data) {
                setAlertas(data);                              // Ya viene en orden DESC
                setNoLeidas(data.filter(a => !a.leida).length);
            }
        } catch (err) {
            console.error('Error cargando historial:', err);
        }
    }, []);

    // ── Socket.io: tiempo real (RF-43, RN-43.1, RN-43.2) ────────────────────
    useEffect(() => {
        if (!userId) return;

        fetchHistorial();

        const socket = io(API_URL, {
            auth: { userId },        // Room individual por usuario (RN-43.1)
            transports: ['websocket'],
        });

        socket.on('connect',    () => setConnected(true));
        socket.on('disconnect', () => setConnected(false));

        socket.on('nueva_notificacion', (alerta) => {
            // RN-43.3: Prepend — la más reciente va primero
            setAlertas(prev => [{ ...alerta, leida: false }, ...prev]);
            setNoLeidas(n => n + 1);

            // RN-44.3: Toast emergente con tipo, estación y hora
            const meta = TIPO_META[alerta.tipo_evento] || { icon: '🔔', label: alerta.tipo_evento };
            toast.custom((t) => (
                <div
                    className={`alert-toast alert-toast-${alerta.tipo_evento === 'mantenimiento' ? 'warn' : 'error'}`}
                    style={{ opacity: t.visible ? 1 : 0, transition: 'opacity 0.3s' }}
                >
                    <div className="toast-body">
                        <span className="toast-tipo">{meta.icon} {meta.label}</span>
                        <span className="toast-titulo">{alerta.titulo}</span>
                        <span className="toast-lugar">📍 {alerta.entidad_afectada} · {formatFecha(alerta.fecha_recepcion)}</span>
                    </div>
                </div>
            ), { duration: 7000, position: 'top-right' });
        });

        return () => socket.disconnect();
    }, [userId, fetchHistorial]);

    // ── Marcar alerta como leída ──────────────────────────────────────────────
    const handleLeer = async (alerta) => {
        if (alerta.leida) return;
        await marcarAlertaLeida(alerta.id_historial);
        setAlertas(prev =>
            prev.map(a => a.id_historial === alerta.id_historial ? { ...a, leida: true } : a)
        );
        setNoLeidas(n => Math.max(0, n - 1));
    };

    // ── Marcar todas como leídas ──────────────────────────────────────────────
    const marcarTodas = async () => {
        const noLeidasList = alertas.filter(a => !a.leida);
        await Promise.all(noLeidasList.map(a => marcarAlertaLeida(a.id_historial)));
        setAlertas(prev => prev.map(a => ({ ...a, leida: true })));
        setNoLeidas(0);
    };

    return (
        <>
            <Toaster />
            <div className="notifications-panel">
                {/* Header */}
                <div className="notif-header">
                    <span className="notif-title">
                        🔔 Notificaciones
                        {noLeidas > 0 && <span className="notif-badge">{noLeidas}</span>}
                    </span>
                    {noLeidas > 0 && (
                        <button className="notif-mark-all" onClick={marcarTodas}>
                            Marcar todas leídas
                        </button>
                    )}
                </div>

                {/* Indicador de conexión */}
                {!connected && (
                    <div className="notif-connecting">
                        <span className="dot-blink">●</span>
                        Conectando al panel de alertas...
                    </div>
                )}

                {/* Lista de alertas (RN-43.3: orden descendente) */}
                {alertas.length === 0 ? (
                    <div className="notif-empty">
                        <span className="empty-icon">🔕</span>
                        <p>No tienes alertas recientes.</p>
                    </div>
                ) : (
                    <ul className="notif-list">
                        {alertas.map((a, idx) => {
                            const meta = TIPO_META[a.tipo_evento] || { icon: '🔔', label: a.tipo_evento };
                            return (
                                <li
                                    key={a.id_historial ?? `new-${idx}`}
                                    className={`notif-item ${!a.leida ? 'unread' : ''}`}
                                    onClick={() => handleLeer(a)}
                                >
                                    <div className={`notif-icon ${a.tipo_evento}`}>{meta.icon}</div>
                                    <div className="notif-content">
                                        <div className={`notif-tipo ${a.tipo_evento}`}>{meta.label}</div>
                                        <div className="notif-item-title">{a.titulo}</div>
                                        <div className="notif-place">📍 {a.entidad_afectada}</div>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                                        <span className="notif-time">{formatFecha(a.fecha_recepcion)}</span>
                                        {!a.leida && <span className="unread-dot" />}
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        </>
    );
};

export default NotificationsPanel;
