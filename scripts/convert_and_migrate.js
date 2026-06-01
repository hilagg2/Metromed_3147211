const fs = require('fs');
const path = require('path');

const mysqlDumpPath = path.join(__dirname, '../metromedd (2).sql');
const outputPath = path.join(__dirname, '../supabase_migration.sql');

const pgSchema = `-- Esquema traducido a PostgreSQL para Supabase

-- 1. roles
CREATE TABLE IF NOT EXISTS roles (
  id_rol SERIAL PRIMARY KEY,
  nombre varchar(50) NOT NULL UNIQUE
);

-- 2. usuarios
CREATE TABLE IF NOT EXISTS usuarios (
  id_usuario SERIAL PRIMARY KEY,
  id_rol integer NOT NULL DEFAULT 1 REFERENCES roles(id_rol) ON UPDATE CASCADE,
  nombre varchar(100) NOT NULL,
  correo varchar(100) NOT NULL UNIQUE,
  contrasena varchar(255) NOT NULL,
  fecha_registro timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  saldo_metrocoins integer DEFAULT 0,
  verificado smallint DEFAULT 0,
  token_verificacion varchar(255) DEFAULT NULL,
  nivel integer DEFAULT 1
);

-- 3. administradores
CREATE TABLE IF NOT EXISTS administradores (
  id_admin SERIAL PRIMARY KEY,
  id_usuario integer NOT NULL REFERENCES usuarios(id_usuario) ON DELETE CASCADE ON UPDATE CASCADE,
  fecha_creacion timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 4. estaciones
CREATE TABLE IF NOT EXISTS estaciones (
  id_estacion SERIAL PRIMARY KEY,
  nombre_estacion varchar(100) NOT NULL,
  nivel_congestion varchar(10) NOT NULL,
  ultima_actualizacion timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 5. alertas
CREATE TABLE IF NOT EXISTS alertas (
  id_alerta SERIAL PRIMARY KEY,
  tipo_alerta varchar(100) NOT NULL,
  mensaje text DEFAULT NULL,
  fecha_alerta timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  estacion_afectada integer REFERENCES estaciones(id_estacion) ON DELETE SET NULL ON UPDATE CASCADE
);

-- 6. auditoria
CREATE TABLE IF NOT EXISTS auditoria (
  id_auditoria SERIAL PRIMARY KEY,
  tabla_afectada varchar(100) NOT NULL,
  operacion varchar(10) NOT NULL,
  usuario_modificador integer REFERENCES usuarios(id_usuario) ON DELETE SET NULL ON UPDATE CASCADE,
  fecha timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 7. codigosverificacion
CREATE TABLE IF NOT EXISTS codigosverificacion (
  id_codigo SERIAL PRIMARY KEY,
  id_usuario integer NOT NULL REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
  codigo varchar(6) NOT NULL,
  fecha_creacion timestamp DEFAULT CURRENT_TIMESTAMP,
  fecha_expiracion timestamp NOT NULL
);

-- 8. lineasayuda
CREATE TABLE IF NOT EXISTS lineasayuda (
  id_linea SERIAL PRIMARY KEY,
  nombre_servicio varchar(100) NOT NULL,
  telefono varchar(20) NOT NULL,
  horario varchar(100) NOT NULL
);

-- 9. mensajesmotivacionales
CREATE TABLE IF NOT EXISTS mensajesmotivacionales (
  id_mensaje SERIAL PRIMARY KEY,
  texto text NOT NULL,
  categoria varchar(50) NOT NULL,
  fecha_creacion date NOT NULL
);

-- 10. metrocoins
CREATE TABLE IF NOT EXISTS metrocoins (
  id_movimiento SERIAL PRIMARY KEY,
  id_usuario integer NOT NULL REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
  tipo_movimiento varchar(20) NOT NULL CHECK (tipo_movimiento IN ('ganado', 'gastado', 'bono')),
  cantidad integer NOT NULL,
  fecha timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  descripcion varchar(255) DEFAULT NULL
);

-- 11. preferenciasusuario
CREATE TABLE IF NOT EXISTS preferenciasusuario (
  id_preferencia SERIAL PRIMARY KEY,
  id_usuario integer NOT NULL REFERENCES usuarios(id_usuario) ON DELETE CASCADE ON UPDATE CASCADE,
  tipo_alerta varchar(100) NOT NULL,
  estacion_interes integer REFERENCES estaciones(id_estacion) ON DELETE SET NULL ON UPDATE CASCADE,
  medio_envio varchar(20) NOT NULL
);

-- 12. reportes
CREATE TABLE IF NOT EXISTS reportes (
  id_reporte SERIAL PRIMARY KEY,
  id_admin integer REFERENCES administradores(id_admin) ON DELETE SET NULL ON UPDATE CASCADE,
  tipo varchar(20) NOT NULL,
  descripcion text DEFAULT NULL,
  fecha timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 13. trazabilidad
CREATE TABLE IF NOT EXISTS trazabilidad (
  id_traza SERIAL PRIMARY KEY,
  id_usuario integer REFERENCES usuarios(id_usuario) ON DELETE SET NULL ON UPDATE CASCADE,
  accion varchar(100) NOT NULL,
  descripcion text DEFAULT NULL,
  fecha timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 14. sesiones_activas
CREATE TABLE IF NOT EXISTS sesiones_activas (
  id_sesion varchar(36) PRIMARY KEY,
  id_usuario integer NOT NULL REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
  dispositivo varchar(255),
  ip varchar(45),
  fecha_creacion timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fecha_expiracion timestamp NOT NULL
);

-- 15. juegos
CREATE TABLE IF NOT EXISTS juegos (
  id_juego SERIAL PRIMARY KEY,
  nombre varchar(50) NOT NULL,
  identificador varchar(50) NOT NULL UNIQUE,
  activo boolean DEFAULT true,
  recompensa_base integer DEFAULT 50,
  fecha_creacion timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 16. historial_juegos
CREATE TABLE IF NOT EXISTS historial_juegos (
  id_historial SERIAL PRIMARY KEY,
  id_usuario integer NOT NULL REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
  id_juego integer NOT NULL REFERENCES juegos(id_juego) ON DELETE CASCADE,
  monedas_obtenidas integer NOT NULL,
  detalles varchar(255),
  fecha_jugada timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_usuarios_nombre ON usuarios(nombre);
CREATE INDEX IF NOT EXISTS idx_usuarios_fecha ON usuarios(fecha_registro);

`;

