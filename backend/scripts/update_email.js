const { pool } = require('../config/mysqlPool');

async function updateAdminEmail() {
    try {
        await pool.query(
            "UPDATE usuarios SET correo = 'materanorosarioedwinjose@gmail.com' WHERE correo = 'admin@metromed.com'"
        );
        console.log('✅ Correo de administrador actualizado a materanorosarioedwinjose@gmail.com');
    } catch (e) {
        console.error('❌ Error actualizando:', e.message);
    } finally {
        process.exit(0);
    }
}

updateAdminEmail();
