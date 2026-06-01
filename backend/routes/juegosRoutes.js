const express = require('express');
const router = express.Router();
const juegosController = require('../controllers/juegosController');
const { verifyToken } = require('../middleware/auth');

// Rutas públicas o semi-públicas
router.get('/', juegosController.getJuegos);
router.get('/ranking', juegosController.getRanking);

// Rutas protegidas (requieren login)
router.post('/jugar', verifyToken, juegosController.registrarPartida);
router.get('/historial', verifyToken, juegosController.getHistorial);

module.exports = router;
