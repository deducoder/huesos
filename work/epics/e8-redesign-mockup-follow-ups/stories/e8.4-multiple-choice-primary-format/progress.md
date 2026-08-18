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

## T2 · Responder en modo `choice` — calificar y registrar

Como se anticipó en T1: los 2 tests nuevos (acierto registra
`{correct:1, incorrect:0}` y muestra "Correcto"; fallo registra
`{correct:0, incorrect:1}` y muestra "Incorrecto" + `bone.es`/`bone.la`)
pasaron en verde sin RED — la calificación ya estaba en el componente
desde T1. Mutación forzada (`anotar(seleccionId === bone.id)` →
`anotar(true)`) confirmó que el test del fallo lo detecta.

Gate: `./scripts/check` verde (252 tests, lint/format/types limpios).

## T3 · Guardrail `must-data-010` y corrección de la pista accesible

RED confirmado en ambas vistas antes de tocar el texto fuente: los tests
nuevos (`SkeletonTestView.test.tsx`, `BoneTestView.test.tsx`) fallaban
contra "Escribí su nombre en el campo de respuesta" / "...Escribí su
nombre...". Corregido a "Elegí su nombre entre las 3 opciones" /
"...Elegí su nombre entre las 3 opciones." — GREEN inmediato. Fila
`must-data-010` agregada a `governance/guardrails.md`, distinguiendo
explícitamente su alcance del de `must-data-003` (que sigue intacto,
gobernando el formato escrito oculto).

Gate: `./scripts/check` verde (254 tests, lint/format/types limpios).

## T4 · Verificación manual — recorrido real en el navegador

Build de producción + `vite preview` en un puerto propio, recorrido con
Playwright real (no jsdom): Test → Hueso aislado y Test → Esqueleto
completo muestran 3 opciones y 0 campos de texto en ambos; "Responder"
arranca deshabilitado y se habilita al elegir; responder muestra el
resultado; 6 preguntas consecutivas confirmaron que la posición de las 3
opciones cambia entre preguntas y que ninguna repite etiqueta dentro de
la misma pregunta; ningún texto ni `aria-label` dice "escrib" en ningún
punto del recorrido.

**Desviación real del plan, y un hallazgo que no estaba en la lista de
archivos de ninguna tarea:** un grep de `getByPlaceholder`/`getByRole('textbox'`
sobre `e2e/` encontró que `e2e/mobile-shell.spec.ts` dependía del `<form>`
del formato escrito (`getByPlaceholder(/qué hueso es/i)`) para medir el
mínimo táctil. El plan no lo había nombrado porque `./scripts/check-integration`
no corre por tarea, solo al pushear (`gemba:integrate`) — pero dejar un
gate que sé que está roto para que lo encuentre otra fase, ya sin este
contexto, es exactamente lo que "no acumular defectos" pide evitar.
Corrida la suite completa de todos modos:

1. `e2e/mobile-shell.spec.ts` — el mismo problema: reescrito para elegir
   una opción del `<fieldset>` en vez de tipear.
2. `e2e/desktop-scale-up.spec.ts` — un segundo caso, más sutil: el test
   ubicaba "la barra de respuesta" por `page.locator('form').first()`,
   que ya no existe por defecto. La barra en sí (el contenedor
   `border-tinta border-t p-4` que envuelve el formato que sea) no tenía
   ningún selector estable — se le agregó `data-testid="barra-respuesta"`
   en `TestQuestion.tsx`, mismo patrón que `data-testid="escena"` ya
   usa en este mismo componente.
3. **La primera corrida de `check-integration` dio un falso positivo — no
   por mi cambio, sino por servidores `vite preview` obsoletos** en los
   puertos 4173/4321, algunos de horas antes de esta sesión
   (`ps` mostró un proceso de las 16:17). `playwright.config.ts` tiene
   `reuseExistingServer: !process.env.CI`, así que reutilizó el build
   viejo en vez de reconstruir — medí contra código de antes de e8.4.
   Maté los procesos obsoletos y corrí de nuevo contra un build fresco.

Suite de integración completa: 21/21 en verde
(`./scripts/check-integration`). Gate rápido también verde
(`./scripts/check`, 254 tests).

## Finalize

- Full gate set: verde (`./scripts/check` — 254 tests; `./scripts/check-integration` — 21/21).
- Orphaned-test check: `src/App.test.tsx` monta `TestQuestion` indirectamente
  (vía `SkeletonTestView`/`BoneTestView`) y solo verifica que el botón
  "Responder" existe — mismo nombre accesible en ambos formatos, sigue
  verde sin tocarse. Ningún otro archivo importa `TestQuestion`,
  `SkeletonTestView` o `BoneTestView` fuera de sus propios tests y de
  `App.tsx`/`SkeletonTestView.tsx`/`BoneTestView.tsx` mismos.
- Acceptance criteria: cumplidas de punta a punta — formato por defecto
  `choice` sin campo de texto, formato `open` intacto y solo alcanzable
  explícito, `must-data-010` declarado con su verificación, guardia de
  `must-data-003` sin editarse y su test sigue en verde.
