---
name: git-checkout-is-not-a-safe-revert-of-uncommitted-work
description: "git checkout/restore vuelve al último commit, no a \"hace un momento\" — mutar antes de commitear puede borrar el GREEN sin aviso"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 28d8bc13-d3f7-4426-8731-0c5c99d0c8bd
  modified: 2026-08-18T21:00:19.099Z
---

Durante una mutación forzada (revertir un fix para confirmar que el test
vuelve a rojo), usar `git checkout -- archivo` o `git restore archivo`
solo es seguro si el GREEN que se quiere preservar ya está commiteado.
Si no lo está, el comando no distingue "deshacer mi mutación" de
"deshacer todo el trabajo sin commitear" — vuelve al último commit, sin
más.

**Why:** en e9.7 (T3, `App.tsx`), un intento de mutación forzada corrió
`git checkout -- src/App.tsx` para revertir un cambio de una línea, pero
el GREEN completo de la tarea (el estado del menú, el botón real, el
render de `AboutPanel`) todavía no estaba commiteado — el commit más
reciente era el merge anterior, de la tarea previa. El comando borró la
tarea entera, no solo la mutación. Detectado de inmediato con `grep`
antes de seguir adelante; recuperado sin pérdida real rehaciendo los
mismos cambios, pero el costo fue evitable.

**How to apply:** commitear el GREEN antes de mutar para verificar una
propiedad, siempre que la mutación se vaya a revertir con un comando de
git (`checkout`/`restore`/`reset`). Si el commit todavía no tiene sentido
por sí solo (tarea a medias), mutar con un método que no dependa de git
—guardar una copia con `cp` a un archivo temporal, o revertir el texto
a mano— en vez de asumir que `git checkout` es un "deshacer" genérico.
Ver [[a-reintroduced-defect-must-actually-break]] para el motivo por el
que la mutación forzada en sí es necesaria.
