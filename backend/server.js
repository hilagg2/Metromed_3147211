const express    = require('express');
const cors       = require('cors');
const dotenv     = require('dotenv');
const http       = require('http');
const { Server } = require('socket.io');
const { testConnection } = require('./config/database');

// Cargar variables de entorno
dotenv.config();

// Crear aplicación Express y servidor HTTP
const app        = express();
const httpServer = http.createServer(app);

// ─── Socket.io ────────────────────────────────────────────────────────────────
const io = new Server(httpServer, {
    cors: {
        origin:      process.env.FRONTEND_URL || 'http://localhost:5173',
        credentials: true,
    },
});

// Hacer io disponible en req.app.get('io') desde cualquier controlador
app.set('io', io);

io.on('connection', (socket) => {
    const userId = socket.handshake.auth?.userId;
    if (userId) {
        socket.join(`user_${userId}`);   // Room individual por usuario (RN-43.1)
        console.log(`🔔 Usuario ${userId} conectado al panel de alertas`);
    }
    socket.on('disconnect', () => {
        if (userId) console.log(`🔕 Usuario ${userId} desconectado del panel de alertas`);
    });
});

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({
    origin:      process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Rutas ────────────────────────────────────────────────────────────────────
const authRoutes    = require('./routes/authRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const juegosRoutes  = require('./routes/juegosRoutes');
const alertasRoutes = require('./routes/alertasRoutes');
const reportesRoutes = require('./routes/reportesRoutes');
const adminRoutes    = require('./routes/adminRoutes');

app.use('/api/auth',      authRoutes);
app.use('/api/usuarios',  usuarioRoutes);
app.use('/api/juegos',    juegosRoutes);
app.use('/api/alerts',    alertasRoutes);   // ← Módulo de Alertas (RF-41 al RF-46) — NO MODIFICAR
app.use('/api/reportes',  reportesRoutes);  // ← Módulo de Reportes (RF-33 al RF-36)
app.use('/api/admin',     adminRoutes);     // ← Dashboard stats + Auditoría general

// Ruta de prueba
app.get('/', (req, res) => {
    res.json({ message: 'API de MetroMed funcionando correctamente', version: '1.0.0' });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Ruta no encontrada' });
});

// Manejo de errores global
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
});

// ─── Iniciar servidor ─────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        try {
            await testConnection();
        } catch (dbError) {
            console.warn('⚠️  No se pudo conectar a la BD principal. El servidor iniciará de todos modos.');
            console.warn('⚠️  Detalle:', dbError?.message ?? dbError);
        }

        httpServer.listen(PORT, () => {
            console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
            console.log(`🔔 Socket.io listo para notificaciones en tiempo real`);
            console.log(`📊 Modo: ${process.env.NODE_ENV || 'development'}`);
        });
    } catch (error) {
        console.error('❌ Error al iniciar el servidor:', error);
        process.exit(1);
    }
};

startServer();
