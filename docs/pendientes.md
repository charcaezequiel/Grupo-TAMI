# Pendientes de TAMI

> Estado al **4 de noviembre de 2026**. Este documento reúne todo lo que falta
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
- Service worker en `tami-v1.4.7`.
- Endurecimiento: CSP estricta (`script-src 'self'`), panel de administración
  con CSS y JS externos, `Cache-Control: no-store` solo para la API y
  `no-cache` para HTML y assets.
- 12 pruebas automatizadas (`npm test`) y flujo de integración continua en
  `.github/workflows/ci.yml`.
- Lighthouse sobre el inicio: **83 rendimiento, 100 accesibilidad, 100 buenas
  prácticas y 100 SEO**, sin fallos binarios. La imagen principal usa variantes
  de 600 y 800 px; en celular descarga 37 KB en lugar de 123 KB.
- Respaldo con `npm run db:respaldo` y guía de operación, monitoreo, rotación
  de secretos e incidentes en `docs/operacion.md`.
- Contenido revisado con un validador: 5 cursos, 20 módulos, 200 teorías,
  120 preguntas con una sola respuesta correcta y 15 retos (12 estafas y
  3 legítimos), sin títulos duplicados ni referencias viejas a AFIP.
- Certificado: solo se emite con el curso completo y la fecha de emisión queda
  fija la primera vez, para que reimprimirlo otro día no cambie el documento.
- Backoffice: el rol `analista` ya no recibe los correos de las solicitudes de
  ayuda y las tablas se vacían al cerrar sesión.
- Protocolo de prueba de usabilidad con personas mayores listo en
  `docs/prueba-usabilidad-mayores.md` (ejecución pendiente).
- Metadatos sociales con URLs absolutas: el servidor reemplaza `__BASE_URL__`
  con `FRONTEND_URL` en cada pedido.
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
- La cuenta de prueba de la verificación quedó **desactivada** el 4 de
  noviembre de 2026, con su historial de auditoría conservado (ver sección 6).

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
- [x] **Ajustar dominio y metadatos**: `og:url`, `og:image`, `twitter:image` y
      `canonical` usan `__BASE_URL__`; el servidor lo completa con
      `FRONTEND_URL` o el host del pedido.
- [ ] **Ejecutar el smoke contra producción**:
      `SMOKE_URL=https://tu-dominio npm run smoke` desde `server/`.
- [ ] **Comprobar cabeceras y HTTPS**: `/api/salud` responde `ok`, `/`
      devuelve `200`, HSTS activo y el certificado válido.

---

## 3. Verificación manual pendiente (QA)

Referencia completa: `docs/despliegue-y-verificacion.md`, sección 6.

### 3.1 Cuenta y privacidad

- [x] Cerrar sesión y confirmar que se vuelve al inicio sin datos de la cuenta.
- [ ] Recuperar la contraseña de punta a punta (bloqueado por Brevo).
- [ ] Rechazar un enlace de recuperación vencido o ya usado.
- [ ] “Descargar mis datos” genera un archivo con perfil y progreso.
- [ ] “Eliminar mi cuenta” exige contraseña + `ELIMINAR` y borra la cuenta.
- [ ] La última cuenta `superadmin` no puede eliminarse.

### 3.2 Aprendizaje

- [x] Completar el test inicial de 3 preguntas y verificar que define el nivel.
- [x] Confirmar que los niveles se desbloquean en orden.
- [x] Confirmar que el repaso final es obligatorio para avanzar.
- [ ] Recorrer “Seguí donde quedaste” y comprobar que abre el nivel correcto.
- [ ] Completar un curso y abrir e imprimir el certificado.
- [ ] Enviar una opinión de 1 a 5 estrellas con comentario.

### 3.3 Escudo de Seguridad

- [x] Verificar que aparecen 15 retos mezclados (12 estafas y 3 legítimos).
- [x] Probar la selección de estafa/confiable y el tipo de estafa.
- [x] Revisar explicación y señales (el puntaje final se confirma al completar
      los 15 retos).

### 3.4 Offline y PWA

