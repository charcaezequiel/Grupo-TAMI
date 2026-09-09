# Auditoría de Usabilidad y UX - TAMI

**Actividad práctica**: Auditoría de Usabilidad y UX
**Proyecto**: TAMI - Tecnología Amigable para Mayores e Inclusiva
**Modalidad**: En parejas (Rachael Choque y Ezequiel Charca)
**Tiempo invertido**: 60 minutos
**Fecha**: Septiembre 2026

**Objetivo**: Evaluar la interfaz de la plataforma mediante una lista de chequeo basada en los criterios fundamentales de experiencia de usuario (principios de Nielsen, accesibilidad WCAG y prevención de errores) e identificar oportunidades de mejora.

---

## Criterios de Evaluación

### 1. Panorama General y Primera Impresión

*Evaluación del propósito y claridad de la interfaz al ingresar por primera vez.*

- [x] **Claridad del propósito**: ¿Es evidente de qué trata el sitio/aplicación dentro de los primeros 5 segundos?
  - *Resultado*: **Cumple**. El hero de bienvenida muestra el título "Bienvenido a TAMI", la misión ("aprender a usar tus dispositivos de forma segura y protegerte de las estafas en línea") y dos botones de acción claros. El propósito se comprende en menos de 5 segundos.
- [x] **Jerarquía visual**: ¿Los elementos principales (títulos, acciones primarias) destacan sobre los secundarios?
  - *Resultado*: **Cumple**. Los títulos usan Teal Oscuro (`#0A4B5C`) en 28-36px, los botones primarios son masivos (60px) y las acciones de registro/login sobresalen sobre el fondo Cian Glacial.
- [x] **Consistencia de marca**: ¿El estilo visual transmite confianza y alineación con el dominio del proyecto?
  - *Resultado*: **Cumple**. La paleta "Protección Proactiva" (Cian Glacial, Teal Oscuro, Teal Contraste) y los íconos de escudo transmiten calma y confianza, alineada con la protección contra el fraude digital.

### 2. Capacidad de Aprendizaje (Learnability)

*Facilidad para que un usuario nuevo realice tareas básicas sin entrenamiento previo.*

- [x] **Sencillez inicial**: ¿El usuario puede completar la tarea principal sin necesidad de consultar tutoriales o ayuda externa?
  - *Resultado*: **Cumple**. El flujo registro → test de nivelación → dashboard es lineal, con botones de texto explícito ("Crear mi cuenta", "Ya tengo cuenta, ingresar") que no requieren instrucciones previas.
- [x] **Modelos mentales conocidos**: ¿Los íconos, botones y términos utilizados corresponden a lo que el usuario espera en el mundo real?
  - *Resultado*: **Cumple**. Íconos estándar (📚 Campus, 🔒 Escudo, 📊 Progreso) acompañados siempre de texto, lenguaje coloquial ("Elegí una opción", "Estás en un entorno seguro").
- [x] **Estructura navegable**: ¿La arquitectura de la información es intuitiva y sigue patrones estándar?
  - *Resultado*: **Cumple**. Árbol de 3 niveles (Dashboard → Categoría → Módulo/Ficha) con breadcrumbs en cada pantalla y botones "Volver" visibles.

### 3. Protección contra Errores y Recuperación

*Mecanismos para prevenir acciones no deseadas y solucionar fallos de forma clara.*

- [ ] **Prevención de errores**: ¿La interfaz solicita confirmación antes de ejecutar acciones irreversibles (p. ej., eliminar datos)?
  - *Resultado*: **A mejorar**. El botón "Cerrar sesión" ejecuta la acción inmediatamente, sin pedir confirmación. Un usuario mayor podría cerrar la sesión por error.
- [x] **Formularios asistidos**: ¿Se aplican validaciones en tiempo real para evitar envíos con datos incorrectos?
  - *Resultado*: **Cumple**. Los formularios de registro/login validan nombre, email y contraseña al enviar, mostrando mensajes de error junto al campo con `role="alert"`.
- [x] **Mensajes de error claros**: Cuando ocurre un fallo, ¿el mensaje explica qué sucedió y cómo solucionarlo de manera sencilla?
  - *Resultado*: **Cumple**. Mensajes en español no punitivos: "El correo electrónico no es válido. Usá el formato correo@dominio.com" y "La contraseña debe tener al menos 6 caracteres".

### 4. Principios de Nielsen (Heurísticas Clave)

*Revisión de la usabilidad basada en las heurísticas de Jakob Nielsen.*

- [x] **Visibilidad del estado del sistema**: ¿La interfaz muestra claramente en qué sección se encuentra el usuario o el progreso de una acción (spinners, barras de carga)?
  - *Resultado*: **Cumple**. Breadcrumbs con `aria-current="page"` indican la sección actual, los resultados del test/examen se anuncian con `aria-live` y las barras de progreso muestran el avance.
- [x] **Control y libertad del usuario**: ¿Existen opciones claras para cancelar, regresar o deshacer una acción fácilmente?
  - *Resultado*: **Cumple**. Botones "← Volver" en todas las pantallas y breadcrumbs clicables permiten regresar en cualquier momento sin pérdida de datos.
