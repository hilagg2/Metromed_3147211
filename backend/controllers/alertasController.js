const { pool } = require('../config/database');
const { procesarYEnviarAlerta } = require('../services/alertService');
const { logAuditoria } = require('./auditoriaController');

/**
 * @module alertasController
 * @description Controlador principal para el módulo de Alertas y Notificaciones (RF-41 al RF-46).
 * Gestiona el ciclo completo de una alerta: creación, emisión en tiempo real (socket.io),
 * historial global/individual, preferencias de usuario, y operaciones de reenvío y borrado.
 *
 * Dependencias externas:
 *   - `alertService.procesarYEnviarAlerta`: Orquesta la emisión (Socket.io + email).
 *   - `auditoriaController.logAuditoria`: Registra acciones privilegiadas para trazabilidad.
 */

/**
 * Lista blanca de tipos de evento válidos.
 * Evita SQL injection y valores arbitrarios en el campo `tipo_evento` (RN-42.1).
 * @constant {string[]}
 */
const TIPOS_VALIDOS = ['retraso', 'cierre_estacion', 'mantenimiento'];

/**
 * Crea y emite una nueva alerta global al sistema.
 * Solo accesible para administradores (requiere middleware `requireAdmin`).
 *
 * Flujo:
 *  1. Valida que todos los campos estén presentes.
 *  2. Valida que `tipo_evento` esté en la lista blanca `TIPOS_VALIDOS`.
 *  3. Llama a `procesarYEnviarAlerta` que guarda en BD y emite via Socket.io + email.
 *  4. Registra la acción en la tabla de auditoría.
 *
 * @async
 * @function crearAlerta
 * @route POST /api/alerts
 * @param {import('express').Request} req - Body esperado: { tipo_evento, titulo, descripcion, entidad_afectada }
 * @param {import('express').Response} res - Respuesta con número de usuarios notificados.
 */
