/**
 * adminAuth.js
 * Middleware centralizado para verificar rol de Administrador (id_rol === 2).
 * Usar junto a verifyToken.
 */

const esAdmin = (req, res, next) => {
    const rol = req.user?.rol;
    if (rol !== 2 && rol !== '2') {
        return res.status(403).json({
            success: false,
            message: 'Acceso restringido a Administradores.'
        });
    }
    next();
};

module.exports = { esAdmin };
