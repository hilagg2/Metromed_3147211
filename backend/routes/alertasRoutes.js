const express = require('express');
const router  = express.Router();
const { verifyToken } = require('../middleware/auth');
const {
    crearAlerta,
    getHistorialGlobal,
    getHistorialUsuario,
    marcarLeida,
    getPreferencias,
    updatePreferencias,
} = require('../controllers/alertasController');

// ── Middleware de Admin ────────────────────────────────────────────────────────
const esAdmin = (req, res, next) => {
    // id_rol === 1 equivale a Administrador (RN-46.1)
    if (req.user.rol !== 1 && req.user.rol !== '1') {
        return res.status(403).json({ success: false, message: 'Acceso restringido a Administradores.' });
    }
    next();
};

// ── Rutas de usuario autenticado ──────────────────────────────────────────────
// GET  /api/alerts/history          → Historial propio (RF-45)
router.get('/history',              verifyToken, getHistorialUsuario);

// PUT  /api/alerts/history/:id/read → Marcar como leída
router.put('/history/:id/read',     verifyToken, marcarLeida);

// GET  /api/alerts/preferences      → Obtener preferencias (RF-41)
router.get('/preferences',          verifyToken, getPreferencias);

// PUT  /api/alerts/preferences      → Actualizar preferencias (RF-41, RF-42)
router.put('/preferences',          verifyToken, updatePreferencias);

// ── Rutas de Administrador ────────────────────────────────────────────────────
// POST /api/alerts/admin            → Crear y emitir alerta (RF-44)
router.post('/admin',               verifyToken, esAdmin, crearAlerta);

// GET  /api/alerts/admin/history    → Historial global (RF-46)
router.get('/admin/history',        verifyToken, esAdmin, getHistorialGlobal);

module.exports = router;
