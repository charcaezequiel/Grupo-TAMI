# Backend TAMI - Node.js + Express + PostgreSQL

Capa de **Datos** y servicios de la aplicación. Expone una **API REST** que el frontend consume con `fetch`.

## Stack

- **Node.js** + **Express** (servidor HTTP y enrutado).
- **PostgreSQL** (Supabase gestionado en la nube, conexión por pooler con SSL).
- **pg** (driver de PostgreSQL, consultas parametrizadas).
- **bcrypt** (hashing irreversible de contraseñas, costo 12).
- **nodemailer** (envío de correos para la recuperación de contraseña).
- **dotenv** (variables de entorno) y **cors** (permite que el frontend consuma la API).

## Estructura

```text
server/
├── index.js              Punto de entrada: app Express, headers de seguridad y rutas
├── db.js                 Pool de conexiones PostgreSQL + verificación
├── schema.sql            DDL: tablas, índices, constraints y RBAC (sin datos)
├── listar_cursos.js      Utilidad de consulta de cursos
├── scripts/
│   ├── migrate.js        Crea el esquema (npm run db:migrate)
│   ├── seed.js           Carga cursos y alertas solo si están vacías (npm run db:seed)
│   ├── seguridad.js      RLS, políticas, auditoría e intentos de login (npm run db:seguridad)
│   ├── estado.js         Informe de solo lectura (npm run db:estado)
│   ├── rbac-apply.js     Carga roles y permisos (npm run db:rbac)
│   ├── migrar-rbac-seguridad.js  Esquema + RBAC en un paso (npm run db:rbac:full)
│   └── rbac_seed.sql     Roles, permisos y asignaciones base
├── middlewares/
│   ├── seguridad.js      Cabeceras HTTP, limitador por IP y CORS restringido
│   └── rbac.js           Autenticación y autorización por rol/permiso
├── services/
│   └── email.js          Envío SMTP del enlace de recuperación
├── routes/
│   ├── usuarios.js       Registro, login, recuperación, perfil y progreso
│   ├── cursos.js         Listado de cursos
│   ├── alertas.js        Alertas de fraude (API heredada)
│   ├── progreso.js       Test, exámenes, avance y mini trabajos
│   └── admin.js          Dashboard, usuarios, roles y auditoría (RBAC)
├── .env                  Credenciales reales (no se sube al repositorio)
├── .env.example          Plantilla de configuración
└── package.json          Dependencias y scripts
```

## Seguridad de Contraseñas (bcrypt)

Se usa `bcrypt` en lugar de un hash rápido porque:

1. **SHA-256 es un hash rápido**, vulnerable a ataques de rainbow tables.
2. **bcrypt incorpora salt automático** por usuario y es resistente a fuerza bruta.
3. El **costo de 12 rondas** equilibra seguridad con rendimiento en hardware estándar.

```js
const passwordHash = await bcrypt.hash(password, COSTO_BCRYPT); // 12
const contrasenaValida = await bcrypt.compare(password, usuario.password_hash);
```

> El frontend guarda un hash SHA-256 **solo** como respaldo cuando funciona sin conexión. Con el servidor disponible se usa siempre bcrypt.

## Validación Estricta de Entradas

- **Email**: expresión regular `^[^\s@]+@[^\s@]+\.[^\s@]+$` validada en el servidor.
- **Nombre**: mínimo 2 caracteres y máximo 100 luego de `.trim()`.
- **Password**: mínimo 6 y máximo 72 caracteres (límite de bcrypt).
- **SQL**: siempre consultas parametrizadas (`$1`, `$2`) para prevenir inyección SQL.
- Los mensajes de error no revelan datos internos.

## Seguridad de la aplicación

Capa implementada en `middlewares/seguridad.js`, `middlewares/rbac.js`, `index.js` y `routes/usuarios.js`:

