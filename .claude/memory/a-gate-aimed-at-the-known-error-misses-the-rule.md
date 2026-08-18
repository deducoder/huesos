---
name: a-gate-aimed-at-the-known-error-misses-the-rule
description: Un gate escrito contra el error que ya pasó no vigila la regla; el mismo agujero se repite épica tras épica.
metadata:
  type: feedback
---

`design-tokens.test.ts` nace de ADR-007 («ningún componente escribe un color a
mano») pero comprueba otra cosa: que no aparezca la **paleta de fábrica de
Tailwind**. Un color hexadecimal en un módulo TypeScript aplicado con
`style={{}}` pasa limpio. Así se coló el color del lienzo 3D en E7 y los 23
valores de `REGION_ACCENT`/`ACENTO_PESTANIA` en E8 — dos épicas seguidas, el
mismo agujero.

**Why:** el gate se escribe justo después de que un error concreto duela, y
sale con la forma de ese error (`bg-slate-800`) en vez de la forma de la regla
(«todo color viene de una fuente declarada»). Verde entonces significa «no
volvió a pasar *eso*», no «la regla se cumple».

**How to apply:** al escribir un gate, enunciar la regla primero y preguntar
qué **otra** manera hay de violarla; si la respuesta es fácil de encontrar, el
gate está apuntado al ejemplo. Y añadir un caso de control que viole la regla
por una vía distinta a la que motivó el gate. Relacionado con
[[contracts-belong-in-gates-not-inventories]],
[[a-check-needs-a-check-that-it-looked]] y
[[epic-review-catches-what-no-single-story-touches]].
