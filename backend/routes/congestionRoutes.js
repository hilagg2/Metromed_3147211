const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const {
    getCongestion,
    reportarCongestion,
    getNotificaciones,
    marcarLeidas,
    getSuscripcion,
    updateSuscripcion
} = require('../controllers/congestionController');

// Obtener datos de congestión del mapa (Público/Privado)
router.get('/', getCongestion);

// El resto de rutas requieren inicio de sesión
router.post('/reportar', verifyToken, reportarCongestion);
router.get('/notificaciones', verifyToken, getNotificaciones);
router.post('/notificaciones/leer', verifyToken, marcarLeidas);
router.get('/suscripcion', verifyToken, getSuscripcion);
router.put('/suscripcion', verifyToken, updateSuscripcion);

module.exports = router;
