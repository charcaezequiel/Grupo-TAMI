# Documentación - TAMI

Carpeta de **documentación técnica y administrativa** del proyecto. Contiene la trazabilidad que la **ET N°20** exige y la evidencia del proceso Scrum.

## Índice de Documentación

| Archivo | Documento | Contenido |
|---------|-----------|-----------|
| `project-charter.md` | Project Charter | Acta de constitución: misión, alcance, equipo y roles. |
| `plan-de-proyecto.md` | Plan de Proyecto | Planificación general, entregables y criterios de éxito. |
| `cronograma-gantt.md` | Diagrama de Gantt | Cronograma de sprints, hitos y responsables. |
| `backlog-sprints.md` | Backlog y Sprints | Backlog del producto y registro de avance por sprint. |
| `design-system.md` | Design System | Paleta "Protección Proactiva", tipografías y componentes. |
| `convenciones-desarrollo.md` | Convenciones | Nomenclatura, organización por responsabilidad y ISO/IEC 25010. |
| `arquitectura-informacion.md` | Arquitectura de Información | Árbol de 3 niveles, menú, breadcrumbs y WCAG de navegación. |
| `auditoria-usabilidad.md` | Auditoría UX | Lista de chequeo en 6 dimensiones y matriz de hallazgos QA. |
| `plan-ejecucion-10-dias.md` | Cronograma rápido | Plan de trabajo día a día del ciclo de 10 días. |

## Coherencia entre Documentos y Prototipo

- El **Project Charter** define la misión y el alcance; el **Plan de Proyecto** la descompone en entregables y el **Gantt** los ubica en el tiempo.
- Las **Convenciones de Desarrollo** alinean todo el código con ISO/IEC 25010 (Mantenibilidad prioritaria).
- La **Arquitectura de Información** define la navegación real implementada (breadcrumbs en `code/index.html` y `code/main.js`).
- El **Backlog** registra el Sprint 1 (autenticación) y la **Auditoría de Usabilidad** provee la matriz de hallazgos QA evaluable.
- El **Design System** documenta la paleta y los criterios de accesibilidad que se implementan en `resources/` y `styles.css`.
- Esta cadena garantiza que **lo impreso, lo diseñado y lo desarrollado cuenten la misma historia**.