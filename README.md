# TAMI - Tecnología Amigable para Mayores e Inclusiva

Proyecto de la **ET N°20 DE 20 "Carolina Muzilli"** - Polo Educativo de Mataderos.
Curso: 6° 2° - Proyecto Integrador III.

**Misión**: Reducir la brecha digital y mitigar los riesgos de fraude en adultos mayores mediante una plataforma web amigable, inclusiva y accesible.

---

## Equipo (Scrum) y Responsabilidades

| Integrante             | Rol de Scrum               | Responsabilidades específicas                                          |
|------------------------|----------------------------|-------------------------------------------------------------------------|
| Nahuel Luciano Ancelmo | Product Owner (PO)         | Definir la visión del producto, priorizar el backlog y validar el PMV.  |
| Rachael Choque         | Scrum Master (SM)          | Facilitar las ceremonias, eliminar impedimentos y cuidar el proceso.    |
| Ezequiel Charca        | Equipo de Desarrollo (Dev) | Diseñar y construir la interfaz, la lógica y la capa de persistencia.   |

---

## Tecnología y Arquitectura

- **Frontend**: HTML5, CSS3 y JavaScript nativo (sin framework).
- **Backend**: Node.js + Express + PostgreSQL.
- **Arquitectura**: Cliente-Servidor en 3 capas (Presentación, Lógica y Datos).
- **Seguridad**: contraseñas con hashing irreversible **bcrypt** y consultas SQL parametrizadas.
- **Persistencia**: PostgreSQL (principal) y LocalStorage (caché/fallback sin conexión).
- **Accesibilidad**: WCAG 2.1 AA, ARIA roles, skip link, breadcrumbs, contraste alto, botones mínimos 52px.
- **Design System**: "Protección Proactiva" (paleta 60-30-10: `#EBF8FA` / `#0A4B5C` / `#007A87`).

---

## PMV V1.0 - Funcionalidades Implementadas

### 1. Pantalla de Registro y Login
- Formulario con campos: Nombre, Correo Electrónico, Contraseña.
- Validación de nombre no vacío, formato de email válido y contraseña mínima de 6 caracteres.
- Hashing de contraseña con **bcrypt** (costo 12) en el servidor, con consultas SQL parametrizadas.
- Persistencia en PostgreSQL (principal) y LocalStorage (fallback offline).

### 2. Test de Nivelación Obligatorio
- 3 preguntas sencillas con botones gigantes de opción múltiple.
- Evalúa nivel digital inicial del usuario ("Principiante" o "Protegido").
- Resultados guardados en PostgreSQL y LocalStorage.

### 3. Dashboard Principal (Entorno Seguro)
- Saludo personalizado: "¡Hola, [Nombre]! Estás en un entorno totalmente seguro 🔒".
- 3 accesos masivos tipo tarjeta: Campus Educativo, Escudo de Seguridad, Mi Progreso.
- **Breadcrumbs** (migas de pan) en cada pantalla: los niveles previos son clicables y el actual es texto plano.

### 4. Campus Educativo (Módulo de Fraude Digital)
- 5 módulos teóricos: Smartphones, Redes, Trámites, Fraudes, Comunicación.
- Solo el Módulo 4 (Fraudes Digitales/Phishing) está activo en esta versión.
- Lección interactiva paso a paso con navegación lineal (5 pasos).

### 5. Escudo de Seguridad (Centro de Alertas)
- 6 alertas de seguridad en tiempo real con explicaciones y consejos.
- Cada alerta incluye: título, descripción, severidad y "Qué hacer".
- Datos cargados desde la API (con fallback offline).

### 6. Sistema de Evaluación y Progreso
- Examen rápido post-lección (3 preguntas sobre phishing).
- Gráficos de barras CSS que comparan nivel inicial vs. examen.
- Progreso guardado en PostgreSQL y mostrado en "Mi Progreso".

---

## Mapa del Repositorio

```text
Grupo-TAMI/
├── README.md               Documentación principal del proyecto
├── code/                   Capa de Presentación y Lógica (frontend)
│   ├── index.html          Estructura accesible con 10 pantallas SPA + breadcrumbs
│   ├── styles.css          Design System "Protección Proactiva"
│   ├── main.js             Lógica + conexión API + fallback LocalStorage
│   └── README.md
├── server/                 Backend Node.js + Express + PostgreSQL
│   ├── index.js            Servidor y rutas API
│   ├── db.js               Conexión a PostgreSQL (pg Pool)
│   ├── schema.sql          Esquema de 7 tablas + datos iniciales
│   ├── routes/
│   │   ├── usuarios.js     Registro/login con bcrypt + progreso
│   │   ├── cursos.js       Listado de módulos/curso
│   │   ├── alertas.js      Alertas de fraude
│   │   └── progreso.js     Test, exámenes y progreso de módulos
│   ├── .env.example        Variables de entorno de ejemplo
│   └── README.md
├── resources/              Activos multimedia
│   ├── img/                Imágenes (optimizadas)
│   ├── icons/              Iconografía SVG de trazo grueso
│   ├── fonts/              Tipografías locales legibles
│   ├── branding-guide.md   Paleta cromática proactiva
│   └── README.md
└── docs/                   Documentación obligatoria (ET N°20)
    ├── project-charter.md        Project Charter
    ├── plan-de-proyecto.md       Plan de Proyecto
    ├── cronograma-gantt.md       Diagrama de Gantt + plan de 10 días
    ├── backlog-sprints.md        Backlog y Sprint 1 (autenticación)
    ├── design-system.md          Design System
    ├── convenciones-desarrollo.md  Convenciones ISO/IEC 25010
    ├── arquitectura-informacion.md Árbol de navegación y breadcrumbs
    ├── auditoria-usabilidad.md   Auditoría UX (6 dimensiones + QA)
    ├── plan-ejecucion-10-dias.md Cronograma rápido día a día
    └── README.md
```

