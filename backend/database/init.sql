-- Script de inicialización de base de datos MetroMed
-- Base de datos: metromedd

USE metromedd;

-- Verificar si la tabla usuarios existe, si no, crearla
CREATE TABLE IF NOT EXISTS usuarios (
  id_usuario INT AUTO_INCREMENT PRIMARY KEY,
  id_rol INT NOT NULL DEFAULT 1,
  nombre VARCHAR(100) NOT NULL,
  correo VARCHAR(150) NOT NULL UNIQUE,
  contrasena VARCHAR(255) NOT NULL COMMENT 'Hash bcrypt',
  fecha_registro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  saldo_metrocoins DECIMAL(10, 2) DEFAULT 0.00,
  verificado TINYINT(1) DEFAULT 0,
  token_verificacion VARCHAR(255) DEFAULT NULL,
  INDEX idx_correo (correo),
  INDEX idx_rol (id_rol)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Verificar si la tabla codigosverificacion existe, si no, crearla
CREATE TABLE IF NOT EXISTS codigosverificacion (
  id_codigo INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario INT NOT NULL,
  codigo VARCHAR(6) NOT NULL,
  fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fecha_expiracion DATETIME NOT NULL,
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
  INDEX idx_usuario (id_usuario),
  INDEX idx_codigo (codigo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Verificar si la tabla sesiones_activas existe, si no, crearla
CREATE TABLE IF NOT EXISTS sesiones_activas (
  id_sesion VARCHAR(36) PRIMARY KEY,
  id_usuario INT NOT NULL,
  dispositivo VARCHAR(255),
  ip VARCHAR(45),
  fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fecha_expiracion DATETIME NOT NULL,
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
  INDEX idx_usuario_sesion (id_usuario)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- Mostrar estructura de las tablas
DESCRIBE usuarios;
DESCRIBE codigosverificacion;

SELECT 'Base de datos inicializada correctamente' AS mensaje;
