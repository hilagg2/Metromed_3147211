/**
 * Configuración centralizada de la API.
 * Todas las peticiones HTTP deben usar API_BASE_URL como raíz.
 *
 * En desarrollo se usa http://localhost:5000 por defecto.
 * En producción (Render) se define VITE_API_URL en las variables de entorno.
 */
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
