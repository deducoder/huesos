# Story e7.6: Vista Explorar en móvil — Plan

> Size: M

## Tasks

### T1 · El lienzo a pantalla completa, sin el navegador

- **Files:** modify `src/features/explore/ExploreView.tsx`,
  `src/features/explore/ExploreView.test.tsx`, `e2e/mobile-shell.spec.ts`.
- **TDD:** RED `e2e/mobile-shell.spec.ts` mide el lienzo de Explorar contra el
  alto de su contenedor — falla porque hoy ocupa solo la fila central del
  grid → GREEN `ExploreView` pasa a `relative h-full` + lienzo
  `absolute inset-0`, sin `BoneNavigator` → REFACTOR el doble de
  `SkeletonScene` en el test, hoy fijo a un único botón que siempre elige
  `tibia-left`, pasa a exponer un botón por cada id que las pruebas necesitan
  simular (`femur-right`, `femur-left`, `tibia-left`, `malleus-right`) — la
  única vía de selección que le queda a esta vista es la escena, así que el
  doble tiene que poder simular más de un hueso.
- **Satisfies:** Must 1 del design; el primer criterio Gherkin del scope.
- **Verify:** `npx vite build` (hay un `vite preview` del túnel corriendo) y
  luego `npx playwright test e2e/mobile-shell.spec.ts`; `./scripts/check`.
- **Commit:** `feat(explore): fill the screen with the canvas, drop the navigator`
- **Por qué primero, y por qué es la tarea de mayor riesgo:** quitar el
  navegador rompe de inmediato ocho de las nueve pruebas existentes de
  `ExploreView.test.tsx`, que hoy seleccionan por la lista. No hay forma de
  separar «quitar el componente» de «arreglar sus pruebas» en dos commits sin
  dejar uno de los dos en rojo — así que van juntos, y es la tarea que más
  superficie cambia de la historia.

### T2 · La tarjeta de identidad flota al elegir, y no antes

- **Files:** modify `src/features/explore/ExploreView.tsx`,
  `src/features/explore/ExploreView.test.tsx`; modify
  `e2e/mobile-shell.spec.ts`.
- **TDD:** RED una prueba de navegador — sin selección no hay ningún elemento
  con `rounded-tarjeta`/`shadow-dura` en Explorar; al elegir «fémur derecho»,
  aparece uno con esas clases y el nombre del hueso adentro — falla porque
  `BoneIdentity` sigue montada en columna fija → GREEN el contenedor
  `absolute inset-x-4 bottom-4 max-h-[45vh] overflow-y-auto rounded-tarjeta
  border-2 border-tinta bg-panel shadow-dura`, montado solo cuando
  `bone !== undefined` → REFACTOR ninguno.
- **Satisfies:** Must 2, Must 3; el segundo y tercer criterio del scope.
- **Verify:** `npx vite build && npx playwright test e2e/mobile-shell.spec.ts`;
  `./scripts/check`.
- **Commit:** `feat(explore): float the identity card over the canvas`

### T3 · Los dos textos que ya no son ciertos sin la lista

- **Files:** modify `src/components/BoneIdentity.tsx`,
  `src/components/BoneIdentity.test.tsx`,
  `src/features/explore/ExploreView.tsx`,
  `src/features/explore/ExploreView.test.tsx`.
- **TDD:** RED dos pruebas — el estado vacío de `BoneIdentity` no menciona
  «lista» y sí menciona «Fichas»; el doble de `SkeletonScene` en
  `ExploreView.test.tsx` recibe un `accessibleHint` que tampoco menciona
  «lista» — fallan contra el texto actual → GREEN los dos textos del design
  → REFACTOR ninguno.
- **Satisfies:** Must 4, Must 5 del design; el quinto criterio del scope.
- **Verify:** `./scripts/check`.
- **Commit:** `fix(explore): stop pointing to a list that no longer lives here`
- **Nota:** el estado vacío de `BoneIdentity` no se llega a ver en Explorar
  tras T2 —sin selección no se monta nada—, pero el componente sigue
  usándose así en otros contextos hipotéticos y el texto tiene que ser
  correcto en su propio archivo, no solo en el lugar donde hoy se monta.

### T4 · Manual integration test

- Con la aplicación por el túnel, en el teléfono: abrir Explorar y confirmar
  que el esqueleto ocupa toda la pantalla bajo el navbar; tocar un hueso y
  ver la tarjeta flotar sin recortar contenido; tocar el mismo hueso otra vez
  y confirmar que la tarjeta desaparece; probar con «falange proximal del
  segundo dedo de la mano» (el nombre más largo) y con un hueso sin malla
  (el aviso de 165 caracteres) para confirmar que la tarjeta no se desborda
  ni tapa una porción excesiva de pantalla; cambiar a «Fichas», elegir
  cualquier hueso por teclado (Tab + Enter) y confirmar que abre su ficha con
  escena e identidad completas.
- **Verify:** ninguna combinación de contenido real hace que la tarjeta pase
  del 45% del alto del viewport. Antes de cerrar,
  `./scripts/check-integration`.

## Order & risks

- **Execution order:** T1 → T2 → T3 → T4. T1 primero porque es la única que
  no se puede dividir más sin dejar el árbol en rojo. T2 depende de T1 (el
  lienzo ya tiene que ser el fondo completo antes de flotar algo encima). T3
  es independiente en código pero va al final porque es la más chica y menos
  arriesgada.
- **Dependencies:** secuencial.
- **Risks:**
  - *La tarjeta flotante, con contenido largo real, supera el 45% del
    viewport y tapa demasiado lienzo* → T4 la prueba contra los dos casos más
    exigentes del catálogo real, no un texto inventado — es la lección de
    e7.4 aplicada desde el arranque: medir el componente real, no un
    prototipo.
  - *`ADR-009` afirma que el camino accesible completo funciona por teclado,
    y esa afirmación no se vuelve a verificar en esta historia* → se apoya en
    dos pruebas que ya existen y siguen pasando sin tocarse:
    `BoneNavigator.test.tsx` («deja activar un hueso solo con el teclado») y
    `App.test.tsx` («elegir un hueso desde "Fichas" abre su detalle»). Se
    corren juntas en el gate de T1 como confirmación, no como prueba nueva.
  - *El doble de `SkeletonScene` reescrito en T1 deja de representar cómo se
    comporta la escena real* → sigue exponiendo la misma interfaz
    (`onPick(id)`), solo con más de un botón; no cambia lo que la escena
    real hace, cambia cuántos casos puede simular la prueba.
