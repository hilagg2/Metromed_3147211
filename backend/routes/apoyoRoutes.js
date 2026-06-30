const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const {
    getLineasAyuda,
    getFaqs,
    createReporte
} = require('../controllers/apoyoController');

// Proteger todas las rutas de apoyo psicológico con token JWT
router.use(verifyToken);

router.get('/lineas', getLineasAyuda);
router.get('/faqs', getFaqs);
router.post('/reporte', createReporte);

module.exports = router;
