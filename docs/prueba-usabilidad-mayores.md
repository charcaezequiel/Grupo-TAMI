# Prueba de usabilidad con personas mayores

Protocolo para validar TAMI con **5 a 8 personas de 60 años o más**, sin
experiencia técnica previa y con niveles digitales distintos. El objetivo es
comprobar que una persona mayor puede usar el campus por su cuenta, sin ayuda
del equipo, y detectar dónde se traba antes de la entrega.

> Estado: **protocolo listo para ejecutar**. Los resultados se completan en la
> sección 9 después de las sesiones. Hasta entonces, las métricas de la
> sección 8 no deben citarse como obtenidas.

---

## 1. Objetivo y alcance

Se evalúan las tareas centrales del recorrido de aprendizaje:

- crear una cuenta e ingresar;
- hacer el test inicial (u omitirlo);
- entrar a un curso, leer una teoría y resolver el repaso;
- consultar el progreso y retomar donde quedó;
- usar el Escudo de Seguridad;
- ajustar la accesibilidad (letra grande y lectura en voz alta).

No se evalúa en esta prueba la recuperación de contraseña por correo, porque
depende de la habilitación de Brevo (ver `docs/pendientes.md`). Se prueba aparte
cuando el envío esté operativo.

### Preguntas que responde la prueba

1. ¿La persona entiende qué hacer en cada pantalla sin explicación previa?
2. ¿Los botones, etiquetas y mensajes se leen y se interpretan sin ambigüedad?
3. ¿Puede recuperarse de un error de tipeo o de una respuesta incorrecta?
4. ¿El tamaño de letra, el contraste y la lectura en voz alta alcanzan para
   seguir el contenido?
5. ¿Qué pantalla o paso concentra más errores y más tiempo?

---

## 2. Participantes

| Criterio | Valor |
|----------|-------|
| Cantidad | 5 a 8 personas |
| Edad | 60 años o más |
| Experiencia digital | Variada: desde “solo llamadas” hasta quien usa WhatsApp a diario |
| Dispositivo | Al menos 3 sesiones en celular y 2 en computadora |
| Vinculación | Sin relación con el equipo TAMI (para evitar respuestas complacientes) |
| Exclusión | Personas con deterioro cognitivo diagnosticado que impida dar consentimiento |

Se busca diversidad, no representatividad estadística. Con 5 participantes
aparecen los problemas más frecuentes; con 8 se gana confianza en los patrones.

### Datos a registrar por participante

- Edad y género (opcional, declarado).
- Nivel declarado de uso de tecnología: bajo, medio, alto.
- Dispositivo y navegador usados.
- Si usa ayudas técnicas (lentes, audífono, lector de pantalla).
- Si ya conoce TAMI (debe ser “no” para la primera sesión).

---

## 3. Consentimiento y ética

Cada persona firma un consentimiento antes de empezar. La sesión es voluntaria
y se puede detener en cualquier momento sin dar explicaciones.

### Texto base del consentimiento

> Soy mayor de 60 años y acepto participar de una prueba de usabilidad de TAMI,
> una plataforma educativa para personas mayores. Entiendo que:
>
> 1. La actividad dura entre 30 y 45 minutos y consiste en usar el sitio
>    mientras una persona observa y toma notas.
> 2. No se evalúa mi capacidad, sino la facilidad de uso del sitio.
> 3. Se pueden tomar notas y, si lo autorizo, grabar audio o video de la
>    pantalla y mis manos. La grabación es opcional.
> 4. Mis datos personales no se publican. En el informe se usa un código
>    (P1, P2…) y no mi nombre.
> 5. Puedo hacer preguntas, pedir una pausa o retirarme en cualquier momento.
> 6. No recibo ningún beneficio económico por participar.
>
> Autorizo la grabación: sí / no
>
> Nombre y firma: ______________________  Fecha: ____________
>
> Responsable de la sesión: ______________________

Guardar los consentimientos firmados en un sobre cerrado. Las grabaciones se
borran al terminar el informe, salvo autorización expresa para conservarlas.

---

## 4. Roles y materiales

### Roles

- **Moderador/a**: recibe a la persona, lee el guion, da las consignas y no
  ayuda salvo en los niveles permitidos (sección 7).
- **Observador/a**: cronometra, registra errores, ayudas y comentarios en la
  planilla. No interviene.
- Si hay una sola persona, primero modera y después completa la planilla con
  lo observado; no se debe moderar y registrar al mismo tiempo sin práctica.

### Materiales

- [ ] Dispositivo de prueba cargado (celular y computadora).
- [ ] Navegador actualizado: Chrome o Edge en escritorio; Chrome o Safari en
      celular.
- [ ] Sitio abierto en la URL de prueba, con la API funcionando.
- [ ] Cuenta de prueba lista para quien no quiera registrarse (opcional).
- [ ] Correo temporal o real para el registro de la tarea 1.
- [ ] Cronómetro y planillas impresas (sección 8).
- [ ] Consentimientos impresos y lapicera.
- [ ] Agua y un espacio tranquilo, sin ruido ni interrupciones.
- [ ] Pañuelos o alcohol para limpiar el dispositivo entre sesiones.

