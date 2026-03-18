const API_URL = 'http://localhost:5000/api/auth';

/**
 * Servicio de autenticación para comunicarse con el backend
 */

// Registrar nuevo usuario
export const register = async (userData) => {
    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error al registrar usuario');
        }

        return data;
    } catch (error) {
        throw error;
    }
};

// Iniciar sesión
export const login = async (credentials) => {
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error al iniciar sesión');
        }

        // Guardar token y datos del usuario en localStorage
        if (data.token) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
        }

        return data;
    } catch (error) {
        throw error;
    }
};

// Solicitar código de recuperación
export const forgotPassword = async (email) => {
    try {
        const response = await fetch(`${API_URL}/forgot-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ correo: email })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error al solicitar código');
        }

        return data;
    } catch (error) {
        throw error;
    }
};

// Verificar código de recuperación
export const verifyCode = async (email, code) => {
    try {
        const response = await fetch(`${API_URL}/verify-code`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ correo: email, codigo: code })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error al verificar código');
        }

        return data;
    } catch (error) {
        throw error;
    }
};

// Resetear contraseña
export const resetPassword = async (resetToken, newPassword) => {
    try {
        const response = await fetch(`${API_URL}/reset-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ resetToken, nuevaContrasena: newPassword })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error al resetear contraseña');
        }

        return data;
    } catch (error) {
        throw error;
    }
};

// Cerrar sesión
export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};

// Obtener usuario actual
export const getCurrentUser = () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
};

// Obtener token
export const getToken = () => {
    return localStorage.getItem('token');
};

// Verificar si está autenticado
export const isAuthenticated = () => {
    return !!getToken();
};

// Obtener perfil completo del usuario
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

        if (!response.ok) {
            throw new Error(data.message || 'Error al obtener perfil');
        }

        return data;
    } catch (error) {
        console.error('Error getting profile:', error);
        // Fallback: devolver usuario local si falla la API
        const localUser = getCurrentUser();
        if (localUser) return localUser;
        throw error;
    }
};
