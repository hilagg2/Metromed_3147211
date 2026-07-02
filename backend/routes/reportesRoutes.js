/**
 * reportesRoutes.js — RF-33, RF-34, RF-35, RF-36
 */

const express   = require('express');
const router    = express.Router();
const { verifyToken } = require('../middleware/auth');
const { esAdmin }     = require('../middleware/adminAuth');
const {
    crearReporte,
    getReportes,
    cambiarEstadoReporte,
    getAuditoriaReportes,
} = require('../controllers/reportesController');

// GET  /api/reportes            → Historial con filtros     RF-35
router.get('/',              verifyToken, esAdmin, getReportes);

// GET  /api/reportes/auditoria  → Auditoría de reportes
router.get('/auditoria',     verifyToken, esAdmin, getAuditoriaReportes);

// POST /api/reportes            → Crear reporte             RF-33, RF-34
router.post('/',             verifyToken, crearReporte);

// PATCH /api/reportes/:id/estado → Cambiar estado           RF-36
router.patch('/:id/estado',  verifyToken, esAdmin, cambiarEstadoReporte);

module.exports = router;
