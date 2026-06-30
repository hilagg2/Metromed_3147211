const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const {
    getJuegosConfig,
    updateJuegoConfig,
    registrarPartida,
    getHistorialPartidas,
    getRanking,
    getEstadisticas
} = require('../controllers/juegoController');

// Todos estos endpoints requieren token JWT
router.use(verifyToken);

router.get('/config', getJuegosConfig);
router.put('/config', updateJuegoConfig);
router.post('/partida', registrarPartida);
router.get('/historial', getHistorialPartidas);
router.get('/ranking', getRanking);
router.get('/estadisticas', getEstadisticas);

module.exports = router;
