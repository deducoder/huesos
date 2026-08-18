# Story e9.1: Selection colour that actually stands out — Progress

## T1 · El resaltado tiñe el material en vez de emitir luz

**Done.** `propio.color` alterna entre `colorDeSeleccion()` y el
`userData.baseColor` guardado al clonar el material; las dos líneas de
`emissive`/`emissiveIntensity` desaparecieron.

- **RED:** 2 en rojo — la presencia del tinte condicionado y la ausencia
  completa de `emissiveIntensity`.
- **GREEN:** `baseColor` se guarda en la misma rama que ya clona el material
  por malla, así que no hay estado nuevo que sincronizar aparte.
- **Gate:** `./scripts/check` verde — 314 tests.

**Lo que el plan no anticipó: un defecto real y preexistente, no de T1.**
Al correr `./scripts/check`, `TestQuestion.test.tsx` falló de forma
intermitente en un test que T1 no toca. Antes de asumir "flaky" —el proyecto
tiene el aprendizaje de que "intermitente" es una hipótesis, no un
hallazgo—, se reprodujo en `main` limpio, sin ningún cambio de e9.1: **2 de 5
corridas en rojo**.

**Causa raíz:** `TestQuestion.test.tsx:255` comparaba
`o.textContent !== bone.es` para encontrar la opción incorrecta. Desde e9.5
las opciones muestran `shortName(opcion.es)`, nunca igual al `es` completo —
la comparación dejó de discriminar y siempre matcheaba la primera opción de
la lista, correcta o no, al azar. Es una regresión de e9.5 que su propia
suite no vio: al no ser determinista, unas corridas pasaban.

**Arreglado directo en `main`** (`fix(test): compare against the short
option label, not the full catalog name`, `8abad96`) — trivial y bien
entendido, per la cláusula de salto de `bug-start`. Verificado con **15
corridas en verde** tras el fix, y **12 fallos en 10 corridas** al forzar la
mutación (volver a `bone.es`), confirmando que el arreglo es lo que sostiene
el verde y no una casualidad. Traído a esta rama con
`git merge main --no-edit` antes de continuar T1.
