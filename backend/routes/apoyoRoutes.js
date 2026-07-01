const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const {
    chatConIA,
    obtenerLineas,
    obtenerCentrosCercanos,
    getFaqs,
    createReporte
} = require('../controllers/apoyoController');

// ── Rutas públicas (Apoyo accesible para todos sin login) ──
router.post('/chat', chatConIA);
router.get('/lineas', obtenerLineas);
router.get('/centros', obtenerCentrosCercanos);
router.get('/faqs', getFaqs);

// ── Rutas protegidas (Requieren usuario autenticado) ──
router.post('/reporte', verifyToken, createReporte);

module.exports = router;
