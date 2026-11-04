# Operación, respaldos y respuesta a incidentes

Guía para mantener TAMI funcionando después de publicarlo. No contiene
credenciales: los secretos viven en `server/.env` o en el panel del proveedor.

---

## 1. Servicio en producción

TAMI es un único servicio Node.js:

- Express sirve el frontend en `/` y las imágenes en `/img`.
- La API responde en `/api/*`.
- La base de datos es PostgreSQL en Supabase (SSL obligatorio).
- El correo de recuperación sale por SMTP de Brevo.

| Recurso | Dónde se revisa |
|---------|-----------------|
| Proceso y reinicios | Panel de Render → Logs y Events |
| Estado de la API y la base | `GET /api/salud` |
| Errores de la aplicación | Logs de Render (buscar `Error`, `[RBAC]`, `[CORS]`) |
| Envío de correo | Logs de Render y panel de Brevo → Transactional → Logs |
| Base de datos | Panel de Supabase → Database y Logs |

### Verificación mínima después de cada despliegue

1. `GET /api/salud` devuelve `{"estado":"ok","baseDeDatos":"ok"}`.
2. La portada carga y el service worker se actualiza a la versión nueva.
3. Un inicio de sesión de prueba funciona.
4. `SMOKE_URL=https://<dominio> npm run smoke` devuelve **9/9**.

---

## 2. Monitoreo

### 2.1 Disponibilidad

Configurar un monitor externo (UptimeRobot, Better Stack o similar) con:

- URL: `https://<dominio>/api/salud`
- Frecuencia: cada 5 minutos
- Éxito: HTTP 200 y cuerpo con `"baseDeDatos":"ok"`
- Alerta: correo al equipo después de **2 fallos consecutivos**

El endpoint consulta la base, así que un fallo puede significar caída del
servicio o de Supabase. Revisar ambos paneles antes de reiniciar.

### 2.2 Señales a vigilar en los logs

| Señal | Posible causa | Acción |
|-------|---------------|--------|
| `Error interno del servidor` repetido | Falla de consulta o de conexión | Revisar Supabase y el pool |
| `[CORS] Origen rechazado` masivo | Escaneo o configuración incorrecta | Confirmar `CORS_ORIGINS` |
| `429` frecuentes en login | Ataque de fuerza bruta o muchos usuarios detrás de una IP | Revisar `intentos_login` y el proxy |
| `[SMTP]` o error 525 | Brevo bloqueó el envío | Revisar IP autorizada y remitente |
| Reinicios seguidos del servicio | Falta de memoria o excepción no capturada | Revisar logs y límites del plan |

### 2.3 Métricas de producto

El panel `/admin.html` muestra usuarios, cursos, alertas y auditoría de las
últimas 24 horas. Las solicitudes de ayuda y las opiniones se revisan en las
secciones correspondientes. Exportar un resumen una vez por semana.

---

## 3. Respaldos

### 3.1 Crear un respaldo

Requiere las herramientas de PostgreSQL (`pg_dump`) instaladas en la máquina
donde se ejecuta el comando.

```bash
cd server
npm run db:respaldo           # datos + estructura
npm run db:respaldo:esquema   # solo estructura
```

Los archivos se guardan en `server/backups/`, que está ignorado por git. El
nombre incluye fecha y hora. Guardar una copia fuera del equipo (almacenamiento
del colegio o nube institucional), nunca en el repositorio.

### 3.2 Frecuencia recomendada

| Momento | Respaldo |
|---------|----------|
| Antes de una migración | Completo, obligatorio |
| Antes de cargar contenido masivo | Completo |
| Semanal | Completo |
| Antes de cada entrega o demo | Completo |

Conservar al menos los últimos **4 respaldos semanales**.

### 3.3 Probar la restauración

Nunca restaurar sobre la base de producción. Crear una base de prueba en
Supabase o en un PostgreSQL local y ejecutar:

```bash
psql "postgresql://<usuario>:<clave>@<host>:5432/<base_de_prueba>" \
  -f server/backups/tami-AAAAAMMDD-HHMMSS.sql
```

Después, contra la base de prueba:

```bash
cd server
DATABASE_URL="postgresql://.../<base_de_prueba>" npm run db:estado
```

La restauración se considera válida si `db:estado` lista las tablas, los roles y
los cursos sin errores. Registrar la fecha de la prueba en la sección 8.

---

## 4. Rotación de secretos

Rotar un secreto invalida sesiones o integraciones. Hacerlo en una ventana
acordada, nunca en medio de una demo.

