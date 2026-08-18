# Story e9.7: Homogeneous header, and a menu that opens — Plan

> Size: M

## Tasks

### T1 · La fórmula de atribución, extraída y guardada contra desincronizarse

- **Files:** create `src/data/attribution.ts`, `src/data/attribution.test.ts`.
- **TDD:** RED — dos afirmaciones: (a) `ATRIBUCION_LITERAL` existe y es la
  cadena exacta que `ATTRIBUTION.md` exige; (b) el propio `ATTRIBUTION.md`
  **contiene** esa misma cadena —leído del archivo real, no citado de
  memoria—, así que un futuro cambio a cualquiera de los dos lados que
  desalinee al otro pone esto en rojo. → GREEN — la constante, transcrita
  una sola vez. → REFACTOR.
- **Satisfies:** «la fórmula de atribución no se traduce ni se resume»
  (design, Must NOT 1); el mecanismo de no-desincronización que el design
  propone.
- **Verify:** la propiedad es que los dos textos —el `.ts` y el `.md`—
  siguen siendo el mismo texto, no que cada uno por separado sea correcto
  — mutación forzada: cambiar una palabra de `ATRIBUCION_LITERAL` (p. ej.
  «Life Science» → «Life Sciences») debe romper (b), porque esa cadena ya
  no aparece en `ATTRIBUTION.md`. Luego `./scripts/check`.
- **Commit:** `feat(attribution): extract the literal attribution formula, guarded against drift`

### T2 · `AboutPanel`: overlay propio, foco gestionado, `Escape` cierra

- **Files:** create `src/components/AboutPanel.tsx`,
  `src/components/AboutPanel.test.tsx`.
- **TDD:** RED — comportamiento real con Testing Library, no código fuente
  (a diferencia de las escenas 3D, esto es DOM plano y se puede probar de
  verdad): (a) el panel tiene `role="dialog"` y `aria-modal="true"`, con
  nombre accesible; (b) muestra `ATRIBUCION_LITERAL` exacta, un enlace a
  la licencia con el `href` correcto, el aviso de privacidad y la
  advertencia de exactitud; (c) al montar, el foco entra al panel
  (`document.activeElement` es el contenedor); (d) `Escape` llama a
  `onClose`; (e) el botón de cerrar llama a `onClose`. → GREEN — el
  componente del design: `useRef` + `useEffect` con `.focus()` al montar y
  un listener de `keydown` para `Escape`, limpiado al desmontar. →
  REFACTOR.
- **Satisfies:** Must 3 y 5 del design; el escenario añadido sobre foco y
  teclado.
- **Verify:** la propiedad es que el panel gestiona el foco y el cierre
  por sí mismo, sin depender de quien lo monte — mutación forzada: quitar
  `panelRef.current?.focus()` del efecto rompe (c); quitar el listener de
  `keydown` rompe (d). Luego `./scripts/check`.
- **Commit:** `feat(about-panel): create the privacy, licence and attribution overlay`

### T3 · `App.tsx`: el menú abre y cierra el panel sin tocar el historial

- **Files:** modify `src/App.tsx`, `src/App.test.tsx`.
- **TDD:** RED — tres afirmaciones nuevas en `App.test.tsx`: (a) tocar el
  botón de menú (nombre accesible, no más `aria-hidden`) muestra
  `getByRole('dialog')`; (b) cerrarlo —botón o `Escape`— lo hace
  desaparecer y la vista de fondo sigue siendo la misma que antes de
  abrirlo; (c) `window.history.length` no cambia entre abrir y cerrar el
  panel —capturado antes y después—, a diferencia de cualquier
  `navegar(...)` real, que si empujara una entrada la rompería. → GREEN —
  `useState<boolean>` local en `App`, el botón real reemplaza a
  `IconoCuadrado` como elemento interactivo, render condicional de
  `AboutPanel`. → REFACTOR.
- **Satisfies:** Must 2 y 4 del design («cerrar el panel … no cambia …
  `window.history.length`»).
- **Verify:** la propiedad es que el panel es una capa ajena a `Modo`, no
  un modo más — mutación forzada: envolver la apertura en
  `navegar({ tipo: … })` en vez de `setMenuAbierto(true)` haría crecer
  `window.history.length`, violando (c); es exactamente el atajo que el
  scope prohíbe y que esta prueba existe para descartar. Luego
  `./scripts/check`.
- **Commit:** `feat(app): open the about panel from a real menu button`

### T4 · La cabecera de la ficha se redondea

- **Files:** modify `src/App.tsx`, `src/App.test.tsx`.
- **TDD:** RED — una afirmación sobre `getByTestId('cabecera')` en modo
  ficha: su clase incluye `rounded-suave` (o el nombre de utilidad que
  Tailwind resuelva) y ya no `border-b-2` sola. → GREEN — cambiar las
  clases del `<header>` de la rama `'ficha'` al mismo patrón que la
  cabecera normal (`rounded-suave border-2 border-tinta bg-panel
  shadow-dura`), ajustando el margen para que flote como el resto de las
  cajas en vez de pegarse al borde superior. → REFACTOR.
- **Satisfies:** Must 1 del design.
- **Verify:** la propiedad es que la cabecera de ficha usa el mismo
  lenguaje que las demás cajas — mutación forzada: revertir a
  `border-b-2` sin `rounded-suave` pone la prueba en rojo. Luego
  `./scripts/check`.
