# Pendientes de TAMI

> Estado al **2 de noviembre de 2026**. Este documento reúne todo lo que falta
> para publicar, verificar y entregar la plataforma. Los puntos ya resueltos se
> mencionan solo para evitar repetir trabajo.
>
> No incluye contraseñas ni claves: los secretos viven únicamente en
> `server/.env` (ignorado por git) o en el panel del proveedor de hosting.

---

## 1. Estado actual

### Terminado

- Rediseño visual formal: una sola paleta institucional, sin modo nocturno,
  sin temas alternativos y sin selectores de contraste.
- Textos y botones con tono formal; se conservaron tutoriales, tour guiado,
  demo del Escudo, preguntas frecuentes y contenido de los 5 cursos.
- Ilustración editorial nueva del inicio (`img/hero-ilustracion-formal.jpg`),
  optimizada para carga rápida.
- Eliminación de emojis decorativos y flechas de los botones.
- `npm run smoke`: **9/9 verificaciones correctas**.
- Service worker en `tami-v1.4.3`.
- Verificado en navegador: inicio, demo del Escudo, registro, login, panel de
  la persona usuaria, campus, curso y barra de accesibilidad.
- Corregido el aviso falso de “sin conexión” cuando una consulta lenta superaba
  el tiempo máximo pero el dispositivo seguía con internet.
- `.env` fuera de git e historial de git auditado: no se encontraron claves
  reales en los commits.

### Situación actual

- La plataforma funciona en **local** (`http://localhost:3000`). **Todavía no
  está publicada en internet.**
- Brevo rechaza el envío de correo con **error 525 (IP no autorizada)**,
  comprobado el 2 de noviembre de 2026. Mientras no se resuelva, la
  recuperación de contraseña no puede probarse de punta a punta.
- Queda una cuenta de prueba creada durante la verificación (ver sección 6).

---

## 2. Bloqueantes para publicar

Sin estos puntos no conviene entregar ni mostrar la plataforma en una demo
externa.

- [ ] **Publicar el servicio Node.js** en Render, Railway, Fly.io o un VPS con
      Nginx. Directorio raíz: `server`. Comando de inicio: `npm start`.
      Health check: `/api/salud`.
- [ ] **Configurar las variables de producción** en el proveedor:
      `NODE_ENV=production`, `DATABASE_URL`, `DB_SSL=true`, `JWT_SECRET` nuevo,
      `FRONTEND_URL` con `https://`, `CORS_ORIGINS` con el dominio exacto,
      `TRUST_PROXY=true`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`,
      `SMTP_USER`, `SMTP_PASS` y `SMTP_FROM`.
- [ ] **Preparar la base de producción**: ejecutar `npm run db:check`,
      `db:migrate`, `db:seguridad`, `db:rbac` y `db:estado`. Confirmar que no
      queden tablas sin RLS.
- [ ] **Habilitar Brevo**:
      - verificar el remitente de `SMTP_FROM`;
      - verificar el dominio si se usa un remitente propio (SPF/DKIM);
      - autorizar la IP de salida del hosting en
        *Transactional → Settings → Security → Authorized IPs* o desactivar
        temporalmente la restricción por IP;
      - probar “¿Olvidaste tu contraseña?” con una cuenta real y confirmar que
        el enlace vence a los 30 minutos y sirve una sola vez.
- [ ] **Promover el primer administrador**:
      `npm run admin:promover -- correo@ejemplo.com`.
- [ ] **Ajustar dominio y metadatos**: definir `og:url` y usar URLs absolutas
      en `og:image` y `twitter:image` del `code/index.html` para que las redes
      sociales muestren la vista previa.
- [ ] **Ejecutar el smoke contra producción**:
      `SMOKE_URL=https://tu-dominio npm run smoke` desde `server/`.
- [ ] **Comprobar cabeceras y HTTPS**: `/api/salud` responde `ok`, `/`
      devuelve `200`, HSTS activo y el certificado válido.

---

## 3. Verificación manual pendiente (QA)

Referencia completa: `docs/despliegue-y-verificacion.md`, sección 6.

### 3.1 Cuenta y privacidad

- [ ] Cerrar sesión y confirmar que se vuelve al inicio sin datos de la cuenta.
- [ ] Recuperar la contraseña de punta a punta (bloqueado por Brevo).
- [ ] Rechazar un enlace de recuperación vencido o ya usado.
- [ ] “Descargar mis datos” genera un archivo con perfil y progreso.
- [ ] “Eliminar mi cuenta” exige contraseña + `ELIMINAR` y borra la cuenta.
- [ ] La última cuenta `superadmin` no puede eliminarse.

### 3.2 Aprendizaje

- [ ] Completar el test inicial de 3 preguntas y verificar que define el nivel.
- [ ] Confirmar que los niveles se desbloquean en orden.
- [ ] Confirmar que el repaso final es obligatorio para avanzar.
- [ ] Recorrer “Seguí donde quedaste” y comprobar que abre el nivel correcto.
- [ ] Completar un curso y abrir e imprimir el certificado.
- [ ] Enviar una opinión de 1 a 5 estrellas con comentario.

### 3.3 Escudo de Seguridad

- [ ] Verificar que aparecen 15 retos mezclados (12 estafas y 3 legítimos).
- [ ] Probar la selección de estafa/confiable y el tipo de estafa.
- [ ] Revisar explicación, señales, consejo y puntaje final.

### 3.4 Offline y PWA

- [ ] Detener el servidor y comprobar que la interfaz abre desde caché.
- [ ] Verificar que el avance se guarda en el dispositivo.
- [ ] Volver a levantar el servidor y confirmar la sincronización automática.
- [ ] Instalar la PWA en Android, iPhone y escritorio.
- [ ] Publicar un cambio de frontend, subir `VERSION` en `code/sw.js` y
      confirmar que el navegador toma la versión nueva.

