/**
 * congestionService.js
 * Servicio frontend para el módulo de Congestión Colaborativa MetroMed
 *
 * Funciones:
 *  - getEstaciones()    → Cargar niveles reales de la BD
 *  - enviarReporte()    → Pasajero reporta nivel en una estación
 *  - suscribirSSE()     → Escuchar actualizaciones en tiempo real
 */

const API_BASE = 'http://localhost:5000/api/congestion';

/**
 * Obtiene todas las estaciones con su nivel de congestión actual.
 * Llamar al montar el mapa para reemplazar los datos estáticos.
 *
 * @returns {Promise<Array>} Array de estaciones [{id_estacion, nombre_estacion, nivel_congestion, ultima_actualizacion}]
 */
export const getEstaciones = async () => {
    const response = await fetch(`${API_BASE}/estaciones`);
    const data = await response.json();
    if (!data.success) throw new Error(data.message || 'Error al cargar estaciones');
    return data.estaciones;
};

/**
 * Pasajero envía un reporte de congestión.
 * Requiere token JWT de usuario con rol Pasajero (id_rol=1).
 *
 * @param {number} id_estacion     - ID de la estación reportada
 * @param {'BAJO'|'MEDIO'|'ALTO'} nivel_reportado
 * @returns {Promise<object>} Respuesta del servidor con estado actualizado
 */
export const enviarReporte = async (id_estacion, nivel_reportado) => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Debes iniciar sesión para enviar reportes');

    const response = await fetch(`${API_BASE}/reporte`, {
        method: 'POST',
        headers: {
            'Content-Type':  'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ id_estacion, nivel_reportado })
    });

    const data = await response.json();

    if (response.status === 429) {
        // Cooldown activo
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

/**
 * Suscribe el cliente a actualizaciones SSE en tiempo real.
 * El servidor emitirá eventos cada vez que cambie el nivel de una estación.
 *
 * @param {function} onSnapshot  - Callback inicial con todas las estaciones [{...}]
 * @param {function} onUpdate    - Callback cuando cambia el nivel de una estación {id_estacion, nivel_nuevo, ...}
 * @param {function} onError     - Callback si la conexión falla
 * @returns {EventSource}        - La conexión SSE (guardar ref para cerrarla en cleanup)
 *
 * Uso en React:
 *   useEffect(() => {
 *     const sse = suscribirSSE(
 *       (estaciones) => setEstaciones(estaciones),
 *       (update)    => actualizarEstacion(update),
 *       (err)       => console.error(err)
 *     );
 *     return () => sse.close();
 *   }, []);
 */
export const suscribirSSE = (onSnapshot, onUpdate, onError) => {
    const eventSource = new EventSource(`${API_BASE}/eventos`);

    // Snapshot inicial con el estado de todas las estaciones
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

    // Actualización en tiempo real de una estación específica
    eventSource.addEventListener('congestion_update', (event) => {
        try {
            const data = JSON.parse(event.data);
            if (onUpdate) {
                onUpdate(data); // { id_estacion, nombre_estacion, nivel_anterior, nivel_nuevo, label, timestamp }
            }
        } catch (e) {
            console.error('[SSE] Error al parsear congestion_update:', e);
        }
    });

    // Error de conexión
    eventSource.onerror = (err) => {
        console.warn('[SSE] Conexión perdida. Intentando reconectar...', err);
        if (onError) onError(err);
        // EventSource reconecta automáticamente
    };

    return eventSource;
};

/**
 * Mapea nivel de BD al estilo visual del mapa.
 * Mantiene consistencia con el esquema de colores original de Trafico.jsx.
 *
 * @param {'BAJO'|'MEDIO'|'ALTO'} nivel
 * @returns {{ color: string, emoji: string, texto: string, estado: string }}
 */
export const nivelToEstilo = (nivel) => {
    switch (nivel) {
        case 'ALTO':  return { color: '#e74c3c', emoji: '🔴', texto: 'Alta congestión',      estado: 'alto'  };
        case 'MEDIO': return { color: '#f39c12', emoji: '🟡', texto: 'Congestión moderada', estado: 'medio' };
        case 'BAJO':
        default:      return { color: '#2ecc71', emoji: '🟢', texto: 'Flujo normal',          estado: 'bajo'  };
    }
};
