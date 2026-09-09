# Backend TAMI - Node.js + Express + PostgreSQL

Capa de **Datos** y servicios de la aplicación. Expone una **API REST** que el frontend consume con `fetch`.

## Stack

- **Node.js** + **Express** (servidor HTTP y enrutado).
- **pg** (driver de PostgreSQL, consultas parametrizadas).
- **bcrypt** (hashing irreversibles de contraseñas, costo 12).
- **dotenv** (variables de entorno) y **cors** (permite que el frontend consuma la API).

## Estructura

```text
server/
├── index.js         Punto de entrada: app Express y rutas montadas
├── db.js            Pool de conexiones a PostgreSQL
├── schema.sql       Esquema de 7 tablas + datos iniciales
├── routes/
│   ├── usuarios.js  Registro, login (bcrypt), listado y progreso
│   ├── cursos.js    Listado de módulos/curso
│   ├── alertas.js   Alertas de fraude
│   └── progreso.js  Test, exámenes y progreso de módulos
├── .env.example     Plantilla de configuración
└── package.json     Dependencias y scripts
```

## Seguridad de Contraseñas (bcrypt)

Se reemplazó `SHA-256` por `bcrypt` porque:

1. **SHA-256 es un hash rápido**, vulnerable a ataques de rainbow tables.
2. **bcrypt incorpora salt automático** por usuario y es resistente a fuerza bruta.
3. El **costo de 12 rondas** equilibra seguridad con rendimiento en hardware estándar.

### Registro

```js
const passwordHash = await bcrypt.hash(password, COSTO_BCRYPT); // 12
```

### Login (comparación segura)

```js
const contrasenaValida = await bcrypt.compare(password, usuario.password_hash);
```

## Validación Estricta de Entradas

- **Email**: expresión regular `^[^\s@]+@[^\s@]+\.[^\s@]+$` validada en el servidor.
- **Nombre**: mínimo 2 caracteres luego de `.trim()`.
- **Password**: mínimo 6 caracteres.
- **SQL**: siempre consultas parametrizadas (`$1`, `$2`) para prevenir inyección SQL.
- Los mensajes de error no revelan datos internos.

## Base de Datos

| Tabla | Descripción |
|-------|-------------|
| `usuarios` | Usuarios con nombre, email, password_hash (bcrypt), nivel_digital |
| `cursos` | 5 módulos del Campus Educativo |
| `alertas_fraude` | 6 alertas con título, descripción, que_hacer, severidad |
| `inscripciones` | Relación usuario-curso |
| `test_nivelacion` | Resultados del test inicial (respuestas JSONB, nivel, puntaje) |
| `examenes` | Resultados del examen post-lección |
| `progreso_modulos` | Avance paso a paso en cada módulo |

## Endpoints

| Método | Ruta | Descripción | Body requerido |
|--------|------|-------------|----------------|
| GET | `/` | Estado de la API | — |
| GET | `/api/usuarios` | Listar usuarios | — |
| GET | `/api/usuarios/:id` | Obtener un usuario | — |
| POST | `/api/usuarios/registrar` | Registrar usuario (bcrypt) | `{ nombre, email, password }` |
| POST | `/api/usuarios/login` | Iniciar sesión (compare bcrypt) | `{ email, password }` |
| GET | `/api/usuarios/:id/progreso` | Progreso completo | — |
| GET | `/api/cursos` | Listar cursos activos | — |
| GET | `/api/cursos/:id` | Obtener un curso | — |
| GET | `/api/alertas` | Listar alertas de fraude | — |
| POST | `/api/progreso/test` | Guardar test nivelación | `{ usuarioId, respuestas, nivel, puntaje, totalPreguntas }` |
| POST | `/api/progreso/examen` | Guardar examen | `{ usuarioId, moduloId, respuestas, puntaje, totalPreguntas }` |
| POST | `/api/progreso/modulo` | Guardar progreso módulo | `{ usuarioId, moduloId, pasoActual, completado }` |
| GET | `/api/progreso/:usuarioId` | Obtener progreso | — |

## Puesta en Marcha

1. **Instalar Node.js** (https://nodejs.org) y **PostgreSQL** (https://www.postgresql.org).

2. Crear la base de datos:

   ```bash
   createdb -U postgres tami_db
   ```

3. Ejecutar el esquema:

   ```bash
   psql -U postgres -d tami_db -f schema.sql
   ```

4. Configurar credenciales:

   ```bash
   cp .env.example .env
   # Editar .env con usuario/contraseña de PostgreSQL
   ```

5. Instalar dependencias y levantar el servidor:

   ```bash
   npm install
   npm start
   ```

   La API queda en `http://localhost:3000`.

> El frontend (`code/main.js`) intenta consumir la API y, si no está disponible, usa la caché de LocalStorage como fallback offline.