const jwt = require('jsonwebtoken');

/**
 * Middleware para verificar el token JWT.
 * Inyecta req.user con los datos decodificados del payload.
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

/**
 * Middleware de autorización por rol.
 * Debe usarse DESPUÉS de verifyToken, ya que depende de req.user.
 *
 * @param {number} rolRequerido - El id_rol que debe tener el usuario.
 *   2 = Pasajero/Usuario   (puede enviar reportes de congestión)
 *   1 = Administrador
 *
 * @example
 *   router.post('/reporte', verifyToken, requireRole(2), recibirReporte);
 *
 * Cumple: RN-19.1, RN-21.1 (solo Pasajeros pueden enviar reportes)
 */
const requireRole = (rolRequerido) => {
    return (req, res, next) => {
        // req.user.rol es el id_rol almacenado en el JWT
        if (!req.user || Number(req.user.rol) !== rolRequerido) {
            return res.status(403).json({
                success: false,
                message: `Acceso denegado. Esta acción requiere rol ${rolRequerido === 2 ? 'Pasajero' : 'Administrador'}.`
            });
        }
        next();
    };
};

module.exports = { verifyToken, requireRole };
