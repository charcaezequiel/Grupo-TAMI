# Despliegue y verificación de TAMI

Guía para publicar TAMI en producción, configurar el correo, respaldar la base
y verificar que todo funcione antes de entregar. No incluye credenciales: los
secretos viven únicamente en `server/.env` (ignorado por git) o en el panel de
variables del proveedor.

---

## 1. Arquitectura de producción

TAMI se despliega como **un solo servicio Node.js**:

- Express sirve el frontend (`code/`) en `/` y las imágenes (`img/`) en `/img`.
- La API responde en `/api/*`.
- La base de datos es **PostgreSQL en Supabase** (pooler, SSL obligatorio).
- El correo de recuperación se envía por **SMTP de Brevo**.

```text
Navegador  ──HTTPS──►  Servicio Node (Express)
                         ├── /        → code/index.html, main.js, styles.css…
                         ├── /img     → imágenes y logos
                         ├── /api     → API REST (JWT)
                         ├── /admin.html → backoffice
                         ├── PostgreSQL (Supabase, SSL)
                         └── SMTP (Brevo) → correo de recuperación
```

No hace falta publicar la carpeta `server/` como estático ni abrir la base a
Internet: el frontend nunca habla directo con Supabase.

---

## 2. Variables de entorno

Configurá estas variables en el proveedor (o en `server/.env` en un servidor
propio). Los valores reales **no se documentan ni se suben al repositorio**.

| Variable | Obligatoria | Ejemplo / uso |
|----------|-------------|----------------|
| `PORT` | Sí | `3000` (el proveedor puede inyectarlo) |
| `NODE_ENV` | Sí | `production` |
| `DATABASE_URL` | Sí | Cadena del pooler de Supabase con SSL |
| `DB_SSL` | Sí | `true` en Supabase |
| `JWT_SECRET` | Sí | Clave aleatoria larga (48+ bytes) |
| `JWT_DURACION_MINUTOS` | No | `720` (12 h) |
| `CORS_ORIGINS` | Recomendada | Dominio público exacto, separado por comas |
| `TRUST_PROXY` | Recomendada | `true` detrás de Render/Railway/Nginx |
| `FRONTEND_URL` | Sí | `https://tu-dominio/` (para el enlace de recuperación) |
| `SMTP_HOST` | Sí | `smtp-relay.brevo.com` |
| `SMTP_PORT` | Sí | `587` |
| `SMTP_SECURE` | Sí | `false` (STARTTLS en 587) |
| `SMTP_USER` | Sí | Usuario SMTP de Brevo |
| `SMTP_PASS` | Sí | Clave SMTP de Brevo |
| `SMTP_FROM` | Sí | `TAMI <remitente-verificado>` |
| `RESET_TOKEN_MINUTOS` | No | `30` |
| `RESET_DEBUG_LINK` | No | `false` en producción (el servidor lo ignora si `NODE_ENV=production`) |
| `ADMIN_KEY` | No | Clave de emergencia para endpoints administrativos |
| `LIMITE_GLOBAL`, `LIMITE_AUTH`, … | No | Límites de solicitudes por IP |

Generar una clave JWT nueva:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

---

## 3. Publicación paso a paso

### 3.1 Preparar Supabase

1. Crear el proyecto y copiar la cadena **Connection string → Pooler**.
2. Reemplazar `[YOUR-PASSWORD]` por la contraseña real de la base.
3. Verificar que `DB_SSL=true`.
4. En **Database → Network Restrictions**, si se activa la restricción por IP,
   agregar la IP de salida del servicio. Para un primer despliegue se puede
   dejar abierto y restringir después de comprobar la conexión.

### 3.2 Preparar el repositorio

```bash
cd server
cp .env.example .env
npm install
npm run db:check
npm run db:migrate
npm run db:seed        # solo carga catálogo si las tablas están vacías
npm run db:seguridad
npm run db:rbac
npm run db:estado
```

### 3.3 Promover el primer administrador

Después de registrarte en la web:

```bash
npm run admin:promover -- tu-correo@ejemplo.com
```

El script asigna el rol `superadmin` sin escribir SQL a mano. También sirve
para promover moderadores o analistas editando el script o el rol en la base.

### 3.4 Desplegar el servicio Node

Opciones habituales:

- **Render / Railway / Fly.io**: repositorio, `root directory = server`,
  comando `npm start`, health check `/api/salud`.
- **VPS con Nginx**: `pm2 start index.js --name tami`, proxy a `localhost:3000`
  y certificado HTTPS (Let’s Encrypt).

El servidor imprime al arrancar:

```text
[DB] Conectado a Supabase → ...
Frontend: https://tu-dominio/  ·  Panel: https://tu-dominio/admin.html
```

### 3.5 Verificar el despliegue

