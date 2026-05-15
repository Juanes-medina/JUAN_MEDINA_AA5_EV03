# BarberSoft API REST

## Evidencia

**GA7-220501096-AA5-EV03: Diseño y desarrollo de servicios web - proyecto**

## Aprendiz

Juan Esteban Medina Méndez

## Descripción

Este proyecto corresponde al diseño y desarrollo de servicios web para el sistema **BarberSoft**, una aplicación orientada a la gestión de barberías.

La API permite administrar los módulos principales del proyecto formativo:

- Autenticación de usuarios
- Gestión de usuarios
- Gestión de clientes
- Gestión de barberos
- Catálogo de servicios
- Agendamiento de turnos
- Gestión de inventario
- Facturación

## Tecnologías utilizadas

- Node.js
- Express.js
- MySQL
- mysql2
- bcryptjs
- Git
- GitHub
- Thunder Client o Postman para pruebas

## Instalación

```bash
npm install
```

## Ejecución

```bash
npm run dev
```

El servidor se ejecuta en:

```txt
http://localhost:3000
```

## Base de datos

Ejecutar el archivo SQL ubicado en:

```txt
database/barbersoft.sql
```

La base de datos creada se llama:

```sql
barbersoft
```

## Configuración de conexión

Archivo:

```txt
src/config/db.js
```

Configuración actual:

```js
host: 'localhost',
user: 'root',
password: '3116316822',
database: 'barbersoft'
```

Si MySQL usa otra contraseña, modificar ese archivo.

---

# Documentación de servicios web

## 1. Servicio principal

### GET /

Verifica que la API esté funcionando.

**Respuesta:**

```json
{
  "mensaje": "API REST BarberSoft funcionando correctamente",
  "evidencia": "GA7-220501096-AA5-EV03"
}
```

---

# Autenticación

## 2. Registrar usuario

### POST /api/auth/registro

Permite registrar usuarios con rol CLIENTE, BARBERO o ADMIN.

**Body JSON:**

```json
{
  "nombre": "Pedro",
  "apellido": "Ramírez",
  "documento": "123456789",
  "telefono": "3001234567",
  "fecha_nacimiento": "2000-01-01",
  "email": "pedro@correo.com",
  "password": "123456",
  "rol": "CLIENTE"
}
```

**Respuesta:**

```json
{
  "mensaje": "Usuario registrado correctamente",
  "id_usuario": 4
}
```

---

## 3. Iniciar sesión

### POST /api/auth/login

Permite iniciar sesión con email y contraseña.

**Body JSON:**

```json
{
  "email": "admin@barbersoft.com",
  "password": "admin123"
}
```

**Respuesta:**

```json
{
  "mensaje": "Autenticación satisfactoria",
  "usuario": {
    "id_usuario": 1,
    "nombre": "Admin",
    "apellido": "Principal",
    "email": "admin@barbersoft.com",
    "rol": "ADMIN"
  }
}
```

---

# Usuarios

## 4. Listar usuarios

### GET /api/usuarios

Obtiene todos los usuarios registrados.

---

## 5. Obtener usuario por ID

### GET /api/usuarios/:id

Ejemplo:

```txt
GET /api/usuarios/1
```

---

## 6. Actualizar usuario

### PUT /api/usuarios/:id

**Body JSON:**

```json
{
  "nombre": "Juan",
  "apellido": "Medina",
  "telefono": "3000000000",
  "estado": "ACTIVO"
}
```

---

## 7. Desactivar usuario

### DELETE /api/usuarios/:id

Realiza eliminación lógica cambiando el estado a INACTIVO.

---

# Clientes

## 8. Listar clientes

### GET /api/clientes

Obtiene los clientes registrados.

---

## 9. Obtener cliente por ID

### GET /api/clientes/:id

---

## 10. Actualizar cliente

### PUT /api/clientes/:id

**Body JSON:**

```json
{
  "nombre": "Juan",
  "apellido": "Pérez",
  "telefono": "3011111111",
  "email": "juan@correo.com"
}
```

---

## 11. Eliminar cliente