---

## 5. Preparación de la sesión

1. Abrir el sitio y confirmar que carga sin errores.
2. Verificar que la API responde: `/api/salud` devuelve `estado: ok`.
3. Cerrar sesión y borrar datos del participante anterior.
4. Probar el volumen del dispositivo y la conexión a internet.
5. Disponer la silla al lado de la persona, no enfrente: se observa la pantalla,
   no se invade el espacio.
6. Leer el guion de bienvenida y firmar el consentimiento.

### Guion de bienvenida

> “Gracias por venir. Estamos probando una página nueva para aprender sobre
> tecnología. No te estamos evaluando a vos: lo que nos interesa es ver si la
> página se entiende. Vas a usarla como lo harías en tu casa. Si algo no se
> entiende, decilo en voz alta; para nosotros es muy útil. No hay respuestas
> incorrectas. Si querés parar, me avisás y listo.”

Después del consentimiento:

> “Voy a leerte una tarea por vez. Hacela como puedas. Si te trabás, quedate
> tranquila: no te voy a decir cómo seguir hasta que sea necesario.”

---

## 6. Tareas

Cada tarea se lee en voz alta y se repite si la persona lo pide. No se explica
cómo hacerla ni se señala la pantalla.

| # | Tarea | Consigna para la persona | Tiempo objetivo |
|---|-------|--------------------------|-----------------|
| T1 | Crear una cuenta | “Creá una cuenta en TAMI con este correo y una contraseña que puedas recordar.” | ≤ 300 s |
| T2 | Ingresar y empezar | “Entrá con la cuenta que creaste y hacé el test inicial. Si no querés hacerlo ahora, busá la forma de seguir sin hacerlo.” | ≤ 180 s |
| T3 | Aprender un nivel | “Entrá al curso ‘Uso de Smartphones’, abrí el Nivel 1, leé una teoría y resolvé el repaso del nivel.” | ≤ 180 s |
| T4 | Retomar el aprendizaje | “Andá a ‘Mi Progreso’ y volvé al curso en el nivel donde quedaste.” | ≤ 180 s |
| T5 | Escudo de Seguridad | “Abrí el Escudo de Seguridad y resolvé los primeros 3 retos: decí si cada uno es estafa o confiable y, si es estafa, elegí el tipo.” | ≤ 180 s |
| T6 | Accesibilidad | “Agrandá la letra de la página y hacé que te lea en voz alta el contenido de esta pantalla. Después detené la lectura.” | ≤ 180 s |

Notas para el moderador:

- En T2, si la persona busca el test y no lo encuentra, se le permite omitirlo;
  se registra como ayuda de nivel 1 y se anota el motivo.
- En T4 se evalúa si reconoce “Mi Progreso” y si vuelve al nivel correcto, no
  si recuerda el nombre exacto del curso.
- En T6 se acepta cualquier camino válido: botones A+/A−, “Escuchar” y
  “Detener”, o los controles del navegador solo si el sitio lo permite.
- Si una tarea supera los 5 minutos sin avance, se cierra con ayuda de nivel 2
  y se registra como no completada.

---

## 7. Registro de ayudas y errores

### Niveles de ayuda

| Nivel | Definición | Cuenta como autónomo |
|-------|------------|----------------------|
| 0 | La persona completa la tarea sin intervención. | Sí |
| 1 | El moderador da una pista verbal, sin indicar dónde hacer clic. | No |
| 2 | El moderador señala la pantalla, hace el clic o completa el campo. | No |

### Tipos de error

| Código | Tipo | Ejemplo |
|--------|------|---------|
| E1 | Navegación | Entra a otra sección o usa “Volver” sin necesidad. |
| E2 | Comprensión | No entiende la consigna o el texto de la teoría. |
| E3 | Validación | El formulario rechaza el dato y no sabe por qué. |
| E4 | Técnico | La página no responde, se cae la conexión o aparece un error del servidor. |
| EC | Crítico | Abandona la tarea, queda bloqueado o comete un error de seguridad (por ejemplo, comparte un código). |

Un error se registra **una vez por ocurrencia**. Si repite el mismo error en la
misma tarea, se anota una sola vez y se indica “repetido”.

---

## 8. Planilla de observación y métricas

### 8.1 Planilla por participante

Copiar esta tabla para cada persona.

| Tarea | Inicio | Fin | Tiempo (s) | Ayuda (0/1/2) | Errores (E1/E2/E3/E4/EC) | Completada (sí/no) | Comentario textual |
|-------|--------|-----|------------|----------------|--------------------------|--------------------|--------------------|
| T1 | | | | | | | |
| T2 | | | | | | | |
| T3 | | | | | | | |
| T4 | | | | | | | |
| T5 | | | | | | | |
| T6 | | | | | | | |

Datos generales:

- Código: P__
- Edad: __
- Nivel digital declarado: bajo / medio / alto
- Dispositivo: celular / computadora / tablet
- Navegador: ______________
- Observaciones de accesibilidad: ______________________________

