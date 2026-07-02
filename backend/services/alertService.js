const { pool } = require('../config/database');
const { sendAlertNotification } = require('../utils/emailService');
require('dotenv').config();

/**
 * Mapa de columnas válidas (lista blanca) para evitar SQL Injection. (RN-42.1)
 */
const TIPO_A_COLUMNA = {
    retraso:          'alerta_retraso',
    cierre_estacion:  'alerta_cierre',
    mantenimiento:    'alerta_mantenimiento',
};

/**
 * Tipos de evento con íconos para el correo. (RN-44.3)
 */
const TIPO_ICONOS = {
    retraso:          '🕐',
    cierre_estacion:  '🚫',
    mantenimiento:    '🔧',
};

/**
 * RF-44, RN-44.2: Procesa y distribuye una alerta a todos los usuarios
 * que tienen activo el tipo de evento, validando sus canales (RN-41.1).
 *
 * Broadcasting paralelo: panelOps y emailOps se ejecutan con Promise.allSettled
 * para que el fallo de un canal no cancele los demás (RN-43.2).
 *
 * @param {object} io          - Instancia de Socket.io
 * @param {object} alertaData  - { tipo_evento, titulo, descripcion, entidad_afectada }
 * @returns {{ id_notificacion, usuariosNotificados, canalesUsados }}
 */
const procesarYEnviarAlerta = async (io, { tipo_evento, titulo, descripcion, entidad_afectada }) => {
    const columna = TIPO_A_COLUMNA[tipo_evento];
    if (!columna) throw new Error(`Tipo de evento inválido: ${tipo_evento}`);

    // ── 1. Guardar en el registro global de auditoría (RF-46, RN-46.2) ──────
    const [rows] = await pool.query(
        `INSERT INTO notificaciones_globales
         (tipo_evento, titulo, descripcion, entidad_afectada, canales_enviados)
         VALUES ($1, $2, $3, $4, 'pendiente') RETURNING id_notificacion, fecha_generacion`,
        [tipo_evento, titulo, descripcion, entidad_afectada]
    );
    const id_notificacion  = rows[0].id_notificacion;
    const fecha_generacion = rows[0].fecha_generacion;

    // ── 2. Obtener usuarios con este tipo de alerta activo (RF-42.1) ─────────
    const [usuariosDestino] = await pool.query(
        `SELECT u.id_usuario, u.correo, u.nombre,
                COALESCE(p.canal_panel,  true)  AS canal_panel,
                COALESCE(p.canal_correo, false) AS canal_correo
         FROM usuarios u
         LEFT JOIN preferencias_alertas p ON u.id_usuario = p.id_usuario
         WHERE COALESCE(p.${columna}, true) = true`
    );

    // ── 3. Payload canónico (RN-44.3: tipo + entidad + timestamp) ────────────
    const payload = {
        id:              id_notificacion,
        tipo_evento,
        titulo,
        descripcion,
        entidad_afectada,
        fecha_recepcion: fecha_generacion
            ? new Date(fecha_generacion).toISOString()
            : new Date().toISOString(),
    };

    // ── 4. Persistir historial individual para cada destinatario (RF-45) ─────
    const historialInserts = usuariosDestino.map(user =>
        pool.query(
            'INSERT INTO historial_alertas_usuario (id_usuario, id_notificacion) VALUES ($1, $2)',
            [user.id_usuario, id_notificacion]
        )
    );
    await Promise.allSettled(historialInserts);

    // ── 5. Broadcasting PARALELO: panel + correo (RN-41.2, RN-43.2) ─────────
    const panelOps = [];
    const emailOps = [];

    for (const user of usuariosDestino) {
        // Canal Panel — Socket.io en tiempo real (RN-43.2)
        // El orden DESC está garantizado por fecha_generacion en las queries (RN-43.3)
        if (user.canal_panel) {
            panelOps.push(
                Promise.resolve(
                    io.to(`user_${user.id_usuario}`).emit('nueva_notificacion', payload)
                )
            );
        }

        // Canal Correo electrónico (RN-41.2)
        if (user.canal_correo) {
            emailOps.push(
                sendAlertNotification(
                    user.correo,
                    user.nombre,
                    tipo_evento,
                    titulo,
                    descripcion,
                    entidad_afectada,
                    payload.fecha_recepcion
                ).catch(err => {
                    // El catch individual previene que un error cancele los demás
                    console.error(`⚠️  Error enviando correo a ${user.correo}:`, err.message);
                })
            );
        }
    }

    // Ejecutar ambos canales EN PARALELO (RN-43.2)
    const [panelResults, emailResults] = await Promise.all([
        Promise.allSettled(panelOps),
        Promise.allSettled(emailOps),
    ]);

    // ── 6. Determinar canales realmente usados y actualizar registro (RN-46.2) ─
    const canalesUsados = [];
    if (panelResults.some(r => r.status === 'fulfilled')) canalesUsados.push('panel');
    if (emailResults.some(r => r.status === 'fulfilled')) canalesUsados.push('correo');
    if (canalesUsados.length === 0) canalesUsados.push('ninguno');

    await pool.query(
        'UPDATE notificaciones_globales SET canales_enviados = $1 WHERE id_notificacion = $2',
        [canalesUsados.join(','), id_notificacion]
    );

    console.log(`📡 Alerta #${id_notificacion} enviada → ${usuariosDestino.length} usuario(s) | Canales: [${canalesUsados.join(', ')}]`);

    return { id_notificacion, usuariosNotificados: usuariosDestino.length, canalesUsados };
};

module.exports = { procesarYEnviarAlerta };
