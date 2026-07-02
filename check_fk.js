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
        console.log('\n=== FK CONSTRAINTS ===');
        const [fks] = await pool.query(`
            SELECT 
                TABLE_NAME, COLUMN_NAME, CONSTRAINT_NAME, REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME 
            FROM 
                INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
            WHERE 
                REFERENCED_TABLE_SCHEMA = 'metromed_db' AND TABLE_NAME = 'historial_alertas_usuario'
        `);
        console.table(fks);
    } catch(err) {
        console.error('Error:', err.message);
    } finally {
        await pool.end();
    }
}
main();
