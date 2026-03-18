import React, { useState } from 'react';
import './chatbot.css';

// Simple placeholder chatbot component for Metro Medellín
export const MetroMedellinChatbot = () => {
    const [messages, setMessages] = useState([
        { from: 'bot', text: '¡Hola! Soy el chatbot de Metro Medellín. ¿En qué puedo ayudarte?' }
    ]);
    const [input, setInput] = useState('');

    const handleSend = e => {
        e.preventDefault();
        if (!input.trim()) return;
        const userMsg = { from: 'user', text: input.trim() };
        setMessages(prev => [...prev, userMsg]);
        // Simple echo response for demo purposes
        const botReply = { from: 'bot', text: `Entiendo: "${input.trim()}". En breve te daremos más información.` };
        setMessages(prev => [...prev, botReply]);
        setInput('');
    };

    return (
        <div className="chatbot-container">
            <div className="chatbot-messages">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`chatbot-message ${msg.from}`}> {msg.text} </div>
                ))}
            </div>
            <form className="chatbot-input" onSubmit={handleSend}>
                <input
                    type="text"
                    placeholder="Escribe tu mensaje..."
                    value={input}
                    onChange={e => setInput(e.target.value)}
                />
                <button type="submit">Enviar</button>
            </form>
        </div>
    );
};

export default MetroMedellinChatbot;