- **Cabeceras HTTP**: `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: no-referrer`, `Permissions-Policy`, `Cross-Origin-*`, `Cache-Control: no-store`, `Pragma`, `Expires` y `Strict-Transport-Security` en producción. Se deshabilita `X-Powered-By`.
- **CORS restringido**: solo se aceptan orígenes locales (`localhost`/`127.0.0.1`), el archivo local (`null` de `file://`) y los indicados en `CORS_ORIGINS`.
- **Límite de body**: `express.json({ limit: "100kb" })`.
- **Limitador por IP**: global (`LIMITE_GLOBAL`, 300 req/min por defecto) y más estricto para login/registro (`LIMITE_AUTH`, 30 req/min). Responde `429` con `Retry-After`.
- **Protección de fuerza bruta**: máximo 5 intentos fallidos por correo cada 15 minutos (tabla `intentos_login`); después se responde `429`.
- **Mensajes genéricos de login**: no se revela si el correo existe.
- **Timing constante**: si el correo no existe se compara igualmente contra un hash de relleno.
- **Recuperación de contraseña**: token aleatorio de 32 bytes, guardado solo como hash SHA-256 en `recuperacion_password`, con vencimiento (30 minutos por defecto) y un solo uso. Un pedido nuevo invalida los enlaces anteriores. Los endpoints tienen límites propios por IP (5 solicitudes y 10 restablecimientos cada 15 minutos).
- **Cambios sensibles**: cambiar correo o contraseña exige confirmar la contraseña actual.
- **Auditoría**: eventos de login, registro, bloqueo, recuperación y cambios sensibles en `auditoria_seguridad`. Nunca se registra el token.
- **RBAC**: las rutas `/api/admin/*` exigen un usuario activo con rol `superadmin`. La autorización se valida siempre en el backend.

> En esta versión educativa el panel administrativo identifica la sesión con la cabecera `x-usuario-id`. La evolución a JWT firmado con expiración está documentada como siguiente paso.

## Seguridad de la base de datos

Aplicada con `npm run db:seguridad`:

- **RLS habilitado** (`ENABLE ROW LEVEL SECURITY`) en todas las tablas.
- **Políticas** por tabla y revocación de privilegios a `anon` y `authenticated` (el frontend nunca habla directo con la base; solo pasa por la API).
- **UNIQUE sobre `lower(btrim(email))`**: impide cuentas duplicadas con distintas mayúsculas.
- **CHECK constraints**: formato y longitud de email/nombre, severidad de alertas, niveles válidos, `puntaje >= 0`, `paso_actual >= 0`, hash presente y preferencias válidas.
- **Tablas de seguridad**: `intentos_login`, `auditoria_seguridad` y `recuperacion_password`.
- **Trigger** que actualiza `actualizado_en` en `progreso_modulos` (los mini trabajos actualizan la fecha desde la API).

Verificá el estado con `npm run db:estado` (solo lectura).

### Recomendaciones en el panel de Supabase

- **Rotar la contraseña de la base** (Settings → Database) si en algún momento se compartió. Luego actualizar `DATABASE_URL` en `.env`.
- **Network Restrictions** (Settings → Database): limitar las IP desde las que se puede conectar la base.
- **Auth / API Keys**: si no se usa el API REST de Supabase, las claves `anon`/`service_role` no deben publicarse ni incluirse en el frontend.

## Base de Datos

La base corre en **PostgreSQL/Supabase**. La configuración vive en `.env` y **no se sube al repositorio**:

```env
DATABASE_URL=postgresql://usuario:password@host:5432/tami
```

También se aceptan las variables separadas `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` y `DB_SSL`; si existe `DATABASE_URL`, tiene prioridad.

> Supabase exige SSL. `db.js` lo habilita por defecto con
> `ssl: { rejectUnauthorized: false }` porque el certificado del pooler no está
> en el almacén de confianzas de Node.

### Tablas

| Tabla | Descripción |
|-------|-------------|
| `usuarios` | Nombre, email, `password_hash` (bcrypt), nivel digital, preferencias, rol, estado y último acceso |
| `cursos` | 5 cursos del Campus Educativo |
| `alertas_fraude` | Alertas de la API heredada |
| `inscripciones` | Relación usuario-curso |
| `test_nivelacion` | Resultados del test inicial (respuestas JSONB, nivel, puntaje) |
| `examenes` | Resultados de los repasos finales por nivel |
| `progreso_modulos` | Avance paso a paso por nivel |
| `mini_trabajos` | Tareas prácticas por usuario, módulo y nivel |
| `intentos_login` | Intentos de acceso (email, IP, éxito, fecha) para rate limiting |
| `auditoria_seguridad` | Eventos de seguridad: logins, registros, bloqueos, recuperación |
| `recuperacion_password` | Tokens de recuperación (solo hash SHA-256, vencimiento y uso) |
| `roles` | Roles: superadmin, editor, analista, moderador y usuario |
| `permissions` | Permisos por módulo y acción |
| `role_permissions` | Asignación de permisos a roles |

