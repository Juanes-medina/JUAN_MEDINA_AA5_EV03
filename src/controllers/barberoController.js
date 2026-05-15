const conexion = require('../config/db');

// Lista los barberos activos del sistema.
const listarBarberos = async (req, res) => {
    try {
        const [barberos] = await conexion.query(
            `SELECT b.id_barbero, u.id_usuario, u.nombre, u.apellido, u.telefono, u.email, b.especialidad, b.descripcion, b.activo
             FROM barberos b
             INNER JOIN usuarios u ON b.id_usuario = u.id_usuario`
        );

        res.json(barberos);
    } catch (error) {
        res.status(500).json({ error: 'Error al listar barberos', detalle: error.message });
    }
};

// Actualiza la especialidad y disponibilidad del barbero.
const actualizarBarbero = async (req, res) => {
    try {
        const { id } = req.params;
        const { especialidad, descripcion, activo } = req.body;

        await conexion.query(
            'UPDATE barberos SET especialidad = ?, descripcion = ?, activo = ? WHERE id_barbero = ?',
            [especialidad, descripcion, activo, id]
        );

        res.json({ mensaje: 'Barbero actualizado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar barbero', detalle: error.message });
    }
};

module.exports = {
    listarBarberos,
    actualizarBarbero
};
