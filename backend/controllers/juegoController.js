const { pool } = require('../config/database');

// Obtener la configuración de todos los juegos
const getJuegosConfig = async (req, res) => {
    try {
        const [config] = await pool.query(
            'SELECT id_juego, nombre, habilitado, metrocoins_premio FROM configuracion_juegos ORDER BY nombre ASC'
        );
        res.json({ success: true, config });
    } catch (error) {
        console.error('Error al obtener configuración de juegos:', error);
        res.status(500).json({ success: false, message: 'Error al obtener la configuración de juegos' });
    }
};

// Actualizar configuración de un juego (Admin)
const updateJuegoConfig = async (req, res) => {
    const { id_juego, habilitado, metrocoins_premio } = req.body;
    try {
        await pool.query(
            'UPDATE configuracion_juegos SET habilitado = $1, metrocoins_premio = $2 WHERE id_juego = $3',
            [habilitado, metrocoins_premio, id_juego]
        );
        res.json({ success: true, message: 'Configuración de juego actualizada correctamente' });
    } catch (error) {
        console.error('Error al actualizar configuración de juego:', error);
        res.status(500).json({ success: false, message: 'Error al actualizar la configuración del juego' });
    }
};

// Registrar una partida y sumar MetroCoins
const registrarPartida = async (req, res) => {
    const { id_juego, cantidad_obtenida } = req.body;
    const id_usuario = req.user.id;

    try {
        // Obtener el nombre del juego para la descripción
        const [juegos] = await pool.query(
            'SELECT nombre, habilitado FROM configuracion_juegos WHERE id_juego = $1',
            [id_juego]
        );

        if (juegos.length === 0) {
            return res.status(404).json({ success: false, message: 'Juego no encontrado' });
        }

        if (!juegos[0].habilitado) {
            return res.status(403).json({ success: false, message: 'Este juego está actualmente deshabilitado' });
        }

        const nombreJuego = juegos[0].nombre;

        // Iniciar transacción de saldo e historial
        await pool.query('BEGIN');

        // Sumar al saldo del usuario
        await pool.query(
            'UPDATE usuarios SET saldo_metrocoins = COALESCE(saldo_metrocoins, 0) + $1 WHERE id_usuario = $2',
            [cantidad_obtenida, id_usuario]
        );

        // Guardar en el historial de metrocoins
        await pool.query(
            `INSERT INTO metrocoins (id_usuario, tipo_movimiento, cantidad, descripcion, fecha) 
             VALUES ($1, 'ganado', $2, $3, NOW())`,
            [id_usuario, cantidad_obtenida, `Partida: ${nombreJuego}`]
        );

        await pool.query('COMMIT');

        // Obtener saldo actualizado
        const [userRows] = await pool.query(
            'SELECT saldo_metrocoins FROM usuarios WHERE id_usuario = $1',
            [id_usuario]
        );

        res.json({
            success: true,
            message: `Partida registrada. ¡Ganaste ${cantidad_obtenida} MetroCoins!`,
            nuevo_saldo: userRows[0].saldo_metrocoins
        });

    } catch (error) {
        if (pool.query) {
            try { await pool.query('ROLLBACK'); } catch (_) {}
        }
        console.error('Error al registrar partida:', error);
        res.status(500).json({ success: false, message: 'Error al registrar la partida y asignar MetroCoins' });
    }
};

// Obtener historial de partidas de un usuario
const getHistorialPartidas = async (req, res) => {
    const id_usuario = req.user.id;
    try {
        const [historial] = await pool.query(
            `SELECT id_movimiento, cantidad, fecha, descripcion 
             FROM metrocoins 
             WHERE id_usuario = $1 AND descripcion LIKE 'Partida:%' 
             ORDER BY fecha DESC`,
            [id_usuario]
        );
        
        // Formatear para retornar solo el nombre del juego
        const logs = historial.map(item => ({
            id: item.id_movimiento,
            cantidad: item.cantidad,
            fecha: item.fecha,
            juego: item.descripcion.replace('Partida: ', '')
        }));

        res.json({ success: true, historial: logs });
    } catch (error) {
        console.error('Error al obtener historial de partidas:', error);
        res.status(500).json({ success: false, message: 'Error al obtener el historial de partidas' });
    }
};

// Obtener ranking general
const getRanking = async (req, res) => {
    try {
        const [ranking] = await pool.query(
            `SELECT id_usuario, nombre, COALESCE(saldo_metrocoins, 0) as total_coins 
             FROM usuarios 
             ORDER BY total_coins DESC 
             LIMIT 15`
        );
        res.json({ success: true, ranking });
    } catch (error) {
        console.error('Error al obtener ranking:', error);
        res.status(500).json({ success: false, message: 'Error al obtener el ranking' });
    }
};

// Obtener estadísticas de participación en los juegos (Admin)
const getEstadisticas = async (req, res) => {
    try {
        // Total de partidas jugadas
        const [totales] = await pool.query(
            "SELECT COUNT(*) as total_partidas, SUM(cantidad) as total_coins_entregadas FROM metrocoins WHERE descripcion LIKE 'Partida:%'"
        );

        // Desglose de partidas por juego
        const [desglose] = await pool.query(
            `SELECT descripcion as juego_desc, COUNT(*) as cantidad_jugada, SUM(cantidad) as monedas_generadas 
             FROM metrocoins 
             WHERE descripcion LIKE 'Partida:%' 
             GROUP BY descripcion`
        );

        const desgloseJuegos = desglose.map(d => ({
            juego: d.juego_desc.replace('Partida: ', ''),
            partidas: parseInt(d.cantidad_jugada, 10),
            monedas: parseInt(d.monedas_generadas || 0, 10)
        }));

        // Jugador con más partidas
        const [topPlayer] = await pool.query(
            `SELECT u.nombre, COUNT(m.id_movimiento) as total_partidas, SUM(m.cantidad) as total_ganado
             FROM metrocoins m
             JOIN usuarios u ON m.id_usuario = u.id_usuario
             WHERE m.descripcion LIKE 'Partida:%'
             GROUP BY u.id_usuario, u.nombre
             ORDER BY total_partidas DESC
             LIMIT 1`
        );

        res.json({
            success: true,
            stats: {
                total_partidas: parseInt(totales[0].total_partidas || 0, 10),
                total_coins: parseInt(totales[0].total_coins_entregadas || 0, 10),
                desglose: desgloseJuegos,
                top_player: topPlayer.length > 0 ? topPlayer[0] : null
            }
        });
    } catch (error) {
        console.error('Error al obtener estadísticas de juegos:', error);
        res.status(500).json({ success: false, message: 'Error al obtener estadísticas' });
    }
};

module.exports = {
    getJuegosConfig,
    updateJuegoConfig,
    registrarPartida,
    getHistorialPartidas,
    getRanking,
    getEstadisticas
};