### Scripts de base de datos

| Comando | Descripción |
|---------|-------------|
| `npm run db:check` | Verifica la conexión con la base |
| `npm run db:estado` | Informe de solo lectura: rol, tablas, filas, duplicados y RLS |
| `npm run db:migrate` | Crea el esquema (solo DDL). **No carga contenido.** Es idempotente |
| `npm run db:seed` | Carga cursos y alertas **solo si las tablas están vacías** |
| `npm run db:seguridad` | Endurecimiento: RLS, políticas, auditoría, intentos de login y triggers |
| `npm run db:rbac` | Carga roles, permisos y asignaciones base |
| `npm run db:rbac:full` | Aplica `schema.sql` + `rbac_seed.sql` en un solo paso |

> ⚠️ **Importante**: `db:migrate` ya **no vuelve a insertar los datos de catálogo**.
> Los cursos y alertas se cargan únicamente con `db:seed`, y este solo inserta
> si la tabla correspondiente está vacía, por lo que **no se duplica contenido**
> aunque se ejecute varias veces.

## Endpoints

| Método | Ruta | Descripción | Body requerido |
|--------|------|-------------|----------------|
| GET | `/` | Estado de la API | — |
| GET | `/api/usuarios` | Listar usuarios (sin correos salvo `x-api-key`) | — |
| GET | `/api/usuarios/:id` | Obtener un usuario (sin correo salvo `x-api-key`) | — |
| POST | `/api/usuarios/registrar` | Registrar usuario (bcrypt) | `{ nombre, email, password }` |
| POST | `/api/usuarios/login` | Iniciar sesión (compare bcrypt) | `{ email, password }` |
| POST | `/api/usuarios/recuperar-password` | Pedir enlace de recuperación (respuesta genérica) | `{ email }` |
| POST | `/api/usuarios/restablecer-password` | Cambiar la contraseña con token de un solo uso | `{ token, passwordNueva }` |
| GET | `/api/usuarios/:id/progreso` | Progreso completo | — |
| PUT | `/api/usuarios/:id/perfil` | Actualizar nombre, nivel y preferencias | `{ nombre, nivel, tamanoFuente, tema, passwordActual }` |
| PUT | `/api/usuarios/:id/email` | Cambiar correo | `{ email, passwordActual }` |
| PUT | `/api/usuarios/:id/password` | Cambiar contraseña | `{ passwordActual, passwordNueva }` |
| GET | `/api/cursos` | Listar cursos activos | — |
| GET | `/api/cursos/:id` | Obtener un curso | — |
| GET | `/api/alertas` | Listar alertas de fraude heredadas | — |
| POST | `/api/progreso/test` | Guardar test de nivelación | `{ usuarioId, respuestas, nivel, puntaje, totalPreguntas }` |
| POST | `/api/progreso/examen` | Guardar repaso final | `{ usuarioId, moduloId, respuestas, puntaje, totalPreguntas }` |
| POST | `/api/progreso/modulo` | Guardar avance del nivel | `{ usuarioId, moduloId, pasoActual, completado }` |
| POST | `/api/progreso/mini-trabajo` | Guardar mini trabajo | `{ usuarioId, moduloId, nivel, completado }` |
| GET | `/api/progreso/:usuarioId` | Obtener progreso | — |
| GET | `/api/admin/dashboard` | Métricas del panel | — |
| GET | `/api/admin/usuarios` | Listado de usuarios con rol y estado | — |
| GET | `/api/admin/roles` | Listado de roles | — |
| GET | `/api/admin/auditoria?limite=50` | Últimos eventos de auditoría | — |
| PUT | `/api/admin/usuarios/:id/rol` | Asignar rol | `{ role_id }` |
| PUT | `/api/admin/usuarios/:id/estado` | Activar/desactivar cuenta | `{ is_active }` |