### 8.2 Indicadores y metas

| Indicador | Fórmula | Meta |
|-----------|---------|------|
| Autonomía | Tareas con ayuda nivel 0 / total de tareas × 100 | **≥ 80 %** |
| Errores por participante | Total de errores / cantidad de participantes | **≤ 1,5** |
| Tiempo mediano por tarea | Mediana de los tiempos de T1–T6, informada por tarea | **≤ 180 s** (T1: ≤ 300 s) |
| Tareas completadas | Tareas completadas / total de tareas × 100 | **≥ 90 %** |
| Errores críticos | Cantidad de EC | **0** |
| Satisfacción | Promedio de la pregunta final (1 a 5) | **≥ 4,0** |

La meta de 180 segundos se evalúa por tarea, no sobre el total de la sesión:
una tarea lenta no debe compensarse con otra rápida. El registro (T1) tiene un
objetivo propio de 300 segundos por incluir la creación de la contraseña.

### 8.3 Preguntas de cierre

1. “¿Qué fue lo más fácil de usar?” 
2. “¿Qué fue lo más difícil o confuso?”
3. “Si tuvieras que explicarle a un amigo cómo entrar al curso, ¿qué le
   dirías?”
4. “¿Usarías TAMI en tu casa? ¿Por qué?”
5. Puntaje general: 1 (muy difícil) a 5 (muy fácil): __

---

## 9. Análisis y resultados

### 9.1 Cálculo

1. Volcar cada planilla a una hoja de cálculo con una fila por tarea.
2. Calcular autonomía: tareas con ayuda 0 dividido el total de tareas.
3. Calcular errores por participante: total de errores dividido la cantidad de
   participantes.
4. Calcular la mediana de tiempo de cada tarea (no el promedio: un valor
   atípico no debe distorsionar el resultado).
5. Agrupar los errores por tipo y por pantalla para ver dónde se concentran.
6. Comparar cada indicador con la meta de la sección 8.2.

### 9.2 Regla de decisión

- Si **todos** los indicadores cumplen la meta, la prueba se considera
  superada y se documenta como evidencia de usabilidad.
- Si falla un indicador, se listan las pantallas responsables, se aplica una
  corrección y se repite la prueba con al menos 3 participantes nuevos.
- Si hay un error crítico, se corrige antes de cualquier otra mejora y se
  vuelve a probar la tarea afectada.

### 9.3 Tabla de resultados (completar después de las sesiones)

| Indicador | Resultado | Meta | Estado |
|-----------|-----------|------|--------|
| Autonomía | | ≥ 80 % | |
| Errores por participante | | ≤ 1,5 | |
| Tiempo mediano T1 | | ≤ 300 s | |
| Tiempo mediano T2–T6 | | ≤ 180 s | |
| Tareas completadas | | ≥ 90 % | |
| Errores críticos | | 0 | |
| Satisfacción | | ≥ 4,0 | |

### 9.4 Problemas detectados y correcciones

| # | Pantalla / tarea | Problema observado | Tipo | Corrección propuesta | Estado |
|---|------------------|--------------------|------|----------------------|--------|
| 1 | | | | | |
| 2 | | | | | |
| 3 | | | | | |

---

## 10. Limitaciones

- La muestra es pequeña y voluntaria: sirve para detectar problemas, no para
  generalizar a toda la población mayor.
- La presencia del moderador puede inhibir o alentar conductas; se procura no
  intervenir y registrar la ayuda con precisión.
- Las sesiones en un mismo dispositivo arrastran caché, sesión y sugerencias
  del navegador. Se limpian entre participantes.
- La prueba no reemplaza una auditoría de accesibilidad con lectores de
  pantalla reales (NVDA, VoiceOver) ni una revisión de conformidad WCAG
  completa. Esos puntos siguen en `docs/pendientes.md`.
- Los resultados dependen de la versión probada. Registrar la versión del
  service worker (`code/sw.js`) al inicio de cada sesión.

---

## 11. Lista de verificación antes de la primera sesión

- [ ] Consentimientos impresos y lapicera.
- [ ] Planillas impresas (una por participante).
- [ ] Cronómetro probado.
- [ ] Sitio abierto y `/api/salud` en `ok`.
- [ ] Cuenta de prueba y correo temporal disponibles.
- [ ] Service worker actualizado a la última versión.
- [ ] Grabación configurada (si la persona la autorizó).
- [ ] Espacio silencioso y silla lateral preparados.
- [ ] Formulario de cierre con la pregunta de satisfacción.

---

## 12. Registro de sesiones

| Código | Fecha | Edad | Nivel digital | Dispositivo | Duración | Observaciones |
|--------|-------|------|---------------|-------------|----------|---------------|
| P1 | | | | | | |
| P2 | | | | | | |
| P3 | | | | | | |
| P4 | | | | | | |
| P5 | | | | | | |
| P6 | | | | | | |
| P7 | | | | | | |
| P8 | | | | | | |
