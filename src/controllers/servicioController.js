const conexion = require('../config/db');

// Lista el catálogo de servicios de la barbería.
const listarServicios = async (req, res) => {
    try {
        const [servicios] = await conexion.query('SELECT * FROM servicios');
        res.json(servicios);
    } catch (error) {
        res.status(500).json({ error: 'Error al listar servicios', detalle: error.message });
    }
};

// Crea un nuevo servicio.
const crearServicio = async (req, res) => {
    try {
        const { nombre, descripcion, precio, duracion_minutos } = req.body;

        if (!nombre || !precio || !duracion_minutos) {
            return res.status(400).json({ error: 'Nombre, precio y duración son obligatorios' });
        }

        const [resultado] = await conexion.query(
            'INSERT INTO servicios (nombre, descripcion, precio, duracion_minutos, estado) VALUES (?, ?, ?, ?, "ACTIVO")',
            [nombre, descripcion || null, precio, duracion_minutos]
        );

        res.status(201).json({
            mensaje: 'Servicio creado correctamente',
            id_servicio: resultado.insertId
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear servicio', detalle: error.message });
    }
};

// Actualiza un servicio existente.
const actualizarServicio = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion, precio, duracion_minutos, estado } = req.body;

        await conexion.query(
            'UPDATE servicios SET nombre = ?, descripcion = ?, precio = ?, duracion_minutos = ?, estado = ? WHERE id_servicio = ?',
            [nombre, descripcion, precio, duracion_minutos, estado, id]
        );

        res.json({ mensaje: 'Servicio actualizado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar servicio', detalle: error.message });
    }
};

// Desactiva un servicio.
const eliminarServicio = async (req, res) => {
    try {
        const { id } = req.params;

        await conexion.query(
            'UPDATE servicios SET estado = "INACTIVO" WHERE id_servicio = ?',
            [id]
        );

        res.json({ mensaje: 'Servicio desactivado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al desactivar servicio', detalle: error.message });
    }
};

module.exports = {
    listarServicios,
    crearServicio,
    actualizarServicio,
    eliminarServicio
};
