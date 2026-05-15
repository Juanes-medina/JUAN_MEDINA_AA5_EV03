const conexion = require('../config/db');

// Lista productos del inventario.
const listarInventario = async (req, res) => {
    try {
        const [productos] = await conexion.query('SELECT * FROM inventario');
        res.json(productos);
    } catch (error) {
        res.status(500).json({ error: 'Error al listar inventario', detalle: error.message });
    }
};

// Registra un producto.
const crearProducto = async (req, res) => {
    try {
        const { nombre, descripcion, stock_actual, stock_minimo, precio_compra, precio_venta } = req.body;

        if (!nombre) {
            return res.status(400).json({ error: 'El nombre del producto es obligatorio' });
        }

        const [resultado] = await conexion.query(
            `INSERT INTO inventario
            (nombre, descripcion, stock_actual, stock_minimo, precio_compra, precio_venta, estado)
            VALUES (?, ?, ?, ?, ?, ?, 'ACTIVO')`,
            [nombre, descripcion || null, stock_actual || 0, stock_minimo || 0, precio_compra || 0, precio_venta || 0]
        );

        res.status(201).json({
            mensaje: 'Producto registrado correctamente',
            id_producto: resultado.insertId
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear producto', detalle: error.message });
    }
};

// Actualiza información de inventario.
const actualizarProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion, stock_actual, stock_minimo, precio_compra, precio_venta, estado } = req.body;

        await conexion.query(
            `UPDATE inventario
             SET nombre = ?, descripcion = ?, stock_actual = ?, stock_minimo = ?, precio_compra = ?, precio_venta = ?, estado = ?
             WHERE id_producto = ?`,
            [nombre, descripcion, stock_actual, stock_minimo, precio_compra, precio_venta, estado, id]
        );

        res.json({ mensaje: 'Producto actualizado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar producto', detalle: error.message });
    }
};

// Desactiva un producto.
const eliminarProducto = async (req, res) => {
    try {
        const { id } = req.params;

        await conexion.query(
            'UPDATE inventario SET estado = "INACTIVO" WHERE id_producto = ?',
            [id]
        );

        res.json({ mensaje: 'Producto desactivado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al desactivar producto', detalle: error.message });
    }
};

// Consulta productos con stock bajo.
const listarStockBajo = async (req, res) => {
    try {
        const [productos] = await conexion.query(
            'SELECT * FROM inventario WHERE stock_actual <= stock_minimo AND estado = "ACTIVO"'
        );

        res.json(productos);
    } catch (error) {
        res.status(500).json({ error: 'Error al consultar stock bajo', detalle: error.message });
    }
};

module.exports = {
    listarInventario,
    crearProducto,
    actualizarProducto,
    eliminarProducto,
    listarStockBajo
};
