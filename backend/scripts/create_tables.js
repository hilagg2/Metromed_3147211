const { pool } = require('../config/mysqlPool');

async function createAlertTables() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS preferencias_alertas (
                id_usuario INT PRIMARY KEY,
                canal_panel BOOLEAN DEFAULT TRUE,
                canal_correo BOOLEAN DEFAULT FALSE,
                alerta_retraso BOOLEAN DEFAULT TRUE,
                alerta_cierre BOOLEAN DEFAULT TRUE,
                alerta_mantenimiento BOOLEAN DEFAULT TRUE,
                fecha_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
            )
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS notificaciones_globales (
                id_notificacion INT AUTO_INCREMENT PRIMARY KEY,
                tipo_evento ENUM('retraso','cierre_estacion','mantenimiento') NOT NULL,
                titulo VARCHAR(150) NOT NULL,
                descripcion TEXT NOT NULL,
                entidad_afectada VARCHAR(100) NOT NULL,
                fecha_generacion DATETIME DEFAULT CURRENT_TIMESTAMP,
                canales_enviados VARCHAR(50) NOT NULL DEFAULT 'panel'
            )
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS historial_alertas_usuario (
                id_historial INT AUTO_INCREMENT PRIMARY KEY,
                id_usuario INT NOT NULL,
                id_notificacion INT NOT NULL,
                leida BOOLEAN DEFAULT FALSE,
                fecha_recepcion DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
                FOREIGN KEY (id_notificacion) REFERENCES notificaciones_globales(id_notificacion) ON DELETE CASCADE,
                INDEX idx_usuario_fecha (id_usuario, fecha_recepcion DESC)
            )
        `);
        console.log('✅ Tablas creadas con éxito');
    } catch (e) {
        console.error('❌ Error creando tablas:', e.message);
    } finally {
        process.exit(0);
    }
}

createAlertTables();
