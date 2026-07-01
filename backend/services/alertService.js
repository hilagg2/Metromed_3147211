const { pool } = require('../config/mysqlPool');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Configurar transportador de correo dinámicamente
let transporter = null;

const getTransporter = async () => {
    if (transporter) return transporter;

    if (process.env.EMAIL_HOST && process.env.EMAIL_USER) {
        // Usar SMTP real configurado en .env
        transporter = nodemailer.createTransport({
            host:   process.env.EMAIL_HOST,
            port:   process.env.EMAIL_PORT,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
    } else {
        // Fallback a Ethereal (Correo de prueba) si no hay variables configuradas
        console.log('⚠️ No se encontraron credenciales SMTP en .env. Generando cuenta de prueba en Ethereal Email...');
        const testAccount = await nodemailer.createTestAccount();
        transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass,
            },
        });
    }
    return transporter;
};

/**
 * Envía un correo de alerta a un usuario.
 * @param {object} param0 - { to, subject, html }
 */
const sendAlertEmail = async ({ to, subject, html }) => {
    try {
        const mailTransporter = await getTransporter();
        const fromEmail = process.env.EMAIL_USER || 'no-reply@metromed.local';
        
        const info = await mailTransporter.sendMail({
            from: `"MetroMed Alertas" <${fromEmail}>`,
            to,
            subject,
            html,
        });
        
        console.log(`✅ Correo de alerta enviado exitosamente a ${to}`);
        // Si usamos Ethereal, mostrar la URL para ver el correo
        if (!process.env.EMAIL_HOST) {
            console.log(`🔗 Puedes ver el correo enviado aquí: ${nodemailer.getTestMessageUrl(info)}`);
        }
    } catch (err) {
        // No lanzar error para no interrumpir el flujo principal
        console.error(`⚠️  Error enviando correo a ${to}:`, err.message);
    }
};

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
 * @param {object} io             - Instancia de Socket.io
 * @param {object} alertaData     - { tipo_evento, titulo, descripcion, entidad_afectada }
 * @returns {{ id_notificacion, usuariosNotificados }}
 */
const procesarYEnviarAlerta = async (io, { tipo_evento, titulo, descripcion, entidad_afectada }) => {
    // Validar tipo de evento contra la lista blanca
    const columna = TIPO_A_COLUMNA[tipo_evento];
    if (!columna) throw new Error(`Tipo de evento inválido: ${tipo_evento}`);

    const canalesEnviados = [];

    // 1. Guardar en el registro global de auditoría (RF-46, RN-46.2)
    const [globalResult] = await pool.query(
        `INSERT INTO notificaciones_globales
         (tipo_evento, titulo, descripcion, entidad_afectada, canales_enviados)
         VALUES (?, ?, ?, ?, 'panel,correo')`,
        [tipo_evento, titulo, descripcion, entidad_afectada]
    );
    const id_notificacion = globalResult.insertId;

    // 2. Obtener usuarios que tienen activo este tipo de alerta (RF-42.1)
    const [usuariosDestino] = await pool.query(
        `SELECT u.id_usuario, u.correo, u.nombre,
                COALESCE(p.canal_panel, 1) as canal_panel, 
                COALESCE(p.canal_correo, 1) as canal_correo
         FROM usuarios u
         LEFT JOIN preferencias_alertas p ON u.id_usuario = p.id_usuario
         WHERE COALESCE(p.${columna}, 1) = 1`
    );

    const payload = {
        id:               id_notificacion,
        tipo_evento,
        titulo,
        descripcion,
        entidad_afectada,
        fecha_recepcion:  new Date().toISOString(),
    };

    // 3. Distribuir por canal a cada usuario (RN-41.1, RN-43.2)
    for (const user of usuariosDestino) {
        // 3a. Guardar en historial individual (RF-45, RN-45.2)
        await pool.query(
            `INSERT INTO historial_alertas_usuario (id_usuario, id_notificacion) VALUES (?, ?)`,
            [user.id_usuario, id_notificacion]
        );

        // 3b. Canal Panel en tiempo real con Socket.io (RN-41.2, RN-43.2)
        if (user.canal_panel) {
            io.to(`user_${user.id_usuario}`).emit('nueva_notificacion', payload);
            if (!canalesEnviados.includes('panel')) canalesEnviados.push('panel');
        }

        // 3c. Canal Correo electrónico (RN-41.2)
        if (user.canal_correo) {
            await sendAlertEmail({
                to:      user.correo,
                subject: `[MetroMed] ${TIPO_ICONOS[tipo_evento]} ${titulo}`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #1e3a5f;">🚇 MetroMed — Alerta de Transporte</h2>
                        <p>Hola, <strong>${user.nombre}</strong>.</p>
                        <div style="background: #f4f6f8; border-left: 4px solid #e74c3c; padding: 16px; border-radius: 4px;">
                            <p><strong>${TIPO_ICONOS[tipo_evento]} ${tipo_evento.replace('_', ' ').toUpperCase()}</strong></p>
                            <p><strong>📍 Afectado:</strong> ${entidad_afectada}</p>
                            <p>${descripcion}</p>
                        </div>
                        <p style="color: #888; font-size: 12px; margin-top: 24px;">
                            Recibiste este correo porque tienes activadas las alertas de correo en MetroMed.<br>
                            Puedes desactivarlas en Configuración &gt; Preferencias de Alertas.
                        </p>
                    </div>`,
            });
            if (!canalesEnviados.includes('correo')) canalesEnviados.push('correo');
        }
    }

    // Actualizar registro con canales realmente usados (RN-46.2)
    if (canalesEnviados.length > 0) {
        await pool.query(
            'UPDATE notificaciones_globales SET canales_enviados = ? WHERE id_notificacion = ?',
            [canalesEnviados.join(','), id_notificacion]
        );
    }

    return { id_notificacion, usuariosNotificados: usuariosDestino.length };
};

module.exports = { procesarYEnviarAlerta };