> Para recibir los correos en los listados de usuarios hay que enviar la cabecera
> `x-api-key` con el valor de `ADMIN_KEY` del `.env`. Si `ADMIN_KEY` está vacía,
> los listados **nunca** devuelven correos.
>
> Las rutas `/api/admin/*` requieren la cabecera `x-usuario-id` de una cuenta con
> rol `superadmin` y activa. El login puede responder `429` cuando se superan los
> intentos fallidos permitidos.

### Habilitar el primer superadmin

Después de registrarte, asigná el rol con SQL:

```sql
UPDATE usuarios
   SET role_id = (SELECT id FROM roles WHERE name = 'superadmin')
 WHERE lower(btrim(email)) = lower(btrim('tu-correo@ejemplo.com'));
```

## Recuperación de contraseña

El flujo es:

1. La persona toca **“¿Olvidaste tu contraseña?”** en la pantalla de login.
2. Ingresa su correo. La API responde siempre lo mismo, exista o no la cuenta (evita enumeración) y genera un token de un solo uso.
3. Si el correo existe, recibe un enlace a `FRONTEND_URL` con el token en `?reset=...`. Por correo viaja el token original; en la base solo queda su hash SHA-256.
4. El enlace abre la pantalla **“Crear una contraseña nueva”**. Al guardar, la API valida el token, reemplaza el hash bcrypt anterior en `usuarios.password_hash`, invalida el token y limpia los bloqueos por intentos fallidos. La contraseña anterior deja de funcionar.

> El cambio se aplica recién al guardar la contraseña nueva. Si la persona no completa el flujo, la contraseña anterior sigue funcionando hasta que el enlace venza o se solicite uno nuevo.

### Configurar el envío por correo

Agregá estas variables a `server/.env` (los valores reales no se suben al repo):

```env
FRONTEND_URL=http://localhost:5500/code/index.html
RESET_TOKEN_MINUTOS=30

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=tu_cuenta@gmail.com
SMTP_PASS=tu_contraseña_de_aplicacion
SMTP_FROM=TAMI <no-reply@tami.local>
```

- **Gmail**: no uses la contraseña normal de la cuenta; generá una **contraseña de aplicación**.
- **Producción**: `FRONTEND_URL` debe ser la URL HTTPS real del frontend y `SMTP_*` debe apuntar a un proveedor transaccional (Brevo, Mailgun, SES, etc.).
- Si `SMTP_HOST` no está configurado, el servidor no puede enviar correos. El endpoint sigue respondiendo de forma genérica para no romper la seguridad.

### Probar sin SMTP (solo desarrollo local)

Con `RESET_DEBUG_LINK=true` la API devuelve además `resetUrl` y la interfaz muestra un botón **“Abrir enlace de prueba”**:

```env
FRONTEND_URL=http://localhost:5500/code/index.html
RESET_DEBUG_LINK=true
```

> ⚠️ `RESET_DEBUG_LINK` está pensado únicamente para desarrollo. El servidor lo ignora cuando `NODE_ENV=production`.

## Puesta en Marcha

1. **Instalar Node.js v18 o superior** (recomendado v20+). No hace falta instalar PostgreSQL si usás Supabase.

2. Configurar el entorno:

   ```bash
   cp .env.example .env
   # Editar .env con DATABASE_URL, CORS_ORIGINS, SMTP y ADMIN_KEY
   ```

3. Instalar dependencias:

   ```bash
   npm install
   ```

4. Verificar la conexión, crear el esquema, cargar contenido, endurecer y aplicar RBAC:

   ```bash
   npm run db:check
   npm run db:migrate
   npm run db:seed       # solo si las tablas están vacías
   npm run db:seguridad
   npm run db:rbac
   npm run db:estado
   ```

   > También se puede usar `npm run db:rbac:full` para aplicar el esquema completo y el seed RBAC en un solo paso.

5. Levantar el servidor:

   ```bash
   npm start
   ```

   La API queda en `http://localhost:3000` y al arrancar imprime
   `[DB] Conectado a ...` si la conexión fue exitosa.

> El frontend (`code/main.js`) intenta consumir la API y, si no está disponible, usa LocalStorage como respaldo offline.