- [x] **Consistencia y estándares**: ¿Se mantienen las mismas palabras, colores y estilos visuales en todas las pantallas?
  - *Resultado*: **Cumple**. Misma paleta (CSS variables), mismas clases de botón, mismos nombres en menú y breadcrumbs (ej. "Campus Educativo" en ambas partes).

### 5. Estética y Diseño Minimalista

*Evaluación del equilibrio visual y la carga cognitiva de la pantalla.*

- [x] **Claridad sin saturación**: ¿Se elimina la información irrelevante o redundante para evitar distracciones?
  - *Resultado*: **Cumple**. Cada pantalla tiene un único propósito; el dashboard presenta solo 3 tarjetas de acceso y las alertas muestran información accionable.
- [x] **Uso del espacio en blanco**: ¿Existe suficiente separación entre elementos para facilitar la lectura?
  - *Resultado*: **Cumple**. Espaciado base de 16px con escala hasta 32px, contenedores con padding de 24-32px e interlineado 1.6-1.7.
- [x] **Contraste y tipografía**: ¿El tamaño de la fuente y los colores permiten una lectura fluida?
  - *Resultado*: **Cumple**. Fuente base 18px (mínimo), títulos hasta 36px; contraste alto de Teal Oscuro sobre Cian Glacial y blanco sobre Teal Oscuro (ratio superior a 4.5:1).

### 6. Accesibilidad (WCAG Básica)

*Garantía de que la plataforma sea utilizable por el mayor número posible de personas.*

- [x] **Navegación por teclado**: ¿Es posible navegar por toda la interfaz utilizando únicamente la tecla Tab y Enter?
  - *Resultado*: **Cumple**. Todos los controles son buttons e inputs nativos; existe skip link "Saltar al contenido principal" y `:focus-visible` visible en todos los elementos.
- [x] **Contraste de color**: ¿El texto cumple con la relación de contraste suficiente respecto al fondo?
  - *Resultado*: **Cumple**. Textos principales en Teal Oscuro sobre Cian Glacial y blanco sobre Teal Oscuro superan el ratio AA. El color secundario (`#55666D`) se revisa en la matriz.
- [x] **Textos alternativos (Alt Text)**: ¿Las imágenes con carga informativa cuentan con descripciones textuales para lectores de pantalla?
  - *Resultado*: **Cumple**. Los íconos decorativos usan `aria-hidden="true"` y la información siempre se complementa con texto; no hay imágenes informativas sin `alt` funcional.

---

## Entregable de la Actividad - Matriz de Hallazgos y Soluciones

Al finalizar la auditoría se completa la matriz con los hallazgos encontrados:

| Criterio Evaluado | Estado (Cumple / A mejorar) | Hallazgo o Problema Detectado | Propuesta de Solución |
|-------------------|-----------------------------|-------------------------------|------------------------|
| Protección contra Errores | A mejorar | El botón "Cerrar sesión" ejecuta la acción sin pedir confirmación; un usuario con visión reducida o motricidad fina podría cerrar la sesión por error. | Agregar un diálogo de confirmación accesible (`<dialog>` o `confirm()`) con botones "Sí, cerrar sesión" y "Cancelar", colocando el foco inicial en "Cancelar". |
| Accesibilidad (Contraste) | A mejorar | El texto secundario (`#55666D`) sobre fondo blanco tiene un contraste cercano al límite del ratio AA para texto de tamaño normal. | Oscurecer el gris secundario a `#4A4A4A` para garantizar un ratio ≥ 4.5:1 en todo el texto secundario, y verificar con axe DevTools. |
| Accesibilidad (Formularios) | A mejorar | Las validaciones de los formularios de registro/login se ejecutan solo al enviar el formulario, no mientras el usuario escribe. | Validar en tiempo real escuchando el evento `input` y `blur` de cada campo; reportar el error apenas el usuario termina de escribir y limpiarlo al corregir. |
| Panorama General | Cumple | El propósito se entiende en menos de 5 segundos gracias al hero con misión y botones claros. | Mantener la estructura actual del hero de bienvenida. |
| Capacidad de Aprendizaje | Cumple | Los íconos de navegación son estándar y reconocibles, siempre acompañados de texto. | Mantener la estructura actual. |
| Principios de Nielsen | Cumple | Breadcrumbs, botones "Volver" y mensajes `aria-live` permiten saber dónde está el usuario y regresar sin pérdida de datos. | Mantener los breadcrumbs y ampliarlos a las nuevas pantallas de los módulos futuros. |
| Estética y Diseño Minimalista | Cumple | La interfaz usa espacio en blanco y tipografía 18px+ con contraste adecuado. | Mantener el Design System "Protección Proactiva". |

---

## Plan de Acción (Mejoras Priorizadas)

| Prioridad | Mejora | Impacto |
|-----------|--------|---------|
| Alta | Confirmación antes de "Cerrar sesión" | Previene errores involuntarios |
| Alta | Validación en tiempo real de formularios | Reduce la tasa de errores (KPI ≤ 1.5/usuario) |
| Media | Oscurecer texto secundario a `#4A4A4A` | Garantiza contraste AA en todo el texto |
| Baja | Reauditar con axe DevTools al habilitar nuevos módulos | Mantiene 0 violaciones críticas |

---

*Documento de entregable académico - Actividad Auditoría de Usabilidad y UX - Proyecto Integrador III - TAMI (2026).*