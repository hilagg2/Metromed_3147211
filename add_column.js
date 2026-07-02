require('./backend/node_modules/dotenv/config');
const mysql = require('./backend/node_modules/mysql2/promise');

async function main() {
    const pool = mysql.createPool({
        host:     process.env.DB_HOST || 'localhost',
        user:     process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'metromed_db',
        port:     process.env.DB_PORT || 3306,
    });

    try {
        await pool.query('ALTER TABLE notificaciones_globales ADD COLUMN oculta_admin BOOLEAN DEFAULT FALSE');
        console.log('Columna oculta_admin agregada exitosamente.');
    } catch(err) {
        if (err.code === 'ER_DUP_FIELDNAME') {
            console.log('La columna oculta_admin ya existe.');
        } else {
            console.error('Error:', err.message);
        }
    } finally {
        await pool.end();
    }
}
main();
