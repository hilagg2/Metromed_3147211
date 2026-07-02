/**
 * reportesController.js — RF-33, RF-34, RF-35, RF-36
 * Gestión administrativa de reportes con auditoría.
 */

const { pool } = require('../config/mysqlPool');

// ─── Helper de auditoría ──────────────────────────────────────────────────────
const registrarAuditoria = async (idReporte, idAdmin, accion, descripcion) => {
    try {
        await pool.query(
            `INSERT INTO auditoria_reportes (id_reporte, id_administrador, accion, descripcion)
             VALUES (?, ?, ?, ?)`,
            [idReporte, idAdmin, accion, descripcion]
        );
    } catch (err) {
        console.error('⚠️  Error al registrar auditoría de reporte:', err.message);
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// RF-33 / RF-34: Registrar reporte
// POST /api/reportes
// ─────────────────────────────────────────────────────────────────────────────
const crearReporte = async (req, res) => {
    const { tipo, descripcion, id_usuario_afectado } = req.body;
    const adminId = req.user?.id;

    if (!tipo || !descripcion) {
        return res.status(400).json({
            success: false,
            message: 'Tipo y descripción son obligatorios.'
        });
    }

    if (!['problema_tecnico', 'sugerencia'].includes(tipo)) {
        return res.status(400).json({
            success: false,
            message: 'Tipo debe ser "problema_tecnico" o "sugerencia".'
        });
    }

    try {
        const [result] = await pool.query(
            `INSERT INTO reportes (tipo, descripcion, estado, id_usuario_creador, id_usuario_afectado)
             VALUES (?, ?, 'pendiente', ?, NULL)`,
            [tipo, descripcion, req.user?.id]
        );

        res.status(201).json({
            success: true,
            message: 'Reporte registrado exitosamente',
            id: result.insertId
        });
    } catch (error) {
        console.error('Error al crear reporte:', error);
        res.status(500).json({ success: false, message: 'Error al crear el reporte' });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// RF-35: Historial de reportes con filtros
// GET /api/reportes
// Query params: tipo, estado, fecha_desde, fecha_hasta
// ─────────────────────────────────────────────────────────────────────────────
const getReportes = async (req, res) => {
    const { tipo, estado, fecha_desde, fecha_hasta } = req.query;

    let sql = `
        SELECT
            r.id_reporte,
            r.tipo,
            r.descripcion,
            r.estado,
            uc.nombre  AS usuario_creador,
            ua.nombre  AS usuario_afectado,
            ar.nombre  AS administrador_revisor,
            DATE_FORMAT(r.fecha_creacion, '%Y-%m-%d %H:%i') AS fecha_creacion,
            DATE_FORMAT(r.fecha_revision, '%Y-%m-%d %H:%i') AS fecha_revision
        FROM reportes r
        LEFT JOIN usuarios uc  ON uc.id_usuario  = r.id_usuario_creador
        LEFT JOIN usuarios ua  ON ua.id_usuario  = r.id_usuario_afectado
        LEFT JOIN usuarios ar  ON ar.id_usuario  = r.id_administrador_revisor
        WHERE 1=1
    `;
    const params = [];

    if (tipo && tipo !== 'todos') {
        sql += ' AND r.tipo = ?';
        params.push(tipo);
    }

    if (estado && estado !== 'todos') {
        sql += ' AND r.estado = ?';
        params.push(estado);
    }

    if (fecha_desde) {
        sql += ' AND r.fecha_creacion >= ?';
        params.push(fecha_desde + ' 00:00:00');
    }

    if (fecha_hasta) {
        sql += ' AND r.fecha_creacion <= ?';
        params.push(fecha_hasta + ' 23:59:59');
    }

    sql += ' ORDER BY r.fecha_creacion DESC LIMIT 200';

    try {
        const [rows] = await pool.query(sql, params);
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error('Error al obtener reportes:', error);
        res.status(500).json({ success: false, message: 'Error al obtener reportes' });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// RF-36: Cambiar estado de reporte (solo admin)
// PATCH /api/reportes/:id/estado
// ─────────────────────────────────────────────────────────────────────────────
const cambiarEstadoReporte = async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;
    const adminId = req.user?.id;

    if (!['pendiente', 'validado', 'descartado'].includes(estado)) {
        return res.status(400).json({
            success: false,
            message: 'Estado debe ser "pendiente", "validado" o "descartado".'
        });
    }

    try {
        const [rows] = await pool.query(
            'SELECT id_reporte, tipo, estado AS estado_anterior FROM reportes WHERE id_reporte = ?',
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Reporte no encontrado' });
        }

        await pool.query(
            `UPDATE reportes
             SET estado = ?, fecha_revision = NOW(), id_administrador_revisor = ?
             WHERE id_reporte = ?`,
            [estado, adminId, id]
        );

        await registrarAuditoria(
            id,
            adminId,
            'CAMBIAR_ESTADO',
            `Estado cambiado de "${rows[0].estado_anterior}" a "${estado}"`
        );

        res.json({ success: true, message: `Reporte marcado como "${estado}"` });
    } catch (error) {
        console.error('Error al cambiar estado del reporte:', error);
        res.status(500).json({ success: false, message: 'Error al cambiar el estado' });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// Auditoría de reportes
// GET /api/reportes/auditoria
// ─────────────────────────────────────────────────────────────────────────────
const getAuditoriaReportes = async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT
                ar.id_auditoria,
                ar.id_reporte,
                r.tipo AS tipo_reporte,
                u.nombre AS administrador,
                ar.accion,
                ar.descripcion,
                DATE_FORMAT(ar.fecha, '%Y-%m-%d %H:%i:%s') AS fecha
             FROM auditoria_reportes ar
             JOIN reportes  r ON r.id_reporte = ar.id_reporte
             JOIN usuarios  u ON u.id_usuario = ar.id_administrador
             ORDER BY ar.fecha DESC
             LIMIT 200`
        );
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error('Error al obtener auditoría de reportes:', error);
        res.status(500).json({ success: false, message: 'Error al obtener auditoría' });
    }
};

module.exports = {
    crearReporte,
    getReportes,
    cambiarEstadoReporte,
    getAuditoriaReportes,
};
