-- ============================================================
-- MetroMed — Migración: Módulos Administrativos
-- Ejecutar una sola vez en la base de datos MySQL
-- ============================================================

-- 1. Agregar columna estado a usuarios (si no existe)
ALTER TABLE usuarios
  ADD COLUMN IF NOT EXISTS estado ENUM('activo','inactivo') NOT NULL DEFAULT 'activo';

-- 2. Auditoría de Usuarios (RF-37)
CREATE TABLE IF NOT EXISTS auditoria_usuarios (
  id_auditoria       INT AUTO_INCREMENT PRIMARY KEY,
  id_administrador   INT NOT NULL,
  id_usuario_afectado INT NOT NULL,
  accion             VARCHAR(60) NOT NULL COMMENT 'CREAR, EDITAR, ACTIVAR, DESACTIVAR, ELIMINAR_LOGICO',
  descripcion        TEXT,
  fecha              DATETIME NOT NULL DEFAULT NOW(),
  INDEX idx_admin    (id_administrador),
  INDEX idx_usuario  (id_usuario_afectado),
  INDEX idx_fecha    (fecha)
);

-- 3. Reportes (RF-33 / RF-34 / RF-35 / RF-36)
CREATE TABLE IF NOT EXISTS reportes (
  id_reporte              INT AUTO_INCREMENT PRIMARY KEY,
  tipo                    ENUM('problema_tecnico','sugerencia') NOT NULL,
  descripcion             TEXT NOT NULL,
  estado                  ENUM('pendiente','validado','descartado') NOT NULL DEFAULT 'pendiente',
  id_usuario_creador      INT NOT NULL,
  id_usuario_afectado     INT DEFAULT NULL,
  fecha_creacion          DATETIME NOT NULL DEFAULT NOW(),
  fecha_revision          DATETIME DEFAULT NULL,
  id_administrador_revisor INT DEFAULT NULL,
  INDEX idx_tipo          (tipo),
  INDEX idx_estado        (estado),
  INDEX idx_fecha         (fecha_creacion)
);

-- 4. Auditoría de Reportes
CREATE TABLE IF NOT EXISTS auditoria_reportes (
  id_auditoria     INT AUTO_INCREMENT PRIMARY KEY,
  id_reporte       INT NOT NULL,
  id_administrador INT NOT NULL,
  accion           VARCHAR(60) NOT NULL COMMENT 'CREAR, CAMBIAR_ESTADO',
  descripcion      TEXT,
  fecha            DATETIME NOT NULL DEFAULT NOW(),
  INDEX idx_reporte (id_reporte),
  INDEX idx_admin   (id_administrador)
);

-- 5. Auditoría de Juegos (RF-61 / RF-62)
CREATE TABLE IF NOT EXISTS auditoria_juegos (
  id_auditoria     INT AUTO_INCREMENT PRIMARY KEY,
  id_juego         INT NOT NULL,
  id_administrador INT NOT NULL,
  accion           VARCHAR(60) NOT NULL COMMENT 'HABILITAR, DESHABILITAR, CAMBIAR_RECOMPENSA',
  valor_anterior   TEXT DEFAULT NULL,
  valor_nuevo      TEXT DEFAULT NULL,
  fecha            DATETIME NOT NULL DEFAULT NOW(),
  INDEX idx_juego  (id_juego),
  INDEX idx_admin  (id_administrador)
);
