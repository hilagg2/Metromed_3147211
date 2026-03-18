const { body, validationResult } = require('express-validator');

/**
 * Validaciones para registro de usuario
 */
const validateRegister = [
    body('nombre')
        .trim()
        .notEmpty().withMessage('El nombre es requerido')
        .isLength({ min: 2 }).withMessage('El nombre debe tener al menos 2 caracteres'),

    body('correo')
        .trim()
        .notEmpty().withMessage('El correo es requerido')
        .isEmail().withMessage('Debe ser un correo electrónico válido')
        .normalizeEmail(),

    body('contrasena')
        .notEmpty().withMessage('La contraseña es requerida')
        .isLength({ min: 8 }).withMessage('La contraseña debe tener mínimo 8 caracteres')
];

/**
 * Validaciones para login
 */
const validateLogin = [
    body('correo')
        .trim()
        .notEmpty().withMessage('El correo es requerido')
        .isEmail().withMessage('Debe ser un correo electrónico válido')
        .normalizeEmail(),

    body('contrasena')
        .notEmpty().withMessage('La contraseña es requerida')
];

/**
 * Validaciones para solicitar código de recuperación
 */
const validateForgotPassword = [
    body('correo')
        .trim()
        .notEmpty().withMessage('El correo es requerido')
        .isEmail().withMessage('Debe ser un correo electrónico válido')
        .normalizeEmail()
];

/**
 * Validaciones para verificar código
 */
const validateVerifyCode = [
    body('correo')
        .trim()
        .notEmpty().withMessage('El correo es requerido')
        .isEmail().withMessage('Debe ser un correo electrónico válido')
        .normalizeEmail(),

    body('codigo')
        .trim()
        .notEmpty().withMessage('El código es requerido')
        .isLength({ min: 6, max: 6 }).withMessage('El código debe tener 6 dígitos')
        .isNumeric().withMessage('El código debe ser numérico')
];

/**
 * Validaciones para resetear contraseña
 */
const validateResetPassword = [
    body('resetToken')
        .notEmpty().withMessage('El token de reseteo es requerido'),

    body('nuevaContrasena')
        .notEmpty().withMessage('La nueva contraseña es requerida')
        .isLength({ min: 8 }).withMessage('La nueva contraseña debe tener mínimo 8 caracteres')
];

/**
 * Middleware para manejar errores de validación
 */
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Errores de validación',
            errors: errors.array().map(err => ({
                field: err.path,
                message: err.msg
            }))
        });
    }

    next();
};

module.exports = {
    validateRegister,
    validateLogin,
    validateForgotPassword,
    validateVerifyCode,
    validateResetPassword,
    handleValidationErrors
};
