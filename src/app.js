const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const clienteRoutes = require('./routes/clienteRoutes');
const barberoRoutes = require('./routes/barberoRoutes');
const servicioRoutes = require('./routes/servicioRoutes');
const turnoRoutes = require('./routes/turnoRoutes');
const inventarioRoutes = require('./routes/inventarioRoutes');
const facturaRoutes = require('./routes/facturaRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Ruta principal para validar que la API está funcionando.
app.get('/', (req, res) => {
    res.json({
        mensaje: 'API REST BarberSoft funcionando correctamente',
        evidencia: 'GA7-220501096-AA5-EV03'
    });
});

// Rutas principales del sistema.
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/barberos', barberoRoutes);
app.use('/api/servicios', servicioRoutes);
app.use('/api/turnos', turnoRoutes);
app.use('/api/inventario', inventarioRoutes);
app.use('/api/facturas', facturaRoutes);

module.exports = app;
