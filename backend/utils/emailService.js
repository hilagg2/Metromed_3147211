const nodemailer = require('nodemailer');
require('dotenv').config();

// Configurar transporter de nodemailer
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true para 465, false para otros puertos
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

/**
 * Envía un código de verificación por email
 * @param {string} email - Email del destinatario
 * @param {string} code - Código de verificación
 * @param {string} nombre - Nombre del usuario
 */
const sendVerificationCode = async (email, code, nombre) => {
    try {
        // Simular envío de correo en modo desarrollo si no hay SMTP real configurado
        if (process.env.EMAIL_HOST === 'smtp.example.com' || !process.env.EMAIL_HOST) {
            console.log('\n' + '='.repeat(50));
            console.log(`📧 [MODO DESARROLLO] Simulación de envío de correo`);
            console.log(`Destinatario: ${email}`);
            console.log(`Asunto: Código de Recuperación de Contraseña`);
            console.log(`CÓDIGO SECRETO: ${code}`);
            console.log('='.repeat(50) + '\n');
            return { success: true, messageId: 'simulated_dev_id_' + Date.now() };
        }

        const mailOptions = {
            from: `"MetroMed" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Código de Recuperación de Contraseña - MetroMed',
            html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 40px auto;
              background-color: #ffffff;
              border-radius: 10px;
              overflow: hidden;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header {
              background: linear-gradient(135deg, #00a86b 0%, #00c87a 100%);
              padding: 30px;
              text-align: center;
              color: white;
            }
            .header h1 {
              margin: 0;
              font-size: 28px;
            }
            .content {
              padding: 40px 30px;
            }
            .code-box {
              background-color: #f8f9fa;
              border: 2px dashed #00a86b;
              border-radius: 8px;
              padding: 20px;
              text-align: center;
              margin: 30px 0;
            }
            .code {
              font-size: 36px;
              font-weight: bold;
              color: #00a86b;
              letter-spacing: 8px;
            }
            .warning {
              background-color: #fff3cd;
              border-left: 4px solid #ffaa00;
              padding: 15px;
              margin: 20px 0;
              border-radius: 4px;
            }
            .footer {
              background-color: #f8f9fa;
              padding: 20px;
              text-align: center;
              color: #6c757d;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🚇 MetroMed</h1>
              <p>Recuperación de Contraseña</p>
            </div>
            <div class="content">
              <p>Hola <strong>${nombre}</strong>,</p>
              <p>Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en MetroMed.</p>
              <p>Tu código de verificación es:</p>
              
              <div class="code-box">
                <div class="code">${code}</div>
              </div>
              
              <div class="warning">
                <strong>⚠️ Importante:</strong> Este código es válido por <strong>15 minutos</strong> y solo puede ser usado una vez.
              </div>
              
              <p>Si no solicitaste este cambio, puedes ignorar este correo de forma segura.</p>
              
              <p>Saludos,<br><strong>El equipo de MetroMed</strong></p>
            </div>
            <div class="footer">
              <p>© 2025 MetroMed - Innovando la movilidad urbana</p>
              <p>Este es un correo automático, por favor no respondas a este mensaje.</p>
            </div>
          </div>
        </body>
        </html>
      `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Email enviado:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Error al enviar email:', error);
        throw new Error('No se pudo enviar el código de verificación');
    }
};

const sendCongestionNotification = async (email, stationName, level, nombre) => {
    try {
        if (process.env.EMAIL_HOST === 'smtp.example.com' || !process.env.EMAIL_HOST) {
            console.log('\n' + '='.repeat(50));
            console.log(`📧 [MODO DESARROLLO] Notificación de Congestión Enviada`);
            console.log(`Destinatario: ${email}`);
            console.log(`Asunto: Alerta de Congestión en Estación ${stationName}`);
            console.log(`Mensaje: Hola ${nombre || 'Usuario'}. Se ha reportado una congestión de nivel ${level} en la estación ${stationName}.`);
            console.log('='.repeat(50) + '\n');
            return { success: true };
        }

        const mailOptions = {
            from: `"MetroMed" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: `⚠️ Alerta de Congestión: Estación ${stationName}`,
            html: `<p>Hola ${nombre || 'Usuario'},</p>
                   <p>Te informamos que se ha reportado <strong>Alta Congestión (🔴)</strong> en la estación <strong>${stationName}</strong> de la red del Metro.</p>
                   <p>Te sugerimos tomar vías alternas o salir con anticipación.</p>
                   <p>Atentamente,<br/><strong>El Equipo de MetroMed</strong></p>`
        };

        await transporter.sendMail(mailOptions);
        return { success: true };
    } catch (err) {
        console.error('Error enviando mail de congestión:', err);
        return { success: false, error: err.message };
    }
};

const sendAlertNotification = async (email, nombre, tipo_evento, titulo, descripcion, entidad_afectada, fecha_recepcion) => {
    try {
        if (process.env.EMAIL_HOST === 'smtp.example.com' || !process.env.EMAIL_HOST) {
            console.log('\n' + '='.repeat(50));
            console.log(`📧 [MODO DESARROLLO] Notificación de Alerta Enviada`);
            console.log(`Destinatario: ${email}`);
            console.log(`Asunto: [MetroMed] ${titulo}`);
            console.log(`Mensaje: Hola ${nombre || 'Usuario'}. Evento: ${tipo_evento}, Afectado: ${entidad_afectada}`);
            console.log('='.repeat(50) + '\n');
            return { success: true };
        }

        const TIPO_ICONOS = {
            retraso:          '🕐',
            cierre_estacion:  '🚫',
            mantenimiento:    '🔧',
        };
        const icon = TIPO_ICONOS[tipo_evento] || '🔔';

        const mailOptions = {
            from: `"MetroMed Alertas" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: `[MetroMed] ${icon} ${titulo}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #1e3a5f;">🚇 MetroMed — Alerta de Transporte</h2>
                    <p>Hola, <strong>${nombre || 'Usuario'}</strong>.</p>
                    <div style="background: #f4f6f8; border-left: 4px solid #e74c3c; padding: 16px; border-radius: 4px;">
                        <p><strong>${icon} ${tipo_evento.replace('_', ' ').toUpperCase()}</strong></p>
                        <p><strong>📍 Afectado:</strong> ${entidad_afectada}</p>
                        <p>${descripcion}</p>
                        <p style="color: #888; font-size: 12px;">🕐 ${new Date(fecha_recepcion).toLocaleString('es-CO')}</p>
                    </div>
                    <p style="color: #888; font-size: 12px; margin-top: 24px;">
                        Recibiste este correo porque tienes activadas las alertas de correo en MetroMed.<br>
                        Puedes desactivarlas en Configuración &gt; Preferencias de Alertas.
                    </p>
                </div>`
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Correo de alerta enviado exitosamente a ${email} (${info.messageId})`);
        return { success: true };
    } catch (err) {
        console.error('❌ Error enviando mail de alerta:', err);
        throw err;
    }
};

module.exports = {
    sendVerificationCode,
    sendCongestionNotification,
    sendAlertNotification
};
