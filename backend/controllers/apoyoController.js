const { pool } = require('../config/database');

// Obtener todas las líneas de ayuda general (RF-28, RF-31)
const getLineasAyuda = async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT id_linea, nombre_servicio, telefono, horario, disponibilidad FROM lineasayuda ORDER BY id_linea ASC'
        );
        res.json({ success: true, lineas: rows });
    } catch (error) {
        console.error('Error al obtener líneas de ayuda:', error);
        res.status(500).json({ success: false, message: 'Error al obtener las líneas de ayuda' });
    }
};

// Obtener preguntas frecuentes interactivas (RF-29)
const getFaqs = async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT id_faq, pregunta, respuesta FROM faqs_apoyo ORDER BY id_faq ASC'
        );
        res.json({ success: true, faqs: rows });
    } catch (error) {
        console.error('Error al obtener FAQs:', error);
        res.status(500).json({ success: false, message: 'Error al obtener las preguntas frecuentes' });
    }
};

// Crear un nuevo reporte o sugerencia para mejorar el servicio de apoyo (RF-32)
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
    getLineasAyuda,
    getFaqs,
    createReporte
};
