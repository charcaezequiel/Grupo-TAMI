# Design System - TAMI

Sistema de diseno **"Proteccion Proactiva"**: comunica confianza y proteccion para el publico adulto mayor.

---

## 1. Principios de diseno

1. **Proteccion proactiva**: la interfaz "cuida" al usuario, lo guia y lo previene de errores.
2. **Inclusividad**: disenado para personas mayores y usuarios novatos.
3. **Maxima legibilidad**: contraste alto, tipografia grande, botones gigantes.
4. **Minimalismo**: cada pantalla tiene un solo proposito, sin distracciones.

## 2. Paleta de colores (regla 60-30-10)

| Proporcion | Rol | Nombre | Hex | Uso |
|------------|-----|--------|-----|-----|
| 60% | Fondo | Cian Glacial | `#EBF8FA` | Superficies amplias, fondos, zonas de descanso |
| 30% | Estructura | Teal Oscuro | `#0A4B5C` | Navegacion, titulos, botones primarios, bordes |
| 10% | Acento | Teal de Contraste | `#007A87` | Botones, enlaces, focus, interacciones |

### Colores complementarios

| Rol | Hex | Uso |
|-----|-----|-----|
| Texto principal | `#1F2D33` | Parrafos sobre fondo claro |
| Texto secundario | `#55666D` | Subtitulos y descripciones |
| Error | `#B00020` | Mensajes de error y severidad alta |
| Exito | `#2E7D32` | Confirmaciones y progreso |
| Alerta | `#E07B00` | Avoid bordes de alertas medias |

## 3. Contraste (WCAG 2.1 AA)

| Combinacion | Ratio estimado | Estado |
|-------------|----------------|--------|
| Teal Oscuro `#0A4B5C` sobre Cian Glacial `#EBF8FA` | > 7 | AA (y AAA) |
| Blanco `#FFFFFF` sobre Teal Oscuro `#0A4B5C` | > 6 | AA (y AAA) |
| Teal Contraste `#007A87` sobre blanco | > 4.5 | AA |
| Error `#B00020` sobre blanco | > 5 | AA |

> Regla: nunca depender del color como unico canal (siempre icono + texto).

## 4. Tipografia

| Nivel | Tamano | Peso | Uso |
|-------|--------|------|-----|
| Base | 18px | 400 | Cuerpo de texto (minimo permitido) |
| Grande | 20px | 400-600 | Subtitulos y textos destacados |
| Titulo | 28px | 700 | Titulos `h2` de pantalla |
| Titulo XL | 36px | 700 | Titulo del hero en escritorio |

- **Familia**: `Inter`, `Atkinson Hyperlegible`, `Segoe UI`, `Tahoma`, `sans-serif`.
- **Interlineado**: 1.6 en cuerpo, 1.7 en textos largos.
- Nunca usar cursivas ni mayusculas largas como formato.

## 5. Dimensiones tactiles (ISO 9241-210)

| Elemento | Tamaño minimo | Uso |
|----------|---------------|-----|
| Boton estandar | **52px** de altura | Acciones normales (WCAG 2.5.5) |
| Boton masivo | **60px** de altura | Acciones primarias del flujo |
| Input de campo | **52px** de altura | Todos los formularios |
| Icono interactivo | **44px** | Minimamente, mejor 52px |
| Objetivo táctil espaciado | 8px entre objetivos | Evitar clics errados |

## 6. Forma y espaciado

- **Bordes**: radio 8px (elementos), 12px (contenedores grandes).
- **Espaciado base**: 16px (escala: 4, 8, 16, 24, 32).
- **Sombras**: sutiles, `rgba(10, 75, 92, 0.08)` para contenedores blancos.

## 7. Iconografia

- **Trazo grueso**: maximo contraste y lectura desde lejos.
- **Siempre** con texto acompanante o `aria-label`/`role` descriptivo.
- Los iconos decorativos llevan `aria-hidden="true"`.
- Sin emojis como unico medio de informacion critica.

## 8. Componentes base

| Componente | Caracteristicas |
|------------|-----------------|
| Header | Sticky, Teal Oscuro, con logo, titulo y acciones |
| Tarjeta de acceso | Blanca, borde Teal, icono + titulo + descripcion, 140px minimo |
| Boton primario | Teal Oscuro, texto blanco, hover Teal Contraste |
| Boton secundario | Blanco, borde Teal, texto Teal |
| Campo de formulario | Borde gris, focus con anillo Teal Contraste |
| Mensaje de error | Texto en `#B00020`, con `role="alert"`, junto al campo |
| Breadcrumb | Niveles previos clicables, ultimo texto plano con `aria-current` |
| Barra de progreso | Fondo gris claro, relleno Teal (test) o verde (examen) |

## 9. Accesibilidad transversal

- `prefers-reduced-motion`: desactiva animaciones.
- `:focus-visible`: outline 3px Teal de Contraste en todos los controles.
- Skip link "Saltar al contenido principal" en el body.
- `aria-live="polite"` para cambios de estado no urgentes.
- HTML semantico: `header`, `main`, `section`, `nav`, `footer`, `ul/li`.