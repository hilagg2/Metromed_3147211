const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

// Rutas para /api/usuarios
router.get('/', usuarioController.getUsuarios);
router.post('/', usuarioController.createUsuario);
router.get('/:id/wrapped', usuarioController.getUsuarioWrapped);
router.put('/:id', usuarioController.updateUsuario);
router.delete('/:id', usuarioController.deleteUsuario);

module.exports = router;
