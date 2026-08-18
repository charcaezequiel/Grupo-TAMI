# Código Frontend - TAMI

Capa de **Presentación** y **Lógica** del proyecto. Interfaz de usuario completa con conexión a la API REST y fallback offline.

## Arquitectura Cliente-Servidor en 3 Capas

```text
┌──────────────────────────────────────┐
│ 1. Presentación  HTML / CSS          │  index.html y styles.css
├──────────────────────────────────────┤
│ 2. Lógica         JavaScript + fetch │  main.js (conexión API + fallback)
├──────────────────────────────────────┤
│ 3. Datos          API REST / LocalStorage │  PostgreSQL o caché local
└──────────────────────────────────────┘
```

- **Presentación**: 9 pantallas SPA con navegación lineal, botones masivos y diseño accesible.
- **Lógica**: Validaciones, autenticación, test de nivelación, lecciones, exámenes y progreso.
- **Datos**: Conecta con la API REST del backend (`http://localhost:3000/api`). Si el servidor no está disponible, usa LocalStorage como fallback automático.

## Archivos

### `index.html` (Presentación)
- HTML5 semántico con 9 pantallas: Inicio, Registro, Login, Test, Dashboard, Campus, Lección, Escudo de Seguridad, Progreso, Examen.
- Atributos ARIA: `aria-live`, `aria-pressed`, `aria-required`, `aria-label`, `role`, `aria-describedby`.
- Navegación lineal sin `target="_blank"` para mantener el botón "Atrás" del dispositivo.

### `styles.css` (Design System)
- **Propuesta 4: Protección Proactiva** - Paleta 60-30-10:
  - 60% Fondo: Cian Glacial `#EBF8FA`
  - 30% Estructura: Teal Oscuro `#0A4B5C`
  - 10% Acentos: Teal de Contraste `#007A87`
- Tipografía 18-36px, botones mínimos 52px / masivos 60px.
- Media query `prefers-reduced-motion` para reducir animaciones.
- Responsive: layout de 1 columna en móvil, 3 columnas en desktop.

### `main.js` (Lógica + API)
- **Capa API**: Funciones `apiGet()` y `apiPost()` para comunicarse con el backend.
- **Fallback automático**: Si el servidor no responde, usa LocalStorage como caché.
- **Autenticación**: Registro y login con hash SHA-256 de contraseñas.
- **Test de nivelación**: 3 preguntas, cálculo de nivel "Principiante" o "Protegido".
- **Lección Módulo 4**: 5 pasos interactivos con navegación lineal.
- **Examen post-lección**: 3 preguntas de phishing.
- **Progreso**: Gráficos de barras CSS que comparan nivel inicial vs. examen.
- **Escudo de Seguridad**: 6 alertas cargadas desde la API con fallback offline.

## Pantallas (SPA)

| # | Pantalla | Descripción |
|---|----------|-------------|
| 1 | Inicio | Bienvenida con opciones de Registro y Login |
| 2 | Registro | Formulario con validación y hashing de contraseña |
| 3 | Login | Inicio de sesión verificando credenciales |
| 4 | Test | 3 preguntas de nivelación digital |
| 5 | Dashboard | Menú principal con 3 accesos masivos |
| 6 | Campus | Lista de 5 módulos (solo Módulo 4 activo) |
| 7 | Lección | 5 pasos interactivos de Fraudes Digitales |
| 8 | Escudo | 6 alertas de seguridad con consejos |
| 9 | Progreso | Barras comparativas inicial vs. examen |
| 10 | Examen | 3 preguntas post-lección |

## Conexión con la API

El frontend se comunica con el backend en `http://localhost:3000/api`:

- **Registro**: `POST /api/usuarios/registrar`
- **Login**: `POST /api/usuarios/login`
- **Test**: `POST /api/progreso/test`
- **Examen**: `POST /api/progreso/examen`
- **Progreso módulo**: `POST /api/progreso/modulo`
- **Alertas**: `GET /api/alertas`
- **Progreso usuario**: `GET /api/progreso/:usuarioId`

> Si el servidor no está disponible, todas las operaciones funcionan con LocalStorage como fallback.

## Cómo Probar

1. Abrí `index.html` en tu navegador (doble clic o arrastrá el archivo).
2. Registrá una cuenta nueva con nombre, email y contraseña.
3. Completá el test de nivelación.
4. Entrá al Campus Educativo → Módulo 4 (Fraudes).
5. Completá la lección y rendí el examen.
6. Mirá tu progreso en "Mi Progreso".
