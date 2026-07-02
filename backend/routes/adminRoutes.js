/**
 * adminRoutes.js
 * Rutas del panel de administración: dashboard y auditoría general.
 */

const express   = require('express');
const router    = express.Router();
const { verifyToken } = require('../middleware/auth');
const { esAdmin }     = require('../middleware/adminAuth');
const { getDashboardStats, getAuditoriaGeneral } = require('../controllers/adminController');

// GET /api/admin/dashboard  → Estadísticas del dashboard
router.get('/dashboard',  verifyToken, esAdmin, getDashboardStats);

// GET /api/admin/auditoria  → Auditoría general (query: ?modulo=usuarios|reportes|juegos)
router.get('/auditoria',  verifyToken, esAdmin, getAuditoriaGeneral);

module.exports = router;
