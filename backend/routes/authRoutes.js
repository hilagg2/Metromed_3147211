const express = require('express');
const router = express.Router();
const {
    register,
    login,
    forgotPassword,
    verifyCode,
    resetPassword
} = require('../controllers/authController');

const {
    validateRegister,
    validateLogin,
    validateForgotPassword,
    validateVerifyCode,
    validateResetPassword,
    handleValidationErrors
} = require('../middleware/validator');

/**
 * @route   POST /api/auth/register
 * @desc    Registrar nuevo usuario (RF-01, RF-03, RF-04)
 * @access  Public
 */
router.post('/register',
    validateRegister,
    handleValidationErrors,
    register
);

/**
 * @route   POST /api/auth/login
 * @desc    Iniciar sesión (RF-05, RF-08)
 * @access  Public
 */
router.post('/login',
    validateLogin,
    handleValidationErrors,
    login
);

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Solicitar código de recuperación (RF-09)
 * @access  Public
 */
router.post('/forgot-password',
    validateForgotPassword,
    handleValidationErrors,
    forgotPassword
);

/**
 * @route   POST /api/auth/verify-code
 * @desc    Verificar código de recuperación
 * @access  Public
 */
router.post('/verify-code',
    validateVerifyCode,
    handleValidationErrors,
    verifyCode
);

/**
 * @route   POST /api/auth/reset-password
 * @desc    Resetear contraseña (RF-10)
 * @access  Public
 */
router.post('/reset-password',
    validateResetPassword,
    handleValidationErrors,
    resetPassword
);

module.exports = router;