### DELETE /api/clientes/:id

---

# Barberos

## 12. Listar barberos

### GET /api/barberos

Obtiene los barberos registrados.

---

## 13. Actualizar barbero

### PUT /api/barberos/:id

**Body JSON:**

```json
{
  "especialidad": "Fade y barba",
  "descripcion": "Especialista en cortes modernos",
  "activo": true
}
```

---

# Servicios de barbería

## 14. Listar servicios

### GET /api/servicios

---

## 15. Crear servicio

### POST /api/servicios

**Body JSON:**

```json
{
  "nombre": "Corte premium",
  "descripcion": "Corte moderno con lavado",
  "precio": 30000,
  "duracion_minutos": 60
}
```

---

## 16. Actualizar servicio

### PUT /api/servicios/:id

**Body JSON:**

```json
{
  "nombre": "Corte clásico",
  "descripcion": "Corte tradicional masculino",
  "precio": 18000,
  "duracion_minutos": 30,
  "estado": "ACTIVO"
}
```

---

## 17. Desactivar servicio

### DELETE /api/servicios/:id

---

# Turnos

## 18. Listar turnos

### GET /api/turnos

Obtiene la agenda de turnos.

---

## 19. Agendar turno

### POST /api/turnos

**Body JSON:**

```json
{
  "id_cliente": 1,
  "id_barbero": 1,
  "id_servicio": 1,
  "fecha": "2026-05-10",
  "hora": "14:00:00",
  "observaciones": "Cliente solicita corte clásico"
}
```

**Respuesta:**

```json
{
  "mensaje": "Turno registrado correctamente",
  "id_turno": 1
}
```

---

## 20. Actualizar turno

### PUT /api/turnos/:id

**Body JSON:**

```json
{
  "fecha": "2026-05-10",
  "hora": "15:00:00",
  "estado": "CONFIRMADO",
  "observaciones": "Turno confirmado"
}
```

---

## 21. Cancelar turno

### DELETE /api/turnos/:id

Cambia el estado del turno a CANCELADO.

---

# Inventario

## 22. Listar inventario

### GET /api/inventario

---

## 23. Consultar stock bajo

### GET /api/inventario/stock-bajo

Obtiene productos cuyo stock actual es menor o igual al stock mínimo.

---

## 24. Crear producto

### POST /api/inventario

**Body JSON:**

```json
{
  "nombre": "Shampoo profesional",
  "descripcion": "Producto para lavado capilar",
  "stock_actual": 10,
  "stock_minimo": 3,
  "precio_compra": 12000,
  "precio_venta": 18000
}
```

---

## 25. Actualizar producto

### PUT /api/inventario/:id

**Body JSON:**

```json
{
  "nombre": "Gel fijador",
  "descripcion": "Producto para peinado",
  "stock_actual": 20,
  "stock_minimo": 5,
  "precio_compra": 8000,
  "precio_venta": 12000,
  "estado": "ACTIVO"
}
```

---

## 26. Desactivar producto

### DELETE /api/inventario/:id

---

# Facturación

## 27. Listar facturas

### GET /api/facturas

---

## 28. Crear factura

### POST /api/facturas

**Body JSON:**

```json
{
  "id_turno": 1,
  "id_cliente": 1,
  "subtotal": 15000,
  "descuento": 0,
  "metodo_pago": "EFECTIVO"
}
```

**Respuesta:**

```json
{
  "mensaje": "Factura generada correctamente",
  "id_factura": 1,
  "total": 15000
}
```

---

# Relación con el proyecto BarberSoft

Los servicios desarrollados responden a los módulos principales del sistema:

- Registro e inicio de sesión
- Gestión de usuarios por roles
- Gestión de clientes
- Agenda de turnos
- Administración de inventario
- Procesamiento de pagos y facturación

## Evidencia de versionamiento

El proyecto debe subirse a GitHub y el enlace debe colocarse en:

```txt
enlace_repositorio.txt
```

## Entrega

La carpeta debe comprimirse con el nombre:

```txt
JUAN_MEDINA_AA5_EV03.zip
```
