/**
 * congestionRoutes.js
 * Rutas del módulo de Congestión Colaborativa MetroMed
 *
 * GET  /api/congestion/estaciones  → Estado actual de todas las estaciones (público)
 * GET  /api/congestion/eventos     → Suscripción SSE en tiempo real (público)
 * POST /api/congestion/reporte     → Enviar reporte (JWT + rol Pasajero obligatorio)
 */

const express = require('express');
const router = express.Router();

const { verifyToken, requireRole } = require('../middleware/auth');
const {
    getEstaciones,
    suscribirSSE,
    recibirReporte
} = require('../controllers/congestionController');

/**
 * @route   GET /api/congestion/estaciones
 * @desc    Retorna todas las estaciones con nivel de congestión actual
 * @access  Público (sin autenticación)
 * @cumple  RN-22.1 — representación uniforme en todas las líneas y estaciones
 */
router.get('/estaciones', getEstaciones);

/**
 * @route   GET /api/congestion/eventos
 * @desc    Stream SSE — el cliente se suscribe y recibe actualizaciones automáticas
 * @access  Público
 * @cumple  RN-19.2, RN-19.3, RN-22.2
 */
router.get('/eventos', suscribirSSE);

/**
 * @route   POST /api/congestion/reporte
 * @desc    Pasajero envía reporte de nivel de congestión en una estación
 * @access  Privado — JWT válido + rol 2 (Pasajero/Usuario)
 * @cumple  RN-19.1, RN-21.1, RN-21.2, RN-21.3, RN-20.1, RN-20.2
 *
 * Body: { id_estacion: number, nivel_reportado: 'BAJO'|'MEDIO'|'ALTO' }
 */
router.post('/reporte',
    verifyToken,            // (RN-21.1) Verificar que está autenticado
    requireRole(2),         // (RN-19.1) Solo pasajeros (rol=2)
    recibirReporte
);

module.exports = router;
