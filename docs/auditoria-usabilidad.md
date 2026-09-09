# Auditoria de Usabilidad y UX - TAMI

Evaluacion de la interfaz del PMV V1.0 aplicando las heurísticas de **Nielsen**, la **accesibilidad WCAG 2.1 AA** y los criterios de **ISO 9241-210** (DCU).

---

## 1. Lista de Chequeo en 6 Dimensiones

### Dimension 1: Panorama General y Primera Impresion

| # | Pregunta | Estado | Evidencia |
|---|----------|--------|-----------|
| 1.1 | El proposito del sitio se entiende en menos de 5 segundos | Cumple | Hero con titulo, mision y 2 botones claros |
| 1.2 | Existe jerarquia visual clara (titulo > subtitulo > acciones) | Cumple | `h1` TAMI, `h2` Bienvenido, buttons grandes |
| 1.3 | El diseno transmite confianza y calma | Cumple | Paleta Cian Glacial / Teal Oscuro |

### Dimension 2: Capacidad de Aprendizaje (Learnability)

| # | Pregunta | Estado | Evidencia |
|---|----------|--------|-----------|
| 2.1 | Los patrones corresponden a modelos mentales del mundo real | Cumple | Botones tipo tarjeta, lenguaje coloquial ("Elegi una opcion") |
| 2.2 | El flujo principal (registro → test → dashboard) es lineal y simple | Cumple | 3 pasos sin ramificaciones |
| 2.3 | Los textos usan lenguaje no tecnico | Cumple | "Estas en un entorno seguro", sin jerga |
| 2.4 | El usuario puede recuperarse de un error sin perdida de datos | Cumple | Errores inline visibles por campo |

### Dimension 3: Proteccion contra Errores y Recuperacion

| # | Pregunta | Estado | Evidencia |
|---|----------|--------|-----------|
| 3.1 | Los formularios validan en tiempo real | Cumple | Validacion client-side con `role="alert"` |
| 3.2 | Los errores no son punitivos ni tecnicos | Cumple | Mensajes en espanol: "La contrasena debe tener al menos 6 caracteres" |
| 3.3 | Las acciones irreversibles piden confirmacion | A mejorar | "Cerrar sesion" no pide confirmacion antes de ejecutarse |
| 3.4 | El usuario conoce que campos son obligatorios | Cumple | `aria-required` + mensajes claros |

### Dimension 4: Heuristicas de Nielsen

| # | Heuristica | Estado | Evidencia |
|---|------------|--------|-----------|
| 4.1 | Visibilidad del estado del sistema | Cumple | Mensajes globales `aria-live` y textos de resultado |
| 4.2 | Control y libertad del usuario | Cumple | Boton "Volver" en cada pantalla + breadcrumbs |
| 4.3 | Consistencia y estandares | Cumple | Misma paleta, mismas clases de boton, mismos nombres |
| 4.4 | Reconocimiento en lugar de recuerdo | Cumple | Todas las opciones siempre visibles, sin menus ocultos |
| 4.5 | Flexible y eficiente | A mejorar | No hay atajos de teclado ni autocompletado avanzado |

### Dimension 5: Estetica y Diseno Minimalista

| # | Pregunta | Estado | Evidencia |
|---|----------|--------|-----------|
| 5.1 | Hay espacio en blanco suficiente | Cumple | Padding 24-32px en contenedores |
| 5.2 | No hay informacion redundante | Cumple | Cada pantalla tiene un solo proposito |
| 5.3 | Los colores no son el unico canal de informacion | Cumple | Severidad de alertas con icono + color + texto |
| 5.4 | El contraste cumple WCAG AA | Cumple | Teal Oscuro sobre Cian Glacial (contraste alto) |

### Dimension 6: Accesibilidad WCAG 2.1 AA

| # | Criterio | Estado | Evidencia |
|---|----------|--------|-----------|
| 6.1 | Navegacion por teclado (Tab/Enter) | Cumple | Todos los controles son `<button>` nativos focuseables |
| 6.2 | Saltar bloques de navegacion (2.4.1) | Cumple | Skip link al inicio del body |
| 6.3 | Contraste de color (1.4.3) | Cumple | Paleta de contraste alto |
| 6.4 | Textos alternativos (1.1.1) | Cumple | Iconos `aria-hidden`, descripciones con texto real |
| 6.5 | Tamano de objetivo tactil (2.5.5) | Cumple | Botones 52px minimo / 60px masivos |
| 6.6 | Lenguaje claro (3.1.1) | Cumple | `lang="es"` y textos en espanol |
| 6.7 | Sin ventanas emergentes (sin `target="_blank"`) | Cumple | No existe ningun `target="_blank"` |
| 6.8 | Movimiento reducido (2.3.3) | Cumple | Media query `prefers-reduced-motion` |

---

## 2. Matriz de Hallazgos y Soluciones QA

| Criterio Evaluado | Estado | Hallazgo / Problema Detectado | Propuesta de Solucion Tecnica |
|-------------------|--------|-------------------------------|-------------------------------|
| 3.3 Confirmacion de acciones irreversibles | A mejorar | "Cerrar sesion" se ejecuta sin confirmacion; un mayor con vision reducida podria cerrarla por error | Agregar un flujo de confirmacion con `confirm()` accesible o dialogo `<dialog>` con botones "Si, cerrar" / "Cancelar" (SIEMPRE con foco en el boton de cancelar) |
| 4.5 Flexible y eficiente | A mejorar | No hay atajos de teclado para usuarios avanzados | Registrar atajo `Alt + C` para Campus, `Alt + E` para Escudo y `Alt + P` para Progreso (documentado en una pantalla de ayuda marca como opcional) |
| 4.1 Visibilidad del estado | Cumple | — | — |
| 2.4 Recuperacion ante errores | Cumple | — | — |
| 6.2 Skip link | Cumple | El skip link existe pero se despliega solo con foco (por CSS `top: -100%`) | Verificar con screen reader que el skip link sea anunciado; mantener el patron actual |
| 5.4 Contraste de estado "disponible" | A mejorar | `#E07B00` (borde de alerta) sobre `#FFF3E0` tiene contraste borderline en textos pequenos | Subir el tono a `#C25700` y verificar con axe DevTools que el ratio supere 4.5:1 |
| 6.7 Sin ventanas emergentes | Cumple | — | — |
| 6.8 Movimiento reducido | Cumple | — | — |
| 1.1 Proposito en 5s | Cumple | — | — |
| 2.2 Flujo lineal simple | Cumple | — | — |
| 6.5 Tamano de objetivo | Cumple | — | — |
| 3.1 Validacion en tiempo real | A mejorar | La validacion ocurre SOLO al enviar el formulario, no mientras se escribe | Escuchar `input` en cada campo y validar inmediatamente; reportar el error al salir del campo (`blur`) y re-validar en `input` |

---

## 3. Protocolo de Verificacion (Plan de Pruebas)

### 3.1 Herramientas

- **axe DevTools** (extension del navegador): detecta violaciones WCAG automaticas.
- **Lighthouse** (Chrome DevTools): reporte de accesibilidad, buenas practicas y SEO.
- **Verificacion manual con lector de pantalla** (NVDA o VoiceOver).
- **Verificacion de teclado**: recorrer todo el sitio solo con Tab / Shift+Tab / Enter.

### 3.2 Criterios de Aprobacion

- 0 violaciones de severidad critica en axe DevTools.
- 100% de las pantallas navegables con teclado sin quedar atascado.
- Auditores manuales (docentes) y adultos mayores pueden completar el registro en menos de 180 segundos.