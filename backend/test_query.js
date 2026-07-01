require('dotenv').config();
const { pool } = require('./config/database');

async function testQuery() {
    try {
        const query = `
            SELECT 
                id_centro, nombre, direccion, latitud, longitud, telefono, tipo, horario,
                (6371 * acos(
                    cos(radians($1)) * cos(radians(latitud)) *
                    cos(radians(longitud) - radians($2)) +
                    sin(radians($1)) * sin(radians(latitud))
                )) AS distancia_km
            FROM centros_ayuda
            WHERE activo = true
            HAVING (6371 * acos(
                cos(radians($1)) * cos(radians(latitud)) *
                cos(radians(longitud) - radians($2)) +
                sin(radians($1)) * sin(radians(latitud))
            )) <= $3
            ORDER BY distancia_km ASC
        `;
        const [rows] = await pool.query(query, [6.2442, -75.5812, 4]);
        console.log("Rows:", rows);
    } catch (e) {
        console.error("Query error:", e.message);
    } finally {
        process.exit();
    }
}
testQuery();
