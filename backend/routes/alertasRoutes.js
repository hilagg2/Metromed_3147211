const express = require('express');
const router  = express.Router();
const { verifyToken, requireAdmin } = require('../middleware/auth');
const {
    crearAlerta,
    getHistorialGlobal,
    getHistorialUsuario,
    marcarLeida,
    getPreferencias,
    updatePreferencias,
    deleteAlertaGlobal,
    resendAlerta,
} = require('../controllers/alertasController');

// ── Rutas de usuario autenticado ──────────────────────────────────────────────
// GET  /api/alerts/history          → Historial propio (RF-45, RN-45.1)
router.get('/history',              verifyToken, getHistorialUsuario);

// PUT  /api/alerts/history/:id/read → Marcar como leída
router.put('/history/:id/read',     verifyToken, marcarLeida);

// GET  /api/alerts/preferences      → Obtener preferencias (RF-41)
router.get('/preferences',          verifyToken, getPreferencias);

// PUT  /api/alerts/preferences      → Actualizar preferencias (RF-41, RF-42, RN-42.3)
router.put('/preferences',          verifyToken, updatePreferencias);

// ── Rutas de Administrador (RN-46.1) ─────────────────────────────────────────
// POST /api/alerts/admin            → Crear y emitir alerta (RF-44)
router.post('/admin',               verifyToken, requireAdmin, crearAlerta);

// GET  /api/alerts/admin/history    → Historial global de auditoría (RF-46)
router.get('/admin/history',        verifyToken, requireAdmin, getHistorialGlobal);

// DELETE /api/alerts/admin/history/:id → Eliminar alerta global
router.delete('/admin/history/:id', verifyToken, requireAdmin, deleteAlertaGlobal);

// POST /api/alerts/admin/history/:id/resend → Reenviar alerta
router.post('/admin/history/:id/resend', verifyToken, requireAdmin, resendAlerta);

module.exports = router;
