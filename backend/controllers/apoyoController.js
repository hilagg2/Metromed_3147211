/**
 * apoyoController.js
 * Controlador para el módulo de Apoyo Psicológico — MetroMed
 * Contiene chat con IA (Gemini), directorio de emergencia, centros cercanos a 4km, y reportes de sugerencias.
 */

const { pool } = require('../config/database');
const { generarRespuesta } = require('../services/geminiService');

// ── Regex para detección de riesgo (server-side, segunda barrera) ────
const FRASES_RIESGO = [
    /\b(quiero\s+morir)\b/i,
    /\b(no\s+quiero\s+vivir)\b/i,
    /\b(me\s+quiero\s+(hacer\s+daño|matar|suicidar))\b/i,
    /\b(suicid(io|arme|arse))\b/i,
    /\b(acabar\s+con\s+todo)\b/i,
    /\b(no\s+vale\s+la\s+pena\s+vivir)\b/i,
    /\b(cortar(me|se))\b/i,
    /\b(matar(me|se))\b/i,
    /\b(hacer(me)?\s+daño)\b/i,
    /\b(quiero\s+desaparecer)\b/i,
    /\b(ya\s+no\s+puedo\s+más)\b/i,
    /\b(no\s+tiene\s+sentido)\b/i,
    /\b(autolesion)\b/i,
    /\b(pastillas\s+para\s+morir)\b/i,
    /\b(tirarme|lanzarme|aventarme)\b/i,
];

/**
 * Detecta frases de riesgo en el texto.
 * @param {string} texto
 * @returns {boolean}
 */
const detectarRiesgo = (texto) => {
    const textoNormalizado = texto
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();
    return FRASES_RIESGO.some(regex => regex.test(textoNormalizado));
};

/**
 * Obtiene las líneas de emergencia formateadas como texto para el contexto de Gemini.
 * @returns {Promise<string>}
 */
const obtenerContextoLineas = async () => {
    try {
        const [rows] = await pool.query(
            'SELECT nombre, numero, descripcion, horario FROM lineas_emergencia WHERE activa = true ORDER BY id_linea'
        );
        if (!rows || rows.length === 0) {
            return 'Línea 106 (atención psicológica 24h) | Línea 123 (emergencias) | Línea de la Vida 018000113113';
        }
        return rows
            .map(l => `• ${l.nombre}: ${l.numero} — ${l.descripcion} (${l.horario})`)
            .join('\n');
    } catch (error) {
        console.warn('[Apoyo] Error obteniendo líneas de BD, usando fallback:', error.message);
        return 'Línea 106 (atención psicológica 24h) | Línea 123 (emergencias) | Línea de la Vida 018000113113';
    }
};

/**
 * POST /api/apoyo/chat
 * Procesa un mensaje del chatbot con IA.
 */
const chatConIA = async (req, res) => {
    try {
        const { mensaje, historial = [] } = req.body;

        if (!mensaje || typeof mensaje !== 'string' || mensaje.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: 'El mensaje es requerido',
            });
        }

        // Detección de riesgo
        if (detectarRiesgo(mensaje)) {
            let lineas = [];
            try {
                const [rows] = await pool.query(
                    'SELECT nombre, numero, descripcion, tipo, horario FROM lineas_emergencia WHERE activa = true ORDER BY id_linea'
                );
                lineas = rows || [];
            } catch (dbErr) {
                console.warn('[Apoyo] BD no disponible para líneas de emergencia');
            }

            return res.json({
                success: true,
                esEmergencia: true,
                respuesta: '💚 Entiendo que estás pasando por un momento muy difícil, y quiero que sepas que no estás solo/a. Lo que sientes importa y hay personas capacitadas que pueden ayudarte ahora mismo. Por favor, comunícate con alguna de estas líneas de ayuda:',
                lineas: lineas.length > 0 ? lineas : [
                    { nombre: 'Línea 106', numero: '106', descripcion: 'Atención psicológica gratuita 24/7', tipo: 'escucha' },
                    { nombre: 'Línea 123', numero: '123', descripcion: 'Emergencias', tipo: 'emergencia' },
                    { nombre: 'Línea de la Vida', numero: '018000113113', descripcion: 'Prevención del suicidio', tipo: 'escucha' },
                ],
            });
        }

        // Contexto y Gemini
        const contextoLineas = await obtenerContextoLineas();
        const { respuesta, esEmergencia } = await generarRespuesta(mensaje, historial, contextoLineas);

        let lineas = [];
        if (esEmergencia) {
            try {
                const [rows] = await pool.query(
                    'SELECT nombre, numero, descripcion, tipo, horario FROM lineas_emergencia WHERE activa = true ORDER BY id_linea'
                );
                lineas = rows || [];
            } catch (dbErr) {
                lineas = [
                    { nombre: 'Línea 106', numero: '106', descripcion: 'Atención psicológica gratuita 24/7', tipo: 'escucha' },
                    { nombre: 'Línea 123', numero: '123', descripcion: 'Emergencias', tipo: 'emergencia' },
                ];
            }
        }

        return res.json({
            success: true,
            esEmergencia,
            respuesta,
            lineas,
        });
    } catch (error) {
        console.error('[Apoyo] Error en chat:', error.message);
        return res.status(500).json({
            success: false,
            esEmergencia: false,
            respuesta: '💚 Disculpa, estoy teniendo dificultades técnicas en este momento. Si necesitas hablar con alguien, por favor comunícate con la Línea 106 (gratuita, 24 horas) o al 123 para emergencias. Tu bienestar es lo más importante.',
            message: 'Error al procesar el mensaje',
        });
    }
};

