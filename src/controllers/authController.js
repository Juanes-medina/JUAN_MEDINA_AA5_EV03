const conexion = require('../config/db');
const bcrypt = require('bcryptjs');

// Registro de usuario para BarberSoft.
// Permite crear usuarios con roles CLIENTE, BARBERO o ADMIN.
const registrar = async (req, res) => {
    try {
        const {
            nombre,
            apellido,
            documento,
            telefono,
            fecha_nacimiento,
            email,
            password,
            rol
        } = req.body;

        // Validación de campos obligatorios.
        if (!nombre || !apellido || !documento || !email || !password || !rol) {
            return res.status(400).json({
                error: 'Nombre, apellido, documento, email, password y rol son obligatorios'
            });
        }

        // Verifica si ya existe un usuario con el mismo email o documento.
        const [existe] = await conexion.query(
            'SELECT * FROM usuarios WHERE email = ? OR documento = ?',
            [email, documento]
        );

        if (existe.length > 0) {
            return res.status(400).json({
                error: 'El usuario ya existe'
            });
        }

        // Encripta la contraseña antes de guardarla.
        const passwordHash = await bcrypt.hash(password, 10);

        const [resultado] = await conexion.query(
            `INSERT INTO usuarios
            (nombre, apellido, documento, telefono, fecha_nacimiento, email, password_hash, rol, estado)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'ACTIVO')`,
            [nombre, apellido, documento, telefono || null, fecha_nacimiento || null, email, passwordHash, rol]
        );

        const idUsuario = resultado.insertId;

        // Según el rol, crea el registro relacionado.
        if (rol === 'CLIENTE') {
            await conexion.query(
                'INSERT INTO clientes (id_usuario) VALUES (?)',
                [idUsuario]
            );
        }

        if (rol === 'BARBERO') {
            await conexion.query(
                'INSERT INTO barberos (id_usuario, especialidad, descripcion, activo) VALUES (?, ?, ?, TRUE)',
                [idUsuario, req.body.especialidad || 'General', req.body.descripcion || 'Barbero registrado en BarberSoft']
            );
        }

        res.status(201).json({
            mensaje: 'Usuario registrado correctamente',
            id_usuario: idUsuario
        });

    } catch (error) {
        res.status(500).json({
            error: 'Error en el servidor',
            detalle: error.message
        });
    }
};

// Inicio de sesión del sistema BarberSoft.
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                error: 'El email y la contraseña son obligatorios'
            });
        }

        const [resultado] = await conexion.query(
            'SELECT * FROM usuarios WHERE email = ? AND estado = "ACTIVO"',
            [email]
        );

        if (resultado.length === 0) {
            return res.status(401).json({
                error: 'Error en la autenticación'
            });
        }

        const usuario = resultado[0];

        // Compara contraseña encriptada.
        // También permite validar datos iniciales del SQL que están en texto plano.
        let passwordCorrecta = false;

        if (usuario.password_hash.startsWith('$2')) {
            passwordCorrecta = await bcrypt.compare(password, usuario.password_hash);
        } else {
            passwordCorrecta = password === usuario.password_hash;
        }

        if (!passwordCorrecta) {
            return res.status(401).json({
                error: 'Error en la autenticación'
            });
        }

        res.json({
            mensaje: 'Autenticación satisfactoria',
            usuario: {
                id_usuario: usuario.id_usuario,
                nombre: usuario.nombre,
                apellido: usuario.apellido,
                email: usuario.email,
                rol: usuario.rol
            }
        });

    } catch (error) {
        res.status(500).json({
            error: 'Error en el servidor',
            detalle: error.message
        });
    }
};

module.exports = {
    registrar,
    login
};
