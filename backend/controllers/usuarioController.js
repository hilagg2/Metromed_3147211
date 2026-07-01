const bcrypt = require('bcrypt');
const { pool } = require('../config/mysqlPool');

const getUsuarios = async (req, res) => {
    try {
        const [usuarios] = await pool.query('SELECT id_usuario, nombre, correo, id_rol FROM usuarios');

        const formatUsuarios = usuarios.map(u => ({
            id: u.id_usuario,
            nombre: u.nombre,
            correo: u.correo,
            rol: u.id_rol === 2 ? 'administrador' : 'usuario',
            estado: 'activo'
        }));

        res.json(formatUsuarios);
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
};

const createUsuario = async (req, res) => {
    const { nombre, correo, rol, password } = req.body;
    try {
        const id_rol = rol === 'administrador' ? 2 : 1;
        const hashedPassword = await bcrypt.hash(password || '123456', 10);

        await pool.query(
            'INSERT INTO usuarios (id_rol, nombre, correo, contrasena, verificado, saldo_metrocoins) VALUES (?, ?, ?, ?, ?, ?)',
            [id_rol, nombre, correo, hashedPassword, 1, 0]
        );

        res.status(201).json({ message: 'Usuario creado exitosamente' });
    } catch (error) {
        console.error('Error al crear usuario:', error);
        res.status(500).json({ error: 'Error al crear usuario. Verifica que el correo no esté duplicado.' });
    }
};

const updateUsuario = async (req, res) => {
    const { id } = req.params;
    const { nombre, correo, rol, password } = req.body;
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

        res.json({ message: 'Usuario actualizado exitosamente' });
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        res.status(500).json({ error: 'Error al actualizar usuario' });
    }
};

const deleteUsuario = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM usuarios WHERE id_usuario = ?', [id]);
        res.json({ message: 'Usuario eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        res.status(500).json({ error: 'Error al eliminar usuario' });
    }
};

module.exports = {
    getUsuarios,
    createUsuario,
    updateUsuario,
    deleteUsuario
};