/**
 * GET /api/apoyo/lineas
 * Retorna todas las líneas de emergencia activas.
 */
const obtenerLineas = async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT id_linea, nombre, numero, descripcion, tipo, horario FROM lineas_emergencia WHERE activa = true ORDER BY tipo, id_linea'
        );
        return res.json({ success: true, lineas: rows || [] });
    } catch (error) {
        console.error('[Apoyo] Error obteniendo líneas:', error.message);
        return res.json({
            success: true,
            lineas: [
                { id_linea: 1, nombre: 'Línea 106', numero: '106', descripcion: 'Atención psicológica gratuita 24/7', tipo: 'escucha', horario: '24 horas' },
                { id_linea: 2, nombre: 'Línea 123', numero: '123', descripcion: 'Emergencias', tipo: 'emergencia', horario: '24 horas' },
                { id_linea: 3, nombre: 'Línea de la Vida', numero: '018000113113', descripcion: 'Prevención del suicidio', tipo: 'escucha', horario: '24 horas' },
            ],
        });
    }
};

/**
 * GET /api/apoyo/centros?lat=X&lon=Y&radio=4
 * Retorna centros de ayuda dentro de un radio (km) usando la fórmula Haversine.
 */
const obtenerCentrosCercanos = async (req, res) => {
    try {
        const { lat, lon, radio = 4 } = req.query;

        if (!lat || !lon) {
            return res.status(400).json({
                success: false,
                message: 'Se requieren los parámetros lat y lon',
            });
        }

        const latNum = parseFloat(lat);
        const lonNum = parseFloat(lon);
        const radioNum = parseFloat(radio);

        if (isNaN(latNum) || isNaN(lonNum) || isNaN(radioNum)) {
            return res.status(400).json({
                success: false,
                message: 'Los parámetros deben ser numéricos',
            });
        }

        const query = `
            WITH distancias AS (
                SELECT 
                    id_centro, nombre, direccion, latitud, longitud, telefono, tipo, horario,
                    (6371 * acos(
                        cos(radians($1)) * cos(radians(latitud)) *
                        cos(radians(longitud) - radians($2)) +
                        sin(radians($1)) * sin(radians(latitud))
                    )) AS distancia_km
                FROM centros_ayuda
                WHERE activo = true
            )
            SELECT * FROM distancias
            WHERE distancia_km <= $3
            ORDER BY distancia_km ASC
        `;

        const [rows] = await pool.query(query, [latNum, lonNum, radioNum]);

        return res.json({
            success: true,
            centros: (rows || []).map(c => ({
                ...c,
                distancia_km: parseFloat(parseFloat(c.distancia_km).toFixed(2)),
            })),
            coordenadas: { lat: latNum, lon: lonNum },
            radio_km: radioNum,
        });
    } catch (error) {
        console.error('[Apoyo] Error buscando centros:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Error al buscar centros de ayuda cercanos',
        });
    }
};

/**
 * GET /api/apoyo/faqs
 * Obtener preguntas frecuentes interactivas (RF-29).
 */
const getFaqs = async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT id_faq, pregunta, respuesta FROM faq_apoyo ORDER BY id_faq ASC'
        );
        res.json({ success: true, faqs: rows });
    } catch (error) {
        try {
            // Fallback si la tabla nueva no existe
            const [rows] = await pool.query(
                'SELECT id_faq, pregunta, respuesta FROM faqs_apoyo ORDER BY id_faq ASC'
            );
            res.json({ success: true, faqs: rows });
        } catch (err) {
            console.error('Error al obtener FAQs:', err);
            res.status(500).json({ success: false, message: 'Error al obtener las preguntas frecuentes' });
        }
    }
};

/**
 * POST /api/apoyo/reporte
 * Crear un nuevo reporte o sugerencia para mejorar el servicio de apoyo (RF-32).
 */
const createReporte = async (req, res) => {
    const { descripcion } = req.body;
    const id_usuario = req.user.id;

    if (!descripcion || !descripcion.trim()) {
        return res.status(400).json({ success: false, message: 'La descripción del reporte no puede estar vacía' });
    }

    try {
        await pool.query(
            'INSERT INTO reportes (id_usuario, tipo_reporte, descripcion, fecha_reporte) VALUES ($1, $2, $3, NOW())',
            [id_usuario, 'APOYO_PSICOLOGICO', descripcion]
        );
        res.status(201).json({ success: true, message: 'Reporte/sugerencia enviado correctamente. ¡Gracias por ayudarnos a mejorar!' });
    } catch (error) {
        console.error('Error al crear reporte:', error);
        res.status(500).json({ success: false, message: 'Error al registrar el reporte o sugerencia' });
    }
};

module.exports = {
    chatConIA,
    obtenerLineas,
    obtenerCentrosCercanos,
    getFaqs,
    createReporte
};
