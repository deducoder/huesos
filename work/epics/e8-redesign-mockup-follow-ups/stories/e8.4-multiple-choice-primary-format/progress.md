# Story e8.4: Multiple choice as primary test format — Progress

## T1 · Modo `choice` por defecto — 3 opciones, ninguna marcada como correcta

`TestQuestion` gana `answerFormat?: 'open' | 'choice'` (default `'choice'`).
Los ~11 `render(...)` existentes de `TestQuestion.test.tsx` agregan
`answerFormat="open"` en el mismo commit — sin esto, todos rompían a la
vez. 4 tests nuevos verifican el render por defecto (sin campo de texto,
3 botones dentro de un `<fieldset>`, ninguno marcado, "Responder"
deshabilitado hasta elegir). Mutación forzada (quitar la condición
`answerFormat === 'open'` del `<form>`) confirmó que los 4 tests nuevos lo
detectan.

**Desviación real del plan, dicha en voz alta:**

1. **Fallout no planeado en dos archivos fuera de la lista de T1:**
   cambiar el default rompió dos tests que el plan no había nombrado —
   `BoneTestView.test.tsx` (`must-data-003` propio, montando el
   componente real sin `answerFormat`) y
   `tests/privacy-runtime.test.tsx` (tipeaba en un campo de texto que ya
   no existe por defecto). El primero se reemplazó por un test que
   verifica lo que realmente sigue siendo cierto ahí —
   `must-data-010`, ninguna opción marcada— en vez de borrarlo o dejarlo
   describiendo algo falso; el segundo se actualizó para elegir una
   opción en vez de escribir. Ninguno se aparcó: los dos eran gate rojo,
   no hallazgos opcionales.
2. **Lint rechazó `role="group"`:** `useSemanticElements` de Biome pide
   `<fieldset>`/`<legend>` en vez de un `div` con `role="group"` +
   `aria-label`. Cambiado — `getByRole('group', { name: ... })` sigue
   funcionando igual en los tests, el `<legend>` provee el nombre
   accesible.
3. **El GREEN de T1 ya implementó la calificación completa** (comparación
   exacta de id, registro del veredicto) — la lógica de T2 no se podía
   separar de "qué hace 'Responder' al hacer clic" sin dejar un botón
   deliberadamente roto a mitad de un commit. T2 verificará con el mismo
   criterio de mutación que ya se volvió rutina en e8.3, no con un RED
   fingido.

Gate: `./scripts/check` verde (250 tests, lint/format/types limpios).
