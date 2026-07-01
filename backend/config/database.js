const { Pool } = require('pg');
require('dotenv').config();

// Crear pool de conexiones para PostgreSQL (Supabase)
const pgPool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

// Emular la interfaz de mysql2 para no romper otros archivos
const pool = {
    query: async (sql, params) => {
        const result = await pgPool.query(sql, params);
        return [result.rows, result.fields];
    },
    getConnection: async () => {
        const client = await pgPool.connect();
        return {
            release: () => client.release()
        };
    }
};

// Función para probar la conexión
const testConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Conexión a PostgreSQL (Supabase) establecida correctamente');
        connection.release();
    } catch (error) {
        console.error('❌ Error al conectar con PostgreSQL:', error.message);
        throw error;
    }
};

module.exports = { pool, testConnection };