-- Migración: Módulo de Alertas y Notificaciones (RF-41 al RF-46)
-- Script en sintaxis PostgreSQL

-- RF-41, RF-42: Preferencias individuales de alerta por usuario
CREATE TABLE IF NOT EXISTS preferencias_alertas (
    id_usuario           INT PRIMARY KEY,
    canal_panel          BOOLEAN DEFAULT TRUE,
    canal_correo         BOOLEAN DEFAULT FALSE,
    alerta_retraso       BOOLEAN DEFAULT TRUE,
    alerta_cierre        BOOLEAN DEFAULT TRUE,
    alerta_mantenimiento BOOLEAN DEFAULT TRUE,
    fecha_actualizacion  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
);

-- RF-44, RF-46: Registro global de notificaciones (auditoría del Admin)
CREATE TABLE IF NOT EXISTS notificaciones_globales (
    id_notificacion   SERIAL PRIMARY KEY,
    tipo_evento       VARCHAR(50) NOT NULL CHECK (tipo_evento IN ('retraso','cierre_estacion','mantenimiento')),
    titulo            VARCHAR(150) NOT NULL,
    descripcion       TEXT NOT NULL,
    entidad_afectada  VARCHAR(100) NOT NULL,
    fecha_generacion  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    canales_enviados  VARCHAR(50) NOT NULL DEFAULT 'panel'
);

CREATE INDEX IF NOT EXISTS idx_ng_fecha_generacion
ON notificaciones_globales (fecha_generacion DESC);

-- RF-45: Historial individual por usuario + estado de lectura
CREATE TABLE IF NOT EXISTS historial_alertas_usuario (
    id_historial      SERIAL PRIMARY KEY,
    id_usuario        INT NOT NULL,
    id_notificacion   INT NOT NULL,
    leida             BOOLEAN DEFAULT FALSE,
    fecha_recepcion   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario)      REFERENCES usuarios(id_usuario)               ON DELETE CASCADE,
    FOREIGN KEY (id_notificacion) REFERENCES notificaciones_globales(id_notificacion) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_usuario_fecha ON historial_alertas_usuario (id_usuario, fecha_recepcion DESC);
