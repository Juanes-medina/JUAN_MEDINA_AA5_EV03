const conexion = require('../config/db');

// Lista todos los usuarios registrados en BarberSoft.
const listarUsuarios = async (req, res) => {
    try {
        const [usuarios] = await conexion.query(
            'SELECT id_usuario, nombre, apellido, documento, telefono, fecha_nacimiento, email, rol, estado, fecha_creacion FROM usuarios'
        );

        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ error: 'Error al listar usuarios', detalle: error.message });
    }
};

// Consulta un usuario por su identificador.
const obtenerUsuario = async (req, res) => {
    try {
        const { id } = req.params;

        const [usuario] = await conexion.query(
            'SELECT id_usuario, nombre, apellido, documento, telefono, fecha_nacimiento, email, rol, estado FROM usuarios WHERE id_usuario = ?',
            [id]
        );

        if (usuario.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.json(usuario[0]);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener usuario', detalle: error.message });
    }
};

// Actualiza información básica de un usuario.
const actualizarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, apellido, telefono, estado } = req.body;

        await conexion.query(
            'UPDATE usuarios SET nombre = ?, apellido = ?, telefono = ?, estado = ? WHERE id_usuario = ?',
            [nombre, apellido, telefono, estado, id]
        );

        res.json({ mensaje: 'Usuario actualizado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar usuario', detalle: error.message });
    }
};

// Eliminación lógica del usuario para conservar información histórica.
const desactivarUsuario = async (req, res) => {
    try {
        const { id } = req.params;

        await conexion.query(
            'UPDATE usuarios SET estado = "INACTIVO" WHERE id_usuario = ?',
            [id]
        );

        res.json({ mensaje: 'Usuario desactivado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al desactivar usuario', detalle: error.message });
    }
};

module.exports = {
    listarUsuarios,
    obtenerUsuario,
    actualizarUsuario,
    desactivarUsuario
};
