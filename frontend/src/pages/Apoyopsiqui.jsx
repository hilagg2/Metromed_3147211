import React, { useState } from 'react';
import './Apoyopsiqui.css';
import MetroMedellinChatbot from './chatbot.jsx';

const resources = [
    {
        icon: 'phone-alt',
        title: 'Línea Amiga',
        description: 'Atención psicológica gratuita las 24 horas del día. Escucha activa y orientación profesional.',
        action: 'Llamar 106',
        link: 'tel:106',
    },
    {
        icon: 'comments',
        title: 'Chat de Escucha',
        description: 'Espacio seguro para hablar sobre lo que sientes. Profesionales dispuestos a escucharte.',
        action: 'Iniciar Chat',
        link: '#',
    },
    {
        icon: 'hands-helping',
        title: 'Grupos de Apoyo',
        description: 'Encuentra comunidades que comparten experiencias similares y bríndense apoyo mutuo.',
        action: 'Ver Grupos',
        link: '#',
    },
    {
        icon: 'book-medical',
        title: 'Recursos Educativos',
        description: 'Artículos, guías y ejercicios para cuidar tu salud mental y bienestar emocional.',
        action: 'Explorar',
        link: '#',
    },
];

const Apoyopsiqui = () => {
    const [showChatbot, setShowChatbot] = useState(false);

    return (
        <div className="apoyo-container fade-in">
            <div className="apoyo-header">
                <h2><i className="fas fa-heartbeat"></i> Tu Salud Mental Importa</h2>
                <p>En el Metro de Medellín nos preocupamos por ti. Aquí encontrarás recursos y apoyo profesional cuando lo necesites.</p>
                <button className="apoyo-btn" onClick={() => setShowChatbot(true)}>Abrir Chatbot</button>
            </div>

            <div className="apoyo-grid">
                {resources.map((resource, index) => (
                    <div className="apoyo-card static-card" key={index}>
                        <div className="apoyo-icon"><i className={`fas fa-${resource.icon}`}></i></div>
                        <h3>{resource.title}</h3>
                        <p>{resource.description}</p>
                        <a href={resource.link} className="apoyo-btn">{resource.action}</a>
                    </div>
                ))}
            </div>

            <div className="emergency-banner static-card">
                <div className="emergency-content">
                    <h3>¿Necesitas ayuda inmediata?</h3>
                    <p>Si sientes que estás en riesgo o necesitas atención urgente, no dudes en pedir ayuda.</p>
                </div>
                <a href="tel:123" className="emergency-btn"><i className="fas fa-ambulance"></i> Llamar al 123</a>
            </div>

            {showChatbot && (
                <div className="chatbot-wrapper" style={{ marginTop: '2rem' }}>
                    <button className="apoyo-btn" onClick={() => setShowChatbot(false)} style={{ marginBottom: '1rem' }}>← Volver a Apoyo Psicológico</button>
                    <MetroMedellinChatbot />
                </div>
            )}
        </div>
    );
};

export default Apoyopsiqui;