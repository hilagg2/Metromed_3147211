/**
 * alertasService.js
 * Servicio frontend para consumir la API de Alertas y Notificaciones.
 */

import { API_BASE_URL } from '../config/api';

const API_URL = `${API_BASE_URL}/api/alerts`;

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
};

/** GET /api/alerts/history — Historial propio del usuario (RF-45) */
export const getHistorialUsuario = async () => {
    const res = await fetch(`${API_URL}/history`, { headers: getAuthHeaders() });
    return res.json();
};

/** PUT /api/alerts/history/:id/read — Marcar alerta como leída */
export const marcarAlertaLeida = async (id_historial) => {
    const res = await fetch(`${API_URL}/history/${id_historial}/read`, {
        method: 'PUT',
        headers: getAuthHeaders(),
    });
    return res.json();
};

/** GET /api/alerts/preferences — Obtener preferencias (RF-41) */
export const getPreferencias = async () => {
    const res = await fetch(`${API_URL}/preferences`, { headers: getAuthHeaders() });
    return res.json();
};

/** PUT /api/alerts/preferences — Guardar preferencias (RF-41, RF-42) */
export const savePreferencias = async (prefs) => {
    const res = await fetch(`${API_URL}/preferences`, {
        method:  'PUT',
        headers: getAuthHeaders(),
        body:    JSON.stringify(prefs),
    });
    return res.json();
};

/** POST /api/alerts/admin — Crear alerta (Admin, RF-44) */
export const crearAlerta = async (alertaData) => {
    const res = await fetch(`${API_URL}/admin`, {
        method:  'POST',
        headers: getAuthHeaders(),
        body:    JSON.stringify(alertaData),
    });
    return res.json();
};

/** GET /api/alerts/admin/history — Historial global Admin (RF-46) */
export const getHistorialGlobal = async () => {
    const res = await fetch(`${API_URL}/admin/history`, { headers: getAuthHeaders() });
    return res.json();
};
