const jwt = require('jsonwebtoken');

/**
 * Middleware para verificar el token JWT
 */
const verifyToken = (req, res, next) => {
    // Obtener token del header
    const token = req.headers['authorization']?.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Acceso denegado. No se proporcionó token de autenticación.'
        });
    }

    try {
        // Verificar token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Agregar datos del usuario al request
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Token inválido o expirado'
        });
    }
};

module.exports = { verifyToken };
