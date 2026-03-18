/**
 * Genera un código numérico aleatorio de 6 dígitos
 * @returns {string} Código de 6 dígitos
 */
const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Calcula la fecha de expiración (15 minutos desde ahora)
 * @returns {Date} Fecha de expiración
 */
const getExpirationDate = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 15);
    return now;
};

module.exports = {
    generateVerificationCode,
    getExpirationDate
};
