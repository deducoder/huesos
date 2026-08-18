# Story e9.7: Homogeneous header, and a menu that opens — Progress

## T1 · La fórmula de atribución, extraída y guardada contra desincronizarse

**Done.** `ATRIBUCION_LITERAL` y `LICENCIA_URL` en `src/data/attribution.ts`,
con un gate que lee `ATTRIBUTION.md` de verdad y compara.

- **RED, primera versión — un falso hallazgo del propio test.** El primer
  intento comparaba `fuente.toContain(ATRIBUCION_LITERAL)` contra el archivo
  crudo, y falló incluso con la constante correcta: `ATTRIBUTION.md` envuelve
  la cita en dos líneas (`>` de markdown) por prolijidad editorial, mismo
  texto, distintos bytes. Corregido extrayendo el bloque de líneas `> ` y
  reuniéndolas en una sola antes de comparar — no debilitando la aserción a
  un fragmento parcial, que habría dejado pasar una fórmula recortada.
- **GREEN:** la constante, transcrita una vez.
- **Mutación forzada:** cambiar «Life Science» por «Life Sciences» rompe
  las dos pruebas que dependen del texto — la propia y la de
  desincronización, confirmando que las dos vigilan lo mismo desde ángulos
  distintos.
- **Gate:** `./scripts/check` verde — 330 tests.

## T2 · `AboutPanel`, el overlay de privacidad y créditos

**Done.** `src/components/AboutPanel.tsx` — overlay propio con
`role="dialog"`, `aria-modal`, foco al montar, cierre por Escape/backdrop/
botón. No toca `window.history` ni `Modo`.

- **RED:** 8 aserciones en `AboutPanel.test.tsx` — todas evalúan de verdad,
  a diferencia de las escenas WebGL, porque esto es DOM plano. Import
  contra un módulo aún no escrito, confirmado como RED real (falla de
  aserción, no de transformación) antes de implementar.
- **GREEN:** el componente completo del design, con `ATRIBUCION_LITERAL` y
  `LICENCIA_URL` de T1.
- **`biome-ignore` inválido:** dos comentarios `{/* biome-ignore ... */}`
  en JSX ("Suppression comment has no effect") — la forma JSX del
  comentario no es la que Biome reconoce. Al quitarlos, las reglas de a11y
  que supuestamente suprimían no dispararon igual (`aria-hidden="true"` en
  el backdrop ya las satisface), así que el arreglo fue borrarlos, no
  reescribirlos.
- **Hallazgo ajeno, no de esta tarea:** al correr el gate completo con T2
  agregado, `TestQuestion.test.tsx` falló de forma intermitente. Investigado
  antes de nombrarlo bug (no descartado como "flaky"): `new RegExp(shortName(bone.es))`
  usado como matcher de `getByRole` hace substring match sin anclar, y 5
  pares de los 120 nombres cortos únicos son substring uno de otro
  («1.ª vértebra torácica» ⊂ «11.ª vértebra torácica», «Escafoides» ⊂
  «Escafoides del tarso», y tres pares más). Cuando `pickDistractors`
  sorteaba el par de diez de diferencia, `getByRole` encontraba dos
  coincidencias y reventaba — reproducido con 15-25 corridas antes del
  arreglo, verificado con 50 corridas después. Defecto preexistente de
  e9.2 (ya señalado como observación en su `quality-review` y no arreglado
  entonces), no del alcance de e9.7. Arreglado directamente en `main`
  (`fix(test): match short bone names exactly, not by unanchored regex`,
  commit `be979e8`) siguiendo el precedente de e9.1, y traído a esta rama
  con `git merge main` — no bundleado en un commit de e9.7.
- **Mutación forzada:** borrar `aria-modal="true"` rompe la primera
  aserción, y quitar el listener de `keydown` para Escape rompe la
  prueba de cierre por teclado.
- **Gate:** `./scripts/check` verde — 338 tests, en la rama de la historia
  con el fix de `main` ya mergeado.

## T3 · `App.tsx`: el menú abre y cierra el panel sin tocar el historial

**Done.** `MenuIcono` deja de ser un `<div aria-hidden>` decorativo y pasa a
ser un `<button>` con `onClick`; `menuAbierto` es estado local de `App`
(`useState<boolean>`), no un `Modo`.

- **RED:** 4 pruebas nuevas en `App.test.tsx` (agrupadas en
  `describe('el menú (e9.7)')`) — confirmadas en rojo real: `getByRole`
  fallaba porque el botón "menú" no existía todavía como elemento
  accesible.
- **GREEN:** `MenuIcono({ onClick })`, `menuAbierto` cableado al
  `onClick` y al render condicional de `AboutPanel` al final de `<main>`.
  El menú ya no se monta en modo `'ficha'` porque esa rama del header
  nunca incluyó `MenuIcono` — sin cambio adicional, la prueba de esa
  condición pasó directo.
- **Accidente durante la verificación, no del código:** un primer intento
  de mutación forzada usó `git checkout -- src/App.tsx` para revertir, y
  como T3 todavía no estaba commiteado eso borró el GREEN entero (volvió
  al estado del merge de T2). Detectado de inmediato con `grep` antes de
  seguir, rehecho igual que la primera vez, y commiteado antes de repetir
  cualquier mutación — la lección concreta: mutar y revertir con
  `git checkout`/`restore` solo es seguro sobre un commit ya hecho.
- **Mutación forzada (ya sobre el commit):** reemplazar
  `setMenuAbierto(true)` por `window.history.pushState(modo, ''); setMenuAbierto(true)`
  —simulando que la apertura se implementó como una navegación real, el
  atajo que el scope prohíbe— rompe exactamente la prueba de
  `window.history.length`, la única de las 4: `expected 17 to be 16`.
  Revertido con `git restore` (seguro, ya commiteado) y confirmado verde
  de nuevo.
- **Gate:** `./scripts/check` verde — 342 tests.

## T4 · La cabecera de la ficha se redondea

**Done.** El `<header>` de la rama `'ficha'` pasa del patrón viejo
(`border-tinta border-b-2`, pegado al borde) al mismo lenguaje que el resto
de las cajas flotantes: `mt-3 mb-3 mx-3.5 rounded-suave border-2 border-tinta
bg-panel shadow-dura`.

- **RED:** una aserción sobre `getByTestId('cabecera')` en modo ficha —
  confirmada en rojo real, con las clases viejas listadas en el mensaje de
  fallo.
- **GREEN:** el cambio de clases, sin tocar la lógica del botón "Volver"
  ni el `h1` `sr-only`.
- **Mutación forzada:** revertir a la clase vieja (`border-b-2` sin
  `rounded-suave`) reproduce el mismo mensaje de fallo que el RED original.
  Commiteado antes de mutar esta vez (lección de T3), así que
  `git restore` fue seguro.
- **Gate:** `./scripts/check` verde — 343 tests.
