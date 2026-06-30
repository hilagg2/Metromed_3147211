const API_URL = 'http://localhost:5000/api/congestion';

const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

export const getCongestionData = async () => {
    const response = await fetch(`${API_URL}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al obtener datos de congestión');
    return data;
};

export const reportarCongestion = async (nombre_estacion, estado) => {
    const response = await fetch(`${API_URL}/reportar`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ nombre_estacion, estado })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al enviar reporte');
    return data;
};

export const getNotificaciones = async () => {
    const response = await fetch(`${API_URL}/notificaciones`, {
        headers: getHeaders()
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al obtener notificaciones');
    return data.notificaciones;
};

export const marcarNotificacionesLeidas = async () => {
    const response = await fetch(`${API_URL}/notificaciones/leer`, {
        method: 'POST',
        headers: getHeaders()
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al marcar notificaciones');
    return data;
};

export const getSuscripcion = async () => {
    const response = await fetch(`${API_URL}/suscripcion`, {
        headers: getHeaders()
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al obtener suscripción');
    return data;
};

export const updateSuscripcion = async (recibir_correo, recibir_push) => {
    const response = await fetch(`${API_URL}/suscripcion`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ recibir_correo, recibir_push })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al guardar suscripción');
    return data;
};
