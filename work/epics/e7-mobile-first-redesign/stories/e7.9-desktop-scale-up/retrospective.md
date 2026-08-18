# Story e7.9: Escritorio como ampliación — Retrospective

## Quality review

Ver salida completa en la conversación de cierre. Veredicto: **PASS**, sin
hallazgos críticos ni recomendados. Dos umbrales de Playwright (fila de
Fichas: 700px con el valor real en 656; barra de test: 800px con el valor
real en 736) quedan con margen ajustado pero muy por debajo de los valores
rotos que el RED capturó (1264 y 1248) — separan "roto" de "arreglado" con
margen suficiente, no umbrales mágicos copiados de la implementación.

## Reflexión

1. **Qué aprendí del sistema:** en un contenedor flex, `flex-1` en un
   `<span>` con texto hace que su propio `boundingBox()` mienta sobre el
   vacío visual — el texto queda alineado a la izquierda de una caja ya
   crecida, así que medir el span da un falso verde. Medí primero así en la
   Task 2 (distancia de 8px, "todo bien") cuando la fila real medía
   1264px de ancho. El RED correcto midió el `<li>` ancestro, no el nombre.
2. **Qué cambiaría del proceso:** nada — el patrón RED-en-Playwright antes
   del GREEN funcionó igual de bien para layout puro (clases `md:`) que
   para lógica de dominio, y fue exactamente lo que detectó el falso-verde
   del punto 1 antes de escribir ningún fix.
3. **Estimado vs. actual:** M estimado en el plan de la épica → S real (3
   tareas, un patrón único — acotar ancho con `md:max-w-*` — aplicado tres
   veces). La épica marcó esta historia como la de más incertidumbre del
   tramo final por tocar el mecanismo de ADR-010 (el navegador `sr-only`),
   pero el gemba de diseño ya había hecho el trabajo difícil —confirmar que
   era el mismo patrón tres veces, y que `sr-only md:not-sr-only` compila—
   antes de planificar. Implementar fue mecánico.
4. **Mejora a una skill/convención:** ninguna concreta esta vez — el patrón
   que hizo falta (medir con Playwright real en vez de con jsdom para todo
   lo que dependa de un breakpoint) ya está bien cubierto por la convención
   existente de la suite de integración; no hace falta un cambio de skill,
   solo aplicarla.

## Aprendizajes guardados en memoria

- El patrón del `boundingBox()` de un `<span>` con `flex-1` mintiendo sobre
  el vacío visual — relevante más allá de este proyecto, cualquier vez que
  se mida geometría real con Playwright sobre un layout flex.

## Criterios de aceptación — confirmados

Los seis criterios de `design.md` (4 MUST + 1 MUST NOT + 1 SHOULD) quedaron
cumplidos, según el detalle de `progress.md`.
