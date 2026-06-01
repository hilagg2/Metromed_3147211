require('dotenv').config({ path: '../.env' });
const mysql = require('mysql2/promise');

async function runMigration() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'metromedd',
      port: process.env.DB_PORT || 3306
    });

    console.log('Connected to DB');

    // 1. Agregar columna nivel a usuarios si no existe
    try {
        await connection.execute(`ALTER TABLE usuarios ADD COLUMN nivel INT DEFAULT 1;`);
        console.log('Columna nivel agregada a la tabla usuarios');
    } catch (e) {
        if (e.code === 'ER_DUP_FIELDNAME') {
            console.log('La columna nivel ya existe en la tabla usuarios');
        } else {
            throw e;
        }
    }

    // 2. Crear tabla juegos
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS juegos (
        id_juego INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(50) NOT NULL,
        identificador VARCHAR(50) NOT NULL UNIQUE,
        activo BOOLEAN DEFAULT TRUE,
        recompensa_base INT DEFAULT 50,
        fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('Tabla juegos creada');

    // 3. Insertar juegos iniciales
    try {
        await connection.execute(`
            INSERT IGNORE INTO juegos (nombre, identificador, recompensa_base) VALUES 
            ('Quiz MetroExperto', 'trivia', 50),
            ('Memoria del Metro', 'memory', 10),
            ('Metro Snake', 'snake', 1),
            ('Ruleta MetroRewards', 'roulette', 0)
        `);
        console.log('Juegos iniciales insertados');
    } catch(e) {
        console.log('Error insertando juegos iniciales:', e);
    }

    // 4. Crear tabla historial_juegos
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS historial_juegos (
        id_historial INT AUTO_INCREMENT PRIMARY KEY,
        id_usuario INT NOT NULL,
        id_juego INT NOT NULL,
        monedas_obtenidas INT NOT NULL,
        detalles VARCHAR(255),
        fecha_jugada DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
        FOREIGN KEY (id_juego) REFERENCES juegos(id_juego) ON DELETE CASCADE,
        INDEX idx_usuario_historial (id_usuario)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('Tabla historial_juegos creada');

    await connection.end();
    console.log('Migración completada exitosamente');
  } catch (err) {
    console.error('Migration failed:', err);
  }
}

runMigration();