- **Commit:** `style(app): round the ficha header to match the rest of the shell`

### T5 · Verificación manual de integración

- Con la aplicación corriendo, en el teléfono: abrir el menú desde
  Explorar, Fichas y las dos variantes de Test; leer el contenido
  completo; cerrarlo con el botón, con `Escape` (si el teclado lo permite
  en el dispositivo) y tocando el fondo; confirmar que el «atrás» del
  sistema (ADR-013, e9.6) sigue funcionando exactamente igual después de
  haber abierto y cerrado el panel varias veces. Confirmar que la cabecera
  de una ficha se ve con esquina redondeada, borde y sombra, igual que el
  resto.
- **Verify:** el panel se siente como una capa encima de la vista, nunca
  como una pantalla nueva; ninguna apertura/cierre del panel deja un
  «atrás» extra ni se salta uno real.

### T6 · El «atrás» del sistema cierra el panel, no solo cambia la vista de fondo

- **Files:** modify `src/App.tsx`, `src/App.test.tsx`.
- **Origin:** hallazgo de la verificación manual en el teléfono (T5): con
  el panel abierto, el gesto de "atrás" del sistema navega la vista de
  fondo (`popstate` cambia `modo`) pero el panel —estado local, ajeno al
  historial por diseño— se queda montado encima, ahora sobre una vista que
  no es la que estaba cuando se abrió. Viola el propio "Done when" del
  scope: *"'atrás' del sistema sigue comportándose como antes de esta
  historia"*.
- **TDD:** RED — una prueba que navega a una vista real (`navegar`, entrada
  en el historial), abre el panel, dispara `window.history.back()`, y
  afirma que el panel desaparece (`queryByRole('dialog')` ausente) sobre
  la vista a la que `popstate` volvió. → GREEN — el handler `alRetroceder`
  de `App` también cierra el panel (`setMenuAbierto(false)`) además de
  fijar el `modo`. → REFACTOR.
- **Satisfies:** el "Done when" del scope sobre el comportamiento de
  "atrás"; ningún Must del design lo pedía explícito porque el design no
  contempló esta interacción — el gemba de la verificación manual es lo
  que la encontró, no una relectura de texto.
- **Verify:** la propiedad es que el panel nunca sobrevive a una
  navegación real del sistema — mutación forzada: quitar
  `setMenuAbierto(false)` del handler debe reproducir el hallazgo original.
  Luego `./scripts/check`.
- **Commit:** `fix(app): close the about panel on system back navigation`

### T7 · Crédito de la aplicación y leyenda de no-rastreo/sin fines de lucro

- **Files:** modify `src/components/AboutPanel.tsx`,
  `src/components/AboutPanel.test.tsx`.
- **Origin:** pedido explícito del humano en la verificación manual (T5):
  agregar quién desarrolló la aplicación y reforzar, en una leyenda corta,
  que no hay rastreo ni fines de lucro. El scope permite contenido más
  allá del mínimo declarado ("como mínimo" los cuatro ítems existentes).
- **TDD:** RED — dos afirmaciones nuevas: (a) el panel muestra el texto
  "Desarrollado por DEDU · 2026"; (b) muestra una leyenda que dice, sin
  ambigüedad, que no hay rastreo y que no persigue fines de lucro. →
  GREEN — una sección nueva (o una línea agregada a la sección de
  Privacidad existente, evaluado al implementar cuál lee mejor) con ese
  texto. → REFACTOR.
- **Satisfies:** pedido explícito del humano; no contradice ningún Must
  NOT del scope (no es un ajuste de usuario, no traduce/resume la
  atribución de BodyParts3D, que es un texto aparte y ya literal).
- **Verify:** la propiedad es que ambos textos están presentes y
  legibles — mutación forzada: borrar la línea de crédito o la leyenda
  rompe la aserción correspondiente. Luego `./scripts/check`.
- **Commit:** `feat(about-panel): credit the developer and state no tracking, no profit`

## Order & risks

- **Execution order:** T1 → T2 → T3 → T4 → T5. T1 primero porque T2 lo
  necesita para su propio contenido. T2 segundo por ser la pieza
  genuinamente nueva —sin precedente en el código— y la más fácil de
  hacer mal en silencio. T3 depende de que `AboutPanel` exista. T4 es
  independiente de las tres anteriores —otro archivo, otra clase CSS— y
  va último por ser la de menor riesgo, no por dependencia real.
- **Dependencies:** T2 depende de T1 (importa la constante). T3 depende de
  T2 (monta el componente). T4 no depende de ninguna.
- **Risks:**
  - **El mecanismo de foco/`Escape` no tiene precedente en este código**
    —es la primera vez que la aplicación gestiona un overlay— así que T2
    no puede apoyarse en un patrón ya probado como sí pudo e9.2 con
    `useFraccionCubierta` o e9.4 con `CamaraEncuadrada`. El riesgo se
    mitiga probándolo de verdad con Testing Library, no con código fuente:
    a diferencia de las escenas 3D, acá no hay excusa de WebGL.
  - **T3 es donde el scope podría romperse en silencio** si la apertura del
    panel se implementa como un modo más de `App` en vez de estado local
    — la mutación forzada de T3 existe específicamente para esa forma de
    fallar, no una genérica.
  - **T4 toca el mismo `<header>` que T3 no toca** (ramas distintas del
    condicional `modo.tipo === 'ficha'`), así que no hay conflicto real
    pese a estar en el mismo archivo.
