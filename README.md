# TAMI - Tecnología Amigable para Mayores e Inclusiva

Proyecto de la **ET N°20 DE 20 "Carolina Muzilli"** - Polo Educativo de Mataderos.
Curso: 6° 2° - Proyecto Integrador III.

**Misión**: Reducir la brecha digital y mitigar los riesgos de fraude en adultos mayores mediante una plataforma web amigable, inclusiva y accesible.

## Equipo (Scrum) y Responsabilidades

| Integrante             | Rol de Scrum               | Responsabilidades específicas                                          |
|------------------------|----------------------------|-------------------------------------------------------------------------|
| Nahuel Luciano Ancelmo | Product Owner (PO)         | Definir la visión del producto, priorizar el backlog y validar el PMV.  |
| Rachael Choque         | Scrum Master (SM)          | Facilitar las ceremonias, eliminar impedimentos y cuidar el proceso.    |
| Ezequiel Charca        | Equipo de Desarrollo (Dev) | Diseñar y construir la interfaz, la lógica y la capa de persistencia.   |

## Tecnología y Arquitectura

- **Frontend**: HTML5, CSS3 y JavaScript nativo.
- **Arquitectura**: Cliente-Servidor en 3 capas (Presentación, Lógica y Datos).
- **Persistencia**: LocalStorage (evita dependencias externas y servidores propios).
- **Nomenclatura**: kebab-case en archivos y carpetas.
- **Design System**: "Protección Proactiva" (`#EBF8FA` y `#0A4B5C`).

## Mapa del Repositorio

```text
grupo-tami/
├── README.md               Documentación principal del proyecto
├── code/                   Capas de Presentación y Lógica
│   ├── index.html          Estructura accesible (Presentación)
│   ├── styles.css          Design System "Protección Proactiva" (Presentación)
│   ├── main.js             Lógica + Escudo de Seguridad + LocalStorage (Lógica/Datos)
│   └── README.md
├── resources/              Activos multimedia
│   ├── img/                Imágenes
│   ├── icons/              Iconos de trazo grueso (SVG)
│   ├── fonts/              Fuentes de alta legibilidad
│   ├── branding-guide.md   Paleta cromática proactiva
│   └── README.md
└── docs/                   Documentación obligatoria (ET N°20)
    ├── project-charter.md  Project Charter
    ├── plan-de-proyecto.md Plan de Proyecto
    ├── cronograma-gantt.md Diagrama de Gantt
    ├── backlog-sprints.md  Backlog y Sprints
    ├── design-system.md    Design System
    └── README.md
```

## Justificación: Relación Teoría-Práctica

- **Scrum**: los roles (PO, SM, Dev) organizan la colaboración del equipo y el avance por sprints documentado en `docs/backlog-sprints.md`.
- **DCU (Diseño Centrado en el Usuario)**: la paleta proactiva, los iconos de trazo grueso y las fuentes de alta legibilidad responden a las necesidades y limitaciones de los adultos mayores.
- **PMV (Producto Mínimo Viable)**: se parte de una página funcional con persistencia local antes de sumar funciones avanzadas, priorizando lo esencial del PMV.

## Enlaces

- [Documentación técnica](docs/README.md)
- [Guía de marca](resources/branding-guide.md)
