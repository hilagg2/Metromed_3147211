const { pool } = require('../config/database');

/**
 * Registra una acción administrativa en la tabla de auditoría.
 * Esta función está diseñada para ser inyectada en otros controladores (ej. usuarios, alertas).
 * 
 * @async
 * @function logAuditoria
 * @param {number} id_admin - El ID del administrador que está realizando la acción.
 * @param {string} accion - Tipo de acción realizada (ej: 'CREAR', 'ACTUALIZAR', 'ELIMINAR', 'REENVIAR').
 * @param {string} entidad - Nombre del módulo o tabla afectada (ej: 'USUARIO', 'ALERTA').
 * @param {string|number|null} [entidad_id=null] - Identificador único del registro afectado.
 * @param {Object} [detalles={}] - Objeto JSON con detalles adicionales sobre la acción (ej. qué campos cambiaron).
 * @returns {Promise<void>} No retorna nada, pero maneja sus propios errores para no bloquear el flujo principal.
 */
const logAuditoria = async (id_admin, accion, entidad, entidad_id = null, detalles = {}) => {
    try {
        await pool.query(
            'INSERT INTO auditoria_admin (id_admin, accion, entidad, entidad_id, detalles) VALUES ($1, $2, $3, $4, $5)',
            [id_admin, accion, entidad, entidad_id, JSON.stringify(detalles)]
        );
    } catch (error) {
        console.error('⚠️ Error al registrar en auditoría:', error);
    }
};

/**
 * Obtiene el historial completo de acciones de auditoría.
 * Realiza un JOIN con la tabla de usuarios para traer el nombre y correo del administrador.
 * 
 * @async
 * @function getHistorialAuditoria
 * @param {Object} req - Objeto de petición Express. Se espera que contenga el token validado del admin.
 * @param {Object} res - Objeto de respuesta Express.
 * @returns {Promise<void>} Envía un JSON al cliente con los últimos 100 registros ordenados por fecha descendente.
 */
const getHistorialAuditoria = async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT a.id_auditoria, a.accion, a.entidad, a.entidad_id, a.detalles, a.fecha_accion,
                    u.nombre as admin_nombre, u.correo as admin_correo
             FROM auditoria_admin a
             JOIN usuarios u ON a.id_admin = u.id_usuario
             ORDER BY a.fecha_accion DESC
             LIMIT 100`
        );
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error('Error al obtener historial de auditoría:', error);
        res.status(500).json({ success: false, message: 'Error al obtener auditoría.' });
    }
};

module.exports = {
    logAuditoria,
    getHistorialAuditoria,
};
