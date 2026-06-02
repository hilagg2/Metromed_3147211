const { pool } = require('../config/database');

/**
 * Función auxiliar para calcular el nivel basado en MetroCoins
 */
const calcularNivel = (metroCoins) => {
    // 1 nivel por cada 500 MetroCoins
    return Math.floor(metroCoins / 500) + 1;
};

/**
 * Obtener todos los juegos disponibles
 * GET /api/juegos
 */
const getJuegos = async (req, res) => {
    try {
        // Obtenemos todos los juegos para el admin, o los activos para el frontend
        // Si el usuario es admin, pasaremos un query param o lo dejaremos traer todos
        const isAdmin = req.query.admin === 'true';
        let query = 'SELECT * FROM juegos';
        if (!isAdmin) {
            query += ' WHERE activo = TRUE';
        }
        
        const [juegos] = await pool.query(query);
        res.json({
            success: true,
            juegos
        });
    } catch (error) {
        console.error('Error al obtener juegos:', error);
        res.status(500).json({ success: false, message: 'Error al cargar los juegos' });
    }
};

/**
 * Registrar partida y otorgar MetroCoins
 * POST /api/juegos/jugar
 */
const registrarPartida = async (req, res) => {
    const { identificador, monedas_obtenidas, detalles } = req.body;
    const userId = req.user.id;

    try {
        // Verificar que el juego exista y esté activo
        const [juegos] = await pool.query('SELECT id_juego, activo FROM juegos WHERE identificador = ?', [identificador]);
        
        if (juegos.length === 0) {
            return res.status(404).json({ success: false, message: 'Juego no encontrado' });
        }
        
        if (!juegos[0].activo) {
            return res.status(400).json({ success: false, message: 'Este juego se encuentra deshabilitado temporalmente' });
        }

        const juegoId = juegos[0].id_juego;

        // Registrar en historial
        await pool.query(
            'INSERT INTO historial_juegos (id_usuario, id_juego, monedas_obtenidas, detalles) VALUES (?, ?, ?, ?)',
            [userId, juegoId, monedas_obtenidas, detalles || '']
        );

        // Actualizar saldo de usuario
        await pool.query(
            'UPDATE usuarios SET saldo_metrocoins = saldo_metrocoins + ? WHERE id_usuario = ?',
            [monedas_obtenidas, userId]
        );

        // Obtener saldo actualizado y calcular posible subida de nivel
        const [usuarios] = await pool.query('SELECT saldo_metrocoins, nivel FROM usuarios WHERE id_usuario = ?', [userId]);
        const nuevoSaldo = parseFloat(usuarios[0].saldo_metrocoins);
        const nivelActual = usuarios[0].nivel || 1;
        
        const nuevoNivelCalculado = calcularNivel(nuevoSaldo);
        
        let subioDeNivel = false;
        if (nuevoNivelCalculado > nivelActual) {
            await pool.query('UPDATE usuarios SET nivel = ? WHERE id_usuario = ?', [nuevoNivelCalculado, userId]);
            subioDeNivel = true;
        }

        res.json({
            success: true,
            message: 'Partida registrada correctamente',
            monedas_obtenidas,
            nuevoSaldo,
            nivel: subioDeNivel ? nuevoNivelCalculado : nivelActual,
            subioDeNivel
        });

    } catch (error) {
        console.error('Error al registrar partida:', error);
        res.status(500).json({ success: false, message: 'Error al registrar la partida' });
    }
};

/**
 * Obtener el historial de partidas del usuario
 * GET /api/juegos/historial
 */
const getHistorial = async (req, res) => {
    const userId = req.user.id;
    try {
        const [historial] = await pool.query(`
            SELECT h.id_historial, j.nombre as juego, h.monedas_obtenidas, h.fecha_jugada, h.detalles
            FROM historial_juegos h
            JOIN juegos j ON h.id_juego = j.id_juego
            WHERE h.id_usuario = ?
            ORDER BY h.fecha_jugada DESC
            LIMIT 50
        `, [userId]);

        res.json({
            success: true,
            historial
        });
    } catch (error) {
        console.error('Error al obtener historial:', error);
        res.status(500).json({ success: false, message: 'Error al obtener historial de juegos' });
    }
};

/**
 * Obtener el ranking general de usuarios
 * GET /api/juegos/ranking
 */
const getRanking = async (req, res) => {
    try {
        const [ranking] = await pool.query(`
            SELECT id_usuario, nombre, saldo_metrocoins, nivel
            FROM usuarios
            ORDER BY saldo_metrocoins DESC
            LIMIT 20
        `);

        res.json({
            success: true,
            ranking
        });
    } catch (error) {
        console.error('Error al obtener ranking:', error);
        res.status(500).json({ success: false, message: 'Error al obtener el ranking' });
    }
};

/**
 * Actualizar configuración de un juego (Admin)
 * PUT /api/juegos/:id
 */
const updateJuego = async (req, res) => {
    // Solo admins deberían hacer esto, aquí se asume que verifyToken dejó info en req.user
    const { id } = req.params;
    const { activo, recompensa_base } = req.body;
    
    try {
        await pool.query(
            'UPDATE juegos SET activo = COALESCE(?, activo), recompensa_base = COALESCE(?, recompensa_base) WHERE id_juego = ?',
            [activo, recompensa_base, id]
        );
        res.json({ success: true, message: 'Juego actualizado correctamente' });
    } catch (error) {
        console.error('Error al actualizar juego:', error);
        res.status(500).json({ success: false, message: 'Error al actualizar el juego' });
    }
};

module.exports = {
    getJuegos,
    registrarPartida,
    getHistorial,
    getRanking,
    updateJuego
};
