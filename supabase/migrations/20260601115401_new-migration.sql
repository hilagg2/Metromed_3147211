-- Schema for MetroMedellin in PostgreSQL

-- 1. Table: usuarios
CREATE TABLE usuarios (
  id_usuario SERIAL PRIMARY KEY,
  id_rol INTEGER NOT NULL DEFAULT 1,
  nombre VARCHAR(100) NOT NULL,
  correo VARCHAR(150) NOT NULL UNIQUE,
  contrasena VARCHAR(255) NOT NULL,
  fecha_registro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  saldo_metrocoins DECIMAL(10, 2) DEFAULT 0.00,
  verificado BOOLEAN DEFAULT FALSE,
  token_verificacion VARCHAR(255) DEFAULT NULL,
  nivel INTEGER DEFAULT 1
);
CREATE INDEX idx_correo ON usuarios(correo);
CREATE INDEX idx_rol ON usuarios(id_rol);

-- 2. Table: codigosverificacion
CREATE TABLE codigosverificacion (
  id_codigo SERIAL PRIMARY KEY,
  id_usuario INTEGER NOT NULL REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
  codigo VARCHAR(6) NOT NULL,
  fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fecha_expiracion TIMESTAMP NOT NULL
);
CREATE INDEX idx_usuario_codigo ON codigosverificacion(id_usuario);
CREATE INDEX idx_codigo_val ON codigosverificacion(codigo);

-- 3. Table: sesiones_activas
CREATE TABLE sesiones_activas (
  id_sesion UUID PRIMARY KEY,
  id_usuario INTEGER NOT NULL REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
  dispositivo VARCHAR(255),
  ip VARCHAR(45),
  fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fecha_expiracion TIMESTAMP NOT NULL
);
CREATE INDEX idx_usuario_sesion ON sesiones_activas(id_usuario);

-- 4. Table: juegos
CREATE TABLE juegos (
  id_juego SERIAL PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL,
  identificador VARCHAR(50) NOT NULL UNIQUE,
  activo BOOLEAN DEFAULT TRUE,
  recompensa_base INTEGER DEFAULT 50,
  fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Insert initial games
INSERT INTO juegos (nombre, identificador, recompensa_base) VALUES 
('Quiz MetroExperto', 'trivia', 50),
('Memoria del Metro', 'memory', 10),
('Metro Snake', 'snake', 1),
('Ruleta MetroRewards', 'roulette', 0)
ON CONFLICT (identificador) DO NOTHING;

-- 5. Table: historial_juegos
CREATE TABLE historial_juegos (
  id_historial SERIAL PRIMARY KEY,
  id_usuario INTEGER NOT NULL REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
  id_juego INTEGER NOT NULL REFERENCES juegos(id_juego) ON DELETE CASCADE,
  monedas_obtenidas INTEGER NOT NULL,
  detalles VARCHAR(255),
  fecha_jugada TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_usuario_historial ON historial_juegos(id_usuario);

-- 6. Table: estaciones
CREATE TABLE estaciones (
  id_estacion SERIAL PRIMARY KEY,
  nombre_estacion VARCHAR(100) NOT NULL,
  nivel_congestion VARCHAR(10) NOT NULL,
  ultima_actualizacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 7. Table: alertas
CREATE TABLE alertas (
  id_alerta SERIAL PRIMARY KEY,
  tipo_alerta VARCHAR(100) NOT NULL,
  mensaje TEXT DEFAULT NULL,
  fecha_alerta TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  estacion_afectada INTEGER REFERENCES estaciones(id_estacion) ON DELETE SET NULL
);
