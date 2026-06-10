const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Faltan variables SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env');
    process.exit(1);
}

// Crear cliente de Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

// Función para probar la conexión
const testConnection = async () => {
    try {
        const { data, error } = await supabase.from('roles').select('id_rol').limit(1);
        if (error) throw error;
        console.log('✅ Conexión a Supabase establecida correctamente');
    } catch (error) {
        console.error('❌ Error al conectar con Supabase:', error.message);
        throw error;
    }
};

module.exports = { supabase, testConnection };
