# Story e9.6: The system back button walks the app — Plan

> Size: M

## Tasks

### T1 · El historial transporta el modo, y `popstate` lo restituye

- **Files:** modify `src/App.tsx`, `src/App.test.tsx`
- **TDD:** RED una prueba que abre la ficha del fémur desde Explorar,
  llama a `history.back()` y espera volver a Explorar con el fémur aún
  seleccionado — hoy se queda en la ficha, porque nunca se empujó nada →
  GREEN `navegar` como único punto de transición (`pushState` + `setModo`),
  el `useEffect` con el escucha de `popstate`, el predicado `esModo` y
  `modoInicial()` → REFACTOR reemplazar los seis `setModo` sueltos por
  `navegar`.
- **Satisfies:** los tres primeros escenarios del scope, y el escenario
  delta del diseño (un `state` que no es un `Modo` cae a Explorar).
- **Verify:** propiedad — tras retroceder, la vista montada corresponde a
  la entrada anterior del historial, y un `state` ajeno no deja la vista
  desincronizada. Mutación forzada: quitar el `pushState` de `navegar`
  debe poner roja la prueba de retroceso; hacer que `esModo` devuelva
  `true` siempre debe poner roja la del `state` inválido.
  **Además:** `npx vitest run src/App.test.tsx --sequence.shuffle` en
  verde — jsdom comparte `window.history` entre casos del mismo archivo, y
  una prueba que retrocede leyendo la pila que dejó la anterior pasa por
  orden, no por comportamiento. Barajar es lo que comprueba el instrumento.
  Luego `./scripts/check`.
- **Commit:** `feat(navigation): carry the mode in history entries`

### T2 · Los botones que ya decían «atrás» retroceden, y `origen` se barre

- **Files:** modify `src/App.tsx`, `src/App.test.tsx`
- **TDD:** RED una prueba que abre la ficha desde Fichas, pulsa «← Volver»
  y luego `history.back()`, esperando **no** reentrar a la ficha — tras T1
  reentra, porque «Volver» empuja una entrada nueva → GREEN los dos
  botones («← Volver» en `App.tsx`, «← cambiar modo» en `TestQuestion` vía
  su prop) pasan por `history.back()`; eliminar `origen` del tipo `Modo` y
  de sus dos sitios de escritura → REFACTOR ninguno esperado.
- **Satisfies:** el quinto escenario del scope («volví con el botón de la
  aplicación … no reentro a la ficha»), y el segundo («vuelvo a Explorar,
  no a Fichas»), que ahora lo sostiene el historial y no el campo.
- **Verify:** propiedad — usar el botón de retroceso de la aplicación deja
  el historial una entrada más corto, no más largo. Mutación forzada:
  devolver `origen` y volver a `setModo({ tipo: modo.origen })` debe poner
  roja la prueba de no-reentrada. Red de seguridad del barrido: la prueba
  existente *«Volver» desde una ficha abierta en "Fichas" regresa a la
  lista de fichas, no a Explorar* debe seguir verde sin tocarla — es lo
  que impide que eliminar el campo cambie el comportamiento en silencio.
  Luego `./scripts/check`.
- **Commit:** `refactor(navigation): back buttons pop history instead of pushing`

### T3 · La prueba de navegador, que es la que de verdad observa esto

- **Files:** create/modify `e2e/mobile-shell.spec.ts` (o un spec propio de
  navegación, según dónde encaje sin duplicar el arranque)
- **TDD:** el mecanismo ya existe tras T1/T2, así que **el RED se produce a
  mano**: se escribe la prueba, se comprueba que pasa, y se revierte
  temporalmente el `pushState` para verla ponerse roja. Una prueba de
  regresión que nunca se vio fallar no prueba nada.
- **Satisfies:** el «done when» del scope que exige `page.goBack()`, y el
  riesgo que el plan de la épica registró como alto: `popstate` en jsdom no
  reproduce el gesto de un teléfono.
- **Verify:** propiedad — con la aplicación real en un navegador real,
  `page.goBack()` desde una ficha devuelve a la vista de origen sin
  abandonar el sitio. Mutación forzada: la reversión temporal del
  `pushState` descrita arriba. Comando: `./scripts/check-integration`.
  **Precondición:** no puede haber servidores sobrantes escuchando —
  `reuseExistingServer` reutiliza cualquiera vivo e ignora el `build`, y
  hoy hay dos `vite preview --port 4180` huérfanos. Se avisa antes de
  matarlos; el dev server de 5173 y su túnel **no se tocan**.
- **Commit:** `test(navigation): cover the system back button in a real browser`

### T4 · Prueba manual de integración

- Con la aplicación corriendo en el dev server ya vivo, a través del túnel
  de Cloudflare, en el teléfono real. Nada que levantar ni reiniciar.
- **Verify:** desde Fichas, abrir el fémur y volver con el gesto del
  sistema → Fichas. Desde Explorar con el fémur seleccionado, abrir la
  ficha y volver → Explorar, con el fémur todavía marcado. Desde el test de
  esqueleto, volver → elegir variante. Y desde Explorar recién cargada, el
  gesto abandona el sitio: eso también hay que verlo, porque no secuestrar
  la primera entrada es criterio, no descuido.

## Order & risks

- **Execution order:** T1 → T2 → T3 → T4. T1 primero porque es el mecanismo
  nuevo y el único con incertidumbre real; si el `Modo` no viaja bien en el
  `state` de una entrada, todo lo demás cambia. T2 depende de que T1 exista
  para poder fallar. T3 y T4 verifican, y no pueden preceder a lo que
  verifican.
- **Dependencies:** estrictamente secuencial, sin ciclos.
- **Risks:**
  - jsdom comparte `window.history` entre casos → el `--sequence.shuffle`
    de T1 es lo que lo detecta; sin él, un verde puede ser de orden.
  - `history.back()` es asíncrono también en jsdom → la aserción posterior
    al clic puede necesitar esperar al `popstate`; si aparece un
    `waitFor`, es por esto y no por lentitud del render.
  - El checkpoint E2E puede medir un build viejo → precondición explícita
    en T3, con los huérfanos ya localizados.
