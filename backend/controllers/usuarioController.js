const bcrypt = require('bcrypt');
const { supabase } = require('../config/database');

const getUsuarios = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('usuarios')
            .select('id_usuario, nombre, correo, id_rol');

        if (error) throw error;

        // Mapear para mantener la misma estructura de respuesta
        const usuarios = (data || []).map(u => ({
            id: u.id_usuario,
            nombre: u.nombre,
            correo: u.correo,
            rol: u.id_rol === 2 ? 'administrador' : 'usuario',
            estado: 'activo'
        }));

        res.json(usuarios);
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
};

const createUsuario = async (req, res) => {
    const { nombre, correo, rol, password } = req.body;
    try {
        const id_rol = rol === 'administrador' ? 2 : 1;
        const hashedPassword = await bcrypt.hash(password || '123456', 10);

        const { error } = await supabase
            .from('usuarios')
            .insert({
                id_rol,
                nombre,
                correo,
                contrasena: hashedPassword,
                verificado: 1
            });

        if (error) throw error;

        res.status(201).json({ message: 'Usuario creado exitosamente' });
    } catch (error) {
        console.error('Error al crear usuario:', error);
        res.status(500).json({ error: 'Error al crear usuario. Verifica que el correo no esté duplicado.' });
    }
};

const updateUsuario = async (req, res) => {
    const { id } = req.params;
    const { nombre, correo, rol, password } = req.body;
    try {
        const id_rol = rol === 'administrador' ? 2 : 1;

        const updateData = { id_rol, nombre, correo };

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updateData.contrasena = hashedPassword;
        }

        const { error } = await supabase
            .from('usuarios')
            .update(updateData)
            .eq('id_usuario', id);

        if (error) throw error;

        res.json({ message: 'Usuario actualizado exitosamente' });
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        res.status(500).json({ error: 'Error al actualizar usuario' });
    }
};

const deleteUsuario = async (req, res) => {
    const { id } = req.params;
    try {
        const { error } = await supabase
            .from('usuarios')
            .delete()
            .eq('id_usuario', id);

        if (error) throw error;

        res.json({ message: 'Usuario eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        res.status(500).json({ error: 'Error al eliminar usuario' });
    }
};

module.exports = {
    getUsuarios,
    createUsuario,
    updateUsuario,
    deleteUsuario
};
