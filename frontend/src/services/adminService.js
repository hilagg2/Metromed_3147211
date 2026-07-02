/**
 * adminService.js
 * Servicio frontend para el panel de administración.
 */

const API_URL = 'http://localhost:5000/api/admin';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
};

/** GET /api/admin/dashboard — Estadísticas del dashboard */
export const getDashboardStats = async () => {
    const res = await fetch(`${API_URL}/dashboard`, { headers: getAuthHeaders() });
    return res.json();
};

/**
 * GET /api/admin/auditoria — Auditoría general
 * @param {string} modulo - 'usuarios' | 'reportes' | 'juegos' | undefined (todos)
 */
export const getAuditoriaGeneral = async (modulo = '') => {
    const url = modulo ? `${API_URL}/auditoria?modulo=${modulo}` : `${API_URL}/auditoria`;
    const res = await fetch(url, { headers: getAuthHeaders() });
    return res.json();
};
