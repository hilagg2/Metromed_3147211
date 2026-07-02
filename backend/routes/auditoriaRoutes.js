const express = require('express');
const router = express.Router();
const { verifyToken, requireAdmin } = require('../middleware/auth');
const { getHistorialAuditoria } = require('../controllers/auditoriaController');

// Solo administradores pueden ver la auditoría
router.get('/', verifyToken, requireAdmin, getHistorialAuditoria);

module.exports = router;
