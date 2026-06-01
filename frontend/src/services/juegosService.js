import { getToken } from './authService';

const API_URL = 'http://localhost:5000/api/juegos';

const getHeaders = () => {
    const token = getToken();
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
};

export const getJuegos = async () => {
    try {
        const response = await fetch(`${API_URL}/`, {
            method: 'GET',
            headers: getHeaders()
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Error al obtener juegos');
        return data.juegos;
    } catch (error) {
        throw error;
    }
};

export const registrarPartida = async (identificador, monedas_obtenidas, detalles = '') => {
    try {
        const response = await fetch(`${API_URL}/jugar`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ identificador, monedas_obtenidas, detalles })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Error al registrar partida');
        return data;
    } catch (error) {
        throw error;
    }
};

export const getHistorial = async () => {
    try {
        const response = await fetch(`${API_URL}/historial`, {
            method: 'GET',
            headers: getHeaders()
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Error al obtener historial');
        return data.historial;
    } catch (error) {
        throw error;
    }
};

export const getRanking = async () => {
    try {
        const response = await fetch(`${API_URL}/ranking`, {
            method: 'GET',
            headers: getHeaders()
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Error al obtener ranking');
        return data.ranking;
    } catch (error) {
        throw error;
    }
};
