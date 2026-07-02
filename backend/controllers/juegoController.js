const { pool } = require('../config/database');

/**
 * @module juegoController
 * @description Controlador del módulo de Gamificación y Juegos de MetroMed.
 * Gestiona la economía de MetroCoins: configuración de juegos, registro de partidas,
 * transacciones atómicas de saldo, historial personal y ranking global.
 *
 * Tabla principal: `configuracion_juegos` (habilita/deshabilita juegos y define su premio)
 * Tabla de saldo: `usuarios.saldo_metrocoins`
 * Tabla de movimientos: `metrocoins` (cada partida genera una fila)
 */

/**
 * Obtiene la configuración actual de todos los juegos disponibles.
 * Devuelve `id_juego`, `nombre`, `habilitado` y `metrocoins_premio` para que
 * el frontend pueda mostrar o esconder la tarjeta del juego y su recompensa.
 *
 * @async
 * @function getJuegosConfig
 * @route GET /api/juegos/config
 * @param {import('express').Request} req
 * @param {import('express').Response} res - JSON: { success, config: [...] }
 */
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

/**
 * Actualiza la configuración de un juego específico. Exclusivo para Administradores.
 * Permite habilitar/deshabilitar el juego y cambiar los MetroCoins que otorga por partida.
 *
 * @async
 * @function updateJuegoConfig
 * @route PUT /api/juegos/config
 * @param {import('express').Request} req - Body: { id_juego: string, habilitado: boolean, metrocoins_premio: number }
 * @param {import('express').Response} res
 */
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

/**
 * Registra el resultado de una partida y acredita los MetroCoins al usuario.
 *
 * Flujo transaccional (garantiza atomicidad con BEGIN/COMMIT/ROLLBACK):
 *  1. Verifica que el juego existe y está habilitado.
 *  2. Abre una transacción de BD.
 *  3. Suma `cantidad_obtenida` al saldo del usuario (`usuarios.saldo_metrocoins`).
 *  4. Inserta un registro en `metrocoins` con descripción "Partida: <nombre_juego>".
 *  5. Hace COMMIT y retorna el nuevo saldo actualizado.
 *  6. En caso de error hace ROLLBACK para evitar inconsistencias en el saldo.
 *
 * @async
 * @function registrarPartida
 * @route POST /api/juegos/partida
 * @param {import('express').Request} req - Body: { id_juego: string, cantidad_obtenida: number }. `req.user.id` por token JWT.
 * @param {import('express').Response} res - JSON: { success, message, nuevo_saldo: number }
 */
const registrarPartida = async (req, res) => {
    const { id_juego, cantidad_obtenida } = req.body;
    const id_usuario = req.user.id;

    try {
        // Verificar que el juego existe y está activo
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

        // Iniciar transacción atómica para evitar inconsistencias de saldo
        await pool.query('BEGIN');

        // 1. Sumar al saldo global del usuario
        await pool.query(
            'UPDATE usuarios SET saldo_metrocoins = COALESCE(saldo_metrocoins, 0) + $1 WHERE id_usuario = $2',
            [cantidad_obtenida, id_usuario]
        );

        // 2. Registrar el movimiento individual en el historial de monedas
        await pool.query(
            `INSERT INTO metrocoins (id_usuario, tipo_movimiento, cantidad, descripcion, fecha) 
             VALUES ($1, 'ganado', $2, $3, NOW())`,
            [id_usuario, cantidad_obtenida, `Partida: ${nombreJuego}`]
        );

        await pool.query('COMMIT');

        // Retornar saldo fresco de la BD para sincronizar el frontend
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
        // Revertir la transacción si algo salió mal para proteger el saldo
        if (pool.query) {
            try { await pool.query('ROLLBACK'); } catch (_) {}
        }
        console.error('Error al registrar partida:', error);
        res.status(500).json({ success: false, message: 'Error al registrar la partida y asignar MetroCoins' });
    }
};

/**
 * Obtiene el historial de partidas del usuario autenticado.
 * Filtra los movimientos de `metrocoins` con descripción "Partida:%" para mostrar
 * solo las partidas jugadas, excluyendo otras transacciones (compras, bonificaciones).
 * Extrae el nombre del juego eliminando el prefijo "Partida: " de la descripción.
 *
 * @async
 * @function getHistorialPartidas
 * @route GET /api/juegos/historial
 * @param {import('express').Request} req - `req.user.id` por token JWT.
 * @param {import('express').Response} res - JSON: { success, historial: [{ id, cantidad, fecha, juego }] }
 */
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
        
        // Formatear para retornar solo el nombre del juego sin el prefijo técnico
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

/**
 * Obtiene el ranking global de los 15 mejores jugadores, ordenado por saldo de MetroCoins.
 * Usa `COALESCE` para tratar nulos como 0 y evitar errores en usuarios sin saldo.
 *
 * @async
 * @function getRanking
 * @route GET /api/juegos/ranking
 * @param {import('express').Request} req
 * @param {import('express').Response} res - JSON: { success, ranking: [{ id_usuario, nombre, total_coins }] }
 */
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

/**
 * Obtiene estadísticas globales de participación en todos los juegos. Exclusivo para Administradores.
 *
 * Calcula:
 *  - `total_partidas`: número total de rondas jugadas en toda la plataforma.
 *  - `total_coins`: suma de MetroCoins distribuidos por juegos.
 *  - `desglose`: breakdown por juego (cuántas partidas y cuántas monedas generó cada uno).
 *  - `top_player`: el usuario con más partidas jugadas y su total acumulado.
 *
 * @async
 * @function getEstadisticas
 * @route GET /api/juegos/estadisticas
 * @param {import('express').Request} req
 * @param {import('express').Response} res - JSON: { success, stats: { total_partidas, total_coins, desglose, top_player } }
 */
const getEstadisticas = async (req, res) => {
    try {
        // Totales globales de partidas y monedas
        const [totales] = await pool.query(
            "SELECT COUNT(*) as total_partidas, SUM(cantidad) as total_coins_entregadas FROM metrocoins WHERE descripcion LIKE 'Partida:%'"
        );

        // Desglose agrupado por nombre de juego
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

        // Jugador más activo (mayor número de partidas jugadas)
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
