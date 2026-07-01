const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/apoyo`;

const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

export const getLineasAyuda = async () => {
    const response = await fetch(`${API_URL}/lineas`, {
        headers: getHeaders()
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al obtener las líneas de ayuda');
    return data.lineas;
};

export const getFaqs = async () => {
    const response = await fetch(`${API_URL}/faqs`, {
        headers: getHeaders()
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al obtener las preguntas frecuentes');
    return data.faqs;
};

export const createReporte = async (descripcion) => {
    const response = await fetch(`${API_URL}/reporte`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ descripcion })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al enviar el reporte');
    return data;
};
