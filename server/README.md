# Backend TAMI - Node.js + Express + PostgreSQL

Capa de **Datos** y servicios de la aplicación. Expone una **API REST** que el frontend consume con `fetch`.

## Stack

- **Node.js** + **Express** (servidor HTTP y enrutado).
- **Supabase** (PostgreSQL gestionado en la nube, conexión por pooler con SSL).
- **pg** (driver de PostgreSQL, consultas parametrizadas).
- **bcrypt** (hashing irreversible de contraseñas, costo 12).
- **nodemailer** (envío de correos para la recuperación de contraseña).
- **dotenv** (variables de entorno) y **cors** (permite que el frontend consuma la API).

## Estructura

```text
server/
├── index.js            Punto de entrada: app Express, headers de seguridad y rutas
├── db.js               Pool de conexiones a Supabase (PostgreSQL) + verificación
├── schema.sql          SOLO DDL: tablas, índices, CHECKs y UNIQUE (sin datos)
├── scripts/
│   ├── migrate.js      Crea el esquema. NO carga contenido (npm run db:migrate)
│   ├── seed.js         Carga cursos y alertas SOLO si las tablas están vacías (npm run db:seed)
│   ├── seguridad.js    Endurecimiento: RLS, políticas, auditoría, intentos de login (npm run db:seguridad)
│   └── estado.js       Informe de solo lectura: rol, tablas, duplicados, RLS (npm run db:estado)
├── middlewares/
│   └── seguridad.js    Cabeceras HTTP, limitador de solicitudes por IP y CORS restringido
├── services/
│   └── email.js        Envío SMTP del enlace de recuperación (nodemailer)
├── routes/
│   ├── usuarios.js     Registro, login, recuperación de contraseña, listado y progreso
│   ├── cursos.js       Listado de módulos/curso
│   ├── alertas.js      Alertas de fraude
│   └── progreso.js     Test, exámenes y progreso de módulos
├── .env                Credenciales de Supabase (no se sube al repositorio)
├── .env.example        Plantilla de configuración
└── package.json        Dependencias y scripts
```

## Seguridad de Contraseñas (bcrypt)

Se reemplazó `SHA-256` por `bcrypt` porque:

1. **SHA-256 es un hash rápido**, vulnerable a ataques de rainbow tables.
2. **bcrypt incorpora salt automático** por usuario y es resistente a fuerza bruta.
3. El **costo de 12 rondas** equilibra seguridad con rendimiento en hardware estándar.

```js
const passwordHash = await bcrypt.hash(password, COSTO_BCRYPT); // 12
const contrasenaValida = await bcrypt.compare(password, usuario.password_hash);
```

## Validación Estricta de Entradas

- **Email**: expresión regular `^[^\s@]+@[^\s@]+\.[^\s@]+$` validada en el servidor.
- **Nombre**: mínimo 2 caracteres y máximo 100 luego de `.trim()`.
- **Password**: mínimo 6 y máximo 72 caracteres (límite de bcrypt).
- **SQL**: siempre consultas parametrizadas (`$1`, `$2`) para prevenir inyección SQL.
- Los mensajes de error no revelan datos internos.

## Seguridad de la aplicación

Capa implementada en `middlewares/seguridad.js`, `index.js` y `routes/usuarios.js`:

- **Cabeceras HTTP**: `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`,
  `Referrer-Policy: no-referrer`, `Permissions-Policy`, `Cross-Origin-*`, `Cache-Control: no-store`
  y `Strict-Transport-Security`. Se deshabilita `X-Powered-By`.
- **CORS restringido**: solo se aceptan orígenes locales (`localhost`/`127.0.0.1`),
  el archivo local (`null` de `file://`) y los que se indiquen en `CORS_ORIGINS`.
- **Límite de body**: `express.json({ limit: "100kb" })`.
- **Limitador por IP**: global (`LIMITE_GLOBAL`, por defecto 300 req/min) y más estricto
  para login/registro (`LIMITE_AUTH`, por defecto 30 req/min). Responde `429` con `Retry-After`.
- **Protección de fuerza bruta**: máximo 5 intentos fallidos por correo cada 15 minutos
  (tabla `intentos_login`); después se responde `429`.
- **Mensajes genéricos de login**: no se revela si el correo existe (evita enumeración de cuentas).
- **Timing constante**: si el correo no existe se compara igualmente contra un hash de relleno.
- **Recuperación de contraseña**: token aleatorio de 32 bytes, guardado solo como hash
  SHA-256 en `recuperacion_password`, con vencimiento (30 minutos por defecto) y un
  solo uso. Un pedido nuevo invalida los enlaces anteriores. Los endpoints tienen
  límites propios por IP (5 solicitudes y 10 restablecimientos cada 15 minutos).
  Al completar el cambio, el `UPDATE` reemplaza el hash bcrypt anterior; no se
  conserva la contraseña anterior ni un historial.
