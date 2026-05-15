const express = require('express');
const router = express.Router();

const {
    listarBarberos,
    actualizarBarbero
} = require('../controllers/barberoController');

router.get('/', listarBarberos);
router.put('/:id', actualizarBarbero);

module.exports = router;
