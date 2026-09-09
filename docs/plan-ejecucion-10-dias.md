# Plan de Ejecucion - Cronograma Rapido (10 Dias)

Plan de trabajo del **Sprint de desarrollo del PMV** del proyecto TAMI, organizado bajo los bloques de un ciclo de desarrollo agil.

---

## Mapa del Ciclo (10 dias)

```text
Dia 1          Dias 2-4         Dias 5-8          Dia 9         Dia 10
[Planning] --> [Diseno] --> [Desarrollo] --> [QA / Pruebas] --> [Revision]
```

---

## Dia 1: Planificacion (Planning)

**Objetivo**: Definir el alcance exacto del incremento y asignar tareas.

| Actividad | Responsable | Entregable |
|-----------|-------------|------------|
| Definir vision y alcance del Sprint (autenticacion + campus + escudo) | Nahuel (PO) | Objetivo del Sprint |
| Descomponer en historias y tareas tecnicas | Rachael (SM) | Sprint Backlog |
| Estimar horas por tarea y definir prioridades | Todo el equipo | Tabla de estimacion |
| Definir criterios de aceptacion de la US-001 | Nahuel (PO) | Criterios de aceptacion |
| Configurar tablero Kanban (Por hacer / En curso / Hecho) | Rachael (SM) | Tablero Kanban |

## Dias 2 a 4: Diseno y Prototipado

**Objetivo**: Diseñar la interfaz accesible antes de programar.

| Dia | Actividad | Responsable | Entregable |
|-----|-----------|-------------|------------|
| 2 | Wireframes de las 10 pantallas (papel o herramienta) | Ezequiel (Dev) | Wireframes |
| 2 | Flujo de navegacion lineal (registro → test → dashboard) | Rachael (SM) | Mapa de navegacion |
| 3 | Design System: paleta, tipografia, botones, componentes | Ezequiel (Dev) | Design System (CSS variables) |
| 3 | Redaccion de textos claros para adultos mayores | Todos | Microcopy |
| 4 | Prototipo estatico HTML/CSS de alta fidelidad | Ezequiel (Dev) | Prototipo aprobado |
| 4 | Validacion del prototipo con guia de marca y contraste AA | Rachael (SM) | Verificacion de accesibilidad |

## Dias 5 a 8: Desarrollo Tecnico (Full Stack)

**Objetivo**: Programar backend, base de datos y frontend accesible.

| Dia | Actividad | Responsable | Detalle tecnico |
|-----|-----------|-------------|-----------------|
| 5 | Esquema de base de datos (schema.sql) | Ezequiel (Dev) | Tabla usuarios + cursos + alertas + progreso |
| 5 | Configuracion del servidor Express | Ezequiel (Dev) | index.js, db.js, middlewares |
| 6 | Endpoints de autenticacion | Ezequiel (Dev) | POST registrar (bcrypt) + POST login (bcrypt) |
| 6 | Endpoints de catalogos | Ezequiel (Dev) | GET cursos + GET alertas |
| 7 | Maquetacion HTML accesible | Ezequiel (Dev) | HTML5 semantico + ARIA |
| 7 | Estilos CSS con Design System | Ezequiel (Dev) | Paleta 60-30-10, botones 52px+, responsive |
| 8 | Logica JS + conexion fetch | Ezequiel (Dev) | Validaciones, sesion, test, leccion, examen |
| 8 | Fallback LocalStorage offline | Ezequiel (Dev) | cache para API caida |

## Dia 9: Pruebas (QA)

**Objetivo**: Validar calidad tecnica y de experiencia.

| Actividad | Responsable | Verificacion |
|-----------|-------------|--------------|
| Validacion de enlaces y navegacion | Rachael (SM) | Todos los botones y breadcrumbs funcionan |
| Pruebas de inyeccion SQL | Ezequiel (Dev) | Consultas parametrizadas, sin concatenacion |
| Pruebas de sanitizacion de entradas | Ezequiel (Dev) | Emails invalidos, passwords cortos rechazados |
| Verificacion de datos en PostgreSQL | Ezequiel (Dev) | `SELECT` de usuarios, cursos, alertas |
| Auditoria de accesibilidad con axe DevTools | Rachael (SM) | 0 violaciones criticas |
| Verificacion del KPI con usuarios de prueba | Solo adultos mayores | Registro autonomo >= 80% |

## Dia 10: Revision y Retrospectiva

**Objetivo**: Demostrar el incremento y aprender del proceso.

| Actividad | Responsable | Resultado |
|-----------|-------------|-----------|
| Demostracion del PMV ante los docentes | Todo el equipo | Anderson y Lambertucci prueban el sistema |
| Lectura de KPIs y metricas del Sprint | Rachael (SM) | Reporte de cumplimiento |
| Retrospectiva (que salio bien / que mejorar) | Rachael (SM) | Acciones de mejora anotadas |
| Actualizacion del backlog para proximo sprint | Nahuel (PO) | Backlog refinado |
| Commit final con etiqueta de version | Ezequiel (Dev) | Tag `v1.0.0` |

---

## Riesgos y Mitigacion

| Riesgo | Probabilidad | Mitigacion |
|--------|--------------|------------|
| PostgreSQL no disponible en la maquina de examen | Media | Fallback LocalStorage probado |
| Falta de tiempo por carga de otras materias | Alta | Priorizar PMV: autenticacion + modulo 4 |
| Dificultades de red para `npm install` | Baja | Descargar dependencias con anticipacion |
| Adultos mayores no disponibles para QA | Alta | Simulacion con docentes + checklist WCAG automatizado |