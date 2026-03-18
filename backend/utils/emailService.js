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

module.exports = {
    sendVerificationCode
};
