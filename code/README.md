# Código Frontend - TAMI

Capa de **Presentación** y **Lógica** del proyecto. Interfaz accesible con conexión a la API REST y fallback offline.

## Arquitectura Cliente-Servidor en 3 Capas

```text
┌──────────────────────────────────────────────┐
│ 1. Presentación   HTML / CSS                 │  index.html, admin.html y styles.css
├──────────────────────────────────────────────┤
│ 2. Lógica         JavaScript + fetch         │  main.js (API + fallback)
├──────────────────────────────────────────────┤
│ 3. Datos          API REST / LocalStorage    │  PostgreSQL o caché local
└──────────────────────────────────────────────┘
```

## Archivos

### `index.html` (Presentación)
- HTML5 semántico con **18 pantallas**: Inicio, Registro, Login, Recuperar contraseña, Nueva contraseña, Test, Dashboard, Campus, Curso, Lección, Examen, Escudo, Progreso, Certificado, Trabajos, Configuración, Legal y Ayuda.
- Atributos ARIA: `aria-live`, `aria-pressed`, `aria-required`, `aria-label`, `role`, `aria-describedby`, `aria-current`.
- **Skip link** "Saltar al contenido principal" (WCAG 2.4.1).
- **Breadcrumbs** dinámicos con `<nav aria-label="Migas de pan">` y microdatos Schema.org.
- Favicon (`../img/icono.svg`), logo institucional (`../img/logo.svg`), ilustración del hero y vista previa Open Graph.
- Navegación lineal sin `target="_blank"`.
- Carga en orden los archivos de contenido y luego `main.js`.

### `config.js`
- Define `window.TAMI_API_URL` para apuntar a la API. Por defecto usa el mismo
  origen (`/api`), lo que permite servir frontend y backend juntos.

### `manifest.json` y `sw.js` (PWA)
- Manifest con nombre, colores, `start_url`, `scope` e iconos normales y maskable.
- Service worker con caché del shell, estrategia network-first para navegación,
  cache-first para estáticos y paso directo a `/api/*`.
- Al publicar cambios de frontend hay que incrementar `VERSION` en `sw.js`.

### `admin.html` (Backoffice)
- Pantalla independiente con login JWT y dashboard administrativo.
- `superadmin`: métricas, usuarios, roles, auditoría, ayuda y opiniones.
- `moderador` y `analista`: solo solicitudes de ayuda y opiniones, con secciones
  ocultas según el rol.
- Tabla de ayuda con filtros y cambio de estado; tabla de opiniones con puntaje.
- Envía `Authorization: Bearer <token>` en todas las llamadas; nunca usa ids de
  usuario enviados por el cliente.

### `styles.css` (Design System)
- **"Protección Proactiva"**, paleta 60-30-10:
  - 60% Fondo: Cian Glacial `#EBF8FA`
  - 30% Estructura: Teal Oscuro `#0A4B5C`
  - 10% Acentos: Teal de Contraste `#007A87`
- El azul institucional es el tema por defecto. Las preferencias de lectura permiten agrandar la letra y elegir temas alternativos.
- Tipografía de 18 a 36px, botones mínimos de 52px y botones masivos de 60px.
- Estilos de skip link, breadcrumbs, foco visible, estados `:disabled` y `prefers-reduced-motion`.
- Responsive: 1 columna en móvil y varias columnas en escritorio.
- Hoja organizada por secciones con índice y comentarios internos.

### `main.js` (Lógica + API)
- **Capa API**: `fetchApi()` con `AbortController` y un máximo de espera de **2,5 segundos**; `apiGet()`, `apiPost()`, `apiPut()` y `apiDelete()` para el backend.
- **Fallback automático**: si el servidor no responde, usa LocalStorage como caché y respaldo, con cola de pendientes para sincronizar al volver la conexión.
- **Autenticación**: registro y login contra la API con JWT (`Authorization: Bearer`). Las respuestas `401` cierran la sesión y avisan a la persona. En modo offline guarda un hash local SHA-256 solo como respaldo educativo.
- **Privacidad**: consentimiento en el registro, descarga de datos personales y eliminación de cuenta desde Configuración.
- **Recuperación de contraseña**: lee el token de `?reset=...`, valida la contraseña nueva y la envía a la API. Al completar el cambio, el backend reemplaza el hash anterior, el frontend borra la sesión local y elimina el token de la URL.
- **Campus**: 5 cursos × 4 niveles, con 10 teorías y 6 preguntas de repaso por nivel. La tarjeta **“Seguí donde quedaste”** abre el primer nivel pendiente.
- **Desbloqueo secuencial**: el Nivel 1 está abierto; cada nivel siguiente requiere completar el anterior, incluido su repaso.
- **Escudo**: motor de 15 mini retos con decisión estafa/confiable, tipo de estafa, señales, explicación y puntaje. En el inicio hay una demo pública de 3 casos.
- **Progreso**: combina el avance de la API con el local, muestra el camino de aprendizaje, logros y certificado imprimible por curso.
- **Opinión**: widget de 1–5 estrellas y comentario conectado a `/api/feedback`.
- **Ayuda y accesibilidad**: botón de ayuda con formulario, tour guiado en `<dialog>`, lectura en voz alta, A−/A+, alto contraste y banner de sin conexión.
- **PWA**: registra el service worker, captura `beforeinstallprompt` y ofrece instalar la app desde la pantalla de ayuda.
- **Foco y accesibilidad**: al cambiar de pantalla, el foco se mueve al título (`tabindex="-1"`).

