const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/mysqlPool');
const { generateVerificationCode, getExpirationDate } = require('../utils/generateCode');
const { sendVerificationCode } = require('../utils/emailService');

/**
 * RF-01, RF-03, RF-04: Registro de usuario
 * POST /api/auth/register
 */
const register = async (req, res) => {
    const { nombre, correo, contrasena } = req.body;

    try {
        // Verificar si el usuario ya existe
        const [existingUser] = await pool.query(
            'SELECT id_usuario FROM usuarios WHERE correo = ?',
            [correo]
        );

        if (existingUser.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'El correo electrónico ya está registrado'
            });
        }

        // Encriptar contraseña con bcrypt
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(contrasena, saltRounds);

        // Insertar usuario en la base de datos
        const [result] = await pool.query(
            `INSERT INTO usuarios (id_rol, nombre, correo, contrasena, saldo_metrocoins, verificado)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [1, nombre, correo, hashedPassword, 0, 0] // id_rol 1 = usuario normal
        );

        res.status(201).json({
            success: true,
            message: 'Usuario registrado exitosamente',
            userId: result.insertId
        });

    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({
            success: false,
            message: 'Error al registrar usuario',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

/**
 * RF-05, RF-08: Inicio de sesión
 * POST /api/auth/login
 */
const login = async (req, res) => {
    const { correo, contrasena } = req.body;

    try {
        // Buscar usuario por correo
        const [users] = await pool.query(
            'SELECT id_usuario, id_rol, nombre, correo, contrasena FROM usuarios WHERE correo = ?',
            [correo]
        );

        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Correo o contraseña incorrectos'
            });
        }

        const user = users[0];

        // Verificar contraseña
        const isPasswordValid = await bcrypt.compare(contrasena, user.contrasena);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Correo o contraseña incorrectos'
            });
        }

        // Generar JWT token
        const token = jwt.sign(
            {
                id: user.id_usuario,
                correo: user.correo,
                rol: user.id_rol
            },
            process.env.JWT_SECRET || 'tu_secreto_jwt',
            { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
        );

        res.json({
            success: true,
            message: 'Inicio de sesión exitoso',
            token,
            user: {
                id: user.id_usuario,
                nombre: user.nombre,
                correo: user.correo,
                rol: user.id_rol
            }
        });

    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({
            success: false,
            message: 'Error al iniciar sesión',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

/**
 * RF-09: Solicitar código de recuperación de contraseña
 * POST /api/auth/forgot-password
 */
const forgotPassword = async (req, res) => {
    const { correo } = req.body;

    try {
        const [users] = await pool.query(
            'SELECT id_usuario, nombre FROM usuarios WHERE correo = ?',
            [correo]
        );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No existe una cuenta con ese correo electrónico'
            });
        }

        const user = users[0];

        // Generar código
        const code = generateVerificationCode();
        const expirationDate = getExpirationDate();

        // Eliminar códigos anteriores
        await pool.query('DELETE FROM codigosverificacion WHERE id_usuario = ?', [user.id_usuario]);

        // Guardar código nuevo
        await pool.query(
            'INSERT INTO codigosverificacion (id_usuario, codigo, fecha_expiracion) VALUES (?, ?, ?)',
            [user.id_usuario, code, expirationDate]
        );

        // Enviar email
        await sendVerificationCode(correo, code, user.nombre);

        res.json({
            success: true,
            message: 'Código de verificación enviado al correo electrónico'
        });

    } catch (error) {
        console.error('Error en forgot password:', error);
        res.status(500).json({
            success: false,
            message: 'Error al procesar la solicitud',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

/**
 * Verificar código de recuperación
 * POST /api/auth/verify-code
 */
const verifyCode = async (req, res) => {
    const { correo, codigo } = req.body;

    try {
        const [users] = await pool.query('SELECT id_usuario FROM usuarios WHERE correo = ?', [correo]);

        if (users.length === 0) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }
        const userId = users[0].id_usuario;

        const [codes] = await pool.query(
            'SELECT id_codigo, codigo, fecha_expiracion FROM codigosverificacion WHERE id_usuario = ? AND codigo = ?',
            [userId, codigo]
        );

        if (codes.length === 0) {
            return res.status(400).json({ success: false, message: 'Código de verificación incorrecto' });
        }

        const codeData = codes[0];
        const now = new Date();
        const expirationDate = new Date(codeData.fecha_expiracion);

        if (now > expirationDate) {
            await pool.query('DELETE FROM codigosverificacion WHERE id_codigo = ?', [codeData.id_codigo]);
            return res.status(400).json({
                success: false,
                message: 'El código de verificación ha expirado. Solicita uno nuevo.'
            });
        }

        const resetToken = jwt.sign(
            { userId, codeId: codeData.id_codigo },
            process.env.JWT_SECRET || 'tu_secreto_jwt',
            { expiresIn: '15m' }
        );

        res.json({
            success: true,
            message: 'Código verificado correctamente',
            resetToken
        });

    } catch (error) {
        console.error('Error en verify code:', error);
        res.status(500).json({
            success: false,
            message: 'Error al verificar el código',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

/**
 * RF-10: Resetear contraseña
 * POST /api/auth/reset-password
 */
const resetPassword = async (req, res) => {
    const { resetToken, nuevaContrasena } = req.body;

    try {
        const decoded = jwt.verify(resetToken, process.env.JWT_SECRET || 'tu_secreto_jwt');
        const { userId, codeId } = decoded;

        const [users] = await pool.query('SELECT contrasena FROM usuarios WHERE id_usuario = ?', [userId]);

        if (users.length === 0) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }

        const isSamePassword = await bcrypt.compare(nuevaContrasena, users[0].contrasena);
        if (isSamePassword) {
            return res.status(400).json({
                success: false,
                message: 'La nueva contraseña no puede ser igual a la anterior'
            });
        }

        const hashedPassword = await bcrypt.hash(nuevaContrasena, 10);

        await pool.query('UPDATE usuarios SET contrasena = ? WHERE id_usuario = ?', [hashedPassword, userId]);
        await pool.query('DELETE FROM codigosverificacion WHERE id_codigo = ?', [codeId]);

        res.json({ success: true, message: 'Contraseña actualizada exitosamente' });

    } catch (error) {
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, message: 'Token inválido o expirado' });
        }
        console.error('Error en reset password:', error);
        res.status(500).json({
            success: false,
            message: 'Error al resetear la contraseña',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

module.exports = {
    register,
    login,
    forgotPassword,
    verifyCode,
    resetPassword
};
