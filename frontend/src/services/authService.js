import { API_BASE_URL } from '../config/api';

/**
 * @module authService
 * @description Capa de servicios de autenticación del frontend.
 * Encapsula todas las llamadas HTTP al endpoint `/api/auth` del backend.
 * Gestiona el ciclo de vida de la sesión del usuario: registro, login, recuperación
 * de contraseña y persistencia local del token JWT mediante `localStorage`.
 *
 * El token se guarda como clave `'token'` y el objeto de usuario como clave `'user'`.
 */

const API_URL = `${API_BASE_URL}/api/auth`;

/**
 * Registra un nuevo usuario en la plataforma.
 * Envía los datos del formulario de registro al backend.
 *
 * @async
 * @function register
 * @param {{ nombre: string, correo: string, contrasena: string }} userData - Datos del nuevo usuario.
 * @returns {Promise<{ success: boolean, message: string, userId: number }>}
 * @throws {Error} Si el correo ya está registrado o el servidor retorna un error.
 */
export const register = async (userData) => {
    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Error al registrar usuario');
        return data;
    } catch (error) {
        throw error;
    }
};

/**
 * Inicia sesión con las credenciales del usuario.
 * Si la respuesta es exitosa, guarda el token JWT y los datos del usuario
 * en `localStorage` para mantener la sesión entre recargas del navegador.
 *
 * @async
 * @function login
 * @param {{ correo: string, contrasena: string }} credentials - Credenciales de acceso.
 * @returns {Promise<{ success: boolean, token: string, user: { id, nombre, correo, rol } }>}
 * @throws {Error} Si las credenciales son incorrectas o el usuario no existe.
 */
export const login = async (credentials) => {
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Error al iniciar sesión');

        // Persistir token y datos de sesión en localStorage para acceso global
        if (data.token) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
        }
        return data;
    } catch (error) {
        throw error;
    }
};

/**
 * Solicita el envío de un código de recuperación de contraseña al correo indicado.
 * El backend genera un código de 6 dígitos con expiración de 15 minutos.
 *
 * @async
 * @function forgotPassword
 * @param {string} email - Correo electrónico del usuario registrado.
 * @returns {Promise<{ success: boolean, message: string }>}
 * @throws {Error} Si el correo no está registrado en el sistema.
 */
export const forgotPassword = async (email) => {
    try {
        const response = await fetch(`${API_URL}/forgot-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ correo: email })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Error al solicitar código');
        return data;
    } catch (error) {
        throw error;
    }
};

/**
 * Verifica el código de recuperación enviado al correo del usuario.
 * Si es correcto y no ha expirado, el backend retorna un `resetToken`
 * de corta duración (15 min) para proceder con el cambio de contraseña.
 *
 * @async
 * @function verifyCode
 * @param {string} email - Correo del usuario.
 * @param {string} code - Código de 6 dígitos recibido por correo.
 * @returns {Promise<{ success: boolean, resetToken: string }>}
 * @throws {Error} Si el código es incorrecto o ha expirado.
 */
export const verifyCode = async (email, code) => {
    try {
        const response = await fetch(`${API_URL}/verify-code`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ correo: email, codigo: code })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Error al verificar código');
        return data;
    } catch (error) {
        throw error;
    }
};

/**
 * Establece una nueva contraseña usando el `resetToken` temporal.
 * El backend verifica que la nueva contraseña sea diferente a la anterior.
 *
 * @async
 * @function resetPassword
 * @param {string} resetToken - Token JWT temporal obtenido de `verifyCode`.
 * @param {string} newPassword - Nueva contraseña deseada (min. 6 caracteres).
 * @returns {Promise<{ success: boolean, message: string }>}
 * @throws {Error} Si el token es inválido, expiró o la contraseña es igual a la actual.
 */
export const resetPassword = async (resetToken, newPassword) => {
    try {
        const response = await fetch(`${API_URL}/reset-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ resetToken, nuevaContrasena: newPassword })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Error al resetear contraseña');
        return data;
    } catch (error) {
        throw error;
    }
};

/**
 * Cierra la sesión del usuario limpiando el localStorage.
 * Elimina el token JWT y los datos de usuario almacenados localmente.
 * Debe llamarse siempre que el usuario haga logout para invalidar la sesión en el cliente.
 *
 * @function logout
 * @returns {void}
 */
export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};

/**
 * Obtiene el objeto de usuario almacenado en `localStorage`.
 * No realiza peticiones de red; usa la caché local de la última sesión.
 *
 * @function getCurrentUser
 * @returns {{ id, nombre, correo, rol } | null} Datos del usuario o `null` si no hay sesión.
 */
export const getCurrentUser = () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
};

/**
 * Obtiene el token JWT de la sesión actual desde `localStorage`.
 *
 * @function getToken
 * @returns {string | null} El token JWT o `null` si no hay sesión activa.
 */
export const getToken = () => {
    return localStorage.getItem('token');
};

/**
 * Verifica si el usuario tiene una sesión activa comprobando la existencia del token.
 * No valida si el token ha expirado; esa validación ocurre en el backend.
 *
 * @function isAuthenticated
 * @returns {boolean} `true` si existe un token en localStorage, `false` en caso contrario.
 */
export const isAuthenticated = () => {
    return !!getToken();
};

/**
 * Obtiene el perfil completo del usuario autenticado desde el backend (datos frescos).
 * A diferencia de `getCurrentUser`, este sí realiza una petición al servidor
 * para obtener datos actualizados (saldo, rol real, etc.).
 *
 * Si la petición falla por cualquier razón (red, token expirado),
 * retorna el usuario desde el localStorage como fallback de emergencia.
 *
 * @async
 * @function getProfile
 * @returns {Promise<{ id_usuario, nombre, correo, fecha_registro, saldo_metrocoins, id_rol }>}
 * @throws {Error} Solo si la petición falla Y no hay usuario local como respaldo.
 */
export const getProfile = async () => {
    try {
        const token = getToken();
        if (!token) throw new Error('No hay token de autenticación');

        const response = await fetch(`${API_URL}/profile`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Error al obtener perfil');
        return data;
    } catch (error) {
        console.error('Error getting profile:', error);
        // Fallback: devolver usuario local si falla la API
        const localUser = getCurrentUser();
        if (localUser) return localUser;
        throw error;
    }
};
