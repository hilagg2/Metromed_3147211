/**
 * apoyoRoutes.js
 * Rutas para el módulo de Apoyo Psicológico — MetroMed
 *
 * Rutas:
 *  POST /api/apoyo/chat      → Chat con IA
 *  GET  /api/apoyo/lineas    → Líneas de emergencia
 *  GET  /api/apoyo/centros   → Centros de ayuda cercanos
 *
 * Nota: Sin autenticación requerida (el apoyo debe ser accesible para todos)
 */

const express = require('express');
const router = express.Router();
const {
    chatConIA,
    obtenerLineas,
    obtenerCentrosCercanos,
} = require('../controllers/apoyoController');

// ── Chat con IA (Google Gemini) ──
router.post('/chat', chatConIA);

// ── Líneas de emergencia activas ──
router.get('/lineas', obtenerLineas);

// ── Centros de ayuda cercanos (con coordenadas) ──
router.get('/centros', obtenerCentrosCercanos);

module.exports = router;
