# Backend TAMI - Node.js + Express + PostgreSQL

Capa de **Datos** y servicios de la aplicación. Expone una **API REST** que el frontend consume con `fetch`.

## Stack

- **Node.js** + **Express** (servidor HTTP y enrutado).
- **pg** (driver de PostgreSQL).
- **dotenv** (variables de entorno) y **cors** (permite que el frontend consuma la API).

## Estructura

```text
server/
├── index.js         Punto de entrada: app Express y rutas montadas
├── db.js            Pool de conexiones a PostgreSQL
├── schema.sql       Esquema de tablas + datos iniciales
├── routes/
│   ├── usuarios.js  GET/POST de usuarios
│   ├── cursos.js    GET de cursos
│   └── alertas.js   GET de alertas de fraude
├── .env.example     Plantilla de configuración
└── package.json     Dependencias y scripts
```

## Endpoints

| Método | Ruta                    | Descripción                         |
|--------|-------------------------|-------------------------------------|
| GET    | `/`                     | Estado de la API                    |
| GET    | `/api/usuarios`         | Listar usuarios                     |
| GET    | `/api/usuarios/:id`     | Obtener un usuario                  |
| POST   | `/api/usuarios`         | Crear usuario (nombre, email, ...)  |
| GET    | `/api/cursos`           | Listar cursos activos               |
| GET    | `/api/cursos/:id`       | Obtener un curso                    |
| GET    | `/api/alertas`          | Listar alertas de fraude            |

## Puesta en marcha

1. **Instalar Node.js** (https://nodejs.org) y **PostgreSQL** (https://www.postgresql.org).
2. Crear la base de datos:

   ```sql
   CREATE DATABASE tami_db;
   ```

3. Ejecutar el esquema:

   ```powershell
   psql -U postgres -d tami_db -f schema.sql
   ```

4. Configurar credenciales:

   ```powershell
   Copy-Item .env.example .env
   # Editar .env con usuario/contraseña de PostgreSQL
   ```

5. Instalar dependencias y levantar el servidor:

   ```powershell
   npm install
   npm start
   ```

   La API queda en `http://localhost:3000`.

> El frontend (`code/main.js`) intenta consumir la API y, si no está disponible, usa la caché de LocalStorage.
