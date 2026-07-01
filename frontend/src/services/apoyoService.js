/**
 * apoyoService.js
 * Servicio frontend para el módulo de Apoyo Psicológico — MetroMed
 */

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/apoyo`;

const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

// ── Frases de riesgo para detección instantánea (client-side) ────────
const PATRONES_RIESGO = [
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
    /\b(autolesion)\b/i,
    /\b(pastillas\s+para\s+morir)\b/i,
    /\b(tirarme|lanzarme|aventarme)\b/i,
];

// ── Líneas de emergencia estáticas (fallback si backend no responde) ──
export const LINEAS_FALLBACK = [
    { nombre: 'Línea 106', numero: '106', descripcion: 'Atención psicológica gratuita 24/7', tipo: 'escucha' },
    { nombre: 'Línea 123', numero: '123', descripcion: 'Emergencias', tipo: 'emergencia' },
    { nombre: 'Línea de la Vida', numero: '018000113113', descripcion: 'Prevención del suicidio', tipo: 'escucha' },
];

/**
 * Detecta frases de riesgo en el texto (client-side, instantáneo).
 */
export const detectarRiesgoLocal = (texto) => {
    if (!texto || typeof texto !== 'string') return false;
    const normalizado = texto
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();
    return PATRONES_RIESGO.some(regex => regex.test(normalizado));
};

/**
 * Envía un mensaje al chatbot de apoyo psicológico (via backend → Gemini).
 */
export const enviarMensajeChat = async (mensaje, historial = []) => {
    const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mensaje, historial }),
    });

    const data = await response.json();

    if (!response.ok && !data.respuesta) {
        throw new Error(data.message || 'Error al comunicarse con el asistente');
    }

    return data;
};

/**
 * Obtiene las líneas de emergencia activas.
 */
export const getLineasEmergencia = async () => {
    try {
        const response = await fetch(`${API_URL}/lineas`);
        const data = await response.json();
        return data.success ? data.lineas : LINEAS_FALLBACK;
    } catch {
        return LINEAS_FALLBACK;
    }
};

// Mantener compatibilidad con llamadas existentes a getLineasAyuda
export const getLineasAyuda = getLineasEmergencia;

/**
 * Obtiene centros de ayuda cercanos a las coordenadas dadas.
 */
export const getCentrosCercanos = async (lat, lon, radio = 4) => {
    const response = await fetch(
        `${API_URL}/centros?lat=${lat}&lon=${lon}&radio=${radio}`
    );
    const data = await response.json();
    if (!data.success) throw new Error(data.message || 'Error al buscar centros');
    return data.centros;
};

/**
 * Obtiene las preguntas frecuentes.
 */
export const getFaqs = async () => {
    const response = await fetch(`${API_URL}/faqs`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al obtener las preguntas frecuentes');
    return data.faqs;
};

/**
 * Envia un reporte de sugerencias de salud mental.
 */
export const createReporte = async (descripcion) => {
    const response = await fetch(`${API_URL}/reporte`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ descripcion })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al enviar el reporte');
    return data;
};
