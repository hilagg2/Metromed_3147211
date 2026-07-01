/**
 * geminiService.js
 * Servicio backend para comunicación con Google Gemini API
 * Módulo de Apoyo Psicológico — MetroMed
 *
 * Responsabilidades:
 *  - Configurar el modelo con system prompt de guardrails
 *  - Enviar mensajes con contexto de líneas de emergencia
 *  - Manejar historial efímero de conversación (por request)
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');

// ── Inicializar SDK ─────────────────────────────────────────
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// ── System Prompt con Guardrails ─────────────────────────────
const SYSTEM_PROMPT = `Actúa como un Asistente de Apoyo Psicológico para la app MetroMed (Metro de Medellín, Colombia).

TU CONFIGURACIÓN DE COMPORTAMIENTO:

1. RESPONSABILIDAD (RN-27.2 & RN-29.2):
   - Tu función es INFORMATIVA, PREVENTIVA y de ORIENTACIÓN.
   - NUNCA emitas diagnósticos clínicos ni reemplaces a un profesional.
   - NO prescribas medicamentos ni terapias específicas.
   - Siempre sugiere consultar a un profesional para situaciones complejas.

2. FUENTES (RN-28.1 & RN-31.1):
   - Usa EXCLUSIVAMENTE las líneas de ayuda y datos oficiales que se te proporcionan como contexto.
   - Si no tienes información suficiente, deriva al usuario a las líneas de emergencia proporcionadas.
   - NO inventes números de teléfono ni nombres de instituciones.

3. SEGURIDAD — GUARDRAIL CRÍTICO:
   - Si detectas CUALQUIER indicio de autolesión, suicidio, intención de hacerse daño o hacerle daño a otros:
     a) DETÉN la conversación generativa inmediatamente
     b) Responde con empatía breve ("Entiendo que estás pasando por un momento muy difícil")
     c) Proporciona EXCLUSIVAMENTE las líneas de emergencia del contexto
     d) Incluye la etiqueta [PROTOCOLO_EMERGENCIA] al inicio de tu respuesta
   - Frases de alerta incluyen pero no se limitan a: "quiero morir", "no quiero vivir", "me quiero hacer daño", "suicidio", "acabar con todo", "no vale la pena vivir", "cortarme", "matarme", etc.

4. CONFIDENCIALIDAD (RN-27.3):
   - NUNCA pidas nombre completo, cédula, dirección exacta ni datos de identificación personal.
   - No hagas referencia a conversaciones anteriores (cada sesión es aislada).

5. TONO Y ESTILO:
   - Sé cálido, empático y profesional.
   - Usa un lenguaje inclusivo y respetuoso.
   - Valida las emociones del usuario antes de ofrecer información.
   - Usa frases como "entiendo cómo te sientes", "es normal sentir eso", "no estás solo/a".
   - Responde en español colombiano natural.
   - Mantén respuestas concisas (máximo 3-4 párrafos cortos).
   - Usa emojis con moderación (💚, 🤗, ✨) para calidez sin perder profesionalismo.

6. CONTEXTO METROMED:
   - Eres parte de la app MetroMed del Metro de Medellín.
   - Puedes mencionar que el Metro se preocupa por el bienestar de sus usuarios.
   - Si te preguntan cosas NO relacionadas con salud mental/bienestar, redirige amablemente: "Mi especialidad es el apoyo emocional. Para consultas sobre el Metro, usa las otras secciones de la app."`;

/**
 * Genera una respuesta del asistente de apoyo psicológico.
 *
 * @param {string}   mensajeUsuario - Mensaje actual del usuario
 * @param {Array}    historial      - Historial de la conversación [{role, parts}]
 * @param {string}   contextoLineas - Texto con las líneas de emergencia disponibles
 * @returns {Promise<{respuesta: string, esEmergencia: boolean}>}
 */
const generarRespuesta = async (mensajeUsuario, historial = [], contextoLineas = '') => {
    try {
        if (!process.env.GEMINI_API_KEY) {
            throw new Error('GEMINI_API_KEY no configurada en .env');
        }

        const model = genAI.getGenerativeModel({
            model: 'gemini-2.5-flash',
            systemInstruction: SYSTEM_PROMPT,
        });

        // ── Construir contexto con líneas de emergencia ──
        const contexto = contextoLineas
            ? `\n\n[CONTEXTO - LÍNEAS DE AYUDA OFICIALES]:\n${contextoLineas}\n\n[FIN CONTEXTO]\n\nMensaje del usuario:`
            : '\n\nMensaje del usuario:';

        // ── Construir historial para Gemini ──
        // Gemini requiere que el historial empiece con 'user' y alterne roles
        let historialLimpio = historial;
        
        // Si el primer mensaje es del bot (ej. el saludo inicial), lo quitamos
        while (historialLimpio.length > 0 && historialLimpio[0].role === 'bot') {
            historialLimpio.shift();
        }

        const historialGemini = historialLimpio.map(msg => ({
            role: msg.role === 'bot' ? 'model' : 'user',
            parts: [{ text: msg.text }],
        }));

        // ── Iniciar chat con historial ──
        const chat = model.startChat({
            history: historialGemini,
        });

        // ── Enviar mensaje con contexto ──
        const result = await chat.sendMessage(`${contexto} ${mensajeUsuario}`);
        const respuesta = result.response.text();

        // ── Detectar si Gemini activó el protocolo de emergencia ──
        const esEmergencia = respuesta.includes('[PROTOCOLO_EMERGENCIA]');

        return {
            respuesta: respuesta.replace('[PROTOCOLO_EMERGENCIA]', '').trim(),
            esEmergencia,
        };
    } catch (error) {
        console.error('[GeminiService] Error:', error.message);
        throw error;
    }
};

module.exports = { generarRespuesta };