### 3.5 Backoffice y roles

- [ ] `superadmin`: métricas, usuarios, auditoría, ayuda y opiniones.
- [ ] `moderador` y `analista`: solo las secciones permitidas.
- [ ] Usuario común: recibe `403` en `/api/admin/*`.
- [ ] Cambiar el estado de una solicitud de ayuda y verlo reflejado.
- [ ] Confirmar que los roles sin permiso no ven correos ni datos sensibles.

### 3.6 Accesibilidad

- [ ] Recorrer toda la interfaz solo con teclado y comprobar el foco visible.
- [ ] Probar el enlace “Saltar al contenido principal”.
- [ ] Usar un lector de pantalla (NVDA o VoiceOver) en inicio, registro, login,
      campus y curso.
- [ ] Probar A−/A+, “Escuchar” y “Detener” en cada pantalla principal.
- [ ] Verificar zoom al 200 % sin pérdida de contenido.
- [ ] Revisar contraste AA en textos, bordes y botones.
- [ ] Comprobar la navegación con breadcrumbs y el botón “Volver”.

### 3.7 Responsive y navegadores

- [ ] Revisar en escritorio, tablet y celular.
- [ ] Probar en Chrome, Edge, Firefox y Safari.
- [ ] Confirmar que la barra de accesibilidad no tapa contenido al final de
      cada pantalla.
- [ ] Revisar el panel de administración en pantallas pequeñas.

---

## 4. Mejoras técnicas y deuda pendiente

Prioridad media; no bloquean la entrega, pero conviene dejarlas registradas.

- [ ] **Tests automatizados**: hoy solo existe el smoke test de lectura. Agregar
      pruebas de integración de la API con una base de prueba y pruebas de las
      funciones críticas del frontend (validación, progreso y sesión).
- [ ] **Integración continua**: crear un flujo en GitHub Actions que ejecute
      `npm run smoke` contra un servicio de prueba.
- [ ] **Rate limiting compartido**: el límite actual vive en memoria; si se
      usan varias instancias, migrar a Redis.
- [ ] **Sesión más robusta**: evaluar refresh token rotativo; hoy el JWT dura
      12 horas y existe `POST /api/usuarios/renovar`.
- [ ] **Doble factor para administración**: recomendado para `superadmin`.
- [ ] **Respaldo probado**: restaurar un `pg_dump` en una base de prueba y
      ejecutar `npm run db:estado` para confirmar que sirve.
- [ ] **Auditoría de rendimiento**: ejecutar Lighthouse y corregir lo que baje
      el puntaje de accesibilidad o rendimiento.
- [ ] **Monitoreo**: definir dónde se revisan los logs y quién recibe avisos
      cuando falla la base o el correo.
- [ ] **Limpieza menor**: borrar `img/hero-ilustracion.svg` (ya no se usa) y
      eliminar de los dispositivos la clave vieja `tami:accesibilidad` que
      conserva un campo `contraste` sin efecto. Ambas tareas son opcionales y
      de bajo riesgo.

---

## 5. Contenido y experiencia

- [ ] **Prueba de usabilidad con personas mayores** (5 a 8 participantes):
      registro, recorrido de un nivel, Escudo y recuperación de contraseña.
      Registrar hallazgos y ajustar textos o tamaños.
- [ ] **Revisión final de contenidos**: leer las 20 lecciones y los 15 retos
      completos para confirmar claridad, tono formal y ausencia de errores.
- [ ] **Revisar el certificado**: nombre, curso, fecha y texto impreso.
- [ ] **Revisar el panel de administración** con una persona que no haya
      participado del desarrollo.
- [ ] **Actualizar capturas o material de difusión** si se usan en la entrega.

---

## 6. Datos de prueba a eliminar

- [ ] Eliminar la cuenta **“Verificación Formal”**
      (`verificacion.formal.20261102@tami.test`, id 15), creada el 2 de
      noviembre de 2026 para probar el rediseño. Se puede borrar desde el panel
      de administración o desde la propia cuenta.
- [ ] Revisar que no queden solicitudes de ayuda, opiniones ni progresos de
      prueba asociados a esa cuenta.

---

## 7. Seguridad y secretos

- [ ] Rotar la clave SMTP de Brevo y la contraseña de la base si alguna vez se
      compartieron fuera de `server/.env`.
- [ ] Generar un `JWT_SECRET` nuevo para producción.
- [ ] Confirmar que el proveedor de hosting cargue las variables como secretos
      y no como texto plano en el repositorio.
- [ ] No subir nunca `server/.env` ni capturas con claves visibles.
- [ ] Revisar `auditoria_seguridad` después de las primeras semanas en
      producción.

---

## 8. Orden sugerido para resolverlo

1. Resolver el acceso de Brevo (autorizar IP y probar recuperación).
2. Publicar el servicio y configurar variables de producción.
3. Ejecutar migraciones, seguridad y RBAC en la base definitiva.
4. Promover el administrador y borrar la cuenta de prueba.
5. Ejecutar el smoke contra la URL pública.
6. Completar la verificación manual (sección 3).
7. Hacer la prueba con personas mayores y ajustar contenidos.
8. Recién después, difundir el enlace de la plataforma.

---

## 9. Comandos de referencia

```bash
# Desde server/
npm install
npm run db:check
npm run db:migrate
npm run db:seed
npm run db:seguridad
npm run db:rbac
npm run db:estado
npm run admin:promover -- correo@ejemplo.com

# Verificación local
npm run smoke

# Verificación contra producción
SMOKE_URL=https://tu-dominio npm run smoke
```

Para publicar cambios de frontend, subir siempre `VERSION` en
`code/sw.js` antes de desplegar.
