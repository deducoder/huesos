# Story e9.3: The isolated bone fits and turns — Plan

> Size: M

Las tareas se cortan **por escenario del scope**, no por mecanismo. Es el
aprendizaje de e9.6: cortarlas por mecanismo dejó dos criterios sin prueba
hasta la revisión.

## Tasks

### T1 · La aritmética del encuadre conoce el ancho y la reserva

> Escenarios: «la clavícula se ve entera» (la aritmética), el delta «el
> fémur no empeora», y los casos límite.

- **Files:** modify `src/domain/framing.ts`, `src/domain/framing.test.ts`
- **TDD:** RED pruebas de `frameObject` — con la clavícula (0,140 × 0,033) y
  aspecto 0,513 la distancia la manda el **ancho**, no el alto; con el fémur
  (0,116 × 0,451) la distancia no supera la que `distanceToFit` ya daba;
  `reservedBottom = 0` da `shiftY = 0`; tamaño nulo y reserva saturada no
  producen `NaN` ni `Infinity` → GREEN `frameObject`, apoyada en
  `distanceToFit` → REFACTOR ninguno esperado.
- **Verify:** propiedad — para un objeto más ancho que alto en un lienzo más
  alto que ancho, la distancia crece respecto de encuadrar solo por altura.
  Mutación forzada: ignorar `size.width` y encuadrar por `max(w, h)` como
  hoy debe poner roja la prueba de la clavícula y **no** la del fémur — si
  también mata la del fémur, esa prueba no distingue el defecto.
  Comando: `./scripts/check`.
- **Commit:** `feat(framing): fit an object by width, aspect and reserved space`

### T2 · El hueso entero entra en el lienzo

> Escenario: «abro la ficha de la clavícula derecha … se ve entero, sin
> salirse por los lados». Y las no-regresiones que van con él: la falange
> más chica sigue visible, y un hueso sin geometría sigue sin montar lienzo.

- **Files:** modify `src/components/IsolatedBoneScene.tsx`,
  `src/features/bone-detail/BoneDetailView.tsx`,
  `src/features/test/BoneTestView.tsx`; modify `e2e/mobile-shell.spec.ts`
- **TDD:** RED una prueba de navegador que abre la ficha de la clavícula
  derecha en 390×844, captura el lienzo y cuenta píxeles de hueso —claros
  sobre el `#20242b` del fondo— en las columnas de ambos bordes; hoy los hay
  → GREEN `IsolatedBoneScene` mide ancho y alto, lee el aspecto real del
  lienzo y usa `frameObject`; `reservedBottom` entra como prop **requerida**
  y los dos llamadores la pasan (en T2 con un valor fijo; T3 lo mide) →
  REFACTOR ninguno esperado.
- **Verify:** propiedad — ninguna columna de borde del lienzo contiene
  hueso. Mutación forzada: volver a `distanceToFit(max(x,y,z))` debe
  reponer los píxeles en los bordes. **Además, tres no-regresiones en la
  misma corrida:** la ficha de la falange media del quinto dedo del pie
  sigue mostrando algo (el `near={0.001}` de e4.4 no se pierde), la de un
  hueso sin geometría sigue sin montar lienzo, y el fémur sigue viéndose.
  Comandos: `./scripts/check` y la prueba dirigida de Playwright.
- **Commit:** `fix(bone-scene): frame the isolated bone by its real width`

### T3 · El hueso no queda detrás de la tarjeta

> Escenario: «el hueso queda en la parte del lienzo que la tarjeta no
> tapa», más el delta «se reserva el alto real de esa tarjeta, no el 45 %
> declarado».

- **Files:** modify `src/features/bone-detail/BoneDetailView.tsx`; modify
  `e2e/mobile-shell.spec.ts`
- **TDD:** RED una prueba de navegador que captura el lienzo de la ficha y
  compara los píxeles de hueso **sobre** la tarjeta contra los que quedan
  **debajo** de ella; hoy la mayoría cae detrás → GREEN medir el alto real
  de la tarjeta con un `ResizeObserver` y pasarlo como fracción → REFACTOR
  ninguno esperado.
