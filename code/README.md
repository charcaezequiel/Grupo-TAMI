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
- HTML5 semántico con **15 pantallas**: Inicio, Registro, Login, Recuperar contraseña, Nueva contraseña, Test, Dashboard, Campus, Curso, Lección, Examen, Escudo, Progreso, Trabajos y Configuración.
- Atributos ARIA: `aria-live`, `aria-pressed`, `aria-required`, `aria-label`, `role`, `aria-describedby`, `aria-current`.
- **Skip link** "Saltar al contenido principal" (WCAG 2.4.1).
- **Breadcrumbs** dinámicos con `<nav aria-label="Migas de pan">` y microdatos Schema.org.
- Favicon (`../img/icono.svg`), logo institucional (`../img/logo.svg`) e icono de escudo en header y footer.
- Navegación lineal sin `target="_blank"`.
- Carga en orden los archivos de contenido y luego `main.js`.

### `admin.html` (Backoffice)
- Pantalla independiente con login y dashboard administrativo.
- Métricas de usuarios, cursos, alertas, test, exámenes y auditoría de las últimas 24 horas.
- Tabla de usuarios con rol y estado; activación/desactivación de cuentas.
- Tabla con los últimos 50 eventos de auditoría.
- Consume `/api/admin/*` con la cabecera `x-usuario-id`; el backend exige rol **superadmin**.

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
- **Capa API**: `fetchApi()` con `AbortController` y un máximo de espera de **2,5 segundos**; `apiGet()` y `apiPost()` para el backend.
- **Fallback automático**: si el servidor no responde, usa LocalStorage como caché y respaldo.
- **Autenticación**: registro y login contra la API (bcrypt en el servidor). En modo offline guarda un hash local SHA-256 solo como respaldo educativo.
- **Recuperación de contraseña**: lee el token de `?reset=...`, valida la contraseña nueva y la envía a la API. Al completar el cambio, el backend reemplaza el hash anterior, el frontend borra la sesión local y elimina el token de la URL.
- **Campus**: 5 cursos × 4 niveles, con 10 teorías y 6 preguntas de repaso por nivel.
- **Desbloqueo secuencial**: el Nivel 1 está abierto; cada nivel siguiente requiere completar el anterior, incluido su repaso.
- **Escudo**: motor de 15 mini retos con decisión estafa/confiable, tipo de estafa, señales, explicación y puntaje.
- **Mini trabajos**: guardado local inmediato y sincronización con la API cuando está disponible.
- **Progreso**: combina el avance de la API con el local para no perder niveles completados.
- **Preferencias**: tamaño de letra, tema, perfil, cambio de correo y cambio de contraseña.
- **Foco y accesibilidad**: al cambiar de pantalla, el foco se mueve al título (`tabindex="-1"`).

### Archivos de contenido
- `contenido-cursos.js`: 5 cursos, 4 niveles cada uno, con teorías base, objetivos, glosario y examen.
- `contenido-teorias.js`: 6 teorías complementarias por nivel (10 en total).
- `contenido-repaso.js`: 3 preguntas complementarias por nivel (6 en total).
- `contenido-retos.js`: 15 mini retos del Escudo (12 estafas y 3 mensajes legítimos).

## Pantallas (SPA)

| # | Pantalla | Descripción |
|---|----------|-------------|
| 1 | Inicio | Presentación del proyecto, pilares, los 5 cursos, recorrido e impacto |
| 2 | Registro | Formulario accesible con validación en el cliente y el servidor |
| 3 | Login | Inicio de sesión con credenciales |
| 4 | Recuperar contraseña | Pide el correo y envía un enlace de un solo uso |
| 5 | Nueva contraseña | Lee el token, guarda la contraseña nueva y reemplaza la anterior |
| 6 | Test | 3 preguntas de nivelación digital |
| 7 | Dashboard | Accesos a Campus, Trabajos, Escudo y Progreso |
| 8 | Campus | 5 cursos con avance y estado |
| 9 | Curso | 4 niveles con desbloqueo secuencial |
| 10 | Lección | Teorías paso a paso, objetivos, glosario y progreso |
| 11 | Examen | Repaso final de 6 preguntas por nivel |
| 12 | Escudo | 15 mini retos antiestafa |
| 13 | Progreso | Barras comparativas y avance por curso |
| 14 | Trabajos | Mini trabajos prácticos filtrados por nivel |
| 15 | Configuración | Perfil, preferencias, correo y contraseña |

## Conexión con la API

El frontend se comunica con el backend en `http://localhost:3000/api`:

- **Registro**: `POST /api/usuarios/registrar`
- **Login**: `POST /api/usuarios/login`
- **Recuperación**: `POST /api/usuarios/recuperar-password` y `POST /api/usuarios/restablecer-password`
- **Perfil**: `PUT /api/usuarios/:id/perfil`, `/email` y `/password`
- **Test**: `POST /api/progreso/test`
- **Examen**: `POST /api/progreso/examen`
- **Progreso del nivel**: `POST /api/progreso/modulo`
- **Mini trabajo**: `POST /api/progreso/mini-trabajo`
- **Progreso del usuario**: `GET /api/progreso/:usuarioId`
- **Cursos**: `GET /api/cursos`
- **Alertas heredadas**: `GET /api/alertas`
- **Panel admin**: `GET /api/admin/dashboard`, `/usuarios`, `/roles`, `/auditoria`; `PUT /api/admin/usuarios/:id/rol` y `/estado`

> Si el servidor no está disponible, las operaciones principales funcionan con LocalStorage como respaldo.

## Cómo Probar

1. Abrí `index.html` en tu navegador (doble clic o arrastrá el archivo).
2. Registrá una cuenta con nombre, email y contraseña.
3. Completá el test de nivelación.
4. Entrá al Campus Educativo y abrí un curso.
5. Recorré las 10 teorías del Nivel 1 y respondé el repaso de 6 preguntas.
6. Verificá que el Nivel 2 se desbloquee recién al completar el Nivel 1.
7. Entrá al Escudo y resolvé los 15 mini retos.
8. Revisá tu avance en "Mi Progreso".
9. Para probar la recuperación, configurá SMTP en `server/.env` o usá `RESET_DEBUG_LINK=true`; luego tocá **“¿Olvidaste tu contraseña?”**.
10. Para el panel admin, promové una cuenta a `superadmin` y abrí `admin.html`.
