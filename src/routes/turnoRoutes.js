const express = require('express');
const router = express.Router();

const {
    listarTurnos,
    crearTurno,
    actualizarTurno,
    cancelarTurno
} = require('../controllers/turnoController');

router.get('/', listarTurnos);
router.post('/', crearTurno);
router.put('/:id', actualizarTurno);
router.delete('/:id', cancelarTurno);

module.exports = router;
