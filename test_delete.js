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
        console.log('\n=== HACIENDO DELETE ===');
        const [del] = await pool.query('DELETE FROM notificaciones_globales WHERE id_notificacion = 14');
        console.log('Filas eliminadas de globales:', del.affectedRows);
        
        const [hist] = await pool.query('SELECT * FROM historial_alertas_usuario');
        console.log('Restantes en historial de usuario:');
        console.table(hist);
    } catch(err) {
        console.error('Error:', err.message);
    } finally {
        await pool.end();
    }
}
main();