- **Auditoría**: eventos de login/registro/bloqueo y de recuperación de contraseña
  en `auditoria_seguridad`. Nunca se registra el token.

## Seguridad de la base de datos

Aplicada con `npm run db:seguridad`:

- **RLS habilitado** (`ENABLE ROW LEVEL SECURITY`) en todas las tablas.
- **Políticas** por tabla y revocación de privilegios a `anon` y `authenticated`
  (el frontend nunca habla directo con la base; solo pasa por la API).
- **UNIQUE sobre `lower(btrim(email))`**: impide cuentas duplicadas con distintas mayúsculas.
- **CHECK constraints**: formato y longitud de email/nombre, severidad de alertas,
  niveles válidos, `puntaje >= 0`, `paso_actual >= 0`, hash presente.
- **Tablas de seguridad**: `intentos_login`, `auditoria_seguridad` y
  `recuperacion_password` (esta última se crea con `db:migrate` y también queda
  protegida por RLS).
- **Trigger** que actualiza `actualizado_en` en `progreso_modulos`.

Verificá el estado con `npm run db:estado` (solo lectura).

### Recomendaciones en el panel de Supabase

Lo anterior se aplica por SQL. Además, conviene revisar en el panel de Supabase:

- **Rotar la contraseña de la base** (Settings → Database) si en algún momento se
  compartió por chat. Luego actualizar `DB_PASSWORD` en `.env`.
- **Network Restrictions** (Settings → Database): limitar las IP desde las que se
  puede conectar la base.
- **Auth / API Keys**: si no se usa el API REST de Supabase (este proyecto no lo usa),
  las claves `anon`/`service_role` no deberían publicarse ni incluirse en el frontend.

## Base de Datos (Supabase)

La base corre en **Supabase** (PostgreSQL gestionado). La configuración vive en
`.env` y **no se sube al repositorio** (`.env` está en `.gitignore`):

```env
DB_HOST=aws-0-us-east-1.pooler.supabase.com
DB_PORT=5432
DB_USER=postgres.wpsgmnmrvmhywnxrytyt
DB_PASSWORD=<password de Supabase>
DB_NAME=postgres
DB_SSL=true
```

También se puede usar la cadena completa en `DATABASE_URL`, que tiene prioridad:

```env
DATABASE_URL=postgresql://postgres.XXXXX:<password>@aws-0-us-east-1.pooler.supabase.com:5432/postgres
```

> Supabase exige SSL. `db.js` lo habilita por defecto con
> `ssl: { rejectUnauthorized: false }` porque el certificado del pooler no está
> en el almacén de confianzas de Node.

### Scripts de base de datos

| Comando | Descripción |
|---------|-------------|
| `npm run db:check` | Verifica la conexión con Supabase |
| `npm run db:estado` | Informe de solo lectura: rol, tablas, filas, duplicados y RLS |
| `npm run db:migrate` | Crea el esquema (solo DDL). **No carga contenido.** Es idempotente |
| `npm run db:seed` | Carga cursos y alertas **solo si las tablas están vacías** |
| `npm run db:seguridad` | Endurecimiento: RLS, políticas, auditoría, intentos de login, triggers e índices |

> ⚠️ **Importante**: `db:migrate` ya **no vuelve a insertar los datos de catálogo**.
> Los cursos y alertas se cargan únicamente con `db:seed`, y este solo inserta
> si la tabla correspondiente está vacía, por lo que **no se duplica contenido**
> aunque se ejecute varias veces.

| Tabla | Descripción |
|-------|-------------|
| `usuarios` | Usuarios con nombre, email, password_hash (bcrypt), nivel_digital |
| `cursos` | 5 módulos del Campus Educativo |
| `alertas_fraude` | 6 alertas con título, descripción, que_hacer, severidad |
| `inscripciones` | Relación usuario-curso |
| `test_nivelacion` | Resultados del test inicial (respuestas JSONB, nivel, puntaje) |
| `examenes` | Resultados del examen post-lección |
| `progreso_modulos` | Avance paso a paso en cada módulo |
| `intentos_login` | Intentos de acceso (email, IP, exito, fecha) para rate limiting |
| `auditoria_seguridad` | Eventos de seguridad: logins, registros, bloqueos, recuperación |
| `recuperacion_password` | Tokens de recuperación (solo hash SHA-256, vencimiento y uso) |

## Endpoints

