const API_URL = 'http://localhost:5000/api/congestion';

const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

// Servicios originales de Notificaciones y Preferencias
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

// Servicios en tiempo real (SSE) y validación colectiva de valeria
export const getEstaciones = async () => {
    const response = await fetch(`${API_URL}/estaciones`);
    const data = await response.json();
    if (!data.success) throw new Error(data.message || 'Error al cargar estaciones');
    return data.estaciones;
};

export const enviarReporte = async (id_estacion, nivel_reportado) => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Debes iniciar sesión para enviar reportes');

    const response = await fetch(`${API_URL}/reporte`, {
        method: 'POST',
        headers: {
            'Content-Type':  'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ id_estacion, nivel_reportado })
    });

    const data = await response.json();

    if (response.status === 429) {
        throw new Error(data.message);
    }
    if (response.status === 403) {
        throw new Error('Solo los pasajeros pueden enviar reportes de congestión.');
    }
    if (!response.ok) {
        throw new Error(data.message || 'Error al enviar reporte');
    }

    return data;
};

export const suscribirSSE = (onSnapshot, onUpdate, onError) => {
    const eventSource = new EventSource(`${API_URL}/eventos`);

    eventSource.addEventListener('snapshot', (event) => {
        try {
            const data = JSON.parse(event.data);
            if (onSnapshot && data.estaciones) {
                onSnapshot(data.estaciones);
            }
        } catch (e) {
            console.error('[SSE] Error al parsear snapshot:', e);
        }
    });

    eventSource.addEventListener('congestion_update', (event) => {
        try {
            const data = JSON.parse(event.data);
            if (onUpdate) {
                onUpdate(data);
            }
        } catch (e) {
            console.error('[SSE] Error al parsear congestion_update:', e);
        }
    });

    eventSource.onerror = (err) => {
        console.warn('[SSE] Conexión perdida. Intentando reconectar...', err);
        if (onError) onError(err);
    };

    return eventSource;
};

export const nivelToEstilo = (nivel) => {
    switch (nivel) {
        case 'ALTO':  return { color: '#e74c3c', emoji: '🔴', texto: 'Alta congestión',      estado: 'alto'  };
        case 'MEDIO': return { color: '#f39c12', emoji: '🟡', texto: 'Congestión moderada', estado: 'medio' };
        case 'BAJO':
        default:      return { color: '#2ecc71', emoji: '🟢', texto: 'Flujo normal',          estado: 'bajo'  };
    }
};
