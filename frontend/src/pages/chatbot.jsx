import React, { useState } from 'react';
import './chatbot.css';

// Lista de estaciones con coordenadas para geolocalización simulada
const estacionesMedellin = [
    { nombre: "Niquía", lat: 6.3389, lng: -75.5431 },
    { nombre: "Bello", lat: 6.3378, lng: -75.5613 },
    { nombre: "Madera", lat: 6.3209, lng: -75.5639 },
    { nombre: "Acevedo", lat: 6.3005, lng: -75.5683 },
    { nombre: "Tricentenario", lat: 6.2803, lng: -75.5728 },
    { nombre: "Caribe", lat: 6.2725, lng: -75.5750 },
    { nombre: "Universidad", lat: 6.2678, lng: -75.5683 },
    { nombre: "Hospital", lat: 6.2621, lng: -75.5656 },
    { nombre: "Prado", lat: 6.2518, lng: -75.5667 },
    { nombre: "Parque Berrío", lat: 6.2515, lng: -75.5697 },
    { nombre: "San Antonio", lat: 6.2473, lng: -75.5696 },
    { nombre: "Alpujarra", lat: 6.2482, lng: -75.5746 },
    { nombre: "Exposiciones", lat: 6.2438, lng: -75.5800 },
    { nombre: "Industriales", lat: 6.2368, lng: -75.5890 },
    { nombre: "Poblado", lat: 6.2107, lng: -75.5722 },
    { nombre: "Aguacatala", lat: 6.1974, lng: -75.5768 },
    { nombre: "Ayurá", lat: 6.1807, lng: -75.5849 },
    { nombre: "Envigado", lat: 6.1692, lng: -75.5923 },
    { nombre: "Itagüí", lat: 6.1616, lng: -75.6086 },
    { nombre: "Sabaneta", lat: 6.1519, lng: -75.6161 },
    { nombre: "La Estrella", lat: 6.1362, lng: -75.6450 },
    { nombre: "Cisneros", lat: 6.2513, lng: -75.5625 },
    { nombre: "San José", lat: 6.2589, lng: -75.5583 },
    { nombre: "Miraflores", lat: 6.2640, lng: -75.5540 },
    { nombre: "Floresta", lat: 6.2679, lng: -75.5510 }
];

// Centros de ayuda psicológica y hospitales con salud mental
const centrosAyuda = [
    { nombre: "Centro de Acompañamiento Psicosocial San Antonio", lat: 6.2473, lng: -75.5696, direccion: "Estación San Antonio, Acceso B", tel: "300-1234567" },
    { nombre: "Clínica Mental del Prado (Especialistas)", lat: 6.2522, lng: -75.5658, direccion: "Calle 58 # 47-32, Prado", tel: "(604) 284-5555" },
    { nombre: "Punto de Escucha y Apoyo Caribe", lat: 6.2720, lng: -75.5745, direccion: "Terminal del Norte, Local 12", tel: "311-9876543" },
    { nombre: "Hospital Universitario San Vicente Fundación", lat: 6.2621, lng: -75.5656, direccion: "Calle 64 # 51D-154", tel: "(604) 444-1333" },
    { nombre: "Unidad Hospitalaria de Niquía", lat: 6.3401, lng: -75.5420, direccion: "Diagonal 55 # 34-10, Bello", tel: "(604) 482-1111" },
    { nombre: "E.S.E Hospital Mental de Antioquia (HOMO)", lat: 6.3325, lng: -75.5645, direccion: "Calle 38 # 55-22, Bello", tel: "(604) 444-8330" },
    { nombre: "Centro de Salud Poblado", lat: 6.2095, lng: -75.5705, direccion: "Carrera 43F # 11-20, Poblado", tel: "(604) 312-5500" },
    { nombre: "Unidad de Salud Mental Belén", lat: 6.2250, lng: -75.5920, direccion: "Carrera 76 # 30-10, Belén", tel: "(604) 341-2233" }
];

// Calcular distancia usando la fórmula Haversine
const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radio de la Tierra en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distancia en km
};