- [x] Detener el servidor y comprobar que la interfaz abre desde caché.
- [ ] Verificar que el avance se guarda en el dispositivo.
- [ ] Volver a levantar el servidor y confirmar la sincronización automática.
- [ ] Instalar la PWA en Android, iPhone y escritorio.
- [x] Publicar un cambio de frontend, subir `VERSION` en `code/sw.js` y
      confirmar que el navegador toma la versión nueva (`v1.4.5`, 27 recursos).

### 3.5 Backoffice y roles

- [ ] `superadmin`: métricas, usuarios, auditoría, ayuda y opiniones.
- [ ] `moderador` y `analista`: solo las secciones permitidas.
- [x] Usuario común: recibe `403` en `/api/admin/*`.
- [ ] Cambiar el estado de una solicitud de ayuda y verlo reflejado.
- [ ] Confirmar que los roles sin permiso no ven correos ni datos sensibles.

### 3.6 Accesibilidad

- [ ] Recorrer toda la interfaz solo con teclado y comprobar el foco visible.
- [ ] Probar el enlace “Saltar al contenido principal”.
- [ ] Usar un lector de pantalla (NVDA o VoiceOver) en inicio, registro, login,
      campus y curso.
- [x] Probar A−/A+, “Escuchar” y “Detener” en las pantallas principales.
- [ ] Verificar zoom al 200 % sin pérdida de contenido.
- [x] Revisar contraste AA en textos, bordes y botones.
- [ ] Comprobar la navegación con breadcrumbs y el botón “Volver”.

### 3.7 Responsive y navegadores

- [ ] Revisar en escritorio, tablet y celular.
- [ ] Probar en Chrome, Edge, Firefox y Safari.
- [ ] Confirmar que la barra de accesibilidad no tapa contenido al final de
      cada pantalla.
- [ ] Revisar el panel de administración en pantallas pequeñas.

### 3.8 Resultados automatizados (4 de noviembre de 2026)

- API de seguridad contra la base real: **31/31** pruebas correctas
  (401/403, IDOR, asignación masiva, JWT alterado, inyección, límites de
  solicitudes, cabeceras y CORS).
- Navegador real: inicio, FAQ, demo del Escudo, registro y validaciones,
  login, test inicial, campus, curso, 10 teorías, repaso **6/6**, progreso,
  Escudo, configuración, cierre de sesión, recuperación y panel de
  administración.
- Accesibilidad: 1 `h1`, 0 imágenes sin `alt`, 0 botones o enlaces sin nombre,
  0 campos sin etiqueta, 0 IDs duplicados, 0 desborde horizontal, 15 regiones
  `aria-live` y contraste AA sin fallos tras el ajuste.
- Correcciones de esta pasada: enlaces legales con contraste AA
  (`#007A87` → `#00717D`), `aria-invalid` y foco en el primer campo con error,
  nivel actualizado al terminar el test, formulario de perfil sincronizado con
  la API, etiquetas y `noindex` en el panel de administración, y refuerzo de
  `prefers-reduced-motion` (iteraciones y desplazamiento suave).
- Pendiente de prueba manual: lector de pantalla (NVDA/VoiceOver), teclado
  real, zoom al 200 %, dispositivos Android/iPhone, Safari/Firefox y vista
  previa social.

### 3.9 Prueba con personas mayores

Protocolo completo y planillas: `docs/prueba-usabilidad-mayores.md`.

- [ ] Reclutar 5 a 8 personas de 60 años o más, sin vínculo con el equipo.
- [ ] Firmar los consentimientos y definir quién modera y quién observa.
- [ ] Ejecutar las tareas T1 a T6 con cronómetro y planilla.
- [ ] Calcular autonomía (≥ 80 %), errores por participante (≤ 1,5), tiempo
      mediano por tarea (≤ 180 s; registro ≤ 300 s), tareas completadas
      (≥ 90 %), errores críticos (0) y satisfacción (≥ 4,0).
- [ ] Registrar los problemas detectados y aplicar las correcciones.
- [ ] Repetir la prueba con 3 participantes nuevos si falla algún indicador.

---

## 4. Mejoras técnicas y deuda pendiente

Prioridad media; no bloquean la entrega, pero conviene dejarlas registradas.

- [x] **Tests automatizados**: `npm test` ejecuta 12 pruebas de las cabeceras
      de seguridad, el limitador, CORS y la integridad del contenido. Falta
      agregar pruebas de integración de la API con una base de prueba y de las
      funciones críticas del frontend.
