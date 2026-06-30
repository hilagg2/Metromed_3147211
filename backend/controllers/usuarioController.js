const bcrypt = require('bcrypt');
const { pool } = require('../config/database');

const getUsuarios = async (req, res) => {
    try {
        const [usuarios] = await pool.query(
            `SELECT id_usuario as id, nombre, correo, 
            CASE WHEN id_rol = 1 THEN 'administrador' ELSE 'usuario' END as rol,
            'activo' as estado
            FROM usuarios`
        );
        res.json(usuarios);
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
};

const createUsuario = async (req, res) => {
    const { nombre, correo, rol, password } = req.body;
    try {
        const id_rol = rol === 'administrador' ? 1 : 2;
        const hashedPassword = await bcrypt.hash(password || '123456', 10);
        
        await pool.query(
            'INSERT INTO usuarios (id_rol, nombre, correo, contrasena, fecha_registro, verificado) VALUES ($1, $2, $3, $4, NOW(), 1)',
            [id_rol, nombre, correo, hashedPassword]
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
        const id_rol = rol === 'administrador' ? 1 : 2;
        
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            await pool.query(
                'UPDATE usuarios SET id_rol = $1, nombre = $2, correo = $3, contrasena = $4 WHERE id_usuario = $5',
                [id_rol, nombre, correo, hashedPassword, id]
            );
        } else {
            await pool.query(
                'UPDATE usuarios SET id_rol = $1, nombre = $2, correo = $3 WHERE id_usuario = $4',
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
        await pool.query('DELETE FROM usuarios WHERE id_usuario = $1', [id]);
        res.json({ message: 'Usuario eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        res.status(500).json({ error: 'Error al eliminar usuario' });
    }
};

const getUsuarioWrapped = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await pool.query(
            'SELECT id_usuario, nombre, correo, fecha_registro, saldo_metrocoins FROM usuarios WHERE id_usuario = $1',
            [id]
        );
        
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        
        const user = rows[0];
        
        // Calcular días de registro
        const regDate = new Date(user.fecha_registro);
        const today = new Date();
        const diffTime = Math.abs(today - regDate);
        const daysRegistered = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
        
        // Generar estadísticas estables basadas en el ID de usuario y los metrocoins reales
        const userIdNum = parseInt(user.id_usuario, 10) || 1;
        const metrocoins = parseFloat(user.saldo_metrocoins) || 0;
        
        const totalSessions = Math.round(metrocoins * 0.05) + (userIdNum % 10) + 12;
        const entries = Math.round(totalSessions * 0.6) + (userIdNum % 5) + 5;
        const alertsViewed = Math.round(totalSessions * 0.15) + (userIdNum % 3) + 2;
        const daysActive = Math.min(daysRegistered, Math.round(totalSessions * 0.4) + (userIdNum % 4) + 3);
        const chatInteractions = Math.round(totalSessions * 0.25) + (userIdNum % 4) + 1;
        
        // Distribución de congestión
        const bajo = 40 + (userIdNum % 20);
        const medio = 30 + (userIdNum % 15);
        const alto = 100 - bajo - medio;
        
        // Últimos 7 días
        const last7 = [
            (userIdNum % 4) + 1,
            ((userIdNum + 1) % 5) + 2,
            ((userIdNum + 2) % 3) + 1,
            ((userIdNum + 3) % 6) + 2,
            ((userIdNum + 4) % 4) + 3,
            ((userIdNum + 5) % 5) + 2,
            ((userIdNum + 6) % 3) + 2
        ];
        
        res.json({
            nombre: user.nombre,
            saldo_metrocoins: metrocoins,
            daysRegistered,
            totalSessions,
            entries,
            alertsViewed,
            daysActive,
            chatInteractions,
            congestion: { bajo, medio, alto },
            last7
        });
    } catch (error) {
        console.error('Error al obtener Wrapped de usuario:', error);
        res.status(500).json({ error: 'Error al obtener Wrapped de usuario' });
    }
};

module.exports = {
    getUsuarios,
    createUsuario,
    updateUsuario,
    deleteUsuario,
    getUsuarioWrapped
};
