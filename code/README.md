# Código - TAMI

Capa de **Presentación** y **Lógica** del proyecto. En esta carpeta vive la interfaz de usuario y el comportamiento de la aplicación.

## Arquitectura Cliente-Servidor en 3 Capas

```text
┌──────────────────────────────┐
│ 1. Presentación  HTML / CSS  │  index.html y styles.css
├──────────────────────────────┤
│ 2. Lógica         JavaScript │  main.js (Escudo de Seguridad)
├──────────────────────────────┤
│ 3. Datos          LocalStorage│  persistencia local en el navegador
└──────────────────────────────┘
```

- **Presentación**: estructura y estilos que el usuario ve e interactúa.
- **Lógica**: reglas de negocio, validaciones y el "Escudo de Seguridad" que protege al usuario del fraude.
- **Datos**: LocalStorage como capa de persistencia, sin servidores ni dependencias externas.

## Archivos

### index.html (Accesibilidad)
- Marcado **HTML5 semántico** (`header`, `nav`, `main`, `footer`) para lectura por tecnologías de asistencia.
- Atributos `aria-label`, `aria-live` y texto alternativo en imágenes.
- Interfaz simple, con botones grandes y navegación clara para adultos mayores.

### styles.css (Design System)
- Aplica la propuesta **"Protección Proactiva"**: Cian Glacial `#EBF8FA` (fondo) y Teal Oscuro `#0A4B5C` (primario).
- Contraste alto, tamaño de fuente base 18px e interlineado holgado.
- Media query `prefers-reduced-motion` para reducir animaciones.

### main.js (Lógica y Escudo de Seguridad)
- Reglas de negocio de la capa Lógica.
- **Escudo de Seguridad**: alertas y validaciones que previenen fraudes y engaños en línea.
- **LocalStorage**: la capa de Datos guarda el estado del usuario (ej. `tami:estado`) para conservar la información entre sesiones.

## Persistencia y Dependencias

- Uso de **LocalStorage** evita depender de una base de datos o servidor externo, manteniendo el proyecto autocontenido y sin costos de infraestructura.
- Buenas prácticas: kebab-case, funciones pequeñas con responsabilidad única y `"use strict"`.