```bash
curl https://tu-dominio/api/salud
# {"estado":"ok","baseDeDatos":"ok","hora":"..."}

curl -I https://tu-dominio/
# 200 + cabeceras de seguridad (nosniff, DENY, HSTS…)

curl -I https://tu-dominio/manifest.json
curl -I https://tu-dominio/sw.js
```

Abrir `https://tu-dominio/` y `https://tu-dominio/admin.html`, completar el
recorrido de la sección 6 y ejecutar `npm run smoke` desde `server/`.

---

## 4. Correo con Brevo

### 4.1 Configuración

- Host: `smtp-relay.brevo.com`
- Puerto: `587` con STARTTLS (`SMTP_SECURE=false`)
- Usuario: el login SMTP que muestra Brevo
- Clave: la **SMTP key** (no la contraseña de la cuenta)

En Brevo deben estar verificados:

1. El **remitente** de `SMTP_FROM`.
2. El **dominio** si se usa un remitente propio (registros DKIM/SPF).

### 4.2 Error 525 / “Unauthorized IP address”

Brevo puede bloquear el envío cuando la IP del servidor no está autorizada:

```text
Error: Can't send mail - 525 Unauthorized IP address
```

Solución:

1. En Brevo, ir a **Transactional → Settings → Security → Authorized IPs**.
2. Agregar la IP de salida del servicio (la muestra el proveedor de hosting).
3. Si el hosting usa IPs dinámicas (por ejemplo, algunos planes de Render),
   desactivar temporalmente la restricción por IP y proteger la SMTP key.
4. Reiniciar el servicio y probar **¿Olvidaste tu contraseña?** con una cuenta real.

El remitente debe estar verificado; si no, Brevo responde con un error de
remitente no autorizado. En producción usar `FRONTEND_URL` con `https://`.

### 4.3 Comprobar sin enviar correo

Logs del servidor: cada envío fallido registra el motivo sin exponer la clave.
Nunca activar `RESET_DEBUG_LINK` en producción.

---

## 5. Respaldos y recuperación

### 5.1 Respaldos automáticos

- Supabase realiza respaldos diarios según el plan contratado.
- Verificar en **Database → Backups** que exista al menos uno y que la
  retención alcance el período de entrega del proyecto.
- Antes de una migración o demo importante, crear un respaldo manual.

### 5.2 Respaldo manual con `pg_dump`

```bash
pg_dump "$DATABASE_URL" --no-owner --no-privileges --format=custom \
  --file=tami-$(date +%Y%m%d).dump
```

Para restaurar en una base de prueba:

```bash
pg_restore --clean --if-exists --no-owner --dbname="$DATABASE_URL_PRUEBA" tami-YYYYMMDD.dump
```

Comprobar el respaldo restaurándolo en un proyecto de prueba y ejecutando
`npm run db:estado`. Un respaldo que nunca se restauró no es un respaldo
confiable.

### 5.3 Qué contienen los datos

| Dato | Tabla | Sensibilidad |
|------|-------|--------------|
| Cuenta y preferencias | `usuarios` | Alta (email, hash bcrypt) |
| Consentimiento | `usuarios.consentimiento_en` | Alta (Ley 25.326) |
| Progreso, test y exámenes | `progreso_modulos`, `test_nivelacion`, `examenes` | Media |
| Mini trabajos | `mini_trabajos` | Media |
| Solicitudes de ayuda | `solicitudes_ayuda` | Alta (mensaje libre) |
| Opiniones | `feedback_experiencia` | Media |
| Auditoría | `auditoria_seguridad` | Alta (eventos e IP) |
| Tokens de recuperación | `recuperacion_password` | Alta (solo hash) |

Los respaldos deben tratarse como datos personales: acceso restringido,
cifrado en reposo y eliminación cuando ya no sean necesarios.

### 5.4 Rotación de secretos

Si se filtra una SMTP key, la contraseña de la base o `JWT_SECRET`:

1. Rotar el secreto en Supabase/Brevo.
2. Actualizar la variable en el proveedor.
3. Reiniciar el servicio.
4. Invalidar sesiones cambiando `JWT_SECRET` (todas las personas vuelven a iniciar sesión).
5. Revisar `auditoria_seguridad` por accesos anómalos.

---

## 6. Verificación funcional (QA)

Marcar cada punto antes de la entrega o demo.

### 6.1 Público y accesibilidad

- [ ] El inicio muestra en orden: Qué querés transmitir, problema, Cómo funciona,
      demo del Escudo, Lecciones, Impacto, Preguntas frecuentes y llamada final.
- [ ] Los botones del menú público llevan a cada sección (Inicio, Qué es,
      Cómo funciona, Lecciones, Impacto, Preguntas).
- [ ] La demo del Escudo permite responder 3 casos, muestra explicación y señales,
      y termina con puntaje y opción de volver a probar.
