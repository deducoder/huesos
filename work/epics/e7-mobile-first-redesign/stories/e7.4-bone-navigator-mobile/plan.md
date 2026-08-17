# Story e7.4: Navegador de huesos en móvil — Plan

> Size: L

## Tasks

One commit per task, in execution order (riskiest first).

### T1 · `toNavigatorRows`, la función de emparejamiento

- **Files:** create `src/domain/navigator-rows.ts`,
  `src/domain/navigator-rows.test.ts`.
- **TDD:** RED cinco casos: empareja dos adyacentes de lados opuestos; dos
  impares seguidos quedan como dos filas simples; un derecho sin su izquierdo
  adyacente no se pierde (fila simple, no caída silenciosa); conserva el orden
  de aparición; sobre el catálogo real da 120 filas —86 `paired` y 34
  `single`— → GREEN la función tal como la fija el design → REFACTOR ninguno
  previsto, es una función pura de veinte líneas.
- **Satisfies:** Must 5 del design; el escenario del catálogo real.
- **Verify:** `./scripts/check`.
- **Commit:** `feat(domain): pair adjacent bones for navigator rows`
- **Por qué primero:** es la pieza de más riesgo semántico —una caída
  silenciosa acá pierde un hueso de la lista para siempre— y no depende de
  nada visual. Se prueba sola, sin React, antes de tocar el componente.

### T2 · El navegador consume las filas, en 44 px verificados

- **Files:** modify `src/components/BoneNavigator.tsx`;
  modify `e2e/mobile-shell.spec.ts`.
- **TDD:** RED una prueba de navegador en 390×844 que mide la píldora
  «Derecho» de `fémur` y la fila de `esfenoides`, exige ≥44×44 px en las dos —
  falla hoy con 28 px → GREEN el JSX del design: `<li>` con nombre y dos
  píldoras para `paired`, fila simple para `single`, `aria-labelledby`
  componiendo el nombre accesible, `rounded-tarjeta`/`shadow-dura` solo en la
  seleccionada → REFACTOR ninguno.
- **Satisfies:** Must 1, Should 1; el primer criterio Gherkin del scope.
- **Verify:** `npx vite build` (hay un `vite preview` levantado a mano para el
  túnel — reconstruir antes de medir, la lección de e7.2/e7.3) y luego
  `npx playwright test e2e/mobile-shell.spec.ts`.
- **Commit:** `feat(navigator): render paired rows with thumb-sized pills`

### T3 · El nombre más largo no se recorta, y el desplazamiento total baja

- **Files:** modify `e2e/mobile-shell.spec.ts`.
- **TDD:** RED dos pruebas — el nombre de 44 caracteres se lee completo
  (comparar `textContent` contra el string esperado, no un recorte con
  ellipsis) en su fila `paired`; el alto total del navegador con los 206
  huesos es ≤ 6.208 px, la cifra medida en `main` antes de esta historia. Las
  dos deberían pasar ya si T2 se implementó según el design —esta tarea es la
  que **lo demuestra con números reales**, no solo con la fila de ejemplo de
  T2 → si alguna falla, GREEN es ajustar el CSS del `<li>` (el relleno
  vertical es el sospechoso, según el design) → REFACTOR ninguno.
- **Satisfies:** Must 2, Must 3 del design; el segundo criterio Gherkin del
  scope y el primer escenario delta del design.
- **Verify:** `npx vite build && npx playwright test e2e/mobile-shell.spec.ts`.
- **Commit:** `test(navigator): cover long names and total scroll length`

### T4 · Manual integration test

- Con la aplicación por el túnel, en el teléfono: abrir la pestaña «Fichas» y
  recorrer la lista completa de punta a punta; tocar varias píldoras de lado
  distinto sin fallar; abrir la ficha de un hueso par desde una píldora y
  confirmar que vuelve al mismo lado seleccionado; mirar un hueso impar
  («esfenoides») y confirmar que no tiene píldoras; mirar un hueso sin
  geometría y confirmar que el aviso de «no representable» sigue ahí.
- **Verify:** el recorrido se siente más corto que antes de esta historia, no
  solo más grande cada objetivo. Antes de cerrar, `./scripts/check-integration`.

## Order & risks

- **Execution order:** T1 → T2 → T3 → T4. T1 primero por riesgo semántico —una
  función de emparejamiento mal hecha pierde huesos de la lista, y es más
  barato descubrirlo en una prueba pura que en una captura de pantalla. T2
  antes que T3 por dependencia: no hay nada que medir en total sin el
  componente ya construido.
- **Dependencies:** secuencial. T3 depende de T2; ninguna es paralelizable de
  verdad porque cada una construye sobre el resultado visual de la anterior.
- **Risks:**
  - *El emparejamiento pierde un hueso si el catálogo cambia* → cubierto por
    T1: la función nunca asume adyacencia sin comprobarla, y el caso está
    probado explícitamente, no solo documentado.
  - *El alto de 44 px que el prototipo midió no se sostiene con las clases
    reales de Tailwind* (el prototipo usó CSS a mano, no las utilidades del
    proyecto) → T3 lo verifica con números del componente real, no del
    prototipo — es la razón por la que esta tarea existe separada de T2 en vez
    de ir todo junto.
  - *Medir contra un build viejo* → `npx vite build` antes de cada medición de
    navegador, en T2 y T3.
  - *El nombre accesible compuesto por `aria-labelledby` no calza con la regex
    de `BoneNavigator.test.tsx`* → si ese archivo se pone rojo en cualquier
    tarea, es la señal de parar la línea: el contrato de esa prueba no se
    edita, se cumple.