| Método | Ruta | Descripción | Body requerido |
|--------|------|-------------|----------------|
| GET | `/` | Estado de la API | — |
| GET | `/api/usuarios` | Listar usuarios (sin correos salvo clave admin) | — |
| GET | `/api/usuarios/:id` | Obtener un usuario (sin correo salvo clave admin) | — |
| POST | `/api/usuarios/registrar` | Registrar usuario (bcrypt) | `{ nombre, email, password }` |
| POST | `/api/usuarios/login` | Iniciar sesión (compare bcrypt) | `{ email, password }` |
| POST | `/api/usuarios/recuperar-password` | Pedir enlace de recuperación (respuesta genérica) | `{ email }` |
| POST | `/api/usuarios/restablecer-password` | Cambiar la contraseña con un token de un solo uso | `{ token, passwordNueva }` |
| GET | `/api/usuarios/:id/progreso` | Progreso completo | — |
| GET | `/api/cursos` | Listar cursos activos | — |
| GET | `/api/cursos/:id` | Obtener un curso | — |
| GET | `/api/alertas` | Listar alertas de fraude | — |
| POST | `/api/progreso/test` | Guardar test nivelación | `{ usuarioId, respuestas, nivel, puntaje, totalPreguntas }` |
| POST | `/api/progreso/examen` | Guardar examen | `{ usuarioId, moduloId, respuestas, puntaje, totalPreguntas }` |
| POST | `/api/progreso/modulo` | Guardar progreso módulo | `{ usuarioId, moduloId, pasoActual, completado }` |
| GET | `/api/progreso/:usuarioId` | Obtener progreso | — |

> Para recibir los correos en los listados de usuarios hay que enviar la cabecera
> `x-api-key` con el valor de `ADMIN_KEY` del `.env`. Si `ADMIN_KEY` está vacía,
> los listados **nunca** devuelven correos (evita exponer datos personales).
> El login puede responder `429` cuando se superan los intentos fallidos permitidos.

## Recuperación de contraseña

El flujo es:

1. La persona toca **“¿Olvidaste tu contraseña?”** en la pantalla de login.
2. Ingresa su correo. La API responde siempre lo mismo, exista o no la cuenta
   (evita enumeración), y genera un token de un solo uso.
3. Si el correo existe, recibe un enlace a `FRONTEND_URL` con el token en
   `?reset=...`. Por correo viaja el token original; en la base solo queda su
   hash SHA-256.
4. El enlace abre la pantalla **“Crear una contraseña nueva”**. Al guardar, la
   API valida el token, reemplaza el hash bcrypt anterior en
   `usuarios.password_hash`, invalida el token y limpia los bloqueos por intentos
   fallidos. La contraseña anterior deja de funcionar.

> El cambio se aplica recién al guardar la contraseña nueva. Si la persona no
> completa el flujo, la contraseña anterior sigue funcionando hasta que el enlace
> venza o se solicite uno nuevo. Así se evita bloquear la cuenta por un pedido que
> no se llegó a completar.

### Configurar el envío por correo

Agregá estas variables a `server/.env` (los valores reales no se suben al repo):

```env
FRONTEND_URL=http://localhost:5500/code/index.html
RESET_TOKEN_MINUTOS=30

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=tu-cuenta@gmail.com
SMTP_PASS=tu-contraseña-de-aplicación
SMTP_FROM=TAMI <no-reply@tami.local>
```

- **Gmail**: no uses la contraseña normal de la cuenta; generá una
  **contraseña de aplicación** en la configuración de seguridad de Google.
- **Producción**: `FRONTEND_URL` debe ser la URL HTTPS real del frontend y
  `SMTP_*` debe apuntar a un proveedor transaccional (Brevo, Mailgun, SES, etc.).
- Si `SMTP_HOST` no está configurado, el servidor no puede enviar correos. El
  endpoint sigue respondiendo de forma genérica para no romper la seguridad.

### Probar sin SMTP (solo desarrollo local)

Con `RESET_DEBUG_LINK=true` la API devuelve además `resetUrl` y la interfaz
muestra un botón **“Abrir enlace de prueba”**. El enlace sirve para completar el
circuito en la máquina local:

```env
FRONTEND_URL=http://localhost:5500/code/index.html
RESET_DEBUG_LINK=true
```

> ⚠️ `RESET_DEBUG_LINK` está pensado únicamente para desarrollo. El servidor lo
> ignora cuando `NODE_ENV=production`. Nunca lo actives en un sitio publicado.

## Puesta en Marcha

1. **Instalar Node.js** (https://nodejs.org). No hace falta instalar PostgreSQL:
   la base vive en **Supabase**.

2. Configurar credenciales de Supabase:

   ```bash
   cp .env.example .env
   # Editar .env con el host, usuario y password de Supabase
   ```

3. Instalar dependencias:

   ```bash
   npm install
   ```

4. Verificar la conexión, crear esquema, cargar contenido y endurecer:

   ```bash
   npm run db:check
   npm run db:migrate
   npm run db:seed       # solo si las tablas están vacías
   npm run db:seguridad
   npm run db:estado
   ```

5. Levantar el servidor:

   ```bash
   npm start
   ```

   La API queda en `http://localhost:3000` y al arrancar imprime
   `[DB] Conectado a Supabase → ...` si la conexión fue exitosa.

> El frontend (`code/main.js`) intenta consumir la API y, si no está disponible, usa la caché de LocalStorage como fallback offline.