---

## Base de Datos (PostgreSQL)

### Tablas

| Tabla | Descripción |
|-------|-------------|
| `usuarios` | Usuarios registrados con nombre, email, password_hash (bcrypt) y nivel_digital |
| `cursos` | 5 módulos del Campus Educativo |
| `alertas_fraude` | 6 alertas con título, descripción, que_hacer, severidad e icono |
| `inscripciones` | Relación many-to-many usuario-curso |
| `test_nivelacion` | Resultados del test inicial (respuestas JSONB, nivel, puntaje) |
| `examenes` | Resultados del examen post-lección |
| `progreso_modulos` | Avance paso a paso en cada módulo |

### API REST - Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/` | Estado de la API |
| GET | `/api/usuarios` | Listar todos los usuarios |
| GET | `/api/usuarios/:id` | Obtener un usuario por ID |
| POST | `/api/usuarios/registrar` | Registrar nuevo usuario (nombre, email, password) |
| POST | `/api/usuarios/login` | Iniciar sesión (email, password) |
| GET | `/api/usuarios/:id/progreso` | Obtener progreso completo de un usuario |
| GET | `/api/cursos` | Listar cursos activos |
| GET | `/api/cursos/:id` | Obtener un curso |
| GET | `/api/alertas` | Listar alertas de fraude |
| POST | `/api/progreso/test` | Guardar resultado de test de nivelación |
| POST | `/api/progreso/examen` | Guardar resultado de examen post-lección |
| POST | `/api/progreso/modulo` | Guardar/actualizar progreso en un módulo |
| GET | `/api/progreso/:usuarioId` | Obtener progreso de un usuario |

---

## Puesta en Marcha

### Requisitos Previos
- [Node.js](https://nodejs.org) (v16 o superior)
- [PostgreSQL](https://www.postgresql.org) (v12 o superior)

### 1. Clonar el repositorio

```bash
git clone https://github.com/charcaezequiel/Grupo-TAMI.git
cd Grupo-TAMI
```

### 2. Configurar la base de datos

```bash
# Crear la base de datos
createdb -U postgres tami_db

# Ejecutar el esquema (tablas + datos iniciales)
psql -U postgres -d tami_db -f server/schema.sql
```

### 3. Configurar el servidor

```bash
cd server

# Copiar archivo de entorno
cp .env.example .env

# Editar .env con tus credenciales de PostgreSQL
# DB_USER=postgres
# DB_PASSWORD=tu_contraseña
# DB_NAME=tami_db
# PORT=3000
```

### 4. Instalar dependencias y arrancar

```bash
cd server
npm install
npm start
# o para desarrollo con auto-reload:
npm run dev
```

El servidor queda disponible en `http://localhost:3000`.

### 5. Abrir el frontend

Abrí `code/index.html` directamente en tu navegador (doble clic o arrastrá el archivo).

> **Nota**: El frontend intenta conectarse a la API en `http://localhost:3000`. Si el servidor no está disponible, funciona automáticamente con LocalStorage como caché offline.

---

## Diseño de Software (ISO/IEC 25010)

- **Alta Cohesión y Bajo Acoplamiento**: Funciones modulares con responsabilidad única, comunicación vía eventos y llamadas directas.
- **Reusabilidad**: Funciones de validación, renderizado y guardado reutilizables en todas las pantallas.
- **Nomenclatura Estricta**: camelCase para variables (sustantivos), infinitivo para funciones (verbos), booleanos como preguntas.
- **Comentarios Profesionales**: Solo explican el "porqué" de decisiones complejas.
- **Mantenibilidad**: Convenciones documentadas en `docs/convenciones-desarrollo.md`.
- **Accesibilidad**: ARIA labels, roles, aria-live, skip link, breadcrumbs, contraste WCAG AA, target size 52px+.

## Justificación: Relación Teoría-Práctica

- **Scrum**: Roles (PO, SM, Dev) organizan la colaboración y el avance por sprints documentado en `docs/backlog-sprints.md`.
- **DCU (Diseño Centrado en el Usuario)**: Paleta proactiva, iconos de trazo grueso, fuentes de alta legibilidad y botones masivos para adultos mayores.
- **Arquitectura de Información**: Navegación de 3 niveles con breadcrumbs definida en `docs/arquitectura-informacion.md`.
- **Calidad (ISO/IEC 25010)**: Métricas, auditoría UX y matriz de hallazgos en `docs/auditoria-usabilidad.md`.
- **PMV (Producto Mínimo Viable)**: Sistema funcional completo con backend, frontend, base de datos y persistencia offline.

---

## Enlaces

- [Documentación técnica](docs/README.md)
- [Guía de marca](resources/branding-guide.md)
- [Backend - API REST](server/README.md)
- [Frontend - Interfaz](code/README.md)

---

## Licencia

Proyecto educativo - ET N°20 "Carolina Muzilli" (2026).
