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
        console.log('\n=== USUARIOS ===');
        const [users] = await pool.query('SELECT id_usuario, nombre, correo, id_rol, estado FROM usuarios LIMIT 20');
        console.table(users);

        console.log('\n=== TABLAS EXISTENTES ===');
        const [tables] = await pool.query('SHOW TABLES');
        console.table(tables);

        console.log('\n=== notificaciones_globales (últimas 5) ===');
        try {
            const [notif] = await pool.query('SELECT * FROM notificaciones_globales ORDER BY fecha_generacion DESC LIMIT 5');
            console.table(notif);
        } catch(e) { console.log('Error notif:', e.message); }

        console.log('\n=== historial_alertas_usuario (últimas 5) ===');
        try {
            const [hist] = await pool.query('SELECT * FROM historial_alertas_usuario ORDER BY fecha_recepcion DESC LIMIT 5');
            console.table(hist);
        } catch(e) { console.log('Error hist:', e.message); }

        console.log('\n=== ESTRUCTURA tabla usuarios ===');
        const [cols] = await pool.query('DESCRIBE usuarios');
        console.table(cols);

    } catch(err) {
        console.error('Error de conexión:', err.message);
    } finally {
        await pool.end();
    }
}
main();
