# Arquitectura de la Informacion y Mapa de Navegacion - TAMI

Documento que define la **estructura jerarquica del contenido**, los **componentes de navegacion** y la **regla de breadcrumbs** del sistema.

---

## 1. Jerarquia de Contenido (Arbol de Navegacion de 3 Niveles)

La estructura del sitio se organiza en **3 niveles de profundidad**:

> **[Nivel 1] Categoria Principal → [Nivel 2] Subcategoria → [Nivel 3 / Pagina Final] Modulo o Ficha Especifica**

```text
TAMI
│
├── [1] Autenticacion
│   ├── [2] Cuenta nueva
│   │   └── [3] Formulario de Registro
│   ├── [2] Cuenta existente
│   │   └── [3] Formulario de Login
│   └── [2] Evaluacion inicial
│       └── [3] Test de Nivelacion (3 preguntas)
│
├── [1] Mi Entorno Seguro (Dashboard)
│   ├── [2] Campus Educativo
│   │   ├── [3] Curso 1: Uso de Smartphones          [ACTIVO · 4 niveles]
│   │   ├── [3] Curso 2: Redes e Internet            [ACTIVO · 4 niveles]
│   │   ├── [3] Curso 3: Tramites en Linea           [ACTIVO · 4 niveles]
│   │   ├── [3] Curso 4: Fraudes Digitales (Phishing) [ACTIVO · 4 niveles]
│   │   │       └── Leccion (10 teorias) + Examen rapido (6 preguntas)
│   │   └── [3] Curso 5: Comunicacion Digital        [ACTIVO · 4 niveles]
│   ├── [2] Escudo de Seguridad
│   │   └── [3] Reto de Fraude (15 casos con "Que hacer" y senales)
│   ├── [2] Mini Trabajos
│   │   └── [3] Trabajo practico filtrado por nivel
│   ├── [2] Mi Progreso
│   │   ├── [3] Camino de aprendizaje y logros
│   │   └── [3] Certificado imprimible por curso
│   └── [2] Mi Cuenta
│       ├── [3] Configuracion (perfil, preferencias, datos personales)
│       ├── [3] Ayuda (tour, lectura en voz alta, instalar app)
│       └── [3] Legal (terminos, privacidad, accesibilidad)
```

> Los 5 cursos se habilitan de forma secuencial: dentro de cada curso, el Nivel 1
> está abierto y los siguientes se desbloquean al completar el anterior con su repaso.

### regla de profundidad

- Nunca superar 3 niveles: si una pagina necesita mas de 3 clics de distancia del inicio, se redisenia.
- Los niveles intermedios siempre son catalogos o listas; los niveles 3 siempre son contenido final.

---

## 2. Componentes de Navegacion

### 2.1 Barra de navegacion superior (menu global)

- Ubicacion: `<header>` fija (sticky) para acceso permanente.
- Contiene solo los elementos esenciales, evitando sobrecarga cognitiva.
- Contenido segun estado de sesion:

| Elemento | Sin sesion | Con sesion |
|----------|------------|------------|
| Logo TAMI | visible | visible |
| Inicio | visible | oculto (se usa el dashboard) |
| Que es TAMI / Como funciona / Lecciones / Impacto / Preguntas | visible | oculto |
| Ingresar / Crear cuenta | visible | oculto |
| Campus / Progreso / Escudo / Trabajos / Perfil | oculto | visible |
| Cerrar sesion | oculto | visible |

### 2.2 Submenus desplegables (dropdowns)

- En el PMV V1.0 no se usan dropdowns: las opciones se presentan como **tarjetas masivas** en el dashboard.
- Cada uno de los 5 cursos del Campus Educativo es un enlace a su pantalla de curso, con 4 niveles de desbloqueo secuencial.
- Los submenus futuros seguiran la regla: **nunca ocultar informacion esencial** detras de un hover (no accesible en tactil).

### 2.3 Dashboard como menu principal

El dashboard funciona como **mapa de navegacion inicial**:

