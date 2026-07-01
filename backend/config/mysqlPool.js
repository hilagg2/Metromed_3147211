const mysql = require('mysql2/promise');
require('dotenv').config();

// Pool de conexión directa a MySQL para el módulo de alertas
const pool = mysql.createPool({
    host:     process.env.DB_HOST || 'localhost',
    user:     process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'metromed_db',
    port:     process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
});

module.exports = { pool };
