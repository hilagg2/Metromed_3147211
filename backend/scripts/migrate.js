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

    await connection.execute(`
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
    `);

    console.log('Created sesiones_activas table');
    await connection.end();
  } catch (err) {
    console.error('Migration failed:', err);
  }
}

runMigration();
