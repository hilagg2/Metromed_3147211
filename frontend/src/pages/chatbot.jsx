import React, { useState, useRef, useEffect } from 'react';
import {
    enviarMensajeChat,
    detectarRiesgoLocal,
    getLineasEmergencia,
    getCentrosCercanos,
    LINEAS_FALLBACK,
} from '../services/apoyoService';
import './chatbot.css';

// ── Opciones rápidas para el usuario ─────────────────────────
const OPCIONES_RAPIDAS = [
    { id: 'sentir', icon: '💭', label: '¿Cómo me siento?' },
    { id: 'ansiedad', icon: '😰', label: 'Tengo ansiedad' },
    { id: 'tristeza', icon: '😢', label: 'Me siento triste' },
    { id: 'estres', icon: '😫', label: 'Estoy estresado/a' },
    { id: 'ayuda', icon: '📍', label: 'Ayuda cercana' },
    { id: 'lineas', icon: '📞', label: 'Líneas de emergencia' },
];

// ── Mapeo de opciones rápidas a mensajes ─────────────────────
const MENSAJES_OPCIONES = {
    sentir: 'No sé cómo describir lo que siento, pero necesito hablar con alguien.',
    ansiedad: 'Estoy sintiendo mucha ansiedad y no sé cómo manejarla.',
    tristeza: 'Me siento triste y un poco solo/a últimamente.',
    estres: 'El estrés del día a día me está afectando mucho.',
};

/**
 * Saludo contextual basado en la hora del día.
 */
const obtenerSaludo = () => {
    const hora = new Date().getHours();
    if (hora < 12) return '¡Buenos días! ☀️';
    if (hora < 18) return '¡Buenas tardes! 🌤️';
    return '¡Buenas noches! 🌙';
};

/**
 * MetroMedellinChatbot — Asistente de Apoyo Psicológico con IA
 *
 * Guardrails de seguridad:
 *  1. Detección de riesgo client-side (instantáneo, regex)
 *  2. Detección de riesgo server-side (regex en backend)
 *  3. System prompt de Gemini con instrucciones de emergencia
 *
 * Confidencialidad (RN-27.3):
 *  - Historial solo en useState (se borra al cerrar/recargar)
 *  - No se almacena PII
 */
