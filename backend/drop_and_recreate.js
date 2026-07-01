const mysql = require('mysql2/promise');
const fs = require('fs');
require('dotenv').config();

async function run() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'metromed_db',
            port: process.env.DB_PORT || 3306,
            multipleStatements: true
        });

        console.log('Connected. Dropping tables...');
        await connection.query('SET FOREIGN_KEY_CHECKS = 0');
        await connection.query('DROP TABLE IF EXISTS historial_juegos, sesiones_activas, codigosverificacion, usuarios');
        await connection.query('SET FOREIGN_KEY_CHECKS = 1');
        
        console.log('Reading init.sql...');
        let initSql = fs.readFileSync('./database/init.sql', 'utf8');
        // Remove USE statement to use current db
        initSql = initSql.replace(/USE metromedd;/g, '');
        
        console.log('Executing init.sql...');
        await connection.query(initSql);
        console.log('Database successfully re-initialized!');
        await connection.end();
    } catch (e) {
        console.error('Error:', e);
    } finally {
        process.exit(0);
    }
}
run();
