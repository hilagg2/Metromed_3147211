import React, { useState, useEffect } from 'react';
import './Apoyopsiqui.css';
import { MetroMedellinChatbot } from './chatbot.jsx';
import { getLineasAyuda, getFaqs, createReporte } from '../services/apoyoService';

const fallbackLineas = [
    { id_linea: 1, nombre_servicio: 'Línea Amiga Salud Mental', telefono: '106', horario: '24 horas', disponibilidad: 'Disponible' },
    { id_linea: 2, nombre_servicio: 'Línea Antisuicidio y Acompañamiento', telefono: '1313131', horario: '24 horas', disponibilidad: 'Disponible' },
    { id_linea: 3, nombre_servicio: 'Orientación Psicológica Alcaldía', telefono: '1717171', horario: 'Lunes a Viernes 8:00-17:00', disponibilidad: 'Disponible' },
    { id_linea: 4, nombre_servicio: 'Línea de Emergencia y Ambulancia', telefono: '123', horario: '24 horas', disponibilidad: 'Disponible' }
];

const fallbackFaqs = [
    { id_faq: 1, pregunta: '¿Qué debo hacer en caso de una crisis de ansiedad en el Metro?', respuesta: 'Si sientes ansiedad o pánico durante tu viaje, intenta bajarte en la próxima estación y busca al personal del Metro (chalecos verdes). Ellos están capacitados en primeros auxilios psicológicos y te guiarán a un lugar seguro para calmarte.' },
    { id_faq: 2, pregunta: '¿Cómo funciona el servicio de orientación psicológica de MetroMed?', respuesta: 'Ofrecemos acompañamiento virtual a través de nuestro chatbot de escucha empática, ejercicios prácticos de respiración (como la técnica 4-7-8) y canalización directa a las líneas oficiales de salud mental del departamento.' },
    { id_faq: 3, pregunta: '¿Las líneas de ayuda tienen algún costo?', respuesta: 'No, todas las líneas de ayuda recomendadas en la plataforma (como la Línea Amiga 106 y la Línea de Emergencias 123) son 100% gratuitas y de carácter confidencial.' }
];

