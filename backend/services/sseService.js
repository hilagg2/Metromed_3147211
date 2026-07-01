/**
 * sseService.js
 * Singleton que gestiona las conexiones SSE activas de los clientes.
 * Proporciona el canal de emisión en tiempo real (RN-19.2, RN-19.3, RN-22.2).
 *
 * Server-Sent Events (SSE) no requiere dependencias adicionales:
 * es nativo de Express con el estándar HTTP/1.1.
 */

const clients = new Set();

/**
 * Agrega un cliente SSE a la lista de suscriptores.
 * @param {object} res - El objeto de respuesta Express con cabeceras SSE configuradas.
 */
const addClient = (res) => {
    clients.add(res);
    console.log(`[SSE] Cliente conectado. Total: ${clients.size}`);
};

/**
 * Elimina un cliente SSE de la lista (cuando cierra la conexión).
 * @param {object} res - El objeto de respuesta Express a eliminar.
 */
const removeClient = (res) => {
    clients.delete(res);
    console.log(`[SSE] Cliente desconectado. Total: ${clients.size}`);
};

/**
 * Emite un evento SSE a todos los clientes conectados (RN-22.1, RN-22.3).
 * Garantiza representación visual uniforme en todos los tabs/dispositivos.
 *
 * @param {string} eventName - Nombre del evento SSE (p.ej. 'congestion_update')
 * @param {object} data - Payload a serializar como JSON
 */
const broadcast = (eventName, data) => {
    const payload = `event: ${eventName}\ndata: ${JSON.stringify(data)}\n\n`;
    let count = 0;

    clients.forEach((clientRes) => {
        try {
            clientRes.write(payload);
            count++;
        } catch (err) {
            // El cliente cerró la conexión sin notificar; limpiamos
            console.warn('[SSE] Error al escribir a cliente, eliminando...', err.message);
            clients.delete(clientRes);
        }
    });

    console.log(`[SSE] Broadcast '${eventName}' → ${count} cliente(s). Data:`, data);
};

/**
 * Emite un ping de keep-alive para evitar que los proxies cierren la conexión.
 * Se llama automáticamente cada 25 segundos.
 */
const broadcastHeartbeat = () => {
    const now = new Date().toISOString();
    const payload = `: heartbeat ${now}\n\n`;
    clients.forEach((clientRes) => {
        try {
            clientRes.write(payload);
        } catch {
            clients.delete(clientRes);
        }
    });
};

// Keep-alive cada 25 segundos
setInterval(broadcastHeartbeat, 25000);

module.exports = { addClient, removeClient, broadcast };
