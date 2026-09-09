# Actividad: "Diseñando el mapa de navegación"

**Actividad práctica**: Arquitectura de la Información (AI) - jerarquía, menús y breadcrumbs
**Modalidad**: En parejas (Rachael Choque y Ezequiel Charca)
**Tiempo invertido**: 50 minutos
**Fecha**: Septiembre 2026

**Objetivo**: Comprender cómo se estructura la información en un sitio web y cómo los componentes de navegación (menú principal y breadcrumbs) orientan al usuario.

---

## 1. Contexto del proyecto

Se diseña la arquitectura para una **tienda en línea de tecnología y electrodomésticos** llamada **TechZone**.

**Objetivo del usuario**: encontrar una **laptop gamer de 15 pulgadas**, comparar especificaciones y llegar al carrito de compras sin perderse.

---

## 2. Paso 1: Jerarquía de Contenido (Árbol de Navegación)

Los contenidos se organizan en **3 niveles de jerarquía**:

> **[Nivel 1] Categoría Principal → [Nivel 2] Subcategoría → [Nivel 3 / Página Final] Producto o Ficha**

```text
TechZone
│
├── [N1] Computación
│   ├── [N2] Laptops
│   │   ├── [N3] Laptops Gamer
│   │   │   └── [Página Final] Laptop Gamer 15" (Intel i7)
│   │   └── [N3] Laptops de Oficina
│   │       └── [Página Final] Laptop de Oficina 14"
│   ├── [N2] Accesorios de Computación
│   │   ├── [N3] Teclados Mecánicos
│   │   └── [N3] Mouse y Periféricos
│   └── [N2] Soporte Técnico
│       └── [N3 / Página] Solicitar servicio técnico
│
└── [N1] Electrohogar
    ├── [N2] Heladeras
    └── [N2] Lavarropas
```

**Contenidos del enunciado ubicados en el árbol**:

| Contenido del enunciado | Ubicación en el árbol |
|-------------------------|-----------------------|
| Computación | Nivel 1 - Categoría principal |
| Electrohogar | Nivel 1 - Categoría principal |
| Laptops | Nivel 2 - Subcategoría de Computación |
| Accesorios de Computación | Nivel 2 - Subcategoría de Computación |
| Soporte Técnico | Nivel 2 - Subcategoría de Computación |
| Teclados Mecánicos | Nivel 3 - Subcategoría de Accesorios |
| Laptops Gamer | Nivel 3 - Subcategoría de Laptops |
| Laptop Gamer 15" | Página final - Producto |

---

## 3. Paso 2: Diseñar el Menú Principal

### Estructura visual del Menú de Navegación Principal (barra superior)

```text
┌──────────────────────────────────────────────────────────────────────────┐
│  TechZone   |  Inicio  |  Computación ▾  |  Electrohogar ▾  |  Ofertas  │
└──────────────────────────────────────────────────────────────────────────┘
```

### Elementos de la barra superior (menú global)

| Elemento | Ubicación | Comportamiento |
|----------|-----------|----------------|
| Logo TechZone | Izquierda | Enlace a la página de inicio |
| Inicio | Barra superior | Enlace directo (nivel superior de la jerarquía) |
| Computación | Barra superior | **Submenú desplegable** (dropdown) |
| Electrohogar | Barra superior | **Submenú desplegable** (dropdown) |
| Ofertas | Barra superior | Enlace directo (página de promociones) |

### Submenús desplegables (dropdowns)

```text
Computación ▾                    Electrohogar ▾
├── Laptops                      ├── Heladeras
│   ├── Laptops Gamer            └── Lavarropas
│   └── Laptops de Oficina
├── Accesorios de Computación
│   ├── Teclados Mecánicos
│   └── Mouse y Periféricos
└── Soporte Técnico
```

**Reglas aplicadas**:

- Solo las **categorías de nivel 1** tienen dropdown; las de nivel 2 y 3 se alcanzan en páginas de listado.
- Los nombres del menú coinciden **exactamente** con los nombres de las categorías del árbol (consistencia).
- No se usa hover como único mecanismo para abrir el dropdown (accesibilidad táctil y de teclado).

---

## 4. Paso 3: Trazar la Ruta de Breadcrumbs (Migas de Pan)

### Ficha de producto: "Laptop Gamer 15" (Intel i7)"

```text
Inicio  >  Computación  >  Laptops  >  Laptops Gamer  >  Laptop Gamer 15" (Intel i7)
  (link)      (link)         (link)         (link)            (TEXTO PLANO)
```

**Formato estándar**: `Inicio > Categoría > Subcategoría > Producto`

### Elementos interactivos vs. texto plano

| Elemento | Tipo | Motivo |
|----------|------|--------|
| Inicio | **Enlace clicable** | Permite volver a la raíz del sitio (compatible con el botón "Atrás" del navegador) |
| Computación | **Enlace clicable** | Permite subir al listado de la categoría principal |
| Laptops | **Enlace clicable** | Permite subir a la subcategoría |
| Laptops Gamer | **Enlace clicable** | Permite volver al listado de laptops gamer |
| Laptop Gamer 15" (Intel i7) | **Texto plano NO interactivo** | Indica dónde está el usuario; no debe recargar la página ni desorientar |

> **Regla de usabilidad estricta**: los elementos previos son enlaces interactivos; el último (página actual) es texto plano y lleva `aria-current="page"` para lectores de pantalla.

---

## 5. Criterios de Evaluación / Autochequeo

| Criterio | Descripción | Resultado |
|----------|-------------|-----------|
| Jerarquía clara | Las categorías van de lo general a lo específico sin saltarse niveles | **Cumple** - Computación → Laptops → Laptops Gamer → Laptop 15", sin saltos de nivel |
| Ubicación del Breadcrumb | Se posiciona en la parte superior del contenido principal (debajo del menú) | **Cumple** - La barra de migas va bajo el header/menú y arriba del contenido |
| Usabilidad | El último elemento del breadcrumb indica la página actual y no es interactivo | **Cumple** - "Laptop Gamer 15" (Intel i7)" es texto plano; los anteriores son clicables |
| Consistencia | Los nombres de las categorías en el menú coinciden exactamente con los del breadcrumb | **Cumple** - "Computación", "Laptops" y "Laptops Gamer" son idénticos en menú y breadcrumb |

---

## 6. Aplicación de la misma metodología al proyecto TAMI

Los mismos principios se implementaron en la plataforma **TAMI** (nuestro proyecto real):

### Árbol de 3 niveles de TAMI

```text
TAMI
├── [N1] Autenticación
│   ├── [N2] Cuenta nueva       → [N3] Registro
│   └── [N2] Cuenta existente   → [N3] Login
├── [N1] Mi Entorno Seguro (Dashboard)
│   ├── [N2] Campus Educativo   → [N3] Modulo 4: Fraudes (lección + examen)
│   ├── [N2] Escudo de Seguridad → [N3] Alerta de fraude
│   └── [N2] Mi Progreso        → [N3] Resultados comparativos
```

### Breadcrumbs reales implementados en `code/index.html` y `code/main.js`

```text
Ejemplo en la lección:  Inicio > Mi entorno seguro > Campus Educativo > Modulo 4: Fraudes
                          (link)        (link)             (link)            (texto plano)
```

- Los niveles previos son `<button>` clicables que llaman a `mostrarPantalla()`.
- El nivel actual es texto plano con `aria-current="page"`.
- Ver documentación completa en `docs/arquitectura-informacion.md`.

---

*Documento de entregable académico - Actividad "Diseñando el mapa de navegación" - Proyecto Integrador III - TAMI (2026).*