| Secreto | Dónde se cambia | Efecto |
|---------|-----------------|--------|
| `JWT_SECRET` | Panel de Render | Cierra todas las sesiones activas |
| `ADMIN_KEY` | Panel de Render | Invalida la clave administrativa anterior |
| Contraseña de Supabase | Panel de Supabase | Hay que actualizar `DATABASE_URL` y reiniciar |
| Clave SMTP de Brevo | Panel de Brevo | Hay que actualizar `SMTP_PASS` y reiniciar |
| `DATABASE_URL` | Panel de Render | Reinicio del servicio |

### Procedimiento

1. Anunciar la ventana y el motivo.
2. Generar el valor nuevo con un generador seguro.
3. Actualizar el panel del proveedor y `server/.env` local.
4. Reiniciar el servicio y verificar `/api/salud` y un inicio de sesión.
5. Revocar el valor anterior en el proveedor.
6. Registrar fecha y responsable en la sección 8.

No pegar secretos en issues, capturas, documentos ni mensajes. Si un secreto
quedó expuesto, rotarlo es obligatorio aunque el repositorio sea privado.

---

## 5. Límites de solicitudes

Hoy el límite vive en memoria del proceso (`server/middlewares/seguridad.js`).
Es suficiente para **una sola instancia** de Render, que es el despliegue
actual. Si en el futuro se ejecutan varias instancias o se escala
horizontalmente, cada instancia tendría su propio contador y el límite real se
multiplicaría.

En ese caso:

1. Contratar un Redis administrado.
2. Reemplazar el `Map` en memoria por un contador con expiración en Redis.
3. Probar que dos instancias compartan el cupo antes de publicar.

No se implementó Redis ahora porque no hay servicio contratado y agregarlo sin
probarlo daría una falsa sensación de protección.

---

## 6. Doble factor para administración

La tabla `usuarios` tiene la columna `twofa_enabled`, pero **el doble factor no
está implementado**. El panel solo muestra si está activo.

Antes de habilitar el backoffice en un entorno público con datos reales:

1. Definir una aplicación autenticadora (Google Authenticator, Authy o similar).
2. Agregar una columna `twofa_secret` cifrada o protegida.
3. Implementar el alta del secreto y la verificación TOTP en el inicio de
   sesión de `superadmin`.
4. Probar con una cuenta de prueba y con la cuenta real antes de exigirlo.
5. Prever códigos de recuperación para no dejar fuera al único administrador.

No se implementó en esta entrega para no bloquear el acceso del único
`superadmin` sin una cuenta de prueba y una migración verificada.

---

## 7. Respuesta a incidentes

### 7.1 La API no responde

1. Revisar el monitor y el panel de Render.
2. Confirmar si Supabase está disponible.
3. Si el proceso se reinició solo, revisar el log previo al reinicio.
4. Reiniciar el servicio desde Render si corresponde.
5. Verificar `/api/salud` y `npm run smoke`.

### 7.2 No llegan correos de recuperación

1. Revisar Brevo → Transactional → Logs.
2. Confirmar que la IP de salida está autorizada o que la restricción está
   desactivada.
3. Confirmar que `SMTP_FROM` es un remitente verificado.
4. Probar con una cuenta real y revisar spam.
5. Mientras tanto, restablecer la contraseña desde el panel de administración
   solo si existe un procedimiento interno aprobado.

### 7.3 Sospecha de cuenta comprometida

1. Desactivar la cuenta desde el backoffice.
2. Rotar `JWT_SECRET` para cerrar todas las sesiones.
3. Revisar `auditoria_seguridad` e `intentos_login`.
4. Cambiar la contraseña y reactivar con una contraseña nueva.
5. Informar a la persona afectada y registrar el incidente.

### 7.4 Error después de un despliegue

1. Identificar el commit desplegado.
2. Volver a la versión anterior desde Render (Rollback).
3. Verificar `/api/salud` y el smoke test.
4. Corregir en una rama y volver a desplegar.

---

## 8. Registro de operaciones

| Fecha | Acción | Responsable | Resultado |
|-------|--------|-------------|-----------|
| | | | |
| | | | |
| | | | |

---

## 9. Lista previa a la entrega pública

- [ ] Servicio publicado con HTTPS y variables de producción.
- [ ] `/api/salud` monitoreado cada 5 minutos con alerta por correo.
- [ ] Respaldo completo creado y restauración probada en una base de prueba.
- [ ] `npm test` y `npm run smoke` en verde.
- [ ] Correo de recuperación probado de punta a punta.
- [ ] Secretos rotados si alguno estuvo expuesto.
- [ ] Responsable de revisar logs y alertas definido.
- [ ] Procedimiento de incidentes conocido por el equipo.
