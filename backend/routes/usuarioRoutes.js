/**
 * usuarioRoutes.js — RF-12, RF-13, RF-14, RF-37
 * Todas las rutas protegidas con JWT + rol Administrador.
 */

const express   = require('express');
const router    = express.Router();
const { verifyToken } = require('../middleware/auth');
const { esAdmin }     = require('../middleware/adminAuth');
const {
    getUsuarios,
    createUsuario,
    updateUsuario,
    deleteUsuario,
    cambiarEstadoUsuario,
    getAuditoriaUsuarios,
    cambiarRolUsuario,
} = require('../controllers/usuarioController');

// GET    /api/usuarios          → Listar (con filtros)     RF-14
router.get('/',              verifyToken, esAdmin, getUsuarios);

// GET    /api/usuarios/auditoria → Historial de auditoría  RF-37
router.get('/auditoria',     verifyToken, esAdmin, getAuditoriaUsuarios);

// POST   /api/usuarios          → Crear usuario            RF-12
router.post('/',             verifyToken, esAdmin, createUsuario);

// PUT    /api/usuarios/:id      → Editar usuario/rol       RF-12, RF-13
router.put('/:id',           verifyToken, esAdmin, updateUsuario);

// PATCH  /api/usuarios/:id/estado → Activar/Desactivar     RF-37
router.patch('/:id/estado',  verifyToken, esAdmin, cambiarEstadoUsuario);

// DELETE /api/usuarios/:id      → Eliminación física
router.delete('/:id',        verifyToken, esAdmin, deleteUsuario);

// PATCH  /api/usuarios/:id/rol  → Alternar rol
router.patch('/:id/rol',     verifyToken, esAdmin, cambiarRolUsuario);

module.exports = router;
