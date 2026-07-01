const { pool } = require('../config/mysqlPool');
const fs = require('fs');
require('dotenv').config();

async function runMigration() {
    let connection;
    try {
        connection = await pool.getConnection();
        await connection.query('SET FOREIGN_KEY_CHECKS = 0');
        const sql = fs.readFileSync('./database/alertas_migration.sql', 'utf8');
        // Split y ejecutar cada sentencia individualmente
        const statements = sql.split(';').filter(s => s.trim() && !s.trim().startsWith('--'));
        for (const stmt of statements) {
            await connection.query(stmt);
        }
        await connection.query('SET FOREIGN_KEY_CHECKS = 1');
        console.log('✅ Migración de alertas ejecutada correctamente');
    } catch (err) {
        console.error('❌ Error en migración:', err.message);
    } finally {
        if (connection) connection.release();
        process.exit(0);
    }
}

runMigration();
