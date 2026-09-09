# Recursos Gráficos - TAMI

Carpeta de **activos multimedia** del proyecto. Todo archivo respeta la nomenclatura **kebab-case**.

## Estructura y Uso

```text
resources/
├── img/         Imágenes: fotos, ilustraciones y logo (logo-tami.png)
├── icons/       Iconografía de la interfaz, preferentemente SVG vectorial
├── fonts/       Tipografías locales de alta legibilidad (si no se usan fuentes del sistema)
├── branding-guide.md   Guía de marca y paleta cromática
└── README.md
```

- **img/**: solo imágenes optimizadas (PNG/SVG). Al usarlas en HTML, siempre con `alt` descriptivo.
- **icons/**: iconos de **trazo grueso** y tamaño mínimo de interacción de **44px** (objetivo táctil recomendado por accesibilidad), con `aria-label` o `role="img"`.
- **fonts/**: fuentes **sans-serif** de alta legibilidad y tamaño base 18px o superior, con buen interlineado.

## Normas de Accesibilidad

- **Iconos de trazo grueso (>44px)**: fáciles de ver y de tocar para personas con motricidad o visión reducida.
- **Fuentes de alta legibilidad**: tipografías claras, sin serifas decorativas y con contraste suficiente.
- Nunca depender del color como único canal de información (complementar con texto o iconos).
- Las imágenes informativas llevan texto alternativo (`alt`); las decorativas, `alt=""` con `aria-hidden`.

## Paleta Cromática Proactiva

Propuesta **"Protección Proactiva"**:

| Rol | Nombre | Hex | Uso |
|-----|--------|-----|-----|
| Fondo | Cian Glacial | `#EBF8FA` | Superficies amplias y descanso |
| Primario | Teal Oscuro | `#0A4B5C` | Textos, botones y navegación |
| Acento | Teal de Contraste | `#007A87` | Interacciones y focus |

Esta paleta transmite **confianza y calma**, asociadas a la protección contra el fraude. Ver [branding-guide.md](branding-guide.md) y [design-system.md](../docs/design-system.md).