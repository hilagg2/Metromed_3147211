const API_URL = 'http://localhost:5000/api/juegos';

const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

export const getJuegosConfig = async () => {
    const response = await fetch(`${API_URL}/config`, {
        headers: getHeaders()
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al obtener la configuración de juegos');
    return data.config;
};

export const updateJuegoConfig = async (config) => {
    const response = await fetch(`${API_URL}/config`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(config)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al actualizar la configuración de juegos');
    return data;
};

export const registrarPartida = async (id_juego, cantidad_obtenida) => {
    const response = await fetch(`${API_URL}/partida`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ id_juego, cantidad_obtenida })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al registrar la partida');
    return data;
};

export const getHistorialPartidas = async () => {
    const response = await fetch(`${API_URL}/historial`, {
        headers: getHeaders()
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al obtener el historial de partidas');
    return data.historial;
};

export const getRanking = async () => {
    const response = await fetch(`${API_URL}/ranking`, {
        headers: getHeaders()
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al obtener el ranking');
    return data.ranking;
};

export const getEstadisticas = async () => {
    const response = await fetch(`${API_URL}/estadisticas`, {
        headers: getHeaders()
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al obtener las estadísticas');
    return data.stats;
};
