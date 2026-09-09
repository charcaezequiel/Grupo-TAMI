# Backlog y Sprints - TAMI

Documento de **gestion de trabajo del equipo Scrum**. Contiene el backlog del producto y el detalle del **Sprint 1 (Sistema de Autenticacion Accesible)**.

---

## 1. Backlog del Producto (Priorizado)

| # | Historia | Prioridad | Valor | Sprint estimado |
|---|----------|-----------|-------|-----------------|
| US-001 | Como persona mayor quiero registrarme solx para acceder a contenido seguro sin ayuda | Alta | Autenticacion inclusiva | Sprint 1 |
| US-002 | Como persona mayor quiero iniciar sesion con mi correo y contrasena para volver a mi entorno | Alta | Reingreso sin friccion | Sprint 1 |
| US-003 | Como persona mayor quiero saber mi nivel digital para recibir contenido adecuado | Media | Personalizacion | Sprint 1 |
| US-004 | Como persona mayor quiero aprender sobre fraudes digitales para protegerme | Alta | Educacion en ciberseguridad | Sprint 1 |
| US-005 | Como persona mayor quiero ver alertas de fraude para saber que estafas estan circulando | Alta | Proteccion proactiva | Sprint 1 |
| US-006 | Como persona mayor quiero ver mi progreso para motivarme a seguir aprendiendo | Media | Motivacion y refuerzo | Sprint 2 |

---

## 2. SPrint 1 - Sistema de Autenticacion Accesible

### 2.1 Objetivo del Sprint (3.1)

> **Desarrollar un sistema de autenticacion inclusivo, seguro y de alta mantenibilidad** que permita a las personas adultas mayores registrarse e ingresar a TAMI de forma autonoma, utilizando una interfaz de alto contraste, botones de gran tamano y mensajes claros, con contraseñas protegidas mediante hashing irreversible (bcrypt) y validacion estricta de entradas en el servidor.

### 2.2 Indicadores de exito (KPIs) (3.2)

| KPI | Definicion | Meta |
|-----|------------|------|
| **Tasa de Exito de Registro Autonomo** | % de personas mayores que completan el registro sin asistencia | **>= 80%** |
| **Tasa de Errores de Validacion** | Promedio de mensajes de error por usuario durante el registro | **<= 1.5 / usuario** |
| **Tiempo de Completitud** | Segundos desde que abre el formulario hasta que crea la cuenta | **<= 180 s** |

### 2.3 Historia de Usuario US-001 (3.3)

```
Historia: US-001
Titulo: Registro autonomo de adulto mayor
Como: persona mayor con poca experiencia digital
Quiero: crear mi cuenta en TAMI sin ayuda de otra persona
Para: acceder a contenido y alertas que me protejan de estafas
```

#### Criterios de Aceptacion (estrictos - WCAG 2.1 AA e ISO 9241-210)

1. **Objetivo tactil**: el boton "Registrar mi cuenta" y todos los campos superan **52px** de altura (WCAG 2.5.5).
2. **Contraste alto**: textos en Teal Oscuro sobre fondo Cian Glacial con ratio >= 4.5:1 (WCAG 1.4.3).
3. **Nada de ventanas emergentes**: ninguna accion abre `target="_blank"` ni redirige fuera de la app.
4. **Etiquetas explicitas**: cada campo tiene `<label>` asociada por `for`/`id` (WCAG 1.3.1, 2.4.6).
5. **Errores legibles**: los errores se muestran en espanol, cercanos al campo, con `role="alert"`.
6. **Validacion de email**: formato `correo@dominio.com` verificado en frontend Y backend.
7. **Password minimo**: 6 caracteres, verificados en frontend Y backend.
8. **Hashing irreversible**: la contrasena se guarda como hash bcrypt, nunca en texto plano.
9. **Recuperacion de flujo**: existe boton "Volver" y breadcrumb hacia atras en todo momento.
10. **Feedback de exito**: al completarse, se muestra mensaje de exito via `aria-live`.

### 2.4 Sprint Backlog Tecnico (3.4)

