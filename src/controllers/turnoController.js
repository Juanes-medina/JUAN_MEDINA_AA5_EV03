const conexion = require('../config/db');

// Lista turnos con datos de cliente, barbero y servicio.
const listarTurnos = async (req, res) => {
    try {
        const [turnos] = await conexion.query(
            `SELECT t.id_turno, t.fecha, t.hora, t.estado, t.observaciones,
                    uc.nombre AS cliente_nombre, uc.apellido AS cliente_apellido,
                    ub.nombre AS barbero_nombre, ub.apellido AS barbero_apellido,
                    s.nombre AS servicio, s.precio
             FROM turnos t
             INNER JOIN clientes c ON t.id_cliente = c.id_cliente
             INNER JOIN usuarios uc ON c.id_usuario = uc.id_usuario
             INNER JOIN barberos b ON t.id_barbero = b.id_barbero
             INNER JOIN usuarios ub ON b.id_usuario = ub.id_usuario
             INNER JOIN servicios s ON t.id_servicio = s.id_servicio
             ORDER BY t.fecha, t.hora`
        );

        res.json(turnos);
    } catch (error) {
        res.status(500).json({ error: 'Error al listar turnos', detalle: error.message });
    }
};

// Agenda un nuevo turno.
const crearTurno = async (req, res) => {
    try {
        const { id_cliente, id_barbero, id_servicio, fecha, hora, observaciones } = req.body;

        if (!id_cliente || !id_barbero || !id_servicio || !fecha || !hora) {
            return res.status(400).json({
                error: 'Cliente, barbero, servicio, fecha y hora son obligatorios'
            });
        }

        // Valida disponibilidad del barbero en la fecha y hora.
        const [existeTurno] = await conexion.query(
            'SELECT * FROM turnos WHERE id_barbero = ? AND fecha = ? AND hora = ? AND estado <> "CANCELADO"',
            [id_barbero, fecha, hora]
        );

        if (existeTurno.length > 0) {
            return res.status(400).json({
                error: 'El barbero no está disponible en ese horario'
            });
        }

        const [resultado] = await conexion.query(
            `INSERT INTO turnos (id_cliente, id_barbero, id_servicio, fecha, hora, estado, observaciones)
             VALUES (?, ?, ?, ?, ?, 'PENDIENTE', ?)`,
            [id_cliente, id_barbero, id_servicio, fecha, hora, observaciones || null]
        );

        res.status(201).json({
            mensaje: 'Turno registrado correctamente',
            id_turno: resultado.insertId
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al registrar turno', detalle: error.message });
    }
};

// Actualiza estado u observaciones del turno.
const actualizarTurno = async (req, res) => {
    try {
        const { id } = req.params;
        const { fecha, hora, estado, observaciones } = req.body;

        await conexion.query(
            'UPDATE turnos SET fecha = ?, hora = ?, estado = ?, observaciones = ? WHERE id_turno = ?',
            [fecha, hora, estado, observaciones, id]
        );

        res.json({ mensaje: 'Turno actualizado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar turno', detalle: error.message });
    }
};

// Cancela el turno para liberar el horario.
const cancelarTurno = async (req, res) => {
    try {
        const { id } = req.params;

        await conexion.query(
            'UPDATE turnos SET estado = "CANCELADO" WHERE id_turno = ?',
            [id]
        );

        res.json({ mensaje: 'Turno cancelado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al cancelar turno', detalle: error.message });
    }
};

module.exports = {
    listarTurnos,
    crearTurno,
    actualizarTurno,
    cancelarTurno
};