export const MetroMedellinChatbot = () => {
    const [messages, setMessages] = useState([
        { from: 'bot', text: '¡Hola! Soy el asistente de apoyo emocional de MetroMed. Estoy aquí para escucharte sin juzgarte. Cuéntame, ¿cómo te sientes hoy o sobre qué te gustaría hablar?' }
    ]);
    const [input, setInput] = useState('');
    const [awaitingStation, setAwaitingStation] = useState(false);

    const getBotResponse = (text) => {
        const lower = text.toLowerCase();

        // Si estábamos esperando la estación para geolocalizar
        if (awaitingStation) {
            const station = estacionesMedellin.find(est => 
                lower.includes(est.nombre.toLowerCase())
            );

            if (station) {
                setAwaitingStation(false);
                // Buscar centros en radio 4 km
                const cercanos = centrosAyuda.map(centro => {
                    const dist = haversineDistance(station.lat, station.lng, centro.lat, centro.lng);
                    return { ...centro, dist };
                }).filter(centro => centro.dist <= 4.0)
                  .sort((a, b) => a.dist - b.dist);

                if (cercanos.length > 0) {
                    let resp = `He encontrado los siguientes puntos de apoyo psicológico a menos de 4 km de la estación **${station.nombre}**:\n\n`;
                    cercanos.forEach((c, idx) => {
                        resp += `${idx + 1}. 🏥 **${c.nombre}**\n📍 *Dirección:* ${c.direccion}\n📏 *Distancia:* ${c.dist.toFixed(2)} km\n📞 *Teléfono:* ${c.tel}\n\n`;
                    });
                    resp += '¿Hay algo más en lo que te pueda colaborar hoy?';
                    return resp;
                } else {
                    setAwaitingStation(false);
                    return `No encontré centros de salud mental especializados a menos de 4 km de la estación **${station.nombre}**. Sin embargo, puedes comunicarte inmediatamente con la **Línea Amiga al 106** o llamar a emergencias al **123** para asistencia nacional inmediata.`;
                }
            } else {
                return 'No logré identificar la estación. Por favor, escribe un nombre válido de estación del Metro de Medellín (ejemplo: "San Antonio", "Niquía", "Poblado", "Cisneros").';
            }
        }

        if (lower.includes('hola') || lower.includes('buen') || lower.includes('saludo')) {
            return '¡Hola! Estoy aquí para escucharte y apoyarte en este espacio seguro. ¿Cómo te encuentras el día de hoy?';
        }

        if (lower.includes('cercan') || lower.includes('donde ir') || lower.includes('lugar') || lower.includes('hospital') || lower.includes('clinica') || lower.includes('punto') || lower.includes('ubicac')) {
            setAwaitingStation(true);
            return 'Para recomendarte los centros de ayuda psicológica y hospitales más cercanos en un radio de 4 km, por favor indícame en qué estación del Metro de Medellín te encuentras actualmente (ej. San Antonio, Caribe, Prado, Niquía).';
        }

        if (lower.includes('triste') || lower.includes('mal') || lower.includes('ansia') || lower.includes('depre') || lower.includes('estres') || lower.includes('estrés') || lower.includes('llorar') || lower.includes('sola') || lower.includes('solo') || lower.includes('morir') || lower.includes('suici')) {
            return 'Lamento mucho escuchar eso. Por favor, ten en cuenta que tu vida es valiosa y hay personas que quieren apoyarte. Si estás experimentando una crisis, podemos guiarte para calmarte con un ejercicio de respiración o proporcionarte los centros más cercanos escribiendo "centros cercanos".\n\nTambién puedes llamar a la Línea Amiga marcando el 106 de forma gratuita.';
        }

        if (lower.includes('respir') || lower.includes('ejercicio') || lower.includes('calmar') || lower.includes('relaj') || lower.includes('ansiedad')) {
            return 'Hagamos una respiración consciente (Técnica 4-7-8):\n\n1. 🌬️ Inhala aire por la nariz suavemente durante 4 segundos.\n2. ⏱️ Mantén el aire en tus pulmones por 7 segundos.\n3. 🍃 Exhala lentamente por la boca durante 8 segundos.\n\nRepite esto 3 veces. ¿Cómo te sientes ahora?';
        }

        if (lower.includes('linea') || lower.includes('ayuda') || lower.includes('telefono') || lower.includes('número') || lower.includes('contacto') || lower.includes('psicol')) {
            return 'Tienes los siguientes canales confidenciales activos 24/7:\n📞 **Línea Amiga:** Llama al 106\n🚨 **Emergencias Médicas:** Llama al 123\n🎗️ **Línea Antisuicidio:** Llama al 1313131';
        }

        if (lower.includes('gracias') || lower.includes('gracia')) {
            return 'Con mucho gusto. Estoy aquí para acompañarte y brindarte un momento de tranquilidad. Cuídate mucho. ❤️';
        }

        return 'Te escucho con atención. Desahogarse es parte del proceso de sanar. Si deseas encontrar ayuda profesional cerca de ti, escribe "centros cercanos" o dime si deseas hacer un ejercicio de respiración.';
    };

    const handleSend = e => {
        e.preventDefault();
        if (!input.trim()) return;
        const userMsg = { from: 'user', text: input.trim() };
        setMessages(prev => [...prev, userMsg]);
        
        const replyText = getBotResponse(input.trim());
        setTimeout(() => {
            const botReply = { from: 'bot', text: replyText };
            setMessages(prev => [...prev, botReply]);
        }, 600);

        setInput('');
    };

    return (
        <div className="chatbot-container">
            <div className="chatbot-messages">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`chatbot-message ${msg.from}`}>
                        {msg.text.split('\n').map((line, lIdx) => (
                            <p key={lIdx} style={{ margin: '0 0 0.5rem 0' }}>{line}</p>
                        ))}
                    </div>
                ))}
            </div>
            <form className="chatbot-input" onSubmit={handleSend}>
                <input
                    type="text"
                    placeholder="Describe tus sentimientos o pide 'centros cercanos'..."
                    value={input}
                    onChange={e => setInput(e.target.value)}
                />
                <button type="submit">Enviar</button>
            </form>
        </div>
    );
};

export default MetroMedellinChatbot;