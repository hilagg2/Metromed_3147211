/**
 * usuarioController.js — RF-12, RF-13, RF-14, RF-37
 * Gestión completa de usuarios con auditoría y eliminación lógica.
 */

const bcrypt = require('bcrypt');
const { pool } = require('../config/mysqlPool');

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Registra una acción administrativa en auditoria_usuarios.
 */
const registrarAuditoria = async (idAdmin, idUsuario, accion, descripcion) => {
    try {
        await pool.query(
            `INSERT INTO auditoria_usuarios (id_administrador, id_usuario_afectado, accion, descripcion)
             VALUES (?, ?, ?, ?)`,
            [idAdmin, idUsuario, accion, descripcion]
        );
    } catch (err) {
        console.error('⚠️  Error al registrar auditoría de usuario:', err.message);
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// RF-14: Listar usuarios con filtros (estado, rol, búsqueda por nombre)
// GET /api/usuarios
// ─────────────────────────────────────────────────────────────────────────────
const getUsuarios = async (req, res) => {
    const { estado, rol, buscar } = req.query;

    let sql = `
        SELECT id_usuario, nombre, correo, id_rol, estado,
               DATE_FORMAT(fecha_registro, '%Y-%m-%d %H:%i') AS fecha_registro
        FROM usuarios
        WHERE 1=1
    `;
    const params = [];

    if (estado && estado !== 'todos') {
        sql += ' AND estado = ?';
        params.push(estado);
    }

    if (rol && rol !== 'todos') {
        const idRol = rol === 'administrador' ? 2 : 1;
        sql += ' AND id_rol = ?';
        params.push(idRol);
    }

    if (buscar) {
        sql += ' AND (nombre LIKE ? OR correo LIKE ?)';
        params.push(`%${buscar}%`, `%${buscar}%`);
    }

    sql += ' ORDER BY fecha_registro DESC';

    try {
        const [usuarios] = await pool.query(sql, params);

        const formatted = usuarios.map(u => ({
            id:             u.id_usuario,
            nombre:         u.nombre,
            correo:         u.correo,
            rol:            u.id_rol === 2 ? 'administrador' : 'usuario',
            id_rol:         u.id_rol,
            estado:         u.estado || 'activo',
            fecha_creacion: u.fecha_registro,
        }));

        res.json({ success: true, data: formatted });
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ success: false, message: 'Error al obtener usuarios' });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// RF-12: Crear usuario
// POST /api/usuarios
// ─────────────────────────────────────────────────────────────────────────────
const createUsuario = async (req, res) => {
    const { nombre, correo, rol, password } = req.body;
    const adminId = req.user?.id;

    // Validaciones obligatorias
    if (!nombre || !correo || !password) {
        return res.status(400).json({
            success: false,
            message: 'Nombre, correo y contraseña son obligatorios.'
        });
    }

    try {
        // Verificar correo duplicado
        const [existing] = await pool.query(
            'SELECT id_usuario FROM usuarios WHERE correo = ?',
            [correo]
        );
        if (existing.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'El correo ya está registrado.'
            });
        }

        const id_rol = rol === 'administrador' ? 2 : 1;
        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await pool.query(
            `INSERT INTO usuarios (id_rol, nombre, correo, contrasena, verificado, saldo_metrocoins, estado)
             VALUES (?, ?, ?, ?, ?, ?, 'activo')`,
            [id_rol, nombre, correo, hashedPassword, 1, 0]
        );

        await registrarAuditoria(
            adminId,
            result.insertId,
            'CREAR',
            `Usuario "${nombre}" (${correo}) creado con rol "${rol || 'usuario'}"`
        );

        res.status(201).json({ success: true, message: 'Usuario creado exitosamente', id: result.insertId });
    } catch (error) {
        console.error('Error al crear usuario:', error);
        res.status(500).json({ success: false, message: 'Error al crear usuario. Verifica que el correo no esté duplicado.' });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// RF-12 / RF-13: Editar usuario y/o rol
// PUT /api/usuarios/:id
// ─────────────────────────────────────────────────────────────────────────────
const updateUsuario = async (req, res) => {
    const { id } = req.params;
    const { nombre, correo, rol, password } = req.body;
    const adminId = req.user?.id;

    if (!nombre || !correo) {
        return res.status(400).json({
            success: false,
            message: 'Nombre y correo son obligatorios.'
        });
    }

    try {
        const id_rol = rol === 'administrador' ? 2 : 1;

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            await pool.query(
                'UPDATE usuarios SET id_rol = ?, nombre = ?, correo = ?, contrasena = ? WHERE id_usuario = ?',
                [id_rol, nombre, correo, hashedPassword, id]
            );
        } else {
            await pool.query(
                'UPDATE usuarios SET id_rol = ?, nombre = ?, correo = ? WHERE id_usuario = ?',
                [id_rol, nombre, correo, id]
            );
        }

        await registrarAuditoria(
            adminId,
            id,
            'EDITAR',
            `Datos actualizados: nombre="${nombre}", correo="${correo}", rol="${rol || 'usuario'}"`
        );

        res.json({ success: true, message: 'Usuario actualizado exitosamente' });
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        res.status(500).json({ success: false, message: 'Error al actualizar usuario' });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// RF-12 / RF-37: Eliminación física
// DELETE /api/usuarios/:id
// ─────────────────────────────────────────────────────────────────────────────
const deleteUsuario = async (req, res) => {
    const { id } = req.params;
    const adminId = req.user?.id;

    if (parseInt(id) === adminId) {
        return res.status(400).json({
            success: false,
            message: 'No puedes eliminar tu propia cuenta.'
        });
    }

    try {
        const [rows] = await pool.query('SELECT nombre FROM usuarios WHERE id_usuario = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }

        // Eliminar dependencias sin CASCADE
        await pool.query('DELETE FROM preferencias_alertas WHERE id_usuario = ?', [id]);
        await pool.query('DELETE FROM codigosverificacion WHERE id_usuario = ?', [id]);
        await pool.query('DELETE FROM auditoria_usuarios WHERE id_usuario_afectado = ? OR id_administrador = ?', [id, id]);
        await pool.query('DELETE FROM auditoria_reportes WHERE id_administrador = ?', [id]);

        await pool.query('DELETE FROM usuarios WHERE id_usuario = ?', [id]);

        await registrarAuditoria(
            adminId,
            null,
            'ELIMINAR_FISICO',
            `Usuario "${rows[0].nombre}" (ID: ${id}) eliminado permanentemente`
        );

        res.json({ success: true, message: 'Usuario eliminado permanentemente' });
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        res.status(500).json({ success: false, message: 'Error al eliminar usuario' });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// Alternar Rol
// PATCH /api/usuarios/:id/rol
// ─────────────────────────────────────────────────────────────────────────────
const cambiarRolUsuario = async (req, res) => {
    const { id } = req.params;
    const adminId = req.user?.id;

    if (parseInt(id) === adminId) {
        return res.status(400).json({
            success: false,
            message: 'No puedes cambiar tu propio rol.'
        });
    }

    try {
        const [rows] = await pool.query('SELECT nombre, id_rol FROM usuarios WHERE id_usuario = ?', [id]);
        if (rows.length === 0) return res.status(404).json({ success: false, message: 'Usuario no encontrado' });

        const nuevoRol = rows[0].id_rol === 1 ? 2 : 1;
        const nombreRol = nuevoRol === 2 ? 'administrador' : 'usuario';

        await pool.query('UPDATE usuarios SET id_rol = ? WHERE id_usuario = ?', [nuevoRol, id]);

        await registrarAuditoria(
            adminId,
            id,
            'CAMBIAR_ROL',
            `Rol de "${rows[0].nombre}" cambiado a "${nombreRol}"`
        );

        res.json({ success: true, message: `Rol actualizado a ${nombreRol}` });
    } catch (error) {
        console.error('Error al cambiar rol:', error);
        res.status(500).json({ success: false, message: 'Error al cambiar rol' });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// RF-37: Cambiar estado (activar / desactivar)
// PATCH /api/usuarios/:id/estado
// ─────────────────────────────────────────────────────────────────────────────
const cambiarEstadoUsuario = async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;
    const adminId = req.user?.id;

    if (!['activo', 'inactivo'].includes(estado)) {
        return res.status(400).json({
            success: false,
            message: 'Estado debe ser "activo" o "inactivo".'
        });
    }

    if (parseInt(id) === adminId) {
        return res.status(400).json({
            success: false,
            message: 'No puedes cambiar el estado de tu propia cuenta.'
        });
    }

    try {
        const [rows] = await pool.query('SELECT nombre FROM usuarios WHERE id_usuario = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }

        await pool.query('UPDATE usuarios SET estado = ? WHERE id_usuario = ?', [estado, id]);

        const accion = estado === 'activo' ? 'ACTIVAR' : 'DESACTIVAR';
        await registrarAuditoria(
            adminId,
            id,
            accion,
            `Cuenta de "${rows[0].nombre}" cambiada a estado "${estado}"`
        );

        res.json({ success: true, message: `Usuario ${estado === 'activo' ? 'activado' : 'desactivado'} exitosamente` });
    } catch (error) {
        console.error('Error al cambiar estado:', error);
        res.status(500).json({ success: false, message: 'Error al cambiar el estado del usuario' });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// RF-37: Historial de auditoría de usuarios
// GET /api/usuarios/auditoria
// ─────────────────────────────────────────────────────────────────────────────
const getAuditoriaUsuarios = async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT
                au.id_auditoria,
                ua.nombre  AS administrador,
                uaf.nombre AS usuario_afectado,
                au.accion,
                au.descripcion,
                DATE_FORMAT(au.fecha, '%Y-%m-%d %H:%i:%s') AS fecha
             FROM auditoria_usuarios au
             JOIN usuarios ua  ON ua.id_usuario  = au.id_administrador
             JOIN usuarios uaf ON uaf.id_usuario = au.id_usuario_afectado
             ORDER BY au.fecha DESC
             LIMIT 200`
        );
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error('Error al obtener auditoría:', error);
        res.status(500).json({ success: false, message: 'Error al obtener auditoría' });
    }
};

module.exports = {
    getUsuarios,
    createUsuario,
    updateUsuario,
    deleteUsuario,
    cambiarEstadoUsuario,
    getAuditoriaUsuarios,
    cambiarRolUsuario,
};
