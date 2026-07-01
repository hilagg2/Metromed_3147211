const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Crear cliente solo si las credenciales están disponibles
const supabase = supabaseUrl && supabaseKey
    ? createClient(supabaseUrl, supabaseKey)
    : null;

if (!supabase) {
    console.warn('⚠️  Supabase no configurado (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY ausentes). El servidor usará MySQL directo.');
}

// Función para probar la conexión
const testConnection = async () => {
    if (!supabase) {
        console.log('✅ Modo MySQL directo activo (Supabase no configurado)');
        return;
    }
    try {
        const { data, error } = await supabase.from('roles').select('id_rol').limit(1);
        if (error) throw error;
        console.log('✅ Conexión a Supabase establecida correctamente');
    } catch (error) {
        console.warn('⚠️  No se pudo conectar a Supabase:', error.message);
        // No lanzar error — el servidor continuará con MySQL directo
    }
};

module.exports = { supabase, testConnection };
