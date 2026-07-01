import React from 'react';
import './Apoyopsiqui.css';
import MetroMedellinChatbot from './chatbot.jsx';

const Apoyopsiqui = () => {
    return (
        <div className="apoyo-container fade-in">
            <div className="apoyo-header">
                <h2><i className="fas fa-heartbeat"></i> Apoyo Psicológico MetroMed</h2>
                <p>Tu bienestar emocional es importante para nosotros. Habla con nuestro asistente confidencial o busca ayuda inmediata si lo necesitas.</p>
            </div>

            <div className="apoyo-main-content">
                <div className="apoyo-chatbot-section">
                    <MetroMedellinChatbot />
                </div>
                
                <div className="apoyo-sidebar-section">
                    <div className="apoyo-card static-card">
                        <div className="apoyo-icon"><i className="fas fa-info-circle"></i></div>
                        <h3>Sobre este espacio</h3>
                        <p>Este es un espacio seguro y confidencial. Nuestro asistente con IA está capacitado para escucharte, brindarte contención emocional y guiarte hacia recursos de ayuda profesional en Medellín.</p>
                    </div>
                    
                    <div className="apoyo-card static-card">
                        <div className="apoyo-icon"><i className="fas fa-shield-alt"></i></div>
                        <h3>Privacidad</h3>
                        <p>Las conversaciones son anónimas y efímeras. No guardamos un historial de tus mensajes ni solicitamos datos personales que puedan identificarte.</p>
                    </div>

                    <div className="emergency-banner static-card">
                        <div className="emergency-content">
                            <h3>¿Emergencia?</h3>
                            <p>Si tu vida o la de alguien más está en riesgo, llama de inmediato.</p>
                        </div>
                        <a href="tel:123" className="emergency-btn"><i className="fas fa-phone-alt"></i> 123</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Apoyopsiqui;