export const MetroMedellinChatbot = () => {
    const [messages, setMessages] = useState([
        {
            from: 'bot',
            text: `${obtenerSaludo()} Soy tu asistente de bienestar emocional en MetroMed 💚\n\nEstoy aquí para escucharte y orientarte. Puedes contarme cómo te sientes o seleccionar una opción rápida.\n\n🔒 Esta conversación es completamente confidencial y no se almacena.`,
            timestamp: new Date(),
        },
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [showEmergency, setShowEmergency] = useState(false);
    const [emergencyLines, setEmergencyLines] = useState([]);
    const [nearbyCenters, setNearbyCenters] = useState([]);
    const [loadingCenters, setLoadingCenters] = useState(false);
    const [showQuickOptions, setShowQuickOptions] = useState(true);

    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    // ── Auto-scroll al último mensaje ──
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping, showEmergency, nearbyCenters]);

    // ── Cargar líneas de emergencia al montar ──
    useEffect(() => {
        getLineasEmergencia()
            .then(setEmergencyLines)
            .catch(() => setEmergencyLines(LINEAS_FALLBACK));
    }, []);

    /**
     * Construye el historial para enviar al backend.
     * Solo envía los últimos 10 mensajes para no exceder tokens.
     */
    const buildHistorial = () => {
        return messages
            .slice(-10)
            .map(m => ({ role: m.from === 'bot' ? 'bot' : 'user', text: m.text }));
    };

    /**
     * Activa el protocolo de emergencia.
     */
    const activarEmergencia = (lineas = null) => {
        setShowEmergency(true);
        if (lineas && lineas.length > 0) {
            setEmergencyLines(lineas);
        }
    };

    /**
     * Envía un mensaje al chatbot.
     */
    const handleSend = async (textoOverride = null) => {
        const texto = textoOverride || input.trim();
        if (!texto) return;

        // Añadir mensaje del usuario
        const userMsg = { from: 'user', text: texto, timestamp: new Date() };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setShowQuickOptions(false);

        // ── BARRERA 1: Detección de riesgo client-side (instantáneo) ──
        if (detectarRiesgoLocal(texto)) {
            const emergencyMsg = {
                from: 'bot',
                text: '💚 Entiendo que estás pasando por un momento muy difícil, y quiero que sepas que no estás solo/a. Lo que sientes importa y hay personas capacitadas que pueden ayudarte ahora mismo.',
                timestamp: new Date(),
                isEmergency: true,
            };
            setMessages(prev => [...prev, emergencyMsg]);
            activarEmergencia();
            return;
        }

        // ── Detección de intención: Buscar ayuda cercana ──
        const intencionUbicacion = /\b(cerca(na)?|ubicaci(o|ó)n|d(o|ó)nde|centro(s)?|hospital(es)?|cl(i|í)nica(s)?)\b/i.test(texto) && /\b(hay|buscar|necesito|quiero|ayuda)\b/i.test(texto);
        
        if (intencionUbicacion) {
            handleBuscarCercanos(true); // true = skip adding default user message
            return;
        }

        // ── Llamar al backend (Gemini + barrera 2) ──
        setIsTyping(true);
        try {
            const historial = buildHistorial();
            const data = await enviarMensajeChat(texto, historial);

            const botMsg = {
                from: 'bot',
                text: data.respuesta,
                timestamp: new Date(),
                isEmergency: data.esEmergencia,
            };
            setMessages(prev => [...prev, botMsg]);

            if (data.esEmergencia) {
                activarEmergencia(data.lineas);
            }
        } catch (error) {
            console.error('[Chatbot] Error:', error);
            const errorMsg = {
                from: 'bot',
                text: '💚 Disculpa, estoy teniendo dificultades en este momento. Si necesitas hablar con alguien urgente, por favor llama a la Línea 106 (gratuita, 24 horas) o al 123 para emergencias.',
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsTyping(false);
        }
    };

    /**
     * Maneja clic en opción rápida.
     */
    const handleQuickOption = async (opcionId) => {
        if (opcionId === 'lineas') {
            // Mostrar líneas de emergencia directamente
            setShowQuickOptions(false);
            const userMsg = { from: 'user', text: '📞 Quiero ver las líneas de emergencia', timestamp: new Date() };
            setMessages(prev => [...prev, userMsg]);

            const lineas = emergencyLines.length > 0 ? emergencyLines : LINEAS_FALLBACK;
            const lineasTexto = lineas
                .map(l => `📞 **${l.nombre}**: ${l.numero}\n   ${l.descripcion}`)
                .join('\n\n');

            const botMsg = {
                from: 'bot',
                text: `Aquí tienes las líneas de ayuda disponibles 💚\n\n${lineasTexto}\n\nTodas estas líneas son gratuitas y confidenciales. No dudes en llamar si lo necesitas.`,
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, botMsg]);
            return;
        }

        if (opcionId === 'ayuda') {
            // Buscar centros cercanos (false = add default user message)
            handleBuscarCercanos(false);
            return;
        }

        // Enviar mensaje predefinido
        const mensaje = MENSAJES_OPCIONES[opcionId];
        if (mensaje) {
            handleSend(mensaje);
        }
    };

    /**
     * Busca centros de ayuda cercanos usando geolocalización (RN-30).
     */
    const handleBuscarCercanos = (skipUserMsg = false) => {
        setShowQuickOptions(false);
        
        if (!skipUserMsg) {
            const userMsg = { from: 'user', text: '📍 Buscar ayuda cercana a mi ubicación', timestamp: new Date() };
            setMessages(prev => [...prev, userMsg]);
        }

        if (!navigator.geolocation) {
            const errMsg = {
                from: 'bot',
                text: '⚠️ Tu navegador no soporta geolocalización. Puedes buscar centros de ayuda en Medellín contactando a la Secretaría de Salud al (604) 385 5555.',
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, errMsg]);
            return;
        }

        setLoadingCenters(true);
        const loadMsg = {
            from: 'bot',
            text: '📍 Buscando centros de ayuda cerca de ti...',
            timestamp: new Date(),
        };
        setMessages(prev => [...prev, loadMsg]);

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    const centros = await getCentrosCercanos(latitude, longitude, 4);
                    setNearbyCenters(centros);

                    if (centros.length === 0) {
                        const noResultMsg = {
                            from: 'bot',
                            text: '😔 No encontré centros de ayuda en un radio de 4km. Te recomiendo contactar a la Línea 106 o la Secretaría de Salud de Medellín al (604) 385 5555.',
                            timestamp: new Date(),
                        };
                        setMessages(prev => [...prev, noResultMsg]);
                    } else {
                        const resultMsg = {
                            from: 'bot',
                            text: `🏥 Encontré ${centros.length} centro(s) de ayuda cerca de ti:`,
                            timestamp: new Date(),
                            centers: centros,
                        };
                        setMessages(prev => [...prev, resultMsg]);
                    }
                } catch (err) {
                    console.error('[Chatbot] Error buscando centros:', err);
                    const errMsg = {
                        from: 'bot',
                        text: '⚠️ No pude buscar centros cercanos. Puedes contactar directamente a la Línea 106 (gratuita, 24h) o a la Secretaría de Salud al (604) 385 5555.',
                        timestamp: new Date(),
                    };
                    setMessages(prev => [...prev, errMsg]);
                }
                setLoadingCenters(false);
            },
            (error) => {
                console.warn('[Chatbot] Error de geolocalización:', error);
                const errMsg = {
                    from: 'bot',
                    text: '📍 No se pudo obtener tu ubicación. Verifica que tengas los permisos de ubicación activados. Mientras tanto, puedes contactar la Línea 106 (gratuita, 24h).',
                    timestamp: new Date(),
                };
                setMessages(prev => [...prev, errMsg]);
                setLoadingCenters(false);
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    };

    /**
     * Maneja el envío con Enter.
     */
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    /**
     * Formatea el timestamp.
     */
    const formatTime = (date) => {
        return new Date(date).toLocaleTimeString('es-CO', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    /**
     * Cierra el protocolo de emergencia (no el chat).
     */
    const handleDismissEmergency = () => {
        setShowEmergency(false);
    };

    return (
        <div className="psych-chatbot">
            {/* ── Header ── */}
            <div className="psych-chatbot__header">
                <div className="psych-chatbot__header-avatar">
                    <i className="fas fa-heart-pulse"></i>
                </div>
                <div className="psych-chatbot__header-info">
                    <h3>Asistente de Bienestar</h3>
                    <span className="psych-chatbot__status">
                        <span className="psych-chatbot__status-dot"></span>
                        Disponible 24/7
                    </span>
                </div>
                <div className="psych-chatbot__header-badge">
                    <i className="fas fa-shield-alt"></i>
                    Confidencial
                </div>
            </div>

            {/* ── Protocolo de emergencia (overlay) ── */}
            {showEmergency && (
                <div className="psych-chatbot__emergency">
                    <div className="psych-chatbot__emergency-card">
                        <div className="psych-chatbot__emergency-header">
                            <i className="fas fa-exclamation-triangle"></i>
                            <h4>Líneas de Ayuda Inmediata</h4>
                        </div>
                        <p className="psych-chatbot__emergency-msg">
                            No estás solo/a. Estas líneas son gratuitas, confidenciales y están disponibles ahora:
                        </p>
                        <div className="psych-chatbot__emergency-lines">
                            {(emergencyLines.length > 0 ? emergencyLines : LINEAS_FALLBACK)
                                .filter(l => l.tipo === 'escucha' || l.tipo === 'emergencia')
                                .slice(0, 4)
                                .map((linea, idx) => (
                                    <a
                                        key={idx}
                                        href={`tel:${linea.numero.replace(/[^0-9+]/g, '')}`}
                                        className={`psych-chatbot__emergency-line ${linea.tipo}`}
                                    >
                                        <div className="psych-chatbot__emergency-line-icon">
                                            <i className={linea.tipo === 'emergencia' ? 'fas fa-ambulance' : 'fas fa-phone-alt'}></i>
                                        </div>
                                        <div className="psych-chatbot__emergency-line-info">
                                            <strong>{linea.nombre}</strong>
                                            <span>{linea.numero}</span>
                                        </div>
                                        <div className="psych-chatbot__emergency-line-action">
                                            <i className="fas fa-phone"></i> Llamar
                                        </div>
                                    </a>
                                ))}
                        </div>
                        <button className="psych-chatbot__emergency-dismiss" onClick={handleDismissEmergency}>
                            Continuar en el chat
                        </button>
                    </div>
                </div>
            )}

            {/* ── Mensajes ── */}
            <div className="psych-chatbot__messages">
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`psych-chatbot__msg ${msg.from} ${msg.isEmergency ? 'emergency' : ''}`}
                    >
                        {msg.from === 'bot' && (
                            <div className="psych-chatbot__msg-avatar">
                                <i className="fas fa-heart"></i>
                            </div>
                        )}
                        <div className="psych-chatbot__msg-content">
                            <div className="psych-chatbot__msg-bubble">
                                {msg.text.split('\n').map((line, i) => (
                                    <React.Fragment key={i}>
                                        {line}
                                        {i < msg.text.split('\n').length - 1 && <br />}
                                    </React.Fragment>
                                ))}
                            </div>

                            {/* ── Cards de centros cercanos ── */}
                            {msg.centers && msg.centers.length > 0 && (
                                <div className="psych-chatbot__centers">
                                    {msg.centers.map((centro, cIdx) => (
                                        <div key={cIdx} className="psych-chatbot__center-card">
                                            <div className="psych-chatbot__center-icon">
                                                <i className={centro.tipo === 'salud_mental' ? 'fas fa-brain' : 'fas fa-hospital'}></i>
                                            </div>
                                            <div className="psych-chatbot__center-info">
                                                <strong>{centro.nombre}</strong>
                                                <span className="psych-chatbot__center-address">
                                                    <i className="fas fa-map-marker-alt"></i> {centro.direccion}
                                                </span>
                                                {centro.telefono && (
                                                    <a href={`tel:${centro.telefono.replace(/[^0-9+]/g, '')}`} className="psych-chatbot__center-phone">
                                                        <i className="fas fa-phone"></i> {centro.telefono}
                                                    </a>
                                                )}
                                                <span className="psych-chatbot__center-dist">
                                                    📍 {centro.distancia_km} km
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <span className="psych-chatbot__msg-time">
                                {formatTime(msg.timestamp)}
                            </span>
                        </div>
                    </div>
                ))}

                {/* ── Indicador de "escribiendo..." ── */}
                {isTyping && (
                    <div className="psych-chatbot__msg bot">
                        <div className="psych-chatbot__msg-avatar">
                            <i className="fas fa-heart"></i>
                        </div>
                        <div className="psych-chatbot__msg-content">
                            <div className="psych-chatbot__msg-bubble psych-chatbot__typing">
                                <span className="psych-chatbot__typing-dot"></span>
                                <span className="psych-chatbot__typing-dot"></span>
                                <span className="psych-chatbot__typing-dot"></span>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* ── Opciones rápidas ── */}
            {showQuickOptions && (
                <div className="psych-chatbot__quick-options">
                    {OPCIONES_RAPIDAS.map(opt => (
                        <button
                            key={opt.id}
                            className="psych-chatbot__quick-btn"
                            onClick={() => handleQuickOption(opt.id)}
                        >
                            <span className="psych-chatbot__quick-icon">{opt.icon}</span>
                            {opt.label}
                        </button>
                    ))}
                </div>
            )}

            {/* ── Input ── */}
            <form className="psych-chatbot__input" onSubmit={(e) => { e.preventDefault(); handleSend(); }}>
                <input
                    ref={inputRef}
                    type="text"
                    placeholder="Cuéntame cómo te sientes..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isTyping}
                    autoComplete="off"
                    id="chatbot-input"
                />
                <button
                    type="submit"
                    disabled={isTyping || !input.trim()}
                    className="psych-chatbot__send-btn"
                    id="chatbot-send"
                >
                    <i className="fas fa-paper-plane"></i>
                </button>
            </form>

            {/* ── Banner de confidencialidad ── */}
            <div className="psych-chatbot__privacy">
                <i className="fas fa-lock"></i>
                Sesión privada · No se almacenan datos personales · <span className="psych-chatbot__privacy-link" onClick={() => handleQuickOption('lineas')}>Ver líneas de ayuda</span>
            </div>
        </div>
    );
};

export default MetroMedellinChatbot;