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
        console.log('\n=== HACIENDO A TODOS LOS USUARIOS ADMIN ===');
        const [update] = await pool.query('UPDATE usuarios SET id_rol = 2');
        console.log('Filas actualizadas:', update.affectedRows);
        
        const [users] = await pool.query('SELECT id_usuario, nombre, correo, id_rol, estado FROM usuarios');
        console.table(users);
    } catch(err) {
        console.error('Error de conexión:', err.message);
    } finally {
        await pool.end();
    }
}
main();
