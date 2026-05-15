const express = require('express');
const router = express.Router();

const {
    listarServicios,
    crearServicio,
    actualizarServicio,
    eliminarServicio
} = require('../controllers/servicioController');

router.get('/', listarServicios);
router.post('/', crearServicio);
router.put('/:id', actualizarServicio);
router.delete('/:id', eliminarServicio);

module.exports = router;
