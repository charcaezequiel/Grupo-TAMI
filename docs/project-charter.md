# Project Charter - TAMI

## Tecnologia Amigable para Mayores e Inclusiva

**Institucion**: ET N°20 DE 20 "Carolina Muzilli" - Polo Educativo de Mataderos
**Materia**: Proyecto Integrador III - 6° 2°
**Profesores**: Anderson y Lambertucci

---

## 1. Mision (Resumen ejecutivo)

Reducir la **brecha digital** y mitigar los **riesgos de fraude en linea** en personas adultas mayores, mediante una plataforma web amigable, inclusiva, segura y accesible que las integre a la tecnologia con confianza.

## 2. Vision

Un espacio digital donde ninguna persona mayor quede afuera: aprender, protegerse y comunicarse con autonomia.

## 3. Alcance del PMV V1.0

### Dentro del alcance

1. Sistema de registro y login accesible (frontend + backend + PostgreSQL).
2. Test de nivelacion digital inicial.
3. Dashboard de entorno seguro con 4 accesos (Campus, Escudo, Trabajos, Progreso).
4. Campus educativo con los 5 cursos activos y 4 niveles desbloqueables por curso.
5. Escudo de Seguridad con 15 retos antiestafa y demo publica en el inicio.
6. Examen por nivel, mini trabajos, certificado imprimible y visualizacion de progreso.
7. Fallback offline con LocalStorage, PWA instalable y boton de ayuda.

### Fuera del alcance (v1.0)

- Pagos, compras ni transacciones.
- Notificaciones push o SMS.
- Contenido generado por los usuarios (foros, comentarios publicos).

## 4. Equipo y Roles (Scrum)

| Integrante | Rol | Responsabilidad |
|------------|-----|-----------------|
| Nahuel Luciano Ancelmo | Product Owner (PO) | Vision, priorizacion de backlog, validacion del PMV |
| Rachael Choque | Scrum Master (SM) | Ceremonias, tablero, eliminacion de impedimentos |
| Ezequiel Charca | Dev Team | Diseno, programacion full stack, testing |

## 5. Stack Tecnologico

- **Frontend**: HTML5 semantico, CSS3 accesible, JavaScript nativo (`fetch`).
- **Backend**: Node.js + Express (REST API).
- **Base de datos**: PostgreSQL (persistencia relacional segura).
- **Seguridad**: hashing bcrypt, consultas parametrizadas, validacion de entradas.
- **Accesibilidad**: WCAG 2.1 AA, ARIA, Design System "Proteccion Proactiva".

## 6. Criterios de Exito

1. El registro autonomo de adultos mayores alcanza **>= 80%** de exito.
2. Zero violaciones criticas de accesibilidad en axe DevTools.
3. Aplicacion funcional de punta a punta (frontend + API + PostgreSQL).
4. Hashing de contrasenas con bcrypt (sin texto plano ni SHA-256).
5. Documentacion completa de las 5 actividades del Proyecto Integrador.

## 7. Riesgos principales

| Riesgo | Impacto | Mitigacion |
|--------|---------|------------|
| Dependencia de PostgreSQL en el equipo de prueba | Alto | Fallback LocalStorage |
| Disponibilidad de adultos mayores para QA | Alto | Simulacion con docentes |
| Acumulacion de carga de otras materias | Medio | Cronograma de 10 dias acotado |

## 8. Hitos

| Hito | Fecha estimada |
|------|----------------|
| PMV funcional backend + BD | A mitad del ciclo |
| Frontend accesible completo | Dia 8 |
| QA y verificacion de KPIs | Dia 9 |
| Demo ante docentes | Dia 10 |

---

*Documento de constitucion del proyecto - Aprobado por el equipo Scrum.*