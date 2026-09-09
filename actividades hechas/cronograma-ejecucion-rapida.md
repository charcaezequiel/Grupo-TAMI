# Cronograma de Ejecución Rápida - Preguntas Contestadas

Actividades del ciclo de 10 días del proyecto **TAMI** (Proyecto Integrador III - ET N°20 "Carolina Muzilli"), con el alcance, los responsables y los entregables de cada bloque definidos.

---

## Día 1: Planificación (Planning)

**Pregunta**: Definir el alcance exacto de las tareas anteriores y asignarlas al equipo.

**Respuesta**:

El alcance del ciclo comprende las **5 actividades del Proyecto Integrador**:

1. **Organización inicial del repositorio y convenciones de código** (estructura de carpetas, READMEs y reglas ISO/IEC 25010).
2. **Arquitectura de la información y mapa de navegación** (árbol de 3 niveles, menú y breadcrumbs).
3. **Sprint 1 - Sistema de autenticación accesible** (login y registro con bcrypt, validación y base de datos).
4. **Auditoría de usabilidad y UX** (checklist en 6 dimensiones y matriz de hallazgos QA).
5. **Planificación y ejecución bajo el cronograma rápido** (este documento).

**Asignación al equipo Scrum**:

| Integrante | Rol | Tareas asignadas en el día 1 |
|------------|-----|------------------------------|
| Nahuel Ancelmo | Product Owner | Definir la visión y priorizar el alcance; validar los criterios de aceptación de la US-001. |
| Rachael Choque | Scrum Master | Organizar el tablero Kanban, coordinar la estimación y actualizar el backlog. |
| Ezequiel Charca | Dev Team | Descomponer el alcance en tareas técnicas, estimar horas y preparar el repositorio. |

**Entregables del día 1**: Objetivo del Sprint aprobado, alcance acotado (sin ingresos en el alcance: módulos 1, 2, 3 y 5 del Campus) y tablero Kanban inicializado.

---

## Días 2 a 4: Diseño y Prototipado

**Pregunta**: Armar los wireframes y flujos de navegación en Figma.

**Respuesta**:

Se diseña la interfaz completa en **Figma** antes de programar:

| Día | Actividad | Detalle |
|-----|-----------|---------|
| 2 | **Wireframes de baja fidelidad** | 10 pantallas (Inicio, Registro, Login, Test, Dashboard, Campus, Lección, Escudo, Progreso, Examen) con la estructura de cada una. |
| 2 | **Flujo de navegación lineal** | Diagrama de flujo: Inicio → Registro/Login → Test de nivelación → Dashboard → Campus/Lección/Examen → Progreso. |
| 3 | **Prototipo de alta fidelidad** | Aplicación de la paleta "Protección Proactiva" (Cian Glacial 60%, Teal Oscuro 30%, Teal Contraste 10%), tipografía 18px+ y botones 52px+. |
| 3 | **Validación de accesibilidad** | Verificar contraste WCAG AA en Figma y tamaños táctiles (ISO 9241-210). |
| 4 | **Aprobación del prototipo** | Revisión del equipo y del PO; ajuste de textos con lenguaje claro para adultos mayores. |

**Entregables**: Wireframes, flujo de navegación y prototipo clicable de alta fidelidad en Figma, aprobado antes de iniciar el desarrollo.

---

## Días 5 a 8: Desarrollo Técnico

**Pregunta**: Programar los componentes de la interfaz y la lógica de navegación.

**Respuesta**:

Se desarrolla el código full stack respetando los wireframes de Figma y las convenciones del repositorio:

| Día | Componente programado | Detalle técnico |
|-----|-----------------------|-----------------|
| 5 | **Base de datos** | `server/schema.sql`: tabla `usuarios` con `password_hash`, `cursos`, `alertas_fraude`, `test_nivelacion`, `examenes` y `progreso_modulos`. |
| 5 | **Servidor Express** | `server/index.js` + `server/db.js`: pool de conexión PostgreSQL y rutas montadas. |
| 6 | **Autenticación backend** | `POST registrar` y `POST login` con hashing **bcrypt** (costo 12), validación de email/nombre/password y consultas SQL parametrizadas. |
| 7 | **Componentes de interfaz** | `code/index.html`: HTML5 semántico con ARIA, skip link y breadcrumbs; `code/styles.css`: Design System y estilos responsive. |
| 8 | **Lógica de navegación** | `code/main.js`: SPA con `mostrarPantalla()`, breadcrumbs dinámicos, botones de actividad (test, lección, examen, alertas) y conexión `fetch` a la API con fallback LocalStorage. |

