const express = require('express');
const router = express.Router();

const {
    listarInventario,
    crearProducto,
    actualizarProducto,
    eliminarProducto,
    listarStockBajo
} = require('../controllers/inventarioController');

router.get('/', listarInventario);
router.get('/stock-bajo', listarStockBajo);
router.post('/', crearProducto);
router.put('/:id', actualizarProducto);
router.delete('/:id', eliminarProducto);

module.exports = router;