const crearAlerta = async (req, res) => {
    const { tipo_evento, titulo, descripcion, entidad_afectada } = req.body;
    const io = req.app.get('io');

    if (!tipo_evento || !titulo || !descripcion || !entidad_afectada) {
        return res.status(400).json({ success: false, message: 'Todos los campos son requeridos.' });
    }

    // Validar que el tipo_evento sea uno de los permitidos (RN-42.1)
    if (!TIPOS_VALIDOS.includes(tipo_evento)) {
        return res.status(400).json({
            success: false,
            message: `Tipo de evento inválido. Debe ser uno de: ${TIPOS_VALIDOS.join(', ')}.`
        });
    }

    try {
        const resultado = await procesarYEnviarAlerta(io, { tipo_evento, titulo, descripcion, entidad_afectada });
        // Auditoría: captura quién creó la alerta y con qué datos
        if (req.user?.id) {
            await logAuditoria(req.user.id, 'CREAR', 'ALERTA', String(idAlerta), { tipo_evento, titulo, entidad_afectada });
        }

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

/**
 * Obtiene el historial global de todas las alertas emitidas.
 * Usado en el panel de administración para auditoría general (RF-46).
 * Los resultados se ordenan de más reciente a más antiguo (RN-43.3).
 *
 * @async
 * @function getHistorialGlobal
 * @route GET /api/alerts/admin/history
 * @param {import('express').Request} req
 * @param {import('express').Response} res - JSON con array `data` de alertas.
 */
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

/**
 * Elimina una alerta global por su ID.
 * Gracias a la restricción `DELETE CASCADE` en `historial_alertas_usuario`,
 * al borrar de `notificaciones_globales` también se borra de la bandeja de entrada de todos los usuarios.
 *
 * @async
 * @function deleteAlertaGlobal
 * @route DELETE /api/alerts/admin/history/:id
 * @param {import('express').Request} req - Param `id` de la alerta a eliminar.
 * @param {import('express').Response} res
 */
const deleteAlertaGlobal = async (req, res) => {
    const id = req.params.id;
    try {
        await pool.query('DELETE FROM notificaciones_globales WHERE id_notificacion = $1', [id]);
        
        // Auditoría: registra quién borró y qué alerta
        if (req.user?.id) await logAuditoria(req.user.id, 'ELIMINAR', 'ALERTA', id, {});
        
        res.json({ success: true, message: 'Alerta eliminada correctamente.' });
    } catch (error) {
        console.error('Error al eliminar alerta:', error);
        res.status(500).json({ success: false, message: 'Error al eliminar alerta.' });
    }
};

/**
 * Reenvía una alerta existente a todos los usuarios activos.
 * Recupera los datos originales de la alerta de la BD y vuelve a ejecutar
 * `procesarYEnviarAlerta` sin crear un registro nuevo en `notificaciones_globales`.
 *
 * @async
 * @function resendAlerta
 * @route POST /api/alerts/admin/history/:id/resend
 * @param {import('express').Request} req - Param `id` de la alerta a reenviar.
 * @param {import('express').Response} res
 */
const resendAlerta = async (req, res) => {
    const id = req.params.id;
    const io = req.app.get('io');
    
    try {
        const [rows] = await pool.query('SELECT * FROM notificaciones_globales WHERE id_notificacion = $1', [id]);
        if (rows.length === 0) return res.status(404).json({ success: false, message: 'Alerta no encontrada.' });
        
        const alerta = rows[0];
        const resultado = await procesarYEnviarAlerta(io, { 
            tipo_evento: alerta.tipo_evento, 
            titulo: alerta.titulo, 
            descripcion: alerta.descripcion, 
            entidad_afectada: alerta.entidad_afectada 
        });

        // Auditoría: indica cuántos usuarios recibieron el reenvío
        if (req.user?.id) await logAuditoria(req.user.id, 'REENVIAR', 'ALERTA', id, { usuarios_notificados: resultado.usuariosNotificados });

        res.json({
            success: true,
            message: `Alerta reenviada. ${resultado.usuariosNotificados} usuario(s) notificado(s).`,
            ...resultado,
        });
    } catch (error) {
        console.error('Error al reenviar alerta:', error);
        res.status(500).json({ success: false, message: 'Error al reenviar la alerta.' });
    }
};

/**
 * Obtiene el historial de alertas recibidas por el usuario autenticado (RF-45).
 * Realiza un JOIN entre `historial_alertas_usuario` y `notificaciones_globales`
 * para enriquecer la respuesta con los datos de la alerta original.
 * Resultados en orden descendente por fecha de recepción (RN-45.1).
 *
 * @async
 * @function getHistorialUsuario
 * @route GET /api/alerts/history
 * @param {import('express').Request} req - `req.user.id` inyectado por `verifyToken`.
 * @param {import('express').Response} res
 */
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

/**
 * Marca una alerta específica como leída en la bandeja del usuario.
 * La actualización filtra tanto por `id_historial` como por `id_usuario`
 * para evitar que un usuario marque alertas ajenas.
 *
 * @async
 * @function marcarLeida
 * @route PUT /api/alerts/history/:id/read
 * @param {import('express').Request} req - Param `id` = id_historial.
 * @param {import('express').Response} res
 */
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

/**
 * Obtiene las preferencias de notificación del usuario autenticado (RF-41).
 * Si el usuario no tiene preferencias guardadas, retorna valores por defecto:
 *  - Canal Panel: activado
 *  - Canal Correo: desactivado
 *  - Todos los tipos de alerta: activados
 *
 * @async
 * @function getPreferencias
 * @route GET /api/alerts/preferences
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
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

/**
 * Actualiza (o crea) las preferencias de notificación del usuario (RF-41, RF-42).
 *
 * Usa una consulta UPSERT (`INSERT ... ON CONFLICT DO UPDATE`) para garantizar
 * que solo exista un registro por usuario en `preferencias_alertas`.
 * Aplica los cambios de forma inmediata (RN-41.3) y retorna el estado actualizado (RN-42.3).
 * El campo `fecha_actualizacion` se sella con `NOW()` para trazabilidad.
 *
 * @async
 * @function updatePreferencias
 * @route PUT /api/alerts/preferences
 * @param {import('express').Request} req - Body: { canal_panel, canal_correo, alerta_retraso, alerta_cierre, alerta_mantenimiento }
 * @param {import('express').Response} res
 */
const updatePreferencias = async (req, res) => {
    const id_usuario = req.user.id;
    const { canal_panel, canal_correo, alerta_retraso, alerta_cierre, alerta_mantenimiento } = req.body;

    try {
        // UPSERT: crea si no existe, actualiza si ya existe (RN-42.2)
        // fecha_actualizacion se actualiza explícitamente en el ON CONFLICT (RN-41.3 — aplicación inmediata)
        await pool.query(
            `INSERT INTO preferencias_alertas
             (id_usuario, canal_panel, canal_correo, alerta_retraso, alerta_cierre, alerta_mantenimiento, fecha_actualizacion)
             VALUES ($1, $2, $3, $4, $5, $6, NOW())
             ON CONFLICT (id_usuario) DO UPDATE SET
               canal_panel          = EXCLUDED.canal_panel,
               canal_correo         = EXCLUDED.canal_correo,
               alerta_retraso       = EXCLUDED.alerta_retraso,
               alerta_cierre        = EXCLUDED.alerta_cierre,
               alerta_mantenimiento = EXCLUDED.alerta_mantenimiento,
               fecha_actualizacion  = NOW()`,
            [id_usuario,
             canal_panel          ?? true,
             canal_correo         ?? false,
             alerta_retraso       ?? true,
             alerta_cierre        ?? true,
             alerta_mantenimiento ?? true]
        );

        // RN-42.3: Confirmar acción retornando las preferencias actualizadas
        const [updated] = await pool.query(
            'SELECT * FROM preferencias_alertas WHERE id_usuario = $1',
            [id_usuario]
        );

        res.json({
            success: true,
            message: 'Preferencias guardadas correctamente.',
            data: updated[0],
        });
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
    deleteAlertaGlobal,
    resendAlerta,
};
