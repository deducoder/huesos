---
name: measure-via-the-accessible-path-not-the-obvious-one
description: "Al medir latencia de una app con WebGL/canvas, medir vía la interacción accesible (DOM) en vez del clic directo sobre el canvas evita confundir el costo del entorno de renderizado con la respuesta real de la aplicación."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 341330ec-28f7-4560-b20e-7f103b32b38a
  modified: 2026-08-18T00:52:11.054Z
---

Cuando una interacción tiene dos vías equivalentes hacia el mismo estado —una
"obvia" (clic directo sobre un `<canvas>` WebGL, con raycasting) y otra
accesible (un botón de teclado/lector de pantalla que dispara el mismo
cambio de estado) — medir la latencia de respuesta de la aplicación por la
vía obvia puede medir, en cambio, el costo del entorno de ejecución.

**Por qué:** en huesos-mono (historia e7.10), un clic real sobre el
`<canvas>` tarda ~2s bajo renderizado por software en el entorno de CI —ya
documentado en un comentario de un test anterior—, mientras que la
selección vía el navegador de huesos (mismo `onSelect`, mismo commit de
React que resalta la malla) resolvía en unos pocos milisegundos. Medir por
el canvas habría reportado un guardrail de "responde en <100ms" como roto,
cuando lo que fallaba era el raycasting de three.js bajo software
rendering, no la aplicación.

**Cómo aplicar:** antes de medir latencia de interacción, verificar si
existe una vía de acceso alternativa (accesible, o cualquier atajo que
dispare el mismo cambio de estado) que comparta el mismo código de
aplicación sin el costo específico del mecanismo de entrada. Si existe,
medir por ahí y documentar explícitamente por qué — la medición sigue
siendo honesta sobre lo que mide, solo evita el ruido de un componente que
no es el que el guardrail vigila.