- [ ] “Creá tu cuenta gratis” lleva al registro.
- [ ] Las preguntas frecuentes abren y cierran con teclado; el enlace de
      privacidad abre la pantalla legal correcta.
- [ ] A−/A+ cambian el tamaño, el alto contraste se mantiene legible y
      “Escuchar” lee la pantalla.
- [ ] Con teclado se llega a todo y el foco siempre es visible.

### 6.2 Registro, sesión y privacidad

- [ ] El registro exige aceptar términos y muestra el enlace a la política.
- [ ] El login devuelve sesión y el cierre de sesión vuelve al inicio.
- [ ] Recuperación de contraseña envía correo (probar con Brevo) y el enlace
      vence a los 30 minutos y sirve una sola vez.
- [ ] “Descargar mis datos” genera el archivo con perfil y progreso.
- [ ] “Eliminar mi cuenta” pide contraseña + `ELIMINAR` y borra la cuenta.
- [ ] La última cuenta `superadmin` no puede eliminarse.

### 6.3 Campus y aprendizaje

- [ ] El test inicial de 3 preguntas se guarda y define el nivel.
- [ ] La tarjeta “Seguí donde quedaste” abre el primer nivel pendiente.
- [ ] Los niveles se desbloquean en orden y el repaso final es obligatorio.
- [ ] El camino de aprendizaje muestra 4 niveles y el progreso por curso.
- [ ] Al completar un curso se puede abrir e imprimir el certificado.
- [ ] El widget de opinión guarda 1–5 estrellas y comentario.

### 6.4 Escudo

- [ ] Hay 15 retos (12 estafas, 3 legítimos), mezclados en cada partida.
- [ ] Se debe elegir estafa/confiable y, si es estafa, el tipo.
- [ ] Se muestran explicación, señales y consejo; el puntaje final es correcto.

### 6.5 Offline y PWA

- [ ] El manifest carga y la app se puede instalar (HTTPS o localhost).
- [ ] Con el servidor caído, la interfaz abre desde caché y guarda avance local.
- [ ] Al volver la conexión, el avance se sincroniza.
- [ ] Al publicar cambios se incrementó `VERSION` en `code/sw.js`.

### 6.6 Backoffice

- [ ] `superadmin` ve métricas, usuarios, auditoría, ayuda y opiniones.
- [ ] `moderador` y `analista` ven solo las secciones permitidas y pueden
      atender/consultar solicitudes de ayuda.
- [ ] Un usuario común recibe `403` en `/api/admin/*`.
- [ ] Cambiar el estado de un usuario se refleja al instante.
- [ ] El panel no muestra datos sensibles en pantalla para roles sin permiso.

### 6.7 Seguridad

- [ ] Las rutas privadas responden `401` sin token y `403` con rol insuficiente.
- [ ] El token no se acepta desde `localStorage` de otro usuario ni desde la URL.
- [ ] Las contraseñas se guardan solo como hash bcrypt.
- [ ] Los listados administrativos no exponen correos a roles no autorizados.
- [ ] `npm run smoke` termina sin fallas.

---

## 7. Smoke test automático

Con el servidor levantado:

```bash
cd server
npm run smoke
```

El script verifica, sin crear datos:

1. `GET /api/salud` responde `200` y la base está conectada.
2. `GET /` responde `200` y contiene “TAMI”.
3. `GET /manifest.json` y `GET /sw.js` responden `200`.
4. `GET /api/cursos` responde `200` con los 5 cursos.
5. `GET /api/admin/dashboard` sin token responde `401`.
6. `GET /api/ayuda` sin token responde `401`.
7. `POST /api/usuarios/login` con credenciales inválidas responde `401`.
8. `POST /api/feedback` sin token responde `401`.

Si alguna verificación falla, el comando termina con código distinto de cero.

---

## 8. Limitaciones conocidas

- **Sesión JWT de 12 h** sin refresh token rotativo: al vencer, la persona
  vuelve a iniciar sesión. `POST /api/usuarios/renovar` permite extenderla
  mientras la sesión siga activa.
- **Rate limiting en memoria**: si se escalan varias instancias, cada una
  cuenta por separado. Para más de una instancia usar un almacén compartido
  (Redis).
- **Caché del service worker**: cambios de frontend requieren subir `VERSION`
  en `code/sw.js`; si no, algunos navegadores siguen mostrando la versión vieja.
- **Metadatos Open Graph**: en producción `og:image` y `og:url` deben ser URLs
  absolutas (`https://tu-dominio/img/og-image.png`). Con rutas relativas las
  redes sociales no muestran la vista previa.
- **Modo offline educativo**: el respaldo local de contraseñas usa SHA-256 solo
  para permitir la demo sin servidor; en producción la autenticación real es
  siempre bcrypt + JWT.
