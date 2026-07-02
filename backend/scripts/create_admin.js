const bcrypt = require('bcrypt');
const { pool } = require('../config/mysqlPool');

async function createOrUpdateAdmin() {
    const email = 'valeriacuestavcc@gmail.com';
    const password = 'val123456';
    const nombre = 'Valeria Cuesta (Admin)';

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        // Check if user exists
        const [rows] = await pool.query('SELECT id_usuario FROM usuarios WHERE correo = ?', [email]);

        if (rows.length > 0) {
            // Update existing user
            const userId = rows[0].id_usuario;
            console.log(`Usuario encontrado (ID: ${userId}). Actualizando a Administrador...`);
            await pool.query(
                `UPDATE usuarios 
                 SET id_rol = 2, contrasena = ?, nombre = ?, verificado = 1, estado = 'activo'
                 WHERE id_usuario = ?`,
                [hashedPassword, nombre, userId]
            );
            console.log('Usuario actualizado exitosamente a Administrador.');
        } else {
            // Insert new admin user
            console.log('Usuario no encontrado. Creando nuevo Administrador...');
            await pool.query(
                `INSERT INTO usuarios (id_rol, nombre, correo, contrasena, verificado, saldo_metrocoins, estado)
                 VALUES (2, ?, ?, ?, 1, 0, 'activo')`,
                [nombre, email, hashedPassword]
            );
            console.log('Nuevo usuario Administrador creado exitosamente.');
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        process.exit(0);
    }
}

createOrUpdateAdmin();
