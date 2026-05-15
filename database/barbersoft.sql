DROP DATABASE IF EXISTS barbersoft;
CREATE DATABASE barbersoft CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE barbersoft;

-- =========================
-- TABLA: usuarios
-- Guarda todos los usuarios que pueden iniciar sesión
-- Roles: CLIENTE, BARBERO, ADMIN
-- =========================
CREATE TABLE usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    documento VARCHAR(20) NOT NULL UNIQUE,
    telefono VARCHAR(20),
    fecha_nacimiento DATE,
    email VARCHAR(120) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    rol ENUM('CLIENTE', 'BARBERO', 'ADMIN') NOT NULL,
    estado ENUM('ACTIVO', 'INACTIVO') NOT NULL DEFAULT 'ACTIVO',
    fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- =========================
-- TABLA: clientes
-- Extensión de usuarios con rol CLIENTE
-- =========================
CREATE TABLE clientes (
    id_cliente INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL UNIQUE,
    fecha_registro DATE NOT NULL DEFAULT (CURRENT_DATE),
    CONSTRAINT fk_clientes_usuarios
        FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- =========================
-- TABLA: barberos
-- Extensión de usuarios con rol BARBERO
-- =========================
CREATE TABLE barberos (
    id_barbero INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL UNIQUE,
    especialidad VARCHAR(100),
    descripcion VARCHAR(255),
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT fk_barberos_usuarios
        FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- =========================
-- TABLA: servicios
-- Catálogo de servicios de barbería
-- =========================
CREATE TABLE servicios (
    id_servicio INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion VARCHAR(255),
    precio DECIMAL(10,2) NOT NULL,
    duracion_minutos INT NOT NULL,
    estado ENUM('ACTIVO', 'INACTIVO') NOT NULL DEFAULT 'ACTIVO'
) ENGINE=InnoDB;

-- =========================
-- TABLA: turnos
-- Reserva de citas
-- =========================
CREATE TABLE turnos (
    id_turno INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT NOT NULL,
    id_barbero INT NOT NULL,
    id_servicio INT NOT NULL,
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    estado ENUM('PENDIENTE', 'CONFIRMADO', 'CANCELADO', 'COMPLETADO') NOT NULL DEFAULT 'PENDIENTE',
    observaciones VARCHAR(255),
    fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_turnos_clientes
        FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    CONSTRAINT fk_turnos_barberos
        FOREIGN KEY (id_barbero) REFERENCES barberos(id_barbero)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    CONSTRAINT fk_turnos_servicios
        FOREIGN KEY (id_servicio) REFERENCES servicios(id_servicio)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    CONSTRAINT uq_turno_barbero_horario UNIQUE (id_barbero, fecha, hora)
) ENGINE=InnoDB;

-- =========================
-- TABLA: inventario
-- Productos e insumos
-- =========================
CREATE TABLE inventario (
    id_producto INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion VARCHAR(255),
    stock_actual INT NOT NULL DEFAULT 0,
    stock_minimo INT NOT NULL DEFAULT 0,
    precio_compra DECIMAL(10,2) DEFAULT 0.00,
    precio_venta DECIMAL(10,2) DEFAULT 0.00,
    estado ENUM('ACTIVO', 'INACTIVO') NOT NULL DEFAULT 'ACTIVO'
) ENGINE=InnoDB;

-- =========================
-- TABLA: servicio_producto
-- Relación entre servicios y productos del inventario
-- =========================
CREATE TABLE servicio_producto (
    id_servicio_producto INT AUTO_INCREMENT PRIMARY KEY,
    id_servicio INT NOT NULL,
    id_producto INT NOT NULL,
    cantidad_requerida INT NOT NULL,
    CONSTRAINT fk_servicio_producto_servicios
        FOREIGN KEY (id_servicio) REFERENCES servicios(id_servicio)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_servicio_producto_inventario
        FOREIGN KEY (id_producto) REFERENCES inventario(id_producto)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT uq_servicio_producto UNIQUE (id_servicio, id_producto)
) ENGINE=InnoDB;

-- =========================
-- TABLA: facturas
-- Encabezado de factura o cobro
-- =========================
CREATE TABLE facturas (
    id_factura INT AUTO_INCREMENT PRIMARY KEY,
    id_turno INT NOT NULL UNIQUE,
    id_cliente INT NOT NULL,
    fecha TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    subtotal DECIMAL(10,2) NOT NULL,
    descuento DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    total DECIMAL(10,2) NOT NULL,
    metodo_pago ENUM('EFECTIVO', 'TARJETA', 'TRANSFERENCIA', 'OTRO') NOT NULL,
    estado ENUM('PENDIENTE', 'PAGADA', 'ANULADA') NOT NULL DEFAULT 'PENDIENTE',
    CONSTRAINT fk_facturas_turnos
        FOREIGN KEY (id_turno) REFERENCES turnos(id_turno)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    CONSTRAINT fk_facturas_clientes
        FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- =========================
-- TABLA: detalle_factura
-- Detalle de servicios cobrados
-- =========================
CREATE TABLE detalle_factura (
    id_detalle INT AUTO_INCREMENT PRIMARY KEY,
    id_factura INT NOT NULL,
    id_servicio INT NOT NULL,
    cantidad INT NOT NULL DEFAULT 1,
    precio_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    CONSTRAINT fk_detalle_factura_facturas
        FOREIGN KEY (id_factura) REFERENCES facturas(id_factura)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_detalle_factura_servicios
        FOREIGN KEY (id_servicio) REFERENCES servicios(id_servicio)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- =========================
-- TABLA: notificaciones
-- Confirmaciones o alertas del sistema
-- =========================
CREATE TABLE notificaciones (
    id_notificacion INT AUTO_INCREMENT PRIMARY KEY,
    id_turno INT NOT NULL,
    tipo ENUM('CONFIRMACION', 'RECORDATORIO', 'CANCELACION', 'PAGO') NOT NULL,
    mensaje VARCHAR(255) NOT NULL,
    estado ENUM('PENDIENTE', 'ENVIADA', 'ERROR') NOT NULL DEFAULT 'PENDIENTE',
    fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_notificaciones_turnos
        FOREIGN KEY (id_turno) REFERENCES turnos(id_turno)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- =========================
-- DATOS INICIALES
-- =========================

-- Usuario administrador
INSERT INTO usuarios (nombre, apellido, documento, telefono, fecha_nacimiento, email, password_hash, rol, estado)
VALUES ('Admin', 'Principal', '1000000000', '3000000000', '2000-01-01', 'admin@barbersoft.com', 'admin123', 'ADMIN', 'ACTIVO');

-- Usuarios cliente y barbero
INSERT INTO usuarios (nombre, apellido, documento, telefono, fecha_nacimiento, email, password_hash, rol, estado)
VALUES
('Juan', 'Pérez', '1010000001', '3011111111', '1999-05-10', 'juan@correo.com', '123456', 'CLIENTE', 'ACTIVO'),
('Carlos', 'Gómez', '1010000002', '3022222222', '1995-08-20', 'carlos@correo.com', '123456', 'BARBERO', 'ACTIVO');

-- Relación cliente
INSERT INTO clientes (id_usuario, fecha_registro)
VALUES (2, CURRENT_DATE);

-- Relación barbero
INSERT INTO barberos (id_usuario, especialidad, descripcion, activo)
VALUES (3, 'Fade y barba', 'Especialista en cortes modernos y perfilado de barba', TRUE);

-- Servicios
INSERT INTO servicios (nombre, descripcion, precio, duracion_minutos, estado)
VALUES
('Corte clásico', 'Corte tradicional masculino', 15000.00, 30, 'ACTIVO'),
('Corte + barba', 'Corte de cabello con arreglo de barba', 25000.00, 45, 'ACTIVO'),
('Perfilado de barba', 'Diseño y perfilado de barba', 12000.00, 20, 'ACTIVO');

-- Inventario
INSERT INTO inventario (nombre, descripcion, stock_actual, stock_minimo, precio_compra, precio_venta, estado)
VALUES
('Gel fijador', 'Producto para peinado', 20, 5, 8000.00, 12000.00, 'ACTIVO'),
('Cera moldeadora', 'Cera para acabado mate', 15, 5, 10000.00, 15000.00, 'ACTIVO'),
('After shave', 'Loción para después del afeitado', 10, 3, 9000.00, 14000.00, 'ACTIVO');