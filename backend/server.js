const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { testConnection, pool } = require('./config/database');
const fs = require('fs');
const path = require('path');

// Cargar variables de entorno
dotenv.config();

// Crear aplicación Express
const app = express();

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
const authRoutes = require('./routes/authRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const congestionRoutes = require('./routes/congestionRoutes');
const apoyoRoutes = require('./routes/apoyoRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/congestion', congestionRoutes);
app.use('/api/apoyo', apoyoRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
    res.json({
        message: 'API de MetroMed funcionando correctamente',
        version: '1.0.0'
    });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Ruta no encontrada'
    });
});

// Manejo de errores global
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Puerto
const PORT = process.env.PORT || 5000;

// Iniciar servidor
const startServer = async () => {
    try {
        // Intentar probar conexión a la base de datos, pero no terminar si falla
        try {
            await testConnection();

            // ── Migración automática: crear tabla reportes_congestion si no existe ──
            try {
                const migrationPath = path.join(__dirname, 'database', 'congestion_migration.sql');
                const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
                // Ejecutar solo el CREATE TABLE IF NOT EXISTS (seguro, idempotente)
                await pool.query(`
                    CREATE TABLE IF NOT EXISTS reportes_congestion (
                        id_reporte      SERIAL PRIMARY KEY,
                        id_usuario      INT NOT NULL,
                        id_estacion     INT NOT NULL,
                        nivel_reportado VARCHAR(10) NOT NULL
                                            CHECK (nivel_reportado IN ('BAJO','MEDIO','ALTO')),
                        fecha_reporte   TIMESTAMP NOT NULL DEFAULT NOW()
                    )
                `);
                await pool.query(`
                    CREATE INDEX IF NOT EXISTS idx_rc_estacion_fecha
                    ON reportes_congestion (id_estacion, fecha_reporte DESC)
                `);
                await pool.query(`
                    CREATE INDEX IF NOT EXISTS idx_rc_usuario_estacion
                    ON reportes_congestion (id_usuario, id_estacion, fecha_reporte DESC)
                `);
                console.log('✅ Tabla reportes_congestion verificada/creada correctamente');
            } catch (migError) {
                console.warn('⚠️ Advertencia en migración de congestión:', migError.message);
            }

            // ── Migración automática: tablas de apoyo psicológico ──
            try {
                const apoyoMigrationPath = path.join(__dirname, 'database', 'apoyo_migration.sql');
                const apoyoSQL = fs.readFileSync(apoyoMigrationPath, 'utf8');
                await pool.query(apoyoSQL);
                console.log('✅ Tablas de apoyo psicológico verificadas/creadas correctamente');
            } catch (apoyoError) {
                console.warn('⚠️ Advertencia en migración de apoyo:', apoyoError.message);
            }
        } catch (dbError) {
            console.warn('⚠️ No se pudo conectar a la base de datos. El servidor iniciará de todos modos.');
            console.warn('⚠️ Detalle:', dbError && dbError.message ? dbError.message : dbError);
        }

        // Iniciar servidor
        app.listen(PORT, () => {
            console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
            console.log(`📊 Modo: ${process.env.NODE_ENV || 'development'}`);
            console.log(`📡 Módulo de congestión activo en /api/congestion`);
        });
    } catch (error) {
        console.error('❌ Error al iniciar el servidor:', error);
        process.exit(1);
    }
};

startServer();