async function convert() {
  console.log('Reading MySQL dump...');
  const data = fs.readFileSync(mysqlDumpPath, 'utf8');
  const lines = data.split('\n');
  const insertStatements = [];
  
  let collecting = false;
  let currentInsert = [];

  for (let line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('INSERT INTO')) {
      collecting = true;
      currentInsert = [trimmed.replace(/`/g, '')];
    } else if (collecting) {
      currentInsert.push(trimmed.replace(/`/g, ''));
    }
    
    if (collecting && trimmed.endsWith(';')) {
      collecting = false;
      insertStatements.push(currentInsert.join('\n'));
      currentInsert = [];
    }
  }

  console.log(`Found ${insertStatements.length} insert statements.`);

  // Juegos iniciales
  const juegosInserts = `
INSERT INTO juegos (nombre, identificador, recompensa_base) VALUES 
('Quiz MetroExperto', 'trivia', 50),
('Memoria del Metro', 'memory', 10),
('Metro Snake', 'snake', 1),
('Ruleta MetroRewards', 'roulette', 0)
ON CONFLICT (identificador) DO NOTHING;
`;

  // Reseteo de secuencias
  const seqReset = `
-- Reseteo de secuencias para PostgreSQL SERIAL
SELECT setval(pg_get_serial_sequence('roles', 'id_rol'), COALESCE(MAX(id_rol), 1)) FROM roles;
SELECT setval(pg_get_serial_sequence('usuarios', 'id_usuario'), COALESCE(MAX(id_usuario), 1)) FROM usuarios;
SELECT setval(pg_get_serial_sequence('administradores', 'id_admin'), COALESCE(MAX(id_admin), 1)) FROM administradores;
SELECT setval(pg_get_serial_sequence('estaciones', 'id_estacion'), COALESCE(MAX(id_estacion), 1)) FROM estaciones;
SELECT setval(pg_get_serial_sequence('alertas', 'id_alerta'), COALESCE(MAX(id_alerta), 1)) FROM alertas;
SELECT setval(pg_get_serial_sequence('auditoria', 'id_auditoria'), COALESCE(MAX(id_auditoria), 1)) FROM auditoria;
SELECT setval(pg_get_serial_sequence('codigosverificacion', 'id_codigo'), COALESCE(MAX(id_codigo), 1)) FROM codigosverificacion;
SELECT setval(pg_get_serial_sequence('lineasayuda', 'id_linea'), COALESCE(MAX(id_linea), 1)) FROM lineasayuda;
SELECT setval(pg_get_serial_sequence('mensajesmotivacionales', 'id_mensaje'), COALESCE(MAX(id_mensaje), 1)) FROM mensajesmotivacionales;
SELECT setval(pg_get_serial_sequence('metrocoins', 'id_movimiento'), COALESCE(MAX(id_movimiento), 1)) FROM metrocoins;
SELECT setval(pg_get_serial_sequence('preferenciasusuario', 'id_preferencia'), COALESCE(MAX(id_preferencia), 1)) FROM preferenciasusuario;
SELECT setval(pg_get_serial_sequence('reportes', 'id_reporte'), COALESCE(MAX(id_reporte), 1)) FROM reportes;
SELECT setval(pg_get_serial_sequence('trazabilidad', 'id_traza'), COALESCE(MAX(id_traza), 1)) FROM trazabilidad;
SELECT setval(pg_get_serial_sequence('juegos', 'id_juego'), COALESCE(MAX(id_juego), 1)) FROM juegos;
`;

  const finalSql = `${pgSchema}\n\n${insertStatements.join('\n\n')}\n\n${juegosInserts}\n\n${seqReset}\n`;
  fs.writeFileSync(outputPath, finalSql, 'utf8');
  console.log(`Successfully generated PostgreSQL migration script at ${outputPath}`);
}

convert();
