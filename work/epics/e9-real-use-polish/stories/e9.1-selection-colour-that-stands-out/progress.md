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

## T2 · Los tokens de acierto y error, con su contraste afirmado

**Done.** `--color-acierto` (#15803d) y `--color-error` (#b91c1c) en `@theme`,
con un gate que calcula el contraste WCAG contra `--color-panel`, no lo cita.

- **RED:** 1 de 2 en rojo — el token no existía. La segunda afirmación
  (`#ef4444` no cumple) pasó desde el principio: es la calibración de que la
  función mide de verdad, no la propiedad bajo prueba.
- **GREEN:** los dos valores del design, calculados con la misma fórmula
  WCAG 2.1 que documenté a mano en el scope.
- **Mutación forzada, ejecutada dos veces** (antes y después del refactor de
  tipos): bajar `--color-error` a `#ef4444` pone el gate en rojo; el valor
  real lo deja en verde.
- **Gate:** `./scripts/check` verde — 316 tests.

**Lo que el plan no anticipó:** `noUncheckedIndexedAccess` no deja destructurar
`[r, g, b]` de un `.map()` sin que cada elemento quede `number | undefined`,
aunque el array tenga longitud fija conocida. El primer intento resolvió el
error de tipos con `as number` — que viola `must-type-004` («prohibido `any` y
`as` para silenciar el compilador») — y se reescribió sin destructuring ni
casteo: `canal(1)`, `canal(3)`, `canal(5)` en vez de indexar un array. El gate
del tipo hizo su trabajo: avisó de un atajo antes de que quedara commiteado.

## T3 · Verificación manual de integración

**Hecho desde el escritorio, en 390 px, con capturas y mediciones — pendiente
la confirmación del humano en su teléfono real.**

- **Fémur (hueso grande, alto):** suma 282, azul inconfundible. Coincide con
  el color del botón «Ver ficha completa».
- **Clavícula (hueso chico, sobre la caja torácica):** suma 244 sobre 342 px
  —área proporcional al tamaño del hueso—, igual de clara a simple vista.
- **Deselección:** al pasar de fémur a tibia, el fémur midió
  `rgb(171,165,157)` — contra `rgb(168,161,154)` sin seleccionar nunca y
  `rgb(174,173,197)` seleccionado. Prácticamente el mismo beige original, muy
  lejos del lila que tenía activo: el color se restaura de verdad, no se
  aproxima.
- Sin acceso a "costilla derecha" por nombre accesible exacto en esta pasada
  —el localizador con regex no encontró coincidencia—; no bloquea, cubierto
  por el fémur (grande) y la clavícula (chico) en tamaños opuestos.

**Falta:** el mismo recorrido en el teléfono del humano, y el modo test de
esqueleto completo, que reutiliza el mismo componente.
