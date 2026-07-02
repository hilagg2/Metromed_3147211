/**
 * reportesService.js
 * Servicio frontend para gestión de reportes (RF-33 al RF-36).
 */

const API_URL = 'http://localhost:5000/api/reportes';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
};

/**
 * GET /api/reportes — Historial de reportes con filtros
 * @param {{ tipo, estado, fecha_desde, fecha_hasta }} filtros
 */
export const getReportes = async (filtros = {}) => {
    const params = new URLSearchParams();
    if (filtros.tipo    && filtros.tipo    !== 'todos') params.append('tipo',        filtros.tipo);
    if (filtros.estado  && filtros.estado  !== 'todos') params.append('estado',      filtros.estado);
    if (filtros.fecha_desde)                             params.append('fecha_desde', filtros.fecha_desde);
    if (filtros.fecha_hasta)                             params.append('fecha_hasta', filtros.fecha_hasta);

    const qs = params.toString();
    const res = await fetch(`${API_URL}${qs ? '?' + qs : ''}`, { headers: getAuthHeaders() });
    return res.json();
};

/**
 * POST /api/reportes — Crear reporte
 * @param {{ tipo, descripcion, id_usuario_afectado? }} data
 */
export const crearReporte = async (data) => {
    const res = await fetch(API_URL, {
        method:  'POST',
        headers: getAuthHeaders(),
        body:    JSON.stringify(data),
    });
    return res.json();
};

/**
 * PATCH /api/reportes/:id/estado — Cambiar estado del reporte
 * @param {number} id
 * @param {string} estado — 'pendiente' | 'validado' | 'descartado'
 */
export const cambiarEstadoReporte = async (id, estado) => {
    const res = await fetch(`${API_URL}/${id}/estado`, {
        method:  'PATCH',
        headers: getAuthHeaders(),
        body:    JSON.stringify({ estado }),
    });
    return res.json();
};

/** GET /api/reportes/auditoria — Auditoría de reportes */
export const getAuditoriaReportes = async () => {
    const res = await fetch(`${API_URL}/auditoria`, { headers: getAuthHeaders() });
    return res.json();
};
