const conexion = require('../config/db');

// Lista facturas registradas.
const listarFacturas = async (req, res) => {
    try {
        const [facturas] = await conexion.query(
            `SELECT f.*, u.nombre AS cliente_nombre, u.apellido AS cliente_apellido
             FROM facturas f
             INNER JOIN clientes c ON f.id_cliente = c.id_cliente
             INNER JOIN usuarios u ON c.id_usuario = u.id_usuario`
        );

        res.json(facturas);
    } catch (error) {
        res.status(500).json({ error: 'Error al listar facturas', detalle: error.message });
    }
};

// Crea factura básica para un turno.
const crearFactura = async (req, res) => {
    try {
        const { id_turno, id_cliente, subtotal, descuento, metodo_pago } = req.body;

        if (!id_turno || !id_cliente || !subtotal || !metodo_pago) {
            return res.status(400).json({
                error: 'Turno, cliente, subtotal y método de pago son obligatorios'
            });
        }

        const total = Number(subtotal) - Number(descuento || 0);

        const [resultado] = await conexion.query(
            `INSERT INTO facturas (id_turno, id_cliente, subtotal, descuento, total, metodo_pago, estado)
             VALUES (?, ?, ?, ?, ?, ?, 'PAGADA')`,
            [id_turno, id_cliente, subtotal, descuento || 0, total, metodo_pago]
        );

        await conexion.query(
            'UPDATE turnos SET estado = "COMPLETADO" WHERE id_turno = ?',
            [id_turno]
        );

        res.status(201).json({
            mensaje: 'Factura generada correctamente',
            id_factura: resultado.insertId,
            total
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear factura', detalle: error.message });
    }
};

module.exports = {
    listarFacturas,
    crearFactura
};
