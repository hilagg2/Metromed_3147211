const bcrypt = require('bcrypt');
const { pool } = require('../config/database');
const { logAuditoria } = require('./auditoriaController');

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
        // Auditoría
        if (req.user?.id) await logAuditoria(req.user.id, 'CREAR', 'USUARIO', String(result[0].insertId || correo), { correo, rol });
        
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
        // Auditoría
        if (req.user?.id) await logAuditoria(req.user.id, 'ACTUALIZAR', 'USUARIO', id, { nombre, correo, rol });
        
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
        
        // Auditoría
        if (req.user?.id) await logAuditoria(req.user.id, 'ELIMINAR', 'USUARIO', id, {});
        
        res.json({ message: 'Usuario eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        res.status(500).json({ error: 'Error al eliminar usuario' });
    }
};

const getUsuarioWrapped = async (req, res) => {
    const { id } = req.params;
    const { periodo } = req.query; // 'mensual' o 'anual'

    try {
        const [rows] = await pool.query(
            'SELECT id_usuario, nombre, correo, fecha_registro, saldo_metrocoins FROM usuarios WHERE id_usuario = $1',
            [id]
        );
        
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        
        const user = rows[0];
        
        // Período de tiempo para filtrar (RN-40.3)
        let dateFilter = "AND fecha >= NOW() - INTERVAL '365 days'";
        let congestionDateFilter = "AND fecha_reporte >= NOW() - INTERVAL '365 days'";
        if (periodo === 'mensual') {
            dateFilter = "AND fecha >= NOW() - INTERVAL '30 days'";
            congestionDateFilter = "AND fecha_reporte >= NOW() - INTERVAL '30 days'";
        }

        // 1. Juegos jugados y monedas ganadas (RN-40.1)
        const [gamesPlayedRows] = await pool.query(
            `SELECT COUNT(*) as total_juegos, COALESCE(SUM(cantidad), 0) as monedas_ganadas 
             FROM metrocoins 
             WHERE id_usuario = $1 AND (descripcion LIKE 'Partida:%' OR descripcion LIKE 'Puntuación%') ${dateFilter}`,
            [id]
        );
        const totalJuegos = parseInt(gamesPlayedRows[0].total_juegos, 10) || 0;
        const monedasGanadas = parseInt(gamesPlayedRows[0].monedas_ganadas, 10) || 0;

        // 2. Reportes de congestión hechos por el usuario (RN-40.1)
        const [congestionRows] = await pool.query(
            `SELECT 
                COUNT(*) as total_reportes,
                COUNT(CASE WHEN nivel_reportado = 'BAJO' THEN 1 END) as bajo,
                COUNT(CASE WHEN nivel_reportado = 'MEDIO' THEN 1 END) as medio,
                COUNT(CASE WHEN nivel_reportado = 'ALTO' THEN 1 END) as alto
             FROM reportes_congestion 
             WHERE id_usuario = $1 ${congestionDateFilter}`,
            [id]
        );
        const totalReportes = parseInt(congestionRows[0].total_reportes, 10) || 0;
        const cBajo = parseInt(congestionRows[0].bajo, 10) || 0;
        const cMedio = parseInt(congestionRows[0].medio, 10) || 0;
        const cAlto = parseInt(congestionRows[0].alto, 10) || 0;

        // Calcular porcentajes de distribución de congestión (RN-40.2)
        let bajoPercent = 0;
        let medioPercent = 0;
        let altoPercent = 0;
        if (totalReportes > 0) {
            bajoPercent = Math.round((cBajo / totalReportes) * 100);
            medioPercent = Math.round((cMedio / totalReportes) * 100);
            altoPercent = 100 - bajoPercent - medioPercent;
        } else {
            // Valores por defecto consistentes si no hay reportes
            bajoPercent = 50;
            medioPercent = 30;
            altoPercent = 20;
        }

        // 3. Actividad últimos 7 días (número de interacciones diarias: juegos + reportes)
        const last7 = [];
        for (let i = 6; i >= 0; i--) {
            const [activityRows] = await pool.query(
                `SELECT 
                    (SELECT COUNT(*) FROM metrocoins WHERE id_usuario = $1 AND (descripcion LIKE 'Partida:%' OR descripcion LIKE 'Puntuación%') AND DATE(fecha) = DATE(NOW() - INTERVAL '${i} days')) +
                    (SELECT COUNT(*) FROM reportes_congestion WHERE id_usuario = $1 AND DATE(fecha_reporte) = DATE(NOW() - INTERVAL '${i} days')) as total_actividad`,
                [id]
            );
            last7.push(parseInt(activityRows[0].total_actividad, 10) || 0);
        }

        // Calcular días de registro
        const regDate = new Date(user.fecha_registro);
        const today = new Date();
        const diffTime = Math.abs(today - regDate);
        const daysRegistered = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

        // Sesiones y alertas vistas (simuladas/calculadas agrupadas a partir de la actividad real)
        const totalSessions = totalJuegos + totalReportes + 5;
        const entries = totalReportes;
        const alertsViewed = Math.round(totalSessions * 0.3) + 2;
        const daysActive = Math.min(daysRegistered, Math.round(totalSessions * 0.5) + 1);
        const chatInteractions = totalJuegos + 2;

        res.json({
            nombre: user.nombre,
            saldo_metrocoins: user.saldo_metrocoins,
            daysRegistered,
            totalSessions,
            entries,
            alertsViewed,
            daysActive,
            chatInteractions,
            congestion: { bajo: bajoPercent, medio: medioPercent, alto: altoPercent },
            last7,
            totalJuegos,
            monedasGanadas,
            totalReportes,
            periodo: periodo || 'anual'
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