**Criterios de calidad aplicados**:
- **Alta cohesión**: cada archivo tiene un único propósito (vista, estilos o lógica).
- **Bajo acoplamiento**: comunicación por eventos e interfaces explícitas.
- **Accesibilidad**: navegación por teclado, foco gestionado al cambiar de pantalla y `aria-live` para mensajes.

**Entregables**: Backend funcionando con 14 endpoints y frontend accesible con las 10 pantallas conectado a la API.

---

## Día 9: Pruebas (QA)

**Pregunta**: Validar que no haya enlaces rotos y que los botones de actividad registren los datos correctamente.

**Respuesta**:

Se ejecuta la batería de pruebas de aseguramiento de calidad:

| Prueba | Procedimiento | Resultado esperado |
|--------|---------------|--------------------|
| **Enlaces y botones rotos** | Recorrer las 10 pantallas haciendo clic en todos los botones, enlaces y breadcrumbs | Ningún botón o enlace roto; todas las rutas de navegación funcionan |
| **Botones de actividad registran datos** | Enviar el test de nivelación, la lección, el examen y las alertas; verificar que el progreso se guarde | Cada botón de actividad registra los datos en PostgreSQL (o en LocalStorage si la API no responde) |
| **Verificación en base de datos** | Consultar `SELECT` de `usuarios`, `test_nivelacion`, `examenes` y `progreso_modulos` | Los registros y los avances reflejan las acciones del usuario |
| **Inyección SQL** | Enviar por los formularios cadenas como `'; DROP TABLE usuarios; --` | La entrada se trata como dato (consultas parametrizadas), sin efectos en la base |
| **Accesibilidad** | Auditoría con axe DevTools y recorrido solo con teclado | 0 violaciones críticas y navegación completa con Tab/Enter |

**Criterio de éxito**: los 3 KPIs del Sprint 1 (registro autónomo ≥ 80%, errores ≤ 1.5 por usuario y tiempo ≤ 180 segundos) se cumplen en la prueba con adultos mayores (protocolo de caja negra).

**Entregable**: Informe de QA con la matriz de hallazgos y soluciones (ver `docs/auditoria-usabilidad.md`).

---

## Día 10: Revisión y Retrospectiva

**Pregunta**: Mostrar los resultados al equipo y analizar qué se puede mejorar para el próximo ciclo.

**Respuesta**:

| Actividad | Detalle |
|-----------|---------|
| **Demostración (Demo)** | Presentar el PMV funcionando ante los profesores Anderson y Lambertucci: registro, login, test, módulo 4 y progreso. |
| **Revisión de resultados** | Mostrar el cumplimiento de los KPIs y el funcionamiento de las 5 actividades del proyecto. |
| **Retrospectiva** | Analizar qué salió bien (trabajo modular, accesibilidad), qué salió mal (falta de tiempo para QA con adultos mayores) y qué mejorar: probar antes con usuarios reales y planificar `npm install` con anticipación. |
| **Acciones de mejora** | Registrar en el backlog del próximo ciclo: habilitar módulos 1, 2, 3 y 5, validación en tiempo real en formularios y confirmación al cerrar sesión. |
| **Cierre** | Actualizar la documentación, generar el commit final con la etiqueta de versión `v1.0.0` y cargar el repositorio en GitHub. |

**Lecciones aprendidas para el próximo ciclo**:
1. La separación por capas (HTML/CSS/JS y rutas backend) evitó conflictos de trabajo en paralelo.
2. Migrar a bcrypt fue clave para la seguridad, pero requirió instalar una dependencia nueva.
3. Las pruebas con adultos mayores deben reservarse con antelación para no depender de la última semana.

---

*Documento de entregable académico - Proyecto Integrador III - TAMI (2026).*