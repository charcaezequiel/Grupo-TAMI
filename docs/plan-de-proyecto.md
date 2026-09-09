# Plan de Proyecto - TAMI

Planificacion general del Proyecto Integrador III: alcance, entregables, estructura de trabajo y criterios de exito.

---

## 1. Objetivos del Proyecto

1. **Autenticacion accesible**: registro/login que una persona mayor pueda completar sin ayuda (KPI >= 80%).
2. **Educacion en ciberseguridad**: modulo funcional de Fraudes Digitales (phishing) con leccion y examen.
3. **Proteccion proactiva**: centro de alertas de fraude con consejos accionables.
4. **Trazabilidad academica**: documentacion completa respetando ISO/IEC 25010, Nielsen y WCAG 2.1 AA.

## 2. Entregables

| # | Entregable | Ubicacion en el repositorio |
|---|------------|------------------------------|
| 1 | Convenciones de desarrollo (ISO/IEC 25010) | `docs/convenciones-desarrollo.md` |
| 2 | Arquitectura de informacion y navegacion (breadcrumbs) | `docs/arquitectura-informacion.md` |
| 3 | Backend REST API (Node.js + Express + PostgreSQL) | `server/` |
| 4 | Esquema de base de datos | `server/schema.sql` |
| 5 | Frontend accesible (HTML5 + CSS3 + JS) | `code/` |
| 6 | Sprint 1 documentado (objetivo, KPIs, backlog, US-001) | `docs/backlog-sprints.md` |
| 7 | Auditoria de usabilidad (6 dimensiones + matriz QA) | `docs/auditoria-usabilidad.md` |
| 8 | Cronograma rapido de 10 dias | `docs/plan-ejecucion-10-dias.md` |
| 9 | Design System documentado | `docs/design-system.md` |
| 10 | Guia de marca | `resources/branding-guide.md` |

## 3. Organizacion del Trabajo

- **Metodologia**: Scrum (PO, SM, Dev) con sprints cortos.
- **Planificacion**: detalle en `docs/plan-ejecucion-10-dias.md`.
- **Backlog**: detalle en `docs/backlog-sprints.md`.
- **Cronograma general**: detalle en `docs/cronograma-gantt.md`.

## 4. Criterios de Exito y Metrica de Calidad

| Area | Criterio |
|------|----------|
| Funcionalidad | Todos los endpoints responden 200/201/400/401/404 correctamente |
| Seguridad | Contrasenas con bcrypt; SQL parametrizado; entradas validadas |
| Accesibilidad | 0 violaciones criticas axe; navegacion por teclado completa |
| Usabilidad | Registro autonomo >= 80%; tiempos <= 180 s |
| Mantenibilidad | Separacion por capas; nomenclatura estricta; funciones reutilizables |
| Documentacion | Los 5 documentos del Proyecto Integrador presentes y coherentes |

## 5. Estructura del Repositorio (Resumen)

```text
Grupo-TAMI/
├── README.md                 Documentacion principal
├── code/                     Frontend (index.html, styles.css, main.js)
├── server/                   Backend (Express, routes, schema.sql)
├── resources/                Activos multimedia y guia de marca
└── docs/                     Documentacion tecnica y academicia
```

## 6. Puesta en marcha (Resumen)

```bash
createdb -U postgres tami_db
psql -U postgres -d tami_db -f server/schema.sql
cd server && cp .env.example .env && npm install && npm start
# Abrir code/index.html en el navegador
```

Detalle completo en el [README principal](../README.md).