- [x] **Integración continua**: `.github/workflows/ci.yml` instala
      dependencias, verifica sintaxis y ejecuta `npm test` en cada push o pull
      request. El smoke test se corre aparte porque necesita la base real.
- [ ] **Pruebas de integración de la API**: crear una base de prueba y cubrir
      login, permisos por rol, progreso y recuperación de contraseña.
- [ ] **Rate limiting compartido**: el límite actual vive en memoria y alcanza
      para una sola instancia. Si se escala horizontalmente, migrar a Redis y
      probarlo con dos instancias (ver `docs/operacion.md`).
- [ ] **Sesión más robusta**: evaluar refresh token rotativo; hoy el JWT dura
      12 horas y existe `POST /api/usuarios/renovar`.
- [ ] **Doble factor para administración**: no implementado para no bloquear
      al único `superadmin` sin cuenta de prueba. El procedimiento está en
      `docs/operacion.md`, sección 6.
- [x] **Respaldo**: `npm run db:respaldo` y `db:respaldo:esquema` generan el
      archivo en `server/backups/`, con procedimiento de restauración
      documentado.
- [ ] **Probar la restauración**: instalar las herramientas de PostgreSQL,
      restaurar un respaldo en una base de prueba y ejecutar `db:estado`.
- [ ] **Certificado verificable**: hoy no tiene un código único que una
      institución pueda validar. Si se necesita, agregar un folio y un
      endpoint de consulta. La fecha de emisión se guarda en el dispositivo,
      así que abrirlo en otro dispositivo genera una fecha nueva.
- [ ] **Filtrado de correos en el backoffice**: probar con una cuenta
      `analista` real que `/api/ayuda` no devuelva el campo `email` y que
      `moderador` y `superadmin` sí lo vean.
- [x] **Auditoría de rendimiento**: Lighthouse con service worker desactivado
      (para evitar un error de traza) dio **83 rendimiento, 100 accesibilidad,
      100 buenas prácticas y 100 SEO**, sin fallos binarios. Se agregó una
      variante de 600 px de la imagen principal (37 KB en lugar de 123 KB).
- [x] **Monitoreo**: procedimiento, umbrales y respuesta a incidentes en
      `docs/operacion.md`. Falta contratar el monitor externo.
- [ ] **Configurar el monitor externo**: apuntar a `/api/salud` cada 5 minutos
      y definir el correo que recibe las alertas.
- [x] **Limpieza menor**: `img/hero-ilustracion.svg` ya fue eliminado del
      repositorio y ninguna página lo referencia. Queda como tarea opcional
      borrar de los dispositivos la clave vieja `tami:accesibilidad`, que
      conserva un campo `contraste` sin efecto.

---

## 5. Contenido y experiencia

- [ ] **Prueba de usabilidad con personas mayores** (5 a 8 participantes):
      ejecutar el protocolo de `docs/prueba-usabilidad-mayores.md`, registrar
      hallazgos y ajustar textos o tamaños.
- [x] **Revisión final de contenidos**: validador con 200 teorías, 120
      preguntas y 15 retos; se corrigieron títulos duplicados, referencias a
      AFIP y un consejo contradictorio sobre la carga nocturna.
- [x] **Revisar el certificado**: se exige el curso completo y la fecha de
      emisión queda fija; pantalla y fecha verificadas en navegador. Falta
      comprobar la impresión en PDF con una impresora o el diálogo del
      navegador.
- [ ] **Revisar el panel de administración** con una persona que no haya
      participado del desarrollo. El filtrado de roles ya se ajustó en
      `analista`; falta la prueba con cuentas reales.
- [ ] **Actualizar capturas o material de difusión** si se usan en la entrega.

---

## 6. Datos de prueba a eliminar

- [x] Cuenta **“Verificación Formal”**
      (`verificacion.formal.20261102@tami.test`, id 15) **desactivada** el 4 de
      noviembre de 2026. Conserva su historial de auditoría y puede eliminarse
      definitivamente cuando se confirme.
- [x] Sin solicitudes de ayuda, opiniones ni progresos asociados: solo tiene
      5 registros de auditoría.

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
