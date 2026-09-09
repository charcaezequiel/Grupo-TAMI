# Convenciones de Desarrollo - TAMI

Documento que establece las **reglas de calidad de software** del proyecto, alineadas con la norma **ISO/IEC 25010** (familia SQuaRE).

> **Alcance**: Todo el codigo fuente del repositorio. Cualquier aporte debe respetar estas convenciones.

---

## 1. Atributos de Calidad ISO/IEC 25010

La norma ISO/IEC 25010 define 8 caracteristicas de calidad. Este proyecto **prioriza la Mantenibilidad** y la aplica a las demas:

| Caracteristica | Como se aplica en TAMI |
|----------------|------------------------|
| **Mantenibilidad** (prioritaria) | Arquitectura modular, sin logica repetida, nombres autoexplicativos. |
| Funcionalidad | Cada funcion cumple un unico proposito comprobable. |
| Usabilidad | DCU orientado a adultos mayores: botones 52px+, texto 18px+, ARIA. |
| Seguridad | Hashing con bcrypt, validacion de entradas, parametrizacion SQL. |
| Eficiencia | CSS con variables, JS vanilla, sin librerias pesadas. |
| Portabilidad | HTML5/CSS3/JS nativo: funciona en cualquier navegador moderno. |
| Confiabilidad | Fallback automatico a LocalStorage cuando la API no responde. |
| Compatibilidad | Semantica HTML5 + ARIA: lectores de pantalla, teclado y movil. |

### Prioridad: Mantenibilidad

La mantenibilidad se evalua sobre la estructura interna:

- **Analizabilidad**: El codigo se entiende sin documentacion externa (los comentarios solo explican el "porque").
- **Capacidad de ser modificado**: Si un requisito cambia, el cambio afecta a pocos archivos (bajo acoplamiento).
- **Modularidad**: Sepa de interfaz, logica de negocio y acceso a datos en archivos distintos.
- **Reusabilidad**: Las funciones de validacion, renderizado y API se usan en todas las pantallas.

---

## 2. Nomenclatura Estricta

### variables: sustantivos en `camelCase`

```javascript
const listaUsuarios = [...];
const fechaExpiracionSesion = null;
let contadorIntentosLogin = 0;
```

### funciones: verbos en infinitivo que describen la accion

```javascript
function validarEmail(email) { ... }
function obtenerRespuestasDeTest(contenedorId) { ... }
function renderizarAlertasEscudo() { ... }
```

### booleanos: preguntas o estados

```javascript
let haIniciadoSesion = false;
const estaCompletado = true;
function tieneRespuestasNull(respuestas) { ... }
```

### reglas adicionales

- **Constantes**: `MAYUSCULAS_CON_GUIONES` para valores fijos.
- **Claves de LocalStorage**: prefijo `tami:` (ej. `tami:sesion`).
- **Selectores de pantalla**: prefijo `pantalla-` (ej. `pantalla-login`).
- **IDs y clases HTML**: `kebab-case` para clases, `camelCase` para IDs.
- **Tablas SQL**: `snake_case` (ej. `test_nivelacion`).
- **Archivos y carpetas**: `kebab-case` sin espacios.

---

## 3. Organizacion de Archivos por Responsabilidad

**Alta Cohesion**: cada archivo cumple UN proposito.
**Bajo Acoplamiento**: los archivos se comunican por interfaces explicitas.

```text
code/                    Menu frontal: capa de presentacion
├── index.html           Estructura semantica + ARIA (SOLO maquetacion)
├── styles.css           Design System y estilos (SOLO presentacion)
└── main.js              Logica, navegacion, API y renderizado

server/                  Menu trasero: capa de servicio
├── index.js             Punto de entrada: Express, middlewares, rutas
├── db.js                Conexion a PostgreSQL (pool)
├── schema.sql           DDL de la base de datos (schema + seed)
└── routes/
    ├── usuarios.js      Autenticacion y usuarios
    ├── cursos.js        Catalogos de cursos
    ├── alertas.js       Alertas de fraude
    └── progreso.js      Test, examenes y progreso
```