| Tarjeta masiva | Destino (Nivel 2) |
|----------------|-------------------|
| Campus Educativo | Lista de 5 cursos |
| Escudo de Seguridad | 15 retos antiestafa |
| Mini Trabajos | Trabajos practicos por nivel |
| Mi Progreso | Camino, logros y certificados |

---

## 3. Breadcrumbs (Migas de Pan)

### 3.1 Formato estandar

```
Inicio > Categoria > Subcategoria > Pagina Actual
```

### 3.2 Regla de usabilidad estricta

- Los elementos **previos** son **enlaces interactivos** (clicables) que permiten volver hacia atras.
- El **ultimo elemento** (pagina actual) es **texto plano NO interactivo** para evitar recargas erroneas y ubicar al usuario.
- El ultimo elemento lleva `aria-current="page"` para lectores de pantalla.

### 3.3 Ruta de breadcrumbs por pantalla

| Pantalla | Ruta visible |
|----------|--------------|
| Inicio | `Inicio` |
| Registro | `Inicio > Registro` |
| Login | `Inicio > Ingresar` |
| Recuperar contraseña | `Inicio > Ingresar > Recuperar contraseña` |
| Nueva contraseña | `Inicio > Ingresar > Nueva contraseña` |
| Test | `Inicio > Test de nivelacion` |
| Dashboard | `Inicio > Mi entorno seguro` |
| Campus | `Inicio > Mi entorno seguro > Campus Educativo` |
| Curso | `Inicio > Mi entorno seguro > Campus Educativo > Curso` |
| Leccion | `Inicio > Mi entorno seguro > Campus Educativo > Curso > Nivel` |
| Examen | `Inicio > Mi entorno seguro > Campus Educativo > Curso > Examen del nivel` |
| Escudo | `Inicio > Mi entorno seguro > Escudo de Seguridad` |
| Progreso | `Inicio > Mi entorno seguro > Mi Progreso` |
| Certificado | `Inicio > Mi entorno seguro > Mi Progreso > Certificado` |
| Trabajos | `Inicio > Mi entorno seguro > Trabajos Prácticos` |
| Configuracion | `Inicio > Mi entorno seguro > Mi Perfil` |
| Legal | `Inicio > Privacidad y términos` |
| Ayuda | `Inicio > Ayuda` |

### 3.4 Consistencia de nombres

- Los nombres del menu (dashboard/tarjetas) y las categorias de los breadcrumbs son **identicos**:
  - Tarjeta "Campus Educativo" ↔ breadcrumb "Campus Educativo"
  - Tarjeta "Escudo de Seguridad" ↔ breadcrumb "Escudo de Seguridad"
  - Tarjeta "Mi Progreso" ↔ breadcrumb "Mi Progreso"

> Prohibido usar sinonimos: "Aprender", "Seguridad", "Mis avances" no son validos si el menu dice otra cosa.

### 3.5 Implementacion tecnica

- Marcado semantico: `<nav aria-label="Migas de pan">` + `<ol>`.
- Microdatos Schema.org `BreadcrumbList` para SEO y lectores de pantalla.
- Los enlaces anteriores son `<button>` que llaman a `mostrarPantalla()`, no anclas que recargan la pagina.
- Si el usuario tiene sesion activa y hace clic en "Inicio", se redirige al dashboard (nunca se cierra la sesion implicitamente).

---

## 4. Criterios WCAG 2.1 AA Aplicados a la Navegacion

| Criterio | Aplicacion |
|----------|------------|
| 2.4.1 Saltar bloques | Enlace "Saltar al contenido principal" al inicio del `<body>` |
| 2.4.2 Titulo de la pagina | `<title>` y `<h1>` descriptivos en cada vista |
| 2.4.5 Multiples vias | El breadcrumb + botones volver + tarjetas dan mas de un camino |
| 2.4.7 Foco visible | `:focus-visible` con outline de 3px Teal de Contraste |
| 3.2.3 Navegacion consistente | El header y el breadcrumb son identicos en todas las pantallas |
| 2.5.5 Tamano objetivo | Botones minimo 52px (objetivo táctil WCAG); masivos 60px |
| 1.3.1 Informacion y relaciones | `<nav>`, `<ol>`, `<li>` y ARIA roles describen la estructura |