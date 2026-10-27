# TP 32, 33 y 34: Seguridad, RBAC y Panel de Administración (Backoffice)

**Proyecto:** Grupo-TAMI  
**Fecha:** Octubre 2026  
**Objetivo:** Aplicar los pilares de seguridad CIA, el control de acceso basado en roles (RBAC) y el diseño del Backoffice con sus medidas de protección, tomando como referencia lo ya implementado en el código del proyecto.

---

## Índice

- [1. TP 32: Seguridad de un Proyecto (Confidencialidad, Integridad, Autenticidad)](#1-tp-32-seguridad-de-un-proyecto-confidencialidad-integridad-autenticidad)
- [2. TP 33: Separación de Vistas según el Rol y Control de Acceso Basado en Roles (RBAC)](#2-tp-33-separación-de-vistas-según-el-rol-y-control-de-acceso-basado-en-roles-rbac)
- [3. TP 34: Diseño del Panel de Administración (Backoffice)](#3-tp-34-diseño-del-panel-de-administración-backoffice)
- [4. Anexo: Implementación existente en Grupo-TAMI](#4-anexo-implementación-existente-en-grupo-tami)

---

## 1. TP 32: Seguridad de un Proyecto (Confidencialidad, Integridad, Autenticidad)

La seguridad de TAMI se basa en los tres pilares fundamentales del modelo **CIA** (Confidencialidad, Integridad, Autenticidad). 

### 1.1. Pilares Teóricos

| Pilar | Definición | Controles Aplicados en TAMI |
| :-- | :-- | :-- |
| **Confidencialidad** | Garantiza que la información sensible solo sea accesible por personas o sistemas autorizados. | Gestión de secretos con `.env`, `.env.example`, `process.env`, principio de menor privilegio, cifrado en tránsito (HTTPS/TLS) y en reposo. |
| **Integridad** | Asegura que los datos, el código fuente y los entregables se mantengan exactos, completos y sin modificaciones no autorizadas. | Control de versiones con trazabilidad, validaciones estrictas en servidor, transacciones atómicas (`BEGIN/COMMIT/ROLLBACK`), validación de esquemas con constraints en PostgreSQL. |
| **Autenticidad** | Verifica la identidad de usuarios, desarrolladores o servicios, evitando suplantación y garantizando el no repudio. | Autenticación con credenciales + hashing con `bcrypt`, recuperación de contraseña con tokens de un solo uso, auditoría de seguridad (`auditoria_seguridad`), rate limiting y registro de intentos de login. | 

### 1.2. Matriz de Evaluación de Seguridad (Aplicada a Grupo-TAMI)

| Pilar de Seguridad | Pregunta de Diagnóstico para el Proyecto | Estado Actual (Riesgo) | Medida Correctiva a Implementar / Estado |
| :-- | :-- | :-- | :-- |
| **Confidencialidad** | ¿Las credenciales de acceso, contraseñas o claves de API están expuestas en el código fuente o se gestionan de forma segura? | **Medio** | **Implementado parcialmente.** Se usan variables de entorno (`server/.env.example`), `.gitignore` para `.env`. Las contraseñas se almacenan con `bcrypt` (costo 12). **Pendiente:** Rotar claves si alguna vez fueron expuestas al historial de Git. |
| **Integridad** | ¿Existe algún mecanismo automático que impida que código sin revisión o alterado llegue a producción? | **Medio** | **A implementar.** Se recomienda proteger la rama `main` con *Pull Requests* obligatorios, al menos 1 revisión, *checks* de CI/CD y uso de *hooks* (`husky`) para validaciones locales. La integridad a nivel datos ya está garantizada con transacciones y constraints. |
| **Autenticidad** | ¿Cómo se identifican y registran las acciones que realiza cada usuario o servicio dentro del sistema? | **Bajo Riesgo (Implementado)** | **Implementado.** Autenticación con `bcrypt`, sistema de recuperación por correo con tokens hash SHA-256, rate limiting por IP/correo, tabla `intentos_login`, `auditoria_seguridad` con registro de acciones (`login_exitoso`, `login_fallido`, `recuperacion_solicitada`, etc.), y confirmación de contraseña para cambios sensibles en la cuenta. | 

---

## 2. TP 33: Separación de Vistas según el Rol y Control de Acceso Basado en Roles (RBAC)

TAMI aplica el principio de **defensa en profundidad**: se ocultan elementos en frontend para mejorar la experiencia, pero la autorización **siempre** se valida en el backend.

### 2.1. Estrategia de Implementación (Frontend vs Backend)

| Nivel | Responsabilidad | Implementación en TAMI |
| :-- | :-- | :-- |
| **Frontend** | Ocultar componentes, redirigir rutas no autorizadas y adaptar la interfaz según el rol/sesión. | Renderizado condicional según el usuario logueado, navegación adaptada, validación de sesión en cliente. (Se recomienda reforzar con *Route Guards*). |
| **Backend** | Validación real de tokens, verificación de permisos por endpoint, denegación con códigos HTTP correctos. | *Middlewares* de seguridad (`crearLimitador`), validación estricta de datos, verificación de contraseña actual para operaciones sensibles, protección con transacciones en operaciones críticas. | 

> **Regla de oro:** Ocultar un botón evita un clic, **validar en el servidor evita un ataque.**

### 2.2. Flujo de Control de Acceso

1. **Autenticación** - El usuario inicia sesión con `POST /api/usuarios/login`. Las credenciales se validan con `bcrypt.compare()`. Se aplican protecciones contra fuerza bruta.
2. **Emisión/Identificación** - Actualmente TAMI identifica usuarios por `id`. Se recomienda evolucionar a **JWT firmado** con payload que incluya `id`, `email` y `rol`. **Nunca** se debe confiar en el rol enviado desde el cliente.
3. **Autorización Frontend** - La interfaz muestra/oculta módulos según el estado de sesión. Se deben implementar *Route Guards* para prevenir acceso directo por URL.
4. **Validación Backend** - Cada endpoint protegido verifica autenticación, autorización y aplica validaciones. Se retorna `401 Unauthorized` si no hay sesión/token válido, `403 Forbidden` si está autenticado pero sin permisos.
5. **Auditoría** - Todas las acciones relevantes se registran en `auditoria_seguridad` con IP, usuario y detalle.

### 2.3. Roles Propuestos para TAMI

| Rol | Vistas Accesibles | Permisos | Notas |
| :-- | :-- | :-- | :-- |
| **SuperAdmin** | Backoffice completo, usuarios, roles, logs de auditoría, configuración global | CRUD total, asignación de roles, gestión de auditoría | Único rol con acceso a `auditoria_seguridad`. Requiere mayor protección (ideal 2FA). |
| **Editor/Gestor de Contenido** | Dashboard, Gestor de Contenido (Cursos, Alertas, materiales) | Crear, editar, publicar. Sin acceso a usuarios/roles/logs | Enfocado a la gestión educativa de TAMI. |
| **Analista de Datos** | Dashboard, reportes, estadísticas de usuarios/progreso | Solo lectura + exportación (CSV/Excel) | Sin permisos de creación/edición/eliminación. |
| **Moderador** | Contenido generado por usuarios, comentarios/solicitudes | Revisar, aprobar/rechazar | Permisos acotados al módulo de moderación. |
| **Usuario Final/Vecino/a** | Sitio público, perfil propio, mis cursos, progreso, configuración | Solo sus propios datos. Sin acceso al Backoffice | Acceso basado en `usuario_id` (Row-Level Access). | 

---

## 3. TP 34: Diseño del Panel de Administración (Backoffice)

### 3.1. Modelo de Permisos y Roles (RBAC)

Se recomienda implementar RBAC con posibilidad de evolucionar a permisos granulares. 

| Rol | Descripción | Alcance |
| :-- | :-- | :-- |
| **SuperAdmin** | Administrador principal del sistema | Configuración global, gestión de usuarios/roles, auditoría, acceso total. |
| **Editor/Gestor de Contenido** | Responsable del contenido educativo | CRUD de cursos, alertas de fraude, materiales, programación de publicaciones. |
| **Analista de Datos** | Análisis y métricas | Lectura de usuarios, progreso, exámenes, exportación. |
| **Moderador** | Control de calidad/contenido | Revisión y moderación de aportes/comentarios. |

### 3.2. Esquema de Base de Datos Propuesto (Usuarios, Roles, Permisos, Auditoría)

Para escalar desde el esquema actual, se propone agregar las siguientes tablas manteniendo compatibilidad con las ya existentes.

| Tabla | Campos Clave | Descripción |
| :-- | :-- | :-- |
| `roles` | `id SERIAL PK`, `name VARCHAR(50) UNIQUE NOT NULL`, `description TEXT`, `created_at TIMESTAMP DEFAULT NOW()` | Catálogo de roles del sistema. |
| `permisos` / `permissions` | `id SERIAL PK`, `code VARCHAR(100) UNIQUE NOT NULL`, `module VARCHAR(50) NOT NULL`, `action VARCHAR(50) NOT NULL`, `description TEXT` | Permisos granulares (ej: `usuarios.delete`, `contenidos.publish`). |
| `rol_permisos` / `role_permissions` | `role_id INT FK roles(id) ON DELETE CASCADE`, `permission_id INT FK permissions(id) ON DELETE CASCADE`, `PRIMARY KEY(role_id, permission_id)` | Relación muchos a muchos. |
| `usuarios` (ampliar) | Agregar `role_id INT FK roles(id)`, `is_active BOOLEAN DEFAULT TRUE`, `twofa_enabled BOOLEAN DEFAULT FALSE`, `last_login_at TIMESTAMP`, `failed_login_count INT DEFAULT 0` | Evolucionar el modelo actual añadiendo rol y estado de cuenta. |
| `audit_logs` / `auditoria_seguridad` (existente) | Ya implementada. Mantener como registro **inmutable** (sin UPDATE/DELETE). | Trazabilidad completa: quién, qué, cuándo, desde dónde. |

> **Nota:** TAMI ya cuenta con `auditoria_seguridad`, `intentos_login` y `recuperacion_password`. Estas tablas cubren gran parte de lo requerido para el Backoffice.

### 3.3. Estructura de la Interfaz del Backoffice

#### A. Autenticación y Acceso

| Elemento | Especificación | Estado |
| :-- | :-- | :-- |
| **Login Administrador** | Formulario con email/contraseña. Verificación de sesión. Renderizado condicional por rol. | A implementar (adaptado al sistema actual) |
| **2FA para roles administrativos** | Recomendado para `SuperAdmin`. | **Recomendado** (pendiente) |
| **Vista 403 Forbidden** | Mostrar al acceder por URL a sección no autorizada. | A implementar |
| **Recuperación de contraseña** | Flujo completo con email via SMTP/Gmail. | **Implementado** (ver Anexo) |

#### B. Módulos Principales

| Módulo | Funcionalidades | Permisos Requeridos | Prioridad |
| :-- | :-- | :-- | :-- |
| **Dashboard Principal** | Resumen de actividad, métricas (usuarios, cursos, exámenes), alertas del sistema. Vista personalizada por rol. | Todos los autenticados con acceso admin | **Alta** |
| **Gestor de Contenido (CMS)** | CRUD de cursos/módulos, alertas de fraude, subida de materiales. Editor de contenido. | `SuperAdmin`, `Editor/Gestor` | **Alta** |
| **Gestión de Datos** | Listados paginados, búsqueda/filtros, exportación CSV/Excel. Usuarios, inscripciones, progreso. | `SuperAdmin`, `Analista` | **Alta** |
| **Control de Usuarios y Roles** | Alta/baja, asignación de roles, activación/desactivación, reset de contraseña. | **Solo SuperAdmin** | **Alta** |
| **Logs de Auditoría** | Historial inmutable con filtros (usuario, acción, fecha, IP). Solo lectura. | **Solo SuperAdmin** | **Alta** |
| **Configuración del Sistema** | Parámetros, SMTP, límites de rate limiting, mantenimiento. | **Solo SuperAdmin** | **Media** |

### 3.4. Especificación Técnica Recomendada

| Componente | Recomendación | Notas |
| :-- | :-- | :-- |
| **Route Guards (Frontend)** | Implementar guards por ruta según rol/permisos. | Prevenir acceso directo por URL. |
| **Middleware RBAC (Backend)** | Crear `authMiddleware` (verifica sesión/token) y `roleMiddleware(roles[])` / `permissionMiddleware(codes[])`. | **Obligatorio**. Fuente única de verdad. |
| **Renderizado Condicional** | Ocultar/deshabilitar botones según permisos (`Eliminar`, `Asignar Rol`, `Exportar`). | Mejora UX y evita confusión. |
| **Tablas Interactivas** | Paginación server-side, búsqueda, ordenamiento, filtros avanzados. | Recomendado para grandes volúmenes. |
| **Errores Estandarizados** | Retornar `401` (no autenticado), `403` (sin permisos), mensajes claros sin filtrar info sensible. | Ya se aplica en parte en el código actual. |
| **Protección de Acciones Sensibles** | Requerir contraseña actual para cambio de email/password/nombre. | **Ya implementado** en `PUT /api/usuarios/:id/*`. |
| **Rate Limiting** | Aplicar a login, recuperación, restablecimiento. | **Ya implementado** con `crearLimitador`. |

### 3.5. Plan de Implementación Recomendado

| Orden | Tarea | Razón | Estado |
| :-- | :-- | :-- | :-- |
| **1.** | **Esquema de BD (Roles/Permisos)** | Base para autenticación/autorización. Ampliar esquema actual. | Pendiente (ampliar schema.sql) |
| **2.** | **Backend: Auth + Middleware RBAC** | Implementar guards, validación de roles/permisos, códigos 401/403. | Pendiente |
| **3.** | **Frontend: Login Admin + Route Guards + Menú condicional** | Acceso al Backoffice, protección de rutas, UI adaptada por rol. | Pendiente |
| **4.** | **Módulos del Backoffice** | Dashboard → Usuarios/Roles → CMS → Datos → Auditoría | Pendiente (incremental) |
| **5.** | **Hardening y Auditoría** | Revisar logs, 2FA, protección de rutas críticas, pruebas. | En progreso continuo |

**Recomendación:** Iniciar por el **punto 1** (esquema) y **punto 2** (middleware RBAC), reutilizando toda la infraestructura de seguridad ya existente en TAMI.

---

## 4. Anexo: Implementación existente en Grupo-TAMI

TAMI ya cuenta con un sólido sistema de seguridad implementado. A continuación se documenta lo que **ya está funcionando**.

### 4.1. Recuperación de Contraseña con Gmail/SMTP

**Archivos involucrados:**
- `server/services/email.js` - Servicio de envío con Nodemailer
- `server/routes/usuarios.js` - Endpoints de recuperación y restablecimiento
- `server/schema.sql` - Tabla `recuperacion_password`

**Características implementadas:**

| Aspecto | Implementación |
| :-- | :-- |
| **Proveedor** | SMTP configurable (compatible con Gmail, Outlook, Brevo, Mailgun, Amazon SES). |
| **Variables de entorno** | `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`, `FRONTEND_URL`, `RESET_TOKEN_MINUTOS`, `RESET_DEBUG_LINK`. |
| **Token seguro** | Generado con `crypto.randomBytes(32).toString("base64url")`. **Solo se guarda el hash SHA-256** en `recuperacion_password.token_hash`. |
| **Vigencia** | Configurable entre 5 y 120 minutos (default 30). Validado con `expira_en > NOW()`. |
| **Un solo uso** | Se marca `usado_en = NOW()` con `UPDATE ... WHERE usado_en IS NULL AND expira_en > NOW() RETURNING usuario_id`. Al usarlo se eliminan todos los tokens pendientes del usuario. |
| **Sin enumeración** | `POST /api/usuarios/recuperar-password` siempre responde con el mismo mensaje exista o no el correo. Se audita internamente. |
| **Rate limiting** | `limiteSolicitudRecuperacion` (5 por 15 min) y `limiteRestablecerPassword` (10 por 15 min). |
| **Plantilla de correo** | HTML + texto plano, con enlace completo, aviso de vigencia, uso único e instrucciones. |
| **Modo desarrollo** | Si SMTP no está configurado, se puede mostrar el enlace con `RESET_DEBUG_LINK=true` **únicamente fuera de producción**. |
| **Transaccional** | `restablecer-password` usa `BEGIN/COMMIT/ROLLBACK` para garantizar atomicidad. |

**Flujo completo:**

```text
1. POST /api/usuarios/recuperar-password { email }
   → Busca usuario (si no existe, responde mismo mensaje)
   → Genera token aleatorio, guarda hash, elimina tokens previos
   → Envía correo con enlace ?reset=<token> o lo muestra en debug
   → Audita evento

2. POST /api/usuarios/restablecer-password { token, passwordNueva }
   → Valida formato de token
   → UPDATE atómico: marca como usado solo si válido, no usado y no vencido
   → Hashea nueva contraseña con bcrypt (costo 12)
   → Actualiza password_hash, elimina tokens pendientes, limpia intentos fallidos
   → Audita y responde éxito
```

### 4.2. Otras Medidas de Seguridad Implementadas

| Medida | Ubicación | Descripción |
| :-- | :-- | :-- |
| **Hashing de contraseñas** | `routes/usuarios.js` | `bcrypt.hash()` con `COSTO_BCRYPT = 12`. Nunca se guarda texto plano. |
| **Protección contra timing** | `routes/usuarios.js` | Comparación con hash de relleno cuando el correo no existe. Comparación en tiempo constante para claves (`clavesIguales`). |
| **Rate limiting** | `middlewares/seguridad.js`, `routes/usuarios.js` | Limitadores para login/cambios/cuenta/recuperación/restablecimiento. |
| **Anti-fuerza bruta** | `routes/usuarios.js` | Bloqueo tras `MAX_INTENTOS_FALLIDOS` (5) en `VENTANA_BLOQUEO_MINUTOS` (15 min). Se limpia al login exitoso. |
| **Auditoría de seguridad** | `routes/usuarios.js` + `schema.sql` | Tabla `auditoria_seguridad` registra: `registro`, `login_exitoso`, `login_fallido`, `acceso_denegado`, `recuperacion_solicitada`, `recuperacion_completada`, `perfil_actualizado`, `email_actualizado`, `password_actualizado`, etc. |
| **Validación de cambios sensibles** | `routes/usuarios.js` | Para cambiar nombre, email o contraseña se requiere `passwordActual` válido. |
| **Transacciones atómicas** | `routes/usuarios.js` | Uso de `BEGIN/COMMIT/ROLLBACK` en restablecimiento de contraseña. |
| **Constraints en BD** | `schema.sql` | Validaciones de formato email, longitudes, rangos, valores permitidos. Índices únicos case-insensitive para emails. |
| **Limpieza automática** | `routes/usuarios.js` | Se eliminan tokens expirados, se purgan intentos antiguos (>30 días). |

### 4.3. Tablas de Seguridad en BD

| Tabla | Propósito |
| :-- | :-- |
| `intentos_login` | Registro de intentos (éxito/fallo, IP, motivo). Usado para bloqueo temporal. |
| `auditoria_seguridad` | Log inmutable de eventos críticos con usuario, acción, detalle, IP y fecha. |
| `recuperacion_password` | Tokens de recuperación con hash SHA-256, vigencia, estado de uso e IP. |

---

**Documento generado para Grupo-TAMI - Actividades Prácticas TP 32, 33 y 34.**  
*Listo para implementación del Backoffice con RBAC siguiendo el orden propuesto.*