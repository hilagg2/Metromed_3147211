const { pool } = require('../config/mysqlPool');
const bcrypt = require('bcrypt');

async function createAdmin() {
    try {
        const correo = 'admin@metromed.com';
        const contrasenaRaw = 'admin123';
        const hash = await bcrypt.hash(contrasenaRaw, 10);
        
        const [existing] = await pool.query('SELECT * FROM usuarios WHERE correo = ?', [correo]);
        if (existing.length > 0) {
            await pool.query('UPDATE usuarios SET id_rol = 2, contrasena = ? WHERE correo = ?', [hash, correo]);
            console.log(`✅ Administrador existente actualizado: ${correo} / ${contrasenaRaw}`);
        } else {
            await pool.query(
                `INSERT INTO usuarios (id_rol, nombre, correo, contrasena, saldo_metrocoins, verificado)
                 VALUES (2, 'Administrador', ?, ?, 0, 1)`,
                [correo, hash]
            );
            console.log(`✅ Administrador creado: ${correo} / ${contrasenaRaw}`);
        }
    } catch (err) {
        console.error('❌ Error creando admin:', err.message);
    } finally {
        process.exit(0);
    }
}

createAdmin();
