const express = require('express');
const router = express.Router();

const {
    listarFacturas,
    crearFactura
} = require('../controllers/facturaController');

router.get('/', listarFacturas);
router.post('/', crearFactura);

module.exports = router;
