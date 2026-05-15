const mysql = require('mysql2/promise');

// Conexión a la base de datos MySQL del proyecto BarberSoft.
// Cambiar la contraseña si MySQL tiene una diferente.
const conexion = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '3116316822',
    database: 'barbersoft',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = conexion;
