const express = require('express');
const router = express.Router();
const { verifyToken, requireRole } = require('../middleware/auth');
const {
    getCongestion,
    reportarCongestion,
    getNotificaciones,
    marcarLeidas,
    getSuscripcion,
    updateSuscripcion,
    getEstaciones,
    suscribirSSE,
    recibirReporte
} = require('../controllers/congestionController');

// Rutas de Gamificación y Notificaciones
router.get('/', getCongestion);
router.post('/reportar', verifyToken, reportarCongestion);
router.get('/notificaciones', verifyToken, getNotificaciones);
router.post('/notificaciones/leer', verifyToken, marcarLeidas);
router.get('/suscripcion', verifyToken, getSuscripcion);
router.put('/suscripcion', verifyToken, updateSuscripcion);

// Rutas de Monitoreo en Tiempo Real (SSE y Validación Colectiva)
router.get('/estaciones', getEstaciones);
router.get('/eventos', suscribirSSE);
router.post('/reporte', verifyToken, requireRole(2), recibirReporte);

module.exports = router;
