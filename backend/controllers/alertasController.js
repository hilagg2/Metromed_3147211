const { pool }                = require('../config/database');
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
             WHERE h.id_usuario = $1
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
            'UPDATE historial_alertas_usuario SET leida = TRUE WHERE id_historial = $1 AND id_usuario = $2',
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
            'SELECT * FROM preferencias_alertas WHERE id_usuario = $1',
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
             VALUES ($1, $2, $3, $4, $5, $6)
             ON CONFLICT (id_usuario) DO UPDATE SET
               canal_panel          = EXCLUDED.canal_panel,
               canal_correo         = EXCLUDED.canal_correo,
               alerta_retraso       = EXCLUDED.alerta_retraso,
               alerta_cierre        = EXCLUDED.alerta_cierre,
               alerta_mantenimiento = EXCLUDED.alerta_mantenimiento`,
            [id_usuario,
             canal_panel          ?? true,
             canal_correo         ?? false,
             alerta_retraso       ?? true,
             alerta_cierre        ?? true,
             alerta_mantenimiento ?? true]
        );

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
};
