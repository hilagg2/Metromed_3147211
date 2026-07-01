/**
 * apoyoService.js
 * Servicio frontend para el módulo de Apoyo Psicológico — MetroMed
 *
 * Funciones:
 *  - enviarMensajeChat()    → Chat con IA via backend
 *  - getLineasEmergencia()  → Líneas de emergencia activas
 *  - getCentrosCercanos()   → Centros de ayuda en radio 4km
 *  - detectarRiesgoLocal()  → Detección client-side (primera barrera)
 */

const API_BASE = 'http://localhost:5000/api/apoyo';

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
 * Primera barrera de seguridad — no requiere llamada al servidor.
 *
 * @param {string} texto
 * @returns {boolean}
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
 *
 * @param {string} mensaje    - Mensaje del usuario
 * @param {Array}  historial  - Historial de conversación [{role, text}]
 * @returns {Promise<{success, respuesta, esEmergencia, lineas?}>}
 */
export const enviarMensajeChat = async (mensaje, historial = []) => {
    const response = await fetch(`${API_BASE}/chat`, {
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
 * @returns {Promise<Array>}
 */
export const getLineasEmergencia = async () => {
    try {
        const response = await fetch(`${API_BASE}/lineas`);
        const data = await response.json();
        return data.success ? data.lineas : LINEAS_FALLBACK;
    } catch {
        return LINEAS_FALLBACK;
    }
};

/**
 * Obtiene centros de ayuda cercanos a las coordenadas dadas.
 *
 * @param {number} lat   - Latitud del usuario
 * @param {number} lon   - Longitud del usuario
 * @param {number} radio - Radio en km (default 4)
 * @returns {Promise<Array>}
 */
export const getCentrosCercanos = async (lat, lon, radio = 4) => {
    const response = await fetch(
        `${API_BASE}/centros?lat=${lat}&lon=${lon}&radio=${radio}`
    );
    const data = await response.json();
    if (!data.success) throw new Error(data.message || 'Error al buscar centros');
    return data.centros;
};