| ID Tarea | Tarea Tecnica | Responsable | Prioridad | Est. Horas | Dependencia Logica | Atributo de Calidad ISO/IEC 25010 |
|----------|---------------|-------------|-----------|------------|--------------------|-----------------------------------|
| T-01 | Crear tabla `usuarios` en schema.sql con restricciones NOT NULL y UNIQUE email | Ezequiel | Alta | 1 | — | Confiabilidad |
| T-02 | Configurar pool de conexion Postgres (db.js) y variables de entorno | Ezequiel | Alta | 1 | T-01 | Confiabilidad |
| T-03 | Implementar endpoint POST /registrar con validacion de email y nombre | Ezequiel | Alta | 2 | T-02 | Seguridad |
| T-04 | Implementar hashing bcrypt (costo 12) antes de insertar en BD | Ezequiel | Alta | 1.5 | T-03 | Seguridad |
| T-05 | Implementar endpoint POST /login con comparacion segura bcrypt | Ezequiel | Alta | 2 | T-04 | Seguridad |
| T-06 | Maquetar formulario de registro y login en HTML5 con ARIA | Ezequiel | Alta | 2 | — | Usabilidad |
| T-07 | Estilizar formularios con contraste AA y botones 52px+ | Ezequiel | Alta | 2 | T-06 | Usabilidad |
| T-08 | Implementar validacion client-side con mensajes no punitivos | Ezequiel | Media | 1.5 | T-06 | Usabilidad |
| T-09 | Conectar formularios con fetch a la API REST | Ezequiel | Alta | 1.5 | T-03, T-06 | Funcionalidad |
| T-10 | Implementar fallback LocalStorage cuando la API no responde | Ezequiel | Media | 1.5 | T-09 | Confiabilidad |
| T-11 | Guardar sesion y redireccionar a test de nivelacion | Ezequiel | Alta | 1 | T-09 | Funcionalidad |
| T-12 | Redactar protocolo de prueba de caja negra para validar KPIs | Rachael | Alta | 1.5 | T-09 | Usabilidad |
| T-13 | Ejecutar pruebas con usuarios adultos mayores y medir KPIs | Todos | Alta | 2 | T-12 | Usabilidad |
| T-14 | Auditoria de accesibilidad (axe DevTools + teclado) del flujo | Rachael | Media | 1 | T-12 | Usabilidad |
| T-15 | Documentar criterios de aceptacion y evidencias del Sprint | Nahuel | Media | 1 | T-13 | Mantenibilidad |

**Total estimado**: ~22.5 horas de desarrollo.

### 2.5 Instrumentos de Seguimiento Grupal (3.6)

#### Tablero Kanban

```
┌───────────────┬───────────────┬──────────────┐
│ POR HACER     │ EN CURSO      │ HECHO        │
├───────────────┼───────────────┼──────────────┤
│ T-12, T-13    │ T-11          │ T-01 ... T-10│
│ T-14, T-15    │               │              │
└───────────────┴───────────────┴──────────────┘
```

- Columna 1 **Por hacer**: backlog ordenado por prioridad.
- Columna 2 **En curso**: maximas 2 tarjetas por persona (limit WIP).
- Columna 3 **Hecho**: solo cuando la tarjeta cumple su Definition of Done.
- Ubicacion sugerida: Trello, GitHub Projects o pizarra fisica del taller.

#### Reuniones Daily Stand-up (15 minutos)

Cada dia, antes de arrancar, el equipo responde 3 preguntas:

1. **¿Que hice ayer?** (avance concreto)
2. **¿Que voy a hacer hoy?** (proxima tarjeta del tablero)
3. **¿Que me bloquea?** (impedimentos que el Scrum Master debe resolver)

El Scrum Master (Rachael) actualiza el tablero y el Product Owner (Nahuel) valida que el avance cumpla los criterios de aceptacion.

### 2.6 Verificacion del KPI (3.7) - Protocolo de Caja Negra

**Objetivo**: validar que las metas cuantitativas del Sprint 1 se cumplen.

#### Muestra

- 5 adultos mayores representativos (con distintos niveles de experiencia digital).
- 2 moderadores (1 anota, 1 guia sin intervenir).
- Ambiente tranquilo, sin ruido, con dispositivo y navegador configurados.

#### Procedimiento

1. Se le entrega al participante una tarjeta impresa con un **escenario**:
   > "Quiero crear una cuenta nueva para entrar a TAMI. Tengo mi correo y una contrasena en mente."

2. El moderador **no interviene** salvo peligro de abandono (despues de 60s sin accion se permite ayuda, y se marca).

3. Se registran en planilla:
   - Completado autonomamente: **si/no**.
   - Cantidad de errores de validacion mostrados por pantalla.
   - Tiempo total desde apertura del formulario hasta pantalla de exito (cronometro).

#### Formulas de calculo

```text
Tasa de Exito = (participantes que completaron solos / total) * 100    >= 80%
Errores por usuario = total errores contados / total participantes      <= 1.5
Tiempo de completitud = promedio de tiempos individuales                <= 180 s
```

#### Criterio de aprobacion

- Los 3 KPIs deben cumplirse. Si alguno falla, se prioriza en el proximo Sprint con una tarea de mejora y se repite la prueba.

---

## 3. Registro de Avance por Sprint

| Sprint | Objetivo | Fecha | Estado | Notas |
|--------|----------|-------|--------|-------|
| Sprint 1 | Sistema de autenticacion accesible (registro + login) | Semana 1 | En curso | US-001 a US-005 |
| Sprint 2 | Campus educativo completo y gamificacion | Semana 2 | Planificado | US-006 + modulos 1,2,3,5 |
| Sprint 3 | Retroalimentacion docentes y entrega final | Semana 3 | Planificado | Demo ante Profesores |

> **Documento vivo**: se actualiza en cada Daily Stand-up y al cierre de cada Sprint.