### regla practica

- Nunca incluir SQL dentro de archivos de logica de negocio web.
- Nunca incluir HTML dentro de archivos JavaScript.
- Cada capa se modifica en paralelo sin conflictos de merge.

---

## 4. Comentarios Explicativos

**Regla de oro**: escribir el **porque** de la decision y NO el "que" hace una linea obvia.

```javascript
// Se reemplazo SHA-256 por bcrypt porque:
// 1) SHA-256 es hash rapido, vulnerable a tablas rainbow
// 2) bcrypt aplica salt automatico, resistente a fuerza bruta
const passwordHash = await bcrypt.hash(password, COSTO_BCRYPT);
```

```javascript
// Los botones del test se generan dinamicamente, por eso se usa
// un MutationObserver para poder vincular el evento de click.
const observer = new MutationObserver(function () { ... });
```

### prohibiciones

- NO comentar lineas obvias como `const x = 1; // asigna 1`.
- NO dejar codigo comentado "por si acaso" (usar git para el historial).
- NO escribir comentarios en mayusculas o gritando.

---

## 5. Indentacion Consistente

- **JavaScript / JSON**: 2 espacios, comillas dobles.
- **HTML**: 2 espacios, atributos en lineas separadas cuando superan 80 caracteres.
- **CSS**: 2 espacios, propiedades ordenadas logicamente (unidades, colores, dimensiones).
- **SQL**: 2 espacios, claves SQL en `MAYUSCULAS`.

**Longitud maxima de linea**: 100 caracteres. Si se excede, se separa el argumento o la condicion en la siguiente linea.

---

## 6. Control de Versiones (Convencion de Commits)

Los commits son **fotografias del historial** del proyecto. Formato: `tipo: descripcion`.

| Tipo | Uso |
|------|-----|
| `feat:` | Nueva funcionalidad |
| `fix:` | Correccion de un error |
| `docs:` | Cambios en documentacion |
| `chore:` | Tareas de mantenimiento, configuracion |
| `refactor:` | Cambios de estructura sin cambiar comportamiento |
| `test:` | Nuevos tests |

### ejemplos

```text
feat: implementar registro de usuarios con hashing bcrypt
fix: corregir validacion de email duplicado en el login
docs: documentar convenciones de desarrollo ISO/IEC 25010
chore: excluir credenciales y dependencias del servidor
```

### reglas

- Mensajes cortos (menos de 72 caracteres), en infinitivo y en espanol.
- Cada commit representa UNA unidad logica de cambio.
- No commitear `.env`, `node_modules/` ni archivos generados.
- Usar ramas por funcionalidad cuando el equipo supere las 3 personas.

---

## 7. Validacion de Entradas (Seguridad por Default)

- Todo input del cliente se valida en el **servidor** (nunca confiar solo en el frontend).
- Email: expresion regular `^[^\s@]+@[^\s@]+\.[^\s@]+$`.
- Password: minimo 6 caracteres verificados en backend.
- SQL: SIEMPRE consultas parametrizadas (`$1`, `$2`) — prohibido concatenar strings.
- Passwords: hashing irreversible con `bcrypt` (costo 12).
- Los mensajes de error no revelan detalles internos del servidor.

---

## 8. Checklist de Revision de Codigo (Definition of Done)

- [ ] Sigue las convenciones de nomenclatura (seccion 2)
- [ ] Cada archivo tiene una unica responsabilidad (seccion 3)
- [ ] Los comentarios explican el "porque" (seccion 4)
- [ ] Indentacion de 2 espacios consistente (seccion 5)
- [ ] Todos los inputs validados en el servidor (seccion 7)
- [ ] Las consultas SQL usan parametros `$n`
- [ ] El HTML es semantico y usa ARIA cuando es necesario
- [ ] Se verifico con las herramientas de accesibilidad del navegador
- [ ] Commit descriptivo siguiendo la convencion (seccion 6)