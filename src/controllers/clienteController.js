const conexion = require('../config/db');

// Lista clientes con sus datos personales.
const listarClientes = async (req, res) => {
    try {
        const [clientes] = await conexion.query(
            `SELECT c.id_cliente, u.id_usuario, u.nombre, u.apellido, u.documento, u.telefono, u.email, c.fecha_registro
             FROM clientes c
             INNER JOIN usuarios u ON c.id_usuario = u.id_usuario`
        );

        res.json(clientes);
    } catch (error) {
        res.status(500).json({ error: 'Error al listar clientes', detalle: error.message });
    }
};

// Consulta el detalle de un cliente.
const obtenerCliente = async (req, res) => {
    try {
        const { id } = req.params;

        const [cliente] = await conexion.query(
            `SELECT c.id_cliente, u.id_usuario, u.nombre, u.apellido, u.documento, u.telefono, u.email, c.fecha_registro
             FROM clientes c
             INNER JOIN usuarios u ON c.id_usuario = u.id_usuario
             WHERE c.id_cliente = ?`,
            [id]
        );

        if (cliente.length === 0) {
            return res.status(404).json({ error: 'Cliente no encontrado' });
        }

        res.json(cliente[0]);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener cliente', detalle: error.message });
    }
};

// Actualiza los datos de contacto del cliente.
const actualizarCliente = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, apellido, telefono, email } = req.body;

        const [cliente] = await conexion.query(
            'SELECT id_usuario FROM clientes WHERE id_cliente = ?',
            [id]
        );

        if (cliente.length === 0) {
            return res.status(404).json({ error: 'Cliente no encontrado' });
        }

        await conexion.query(
            'UPDATE usuarios SET nombre = ?, apellido = ?, telefono = ?, email = ? WHERE id_usuario = ?',
            [nombre, apellido, telefono, email, cliente[0].id_usuario]
        );

        res.json({ mensaje: 'Cliente actualizado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar cliente', detalle: error.message });
    }
};

// Elimina un cliente.
const eliminarCliente = async (req, res) => {
    try {
        const { id } = req.params;

        await conexion.query('DELETE FROM clientes WHERE id_cliente = ?', [id]);

        res.json({ mensaje: 'Cliente eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar cliente', detalle: error.message });
    }
};

module.exports = {
    listarClientes,
    obtenerCliente,
    actualizarCliente,
    eliminarCliente
};