### Archivos de contenido
- `contenido-cursos.js`: 5 cursos, 4 niveles cada uno, con teorías base, objetivos, glosario y examen.
- `contenido-teorias.js`: 6 teorías complementarias por nivel (10 en total).
- `contenido-repaso.js`: 3 preguntas complementarias por nivel (6 en total).
- `contenido-retos.js`: 15 mini retos del Escudo (12 estafas y 3 mensajes legítimos).

## Pantallas (SPA)

| # | Pantalla | Descripción |
|---|----------|-------------|
| 1 | Inicio | Presentación, recorrido, **demo pública del Escudo**, los 5 cursos, impacto y preguntas frecuentes |
| 2 | Registro | Formulario accesible con consentimiento, validación en el cliente y el servidor |
| 3 | Login | Inicio de sesión con credenciales |
| 4 | Recuperar contraseña | Pide el correo y envía un enlace de un solo uso |
| 5 | Nueva contraseña | Lee el token, guarda la contraseña nueva y reemplaza la anterior |
| 6 | Test | 3 preguntas de nivelación digital |
| 7 | Dashboard | Accesos a Campus, Trabajos, Escudo y Progreso |
| 8 | Campus | 5 cursos con avance, estado y tarjeta “Seguí donde quedaste” |
| 9 | Curso | 4 niveles con desbloqueo secuencial |
| 10 | Lección | Teorías paso a paso, objetivos, glosario y progreso |
| 11 | Examen | Repaso final de 6 preguntas por nivel |
| 12 | Escudo | 15 mini retos antiestafa con señales y explicación |
| 13 | Progreso | Camino de aprendizaje, logros y certificados por curso |
| 14 | Certificado | Vista imprimible del certificado de un curso completado |
| 15 | Trabajos | Mini trabajos prácticos filtrados por nivel |
| 16 | Configuración | Perfil, preferencias, correo, contraseña y datos personales |
| 17 | Legal | Términos, privacidad (Ley 25.326) y accesibilidad |
| 18 | Ayuda | Guía, tour, lectura en voz alta, contraste e instalación de la app |

## Conexión con la API

El frontend se comunica con el backend por el **mismo origen** (`/api`), que es
el valor por defecto de `window.TAMI_API_URL` en `config.js`. Sirviendo
`npm start` desde `server/`, el sitio queda en `http://localhost:3000/` y todas
las llamadas usan `http://localhost:3000/api`. Las rutas privadas viajan con
`Authorization: Bearer <token>`.

- **Registro**: `POST /api/usuarios/registrar`
- **Login**: `POST /api/usuarios/login`
- **Sesión**: `GET /api/usuarios/yo` y `POST /api/usuarios/renovar` (renueva el JWT)
- **Recuperación**: `POST /api/usuarios/recuperar-password` y `POST /api/usuarios/restablecer-password`
- **Perfil**: `PUT /api/usuarios/:id/perfil`, `/email` y `/password`
- **Datos personales**: `GET /api/usuarios/:id/datos` (exportación) y `DELETE /api/usuarios/:id` (baja con contraseña)
- **Test**: `POST /api/progreso/test`
- **Examen**: `POST /api/progreso/examen`
- **Progreso del nivel**: `POST /api/progreso/modulo`
- **Mini trabajo**: `POST /api/progreso/mini-trabajo`
- **Progreso del usuario**: `GET /api/progreso/:usuarioId`
- **Cursos**: `GET /api/cursos`
- **Ayuda**: `POST /api/ayuda` (consulta desde el botón de ayuda)
- **Opinión**: `POST /api/feedback` (estrellas y comentario)
- **Alertas heredadas**: `GET /api/alertas`
- **Panel admin**: `GET /api/admin/dashboard`, `/usuarios`, `/roles`, `/auditoria`, `/ayuda`, `/feedback`; `PUT /api/admin/usuarios/:id/rol` y `/estado`, `PUT /api/admin/ayuda/:id/estado`

> Si el servidor no está disponible, las operaciones principales funcionan con LocalStorage como respaldo.

## Cómo Probar

1. Levantá el backend (`npm start` dentro de `server/`) y abrí `http://localhost:3000/`. No abras `index.html` con doble clic: sin servidor no hay API, ni service worker, ni rutas `/api`.
2. En Inicio, probá la **demo del Escudo** (3 casos) y abrí una pregunta frecuente con “¿TAMI es gratis?”.
3. Registrá una cuenta con nombre, email, contraseña y el consentimiento de privacidad.
4. Completá el test de nivelación.
5. Entrá al Campus Educativo: la tarjeta “Seguí donde quedaste” debe abrir el primer nivel pendiente.
6. Recorré las 10 teorías del Nivel 1 y respondé el repaso de 6 preguntas.
7. Verificá que el Nivel 2 se desbloquee recién al completar el Nivel 1.
8. Entrá al Escudo y resolvé los 15 mini retos.
9. Revisá tu avance en “Mi Progreso” y abrí el certificado de un curso completado.
10. Desde el botón de ayuda, probá el tour guiado, la lectura en voz alta, A−/A+ y el alto contraste.
11. Desde Configuración, descargá tus datos personales.
12. Para la recuperación, configurá SMTP en `server/.env` o usá `RESET_DEBUG_LINK=true`; luego tocá **“¿Olvidaste tu contraseña?”**.
13. Para el panel admin, promové una cuenta con `npm run admin:promover` y abrí `http://localhost:3000/admin.html`.
14. Comprobá la PWA: en DevTools → Application, verificá el service worker y el manifest; cortá la red y confirmá el banner de sin conexión.
