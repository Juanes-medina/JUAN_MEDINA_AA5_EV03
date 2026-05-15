const express = require('express');
const router = express.Router();

const {
    listarClientes,
    obtenerCliente,
    actualizarCliente,
    eliminarCliente
} = require('../controllers/clienteController');

router.get('/', listarClientes);
router.get('/:id', obtenerCliente);
router.put('/:id', actualizarCliente);
router.delete('/:id', eliminarCliente);

module.exports = router;
