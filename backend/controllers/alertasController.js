const { pool }                = require('../config/mysqlPool');
const { procesarYEnviarAlerta } = require('../services/alertService');

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/admin/alerts  —  Crear y emitir una alerta (RF-44, Admin only)
// ─────────────────────────────────────────────────────────────────────────────
const crearAlerta = async (req, res) => {
    const { tipo_evento, titulo, descripcion, entidad_afectada } = req.body;
    const io = req.app.get('io');

    if (!tipo_evento || !titulo || !descripcion || !entidad_afectada) {
        return res.status(400).json({ success: false, message: 'Todos los campos son requeridos.' });
    }

    try {
        const resultado = await procesarYEnviarAlerta(io, { tipo_evento, titulo, descripcion, entidad_afectada });
        res.status(201).json({
            success: true,
            message: `Alerta procesada. ${resultado.usuariosNotificados} usuario(s) notificado(s).`,
            ...resultado,
        });
    } catch (error) {
        console.error('Error al crear alerta:', error);
        res.status(500).json({ success: false, message: error.message || 'Error al procesar la alerta.' });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/admin/alerts/history  —  Historial global para auditoría (RF-46)
// ─────────────────────────────────────────────────────────────────────────────
const getHistorialGlobal = async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT id_notificacion, tipo_evento, titulo, entidad_afectada,
                    descripcion, fecha_generacion, canales_enviados
             FROM notificaciones_globales
             ORDER BY fecha_generacion DESC`  // RN-43.3
        );
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error('Error al obtener historial global:', error);
        res.status(500).json({ success: false, message: 'Error al obtener historial.' });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /api/admin/alerts/history/:id  —  Eliminar alerta global
// ─────────────────────────────────────────────────────────────────────────────
const deleteAlerta = async (req, res) => {
    const { id } = req.params;
    const io = req.app.get('io');
    
    try {
        const [result] = await pool.query(
            'DELETE FROM notificaciones_globales WHERE id_notificacion = ?',
            [id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Alerta no encontrada.' });
        }

        // Emitir evento para que los clientes actualicen su interfaz en tiempo real
        if (io) {
            io.emit('alerta_eliminada', { id_notificacion: parseInt(id, 10) });
        }

        res.json({ success: true, message: 'Alerta eliminada correctamente.' });
    } catch (error) {
        console.error('Error al eliminar alerta:', error);
        res.status(500).json({ success: false, message: 'Error al eliminar alerta.' });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/alerts/history  —  Historial individual del usuario (RF-45)
// ─────────────────────────────────────────────────────────────────────────────
const getHistorialUsuario = async (req, res) => {
    const id_usuario = req.user.id;
    try {
        const [rows] = await pool.query(
            `SELECT h.id_historial, n.id_notificacion, n.tipo_evento, n.titulo,
                    n.descripcion, n.entidad_afectada, h.leida, h.fecha_recepcion
             FROM historial_alertas_usuario h
             JOIN notificaciones_globales n ON h.id_notificacion = n.id_notificacion
             WHERE h.id_usuario = ?
             ORDER BY h.fecha_recepcion DESC`,   // RN-43.3, RN-45.1
            [id_usuario]
        );
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error('Error al obtener historial usuario:', error);
        res.status(500).json({ success: false, message: 'Error al obtener historial.' });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// PUT /api/alerts/history/:id/read  —  Marcar alerta como leída
// ─────────────────────────────────────────────────────────────────────────────
const marcarLeida = async (req, res) => {
    const id_usuario  = req.user.id;
    const id_historial = req.params.id;
    try {
        await pool.query(
            'UPDATE historial_alertas_usuario SET leida = TRUE WHERE id_historial = ? AND id_usuario = ?',
            [id_historial, id_usuario]
        );
        res.json({ success: true, message: 'Alerta marcada como leída.' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al actualizar.' });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/alerts/preferences  —  Obtener preferencias del usuario (RF-41)
// ─────────────────────────────────────────────────────────────────────────────
const getPreferencias = async (req, res) => {
    const id_usuario = req.user.id;
    try {
        const [rows] = await pool.query(
            'SELECT * FROM preferencias_alertas WHERE id_usuario = ?',
            [id_usuario]
        );

        // Si no tiene prefs aún, devolver defaults
        const defaults = {
            id_usuario,
            canal_panel:          true,
            canal_correo:         false,
            alerta_retraso:       true,
            alerta_cierre:        true,
            alerta_mantenimiento: true,
        };

        res.json({ success: true, data: rows[0] || defaults });
    } catch (error) {
        console.error('Error al obtener preferencias:', error);
        res.status(500).json({ success: false, message: 'Error al obtener preferencias.' });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// PUT /api/alerts/preferences  —  Actualizar preferencias (RF-41, RF-42)
// ─────────────────────────────────────────────────────────────────────────────
const updatePreferencias = async (req, res) => {
    const id_usuario = req.user.id;
    const { canal_panel, canal_correo, alerta_retraso, alerta_cierre, alerta_mantenimiento } = req.body;

    try {
        // UPSERT: crea si no existe, actualiza si ya existe (RN-42.2)
        await pool.query(
            `INSERT INTO preferencias_alertas
             (id_usuario, canal_panel, canal_correo, alerta_retraso, alerta_cierre, alerta_mantenimiento)
             VALUES (?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE
               canal_panel          = VALUES(canal_panel),
               canal_correo         = VALUES(canal_correo),
               alerta_retraso       = VALUES(alerta_retraso),
               alerta_cierre        = VALUES(alerta_cierre),
               alerta_mantenimiento = VALUES(alerta_mantenimiento)`,
            [id_usuario,
             canal_panel          ?? true,
             canal_correo         ?? false,
             alerta_retraso       ?? true,
             alerta_cierre        ?? true,
             alerta_mantenimiento ?? true]
        );

        // RN-41.3 & RN-42.3: Respuesta de confirmación inmediata
        res.json({ success: true, message: 'Preferencias guardadas correctamente.' });
    } catch (error) {
        console.error('Error al guardar preferencias:', error);
        res.status(500).json({ success: false, message: 'Error al guardar preferencias.' });
    }
};

module.exports = {
    crearAlerta,
    getHistorialGlobal,
    getHistorialUsuario,
    marcarLeida,
    getPreferencias,
    updatePreferencias,
    deleteAlerta,
};
