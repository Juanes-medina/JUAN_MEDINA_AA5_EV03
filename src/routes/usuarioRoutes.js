const express = require('express');
const router = express.Router();

const {
    listarUsuarios,
    obtenerUsuario,
    actualizarUsuario,
    desactivarUsuario
} = require('../controllers/usuarioController');

router.get('/', listarUsuarios);
router.get('/:id', obtenerUsuario);
router.put('/:id', actualizarUsuario);
router.delete('/:id', desactivarUsuario);

module.exports = router;