- **Verify:** propiedad — la mayor parte del hueso queda en la franja
  visible. Mutación forzada: fijar `reservedBottom = 0` debe reponer el
  hueso detrás de la tarjeta. Y la comprobación de que se **mide**: con una
  ficha corta y otra larga, la fracción reservada difiere — si fuera el 45 %
  fijo, sería la misma. Comandos: `./scripts/check` y Playwright dirigido.
- **Commit:** `fix(bone-detail): reserve the space the sheet actually covers`

### T4 · El hueso se puede girar sin robarle el scroll a la página

> Escenario: «arrastro el dedo sobre el lienzo · el hueso gira, y la página
> no hace scroll». Y la no-regresión: `SkeletonScene` no cambia.

- **Files:** create `src/components/FixTouchAction.tsx`; modify
  `src/components/SkeletonScene.tsx` (solo extraer, sin tocar su encuadre ni
  sus controles), `src/components/IsolatedBoneScene.tsx`; modify
  `e2e/mobile-shell.spec.ts`
- **TDD:** RED una prueba de navegador que arrastra sobre el lienzo de la
  ficha y compara la captura antes y después —hoy no cambia nada, porque no
  hay controles— y que comprueba `touch-action: none` sobre ese lienzo →
  GREEN `FixTouchAction` movido a su propio archivo con su comentario
  íntegro, más `<OrbitControls enableRotate enableZoom={false}
  enablePan={false} />` en la escena aislada → REFACTOR ninguno esperado.
- **Verify:** propiedad — arrastrar cambia lo que se dibuja, y el lienzo
  conserva sus propios gestos. Mutación forzada: quitar `<FixTouchAction />`
  de la escena aislada debe poner roja la aserción de `touch-action`, que es
  justo el defecto que e7.2 encontró en un teléfono real. No-regresión:
  `SkeletonScene.test.tsx` y las pruebas de gestos existentes siguen verdes
  **sin tocarlas**. Comandos: `./scripts/check` y `./scripts/check-integration`.
- **Commit:** `feat(bone-scene): let the isolated bone be rotated`

### T5 · Prueba manual de integración

- Con el dev server y el túnel ya vivos, en el teléfono real. Nada que
  levantar.
- **Verify:** la ficha de la **clavícula** y la del **atlas** —los dos casos
  medidos como extremos— muestran el hueso entero y por encima de la
  tarjeta. El **fémur**, que ya funcionaba, no se ve peor. La **falange
  media del quinto dedo del pie** sigue viéndose. El hueso gira con el dedo
  y la página no hace scroll mientras se gira. En el modo test de hueso
  aislado, lo mismo. Y Explorar sigue igual que antes.

## Order & risks

- **Execution order:** T1 → T2 → T3 → T4 → T5. T1 primero porque es la
  aritmética de la que todo lo demás depende y la única probable sin
  navegador. T2 antes que T3 porque encuadrar por el ancho es la causa
  principal y la reserva se apoya en ella. T4 al final: es la única
  capacidad nueva y no depende del encuadre.
- **Dependencies:** T2 y T3 dependen de T1; T4 es independiente pero se deja
  al final para no mezclar controles con encuadre mientras se afina.
- **Risks:**
  - **El fixture cómodo.** El fémur no expone nada: alto y estrecho, ratio
    0,26. Cada prueba nombra la clavícula (4,26) o el atlas (4,34), y la
    mutación de T1 debe matar el caso ancho **sin** matar el alto.
  - **Medir el lienzo antes del layout.** Un `<canvas>` mide 300×150 hasta
    que alguien lo dimensiona; el aspecto se lee de `useThree().size`, que
    ya es post-layout, y la tarjeta con `ResizeObserver`, que dispara
    después del layout por definición.
  - **El umbral de «píxel de hueso».** El fondo es `#20242b` y el hueso un
    beige claro; el umbral se elige mirando una captura real, no a ojo, y la
    mutación forzada es lo que confirma que discrimina.
  - **Servidores sobrantes antes de Playwright** — comprobar que 4173 está
    libre. El dev server (5173) y su túnel no se tocan.
