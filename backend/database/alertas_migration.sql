-- Migración: Módulo de Alertas y Notificaciones (RF-41 al RF-46)
-- Ejecutar sobre la base de datos metromed_db

-- RF-41, RF-42: Preferencias individuales de alerta por usuario
CREATE TABLE IF NOT EXISTS preferencias_alertas (
    id_usuario           INT PRIMARY KEY,
    canal_panel          BOOLEAN DEFAULT TRUE,
    canal_correo         BOOLEAN DEFAULT FALSE,
    alerta_retraso       BOOLEAN DEFAULT TRUE,
    alerta_cierre        BOOLEAN DEFAULT TRUE,
    alerta_mantenimiento BOOLEAN DEFAULT TRUE,
    fecha_actualizacion  DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- RF-44, RF-46: Registro global de notificaciones (auditoría del Admin)
CREATE TABLE IF NOT EXISTS notificaciones_globales (
    id_notificacion   INT AUTO_INCREMENT PRIMARY KEY,
    tipo_evento       ENUM('retraso','cierre_estacion','mantenimiento') NOT NULL,
    titulo            VARCHAR(150) NOT NULL,
    descripcion       TEXT NOT NULL,
    entidad_afectada  VARCHAR(100) NOT NULL,
    fecha_generacion  DATETIME DEFAULT CURRENT_TIMESTAMP,
    canales_enviados  VARCHAR(50) NOT NULL DEFAULT 'panel'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- RF-45: Historial individual por usuario + estado de lectura
CREATE TABLE IF NOT EXISTS historial_alertas_usuario (
    id_historial      INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario        INT NOT NULL,
    id_notificacion   INT NOT NULL,
    leida             BOOLEAN DEFAULT FALSE,
    fecha_recepcion   DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario)      REFERENCES usuarios(id_usuario)               ON DELETE CASCADE,
    FOREIGN KEY (id_notificacion) REFERENCES notificaciones_globales(id_notificacion) ON DELETE CASCADE,
    INDEX idx_usuario_fecha (id_usuario, fecha_recepcion DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SELECT 'Tablas de alertas creadas correctamente' AS mensaje;
