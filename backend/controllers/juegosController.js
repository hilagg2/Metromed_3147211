const { supabase } = require('../config/database');

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
        const isAdmin = req.query.admin === 'true';
        let query = supabase.from('juegos').select('*');

        if (!isAdmin) {
            query = query.eq('activo', true);
        }

        const { data: juegos, error } = await query;

        if (error) throw error;

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
        const { data: juegos, error: juegoError } = await supabase
            .from('juegos')
            .select('id_juego, activo')
            .eq('identificador', identificador);

        if (juegoError) throw juegoError;

        if (!juegos || juegos.length === 0) {
            return res.status(404).json({ success: false, message: 'Juego no encontrado' });
        }

        if (!juegos[0].activo) {
            return res.status(400).json({ success: false, message: 'Este juego se encuentra deshabilitado temporalmente' });
        }

        const juegoId = juegos[0].id_juego;

        // Registrar en historial
        const { error: histError } = await supabase
            .from('historial_juegos')
            .insert({
                id_usuario: userId,
                id_juego: juegoId,
                monedas_obtenidas,
                detalles: detalles || ''
            });

        if (histError) throw histError;

        // Obtener saldo actual del usuario
        const { data: userData, error: userError } = await supabase
            .from('usuarios')
            .select('saldo_metrocoins, nivel')
            .eq('id_usuario', userId)
            .single();

        if (userError) throw userError;

        const nuevoSaldo = (parseFloat(userData.saldo_metrocoins) || 0) + monedas_obtenidas;
        const nivelActual = userData.nivel || 1;
        const nuevoNivelCalculado = calcularNivel(nuevoSaldo);

        // Actualizar saldo y posiblemente nivel
        const updateData = { saldo_metrocoins: nuevoSaldo };
        let subioDeNivel = false;

        if (nuevoNivelCalculado > nivelActual) {
            updateData.nivel = nuevoNivelCalculado;
            subioDeNivel = true;
        }

        const { error: updateError } = await supabase
            .from('usuarios')
            .update(updateData)
            .eq('id_usuario', userId);

        if (updateError) throw updateError;

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
        const { data, error } = await supabase
            .from('historial_juegos')
            .select('id_historial, juegos(nombre), monedas_obtenidas, fecha_jugada, detalles')
            .eq('id_usuario', userId)
            .order('fecha_jugada', { ascending: false })
            .limit(50);

        if (error) throw error;

        // Mapear para mantener la misma estructura de respuesta
        const historial = (data || []).map(h => ({
            id_historial: h.id_historial,
            juego: h.juegos?.nombre || 'Desconocido',
            monedas_obtenidas: h.monedas_obtenidas,
            fecha_jugada: h.fecha_jugada,
            detalles: h.detalles
        }));

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
        const { data: ranking, error } = await supabase
            .from('usuarios')
            .select('id_usuario, nombre, saldo_metrocoins, nivel')
            .order('saldo_metrocoins', { ascending: false })
            .limit(20);

        if (error) throw error;

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
    const { id } = req.params;
    const { activo, recompensa_base } = req.body;

    try {
        // Construir objeto de actualización solo con campos proporcionados
        const updateData = {};
        if (activo !== undefined && activo !== null) updateData.activo = activo;
        if (recompensa_base !== undefined && recompensa_base !== null) updateData.recompensa_base = recompensa_base;

        const { error } = await supabase
            .from('juegos')
            .update(updateData)
            .eq('id_juego', id);

        if (error) throw error;

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
