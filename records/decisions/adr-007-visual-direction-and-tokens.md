---
type: adr
id: ADR-007
title: "Neobrutalismo suave sobre tema claro, con los tokens en @theme de Tailwind"
status: accepted
date: 2026-08-17
epic: e7
---

# ADR-007: Neobrutalismo suave sobre tema claro, con los tokens en @theme de Tailwind

## Status

Accepted

## Context

E7 rehace la capa de presentación partiendo del móvil. Medido en 390×844 el
2026-08-17, el front actual no es utilizable en un teléfono: el lienzo 3D se
dibuja a 390×150 —su altura intrínseca de `<canvas>`, porque `grid-cols-1`
apila y nadie le da altura— y **los 209 botones interactivos miden menos de
44×44 px**, el más común 32 px de alto.

Además no hay sistema de diseño. `src/index.css` es una sola línea,
`@import "tailwindcss"`, y los colores viven repetidos a mano en cada
componente: `slate-950`, `slate-900`, `slate-800`, `sky-700`, `amber-700`. No
hay un solo sitio donde cambiar el aspecto de la aplicación.

La dirección visual la fija el usuario con tres referencias concretas —dos de
móvil, una de escritorio— y no con la etiqueta «neobrutalismo», que cada quien
rellena distinto. Lo que las tres comparten, observado sobre las imágenes:
borde negro sólido de 1,5-3 px en casi todo contenedor; sombra dura desplazada
sin desenfoque; esquinas redondeadas de 12-24 px; fondo claro siempre —blanco,
gris casi blanco, crema—; acentos pastel y saturados planos; tipografía display
muy pesada y redondeada en títulos con sans normal en cuerpo.

El proyecto usa Tailwind 4.3.3. Verificado en `node_modules/tailwindcss/theme.css`:
la versión 4 declara sus tokens con `@theme` en CSS y **no hay
`tailwind.config.js` en el proyecto**, que es coherente con el modelo CSS-first
de esa versión.

## Decision

**La dirección visual es neobrutalismo suave sobre tema claro, y sus tokens se
declaran una sola vez en `src/index.css` con `@theme`.**

1. **Suave, no áspero.** Borde y sombra dura, pero con esquinas redondeadas
   generosas y paleta amable. No el brutalismo de esquina viva y tipografía
   cruda. Es lo que muestran las tres referencias, y encaja con una herramienta
   de estudio que se usa durante horas.
2. **Tema claro único.** La aplicación se invierte: hoy es `slate-950`. No se
   sostienen dos temas.
3. **Los tokens son la única fuente.** Color, borde, sombra, radio y escala
   tipográfica se declaran en `@theme` y los componentes los consumen. Ningún
   componente vuelve a escribir un color a mano.
4. **El mínimo táctil es 44×44 px** para todo objetivo interactivo, y es un
   token, no una decisión por componente.

## Consequences

- Hay un solo sitio donde cambia el aspecto de la aplicación, que es
  precisamente lo que hoy no existe.
- **La suite actual no estorba: la protege.** Verificado el 2026-08-17 —
  *ningún* test del proyecto asserta clases CSS; los de componentes consultan
  roles y nombres accesibles. Un cambio de estilo que rompa un test es entonces
  la señal de que se degradó la accesibilidad, no de que el test sea frágil.
- El contraste mejora: negro sobre claro supera holgadamente lo que exige
  `must-a11y-005`, que además prohíbe que el color sea el único indicador.
- **El esqueleto beige deja de tener fondo oscuro que lo destaque.** Sobre
  crema, un hueso color hueso se pierde. Esa decisión concreta —tarjeta de
  fondo oscuro con borde, o cambiar el material— se toma en la historia del
  lienzo, con la escena delante.
- El tratamiento de tarjeta con borde y sombra **no escala a los 206 huesos**
  del navegador. Cómo se resuelve es una decisión propia, no una consecuencia
  de esta.
- Invertir a tema claro toca todos los componentes: no hay entrega parcial
  posible sin una fase donde conviven dos estéticas.

## Alternatives considered

- **(A) Mantener el tema oscuro y solo arreglar el layout móvil.** Rechazada:
  resuelve la usabilidad pero no la petición —el usuario pidió una dirección
  visual concreta y la ancló a referencias— y deja la aplicación sin sistema
  de diseño, que es la causa de que el aspecto esté repetido a mano.
- **(B) Sostener tema claro y oscuro desde el principio.** Rechazada: duplica
  cada decisión de color antes de que la primera esté validada en un teléfono
  real. Queda como candidata a épica propia; el hecho de que los tokens sean
  la única fuente es lo que la abarata después.
- **(C) Configurar los tokens en `tailwind.config.js`.** Rechazada: es el
  modelo de Tailwind 3. En la versión 4 que el proyecto usa, la configuración
  vive en CSS con `@theme`, y añadir un archivo de configuración iría contra
  la librería en vez de seguirla — la misma razón que en b2.1 llevó a usar
  `PropertyBinding.sanitizeNodeName` de `three` en vez de reimplementarla.
- **(D) Adoptar una librería de componentes neobrutalista.** Rechazada: la
  aplicación tiene seis componentes de presentación y un lienzo WebGL; una
  dependencia nueva pesaría más que el CSS que sustituye, y `must-privacy-006`
  obliga a auditar que no pida nada a la red.