const Apoyopsiqui = () => {
    const [showChatbot, setShowChatbot] = useState(false);
    const [lineas, setLineas] = useState(fallbackLineas);
    const [faqs, setFaqs] = useState(fallbackFaqs);
    const [openFaqId, setOpenFaqId] = useState(null);
    
    // Formulario de sugerencias/reportes
    const [reportText, setReportText] = useState('');
    const [submitSuccess, setSubmitSuccess] = useState('');
    const [submitError, setSubmitError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const loadSupportData = async () => {
            try {
                const fetchedLineas = await getLineasAyuda();
                if (fetchedLineas && fetchedLineas.length > 0) {
                    // Mapear campos si vienen del nuevo formato de base de datos
                    const mapped = fetchedLineas.map(l => ({
                        id_linea: l.id_linea,
                        nombre_servicio: l.nombre || l.nombre_servicio,
                        telefono: l.numero || l.telefono,
                        horario: l.horario,
                        disponibilidad: l.activa || l.disponibilidad ? 'Disponible' : 'No disponible'
                    }));
                    setLineas(mapped);
                }
                
                const fetchedFaqs = await getFaqs();
                if (fetchedFaqs && fetchedFaqs.length > 0) {
                    setFaqs(fetchedFaqs);
                }
            } catch (error) {
                console.error('Error al cargar datos de apoyo psicológico:', error);
            }
        };
        loadSupportData();
    }, []);

    const toggleFaq = (id) => {
        setOpenFaqId(openFaqId === id ? null : id);
    };

    const handleReportSubmit = async (e) => {
        e.preventDefault();
        if (!reportText.trim()) return;

        setSubmitting(true);
        setSubmitSuccess('');
        setSubmitError('');

        try {
            const res = await createReporte(reportText);
            if (res.success) {
                setSubmitSuccess(res.message);
                setReportText('');
            } else {
                setSubmitError(res.message || 'No se pudo enviar el reporte');
            }
        } catch (err) {
            setSubmitError(err.message || 'Error de conexión al enviar el reporte');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="apoyo-container fade-in">
            {!showChatbot ? (
                <>
                    {/* Encabezado */}
                    <div className="apoyo-header">
                        <h2><i className="fas fa-heartbeat"></i> Tu Salud Mental Importa</h2>
                        <p>En el Metro de Medellín nos preocupamos por ti. Accede al chat de ayuda para conversar o consulta recursos profesionales.</p>
                        <button className="apoyo-btn" style={{ marginTop: '1rem', background: 'var(--primary-green)', color: '#000', fontWeight: 'bold' }} onClick={() => setShowChatbot(true)}>
                            <i className="fas fa-comments"></i> Iniciar Chat de Escucha Activa
                        </button>
                    </div>

                    {/* Líneas de Ayuda Generales (RF-28, RF-31) */}
                    <h3 className="section-title"><i className="fas fa-phone-alt"></i> Directorio de Líneas de Apoyo</h3>
                    <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>Horarios y disponibilidad en tiempo real para atención profesional gratuita y confidencial:</p>
                    <div className="apoyo-grid">
                        {lineas.map((linea) => {
                            const isAvailable = linea.disponibilidad.toLowerCase() === 'disponible';
                            return (
                                <div className="apoyo-card" key={linea.id_linea} style={{ alignItems: 'flex-start', textAlign: 'left', position: 'relative' }}>
                                    <span style={{
                                        position: 'absolute',
                                        top: '1rem',
                                        right: '1rem',
                                        fontSize: '0.75rem',
                                        fontWeight: '700',
                                        padding: '0.3rem 0.8rem',
                                        borderRadius: '30px',
                                        background: isAvailable ? 'rgba(0, 255, 136, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                        color: isAvailable ? '#00ff88' : '#ef4444',
                                        border: `1px solid ${isAvailable ? 'rgba(0, 255, 136, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`
                                    }}>
                                        {linea.disponibilidad}
                                    </span>
                                    <div className="apoyo-icon"><i className="fas fa-phone-volume"></i></div>
                                    <h3>{linea.nombre_servicio}</h3>
                                    <p style={{ margin: '0.2rem 0' }}><strong>📞 Teléfono:</strong> <a href={`tel:${linea.telefono}`} style={{ color: '#00ff88', textDecoration: 'none', fontWeight: 'bold' }}>{linea.telefono}</a></p>
                                    <p style={{ margin: '0.2rem 0' }}><strong>⏰ Horario:</strong> {linea.horario}</p>
                                    <a href={`tel:${linea.telefono}`} className="apoyo-btn" style={{ marginTop: '1.5rem', width: '100%', textAlign: 'center' }}>Llamar Ahora</a>
                                </div>
                            );
                        })}
                    </div>

                    {/* Preguntas Frecuentes Interactivas (FAQ) (RF-29) */}
                    <div style={{ marginTop: '3rem' }}>
                        <h3 className="section-title"><i className="fas fa-question-circle"></i> Preguntas Frecuentes de Apoyo Emocional</h3>
                        <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>Respuestas interactivas sobre el cuidado mental y el uso del sistema:</p>
                        <div className="faq-container" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {faqs.map((faq) => {
                                const isOpen = openFaqId === faq.id_faq;
                                return (
                                    <div key={faq.id_faq} style={{
                                        background: 'rgba(255, 255, 255, 0.02)',
                                        border: `1px solid ${isOpen ? '#00ff88' : 'rgba(255, 255, 255, 0.05)'}`,
                                        borderRadius: '12px',
                                        overflow: 'hidden',
                                        transition: 'all 0.3s'
                                    }}>
                                        <button 
                                            onClick={() => toggleFaq(faq.id_faq)}
                                            style={{
                                                width: '100%',
                                                background: 'transparent',
                                                border: 'none',
                                                padding: '1.25rem',
                                                color: '#fff',
                                                textAlign: 'left',
                                                fontSize: '1.1rem',
                                                fontWeight: '700',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center'
                                            }}
                                        >
                                            <span>{faq.pregunta}</span>
                                            <i className={`fas fa-chevron-${isOpen ? 'up' : 'down'}`} style={{ color: '#00ff88' }}></i>
                                        </button>
                                        {isOpen && (
                                            <div style={{
                                                padding: '0 1.25rem 1.25rem 1.25rem',
                                                color: '#cbd5e1',
                                                fontSize: '0.95rem',
                                                lineHeight: '1.6',
                                                borderTop: '1px solid rgba(255, 255, 255, 0.02)',
                                                paddingTop: '1rem'
                                            }}>
                                                {faq.respuesta}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Reportes/Sugerencias para mejorar el servicio (RF-32) */}
                    <div style={{ marginTop: '4rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '20px', padding: '2.5rem' }}>
                        <h3 className="section-title"><i className="fas fa-bullhorn"></i> Mejorar el Servicio de Apoyo</h3>
                        <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>¿Tienes sugerencias o experimentaste algún inconveniente? Envíanos tu reporte de forma totalmente anónima y confidencial.</p>
                        
                        <form onSubmit={handleReportSubmit}>
                            <textarea
                                value={reportText}
                                onChange={(e) => setReportText(e.target.value)}
                                placeholder="Escribe tu sugerencia, reporte o comentario aquí..."
                                rows={4}
                                style={{
                                    width: '100%',
                                    background: 'rgba(0, 0, 0, 0.3)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '12px',
                                    color: '#fff',
                                    padding: '1rem',
                                    fontSize: '1rem',
                                    fontFamily: 'inherit',
                                    marginBottom: '1rem',
                                    resize: 'vertical'
                                }}
                                required
                            />
                            
                            {submitSuccess && <p style={{ color: '#00ff88', fontWeight: 'bold', marginBottom: '1rem' }}><i className="fas fa-check-circle"></i> {submitSuccess}</p>}
                            {submitError && <p style={{ color: '#ef4444', fontWeight: 'bold', marginBottom: '1rem' }}><i className="fas fa-exclamation-triangle"></i> {submitError}</p>}
                            
                            <button
                                type="submit"
                                className="apoyo-btn"
                                style={{ background: 'transparent', cursor: 'pointer' }}
                                disabled={submitting || !reportText.trim()}
                            >
                                {submitting ? 'Enviando...' : 'Enviar Comentario'}
                            </button>
                        </form>
                    </div>

                    {/* Banner de Emergencia */}
                    <div className="emergency-banner" style={{ marginTop: '4rem' }}>
                        <div className="emergency-content">
                            <h3>¿Necesitas ayuda de inmediato?</h3>
                            <p>Si te encuentras en una crisis severa o riesgo vital, llama al canal nacional de rescate.</p>
                        </div>
                        <a href="tel:123" className="emergency-banner-btn" style={{ background: '#ef4444', color: '#fff', padding: '0.8rem 1.5rem', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}><i className="fas fa-ambulance"></i> Llamar al 123</a>
                    </div>
                </>
            ) : (
                /* Chatbot Activo (RF-27, RF-30) */
                <div className="chatbot-wrapper animate-fadeIn" style={{ marginTop: '1rem' }}>
                    <button 
                        className="apoyo-btn" 
                        onClick={() => setShowChatbot(false)} 
                        style={{ marginBottom: '1.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', border: 'none', cursor: 'pointer' }}
                    >
                        <i className="fas fa-arrow-left"></i> Volver a Recursos de Apoyo
                    </button>
                    <MetroMedellinChatbot />
                </div>
            )}
        </div>
    );
};

export default Apoyopsiqui;