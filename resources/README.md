# Recursos Gráficos - TAMI

Carpeta de **guía de marca** del proyecto. Los activos gráficos reales viven en `img/`, en la raíz del repositorio.

## Estructura y Uso

```text
resources/
├── branding-guide.md   Guía de marca y paleta cromática
└── README.md
```

- **img/ (raíz del repositorio)**: logo, icono/escudo, portadas de los 5 cursos, iconos de los 4 niveles, iconos PWA e imágenes de vista previa para redes. Solo archivos optimizados (SVG, JPG y PNG).
- **Iconos de interfaz**: SVG en línea dentro de `code/index.html` y `code/admin.html`, con `aria-label` o `role="img"` cuando son informativos.
- **Tipografías**: se usan pilas de fuentes del sistema, sin archivos locales, para evitar descargas adicionales.

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